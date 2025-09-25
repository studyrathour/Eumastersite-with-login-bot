/*
  Lightweight HLS proxy and manifest rewriter.
  - Virtual URLs:
    - /v/manifest/<token>[/<encodedAbsoluteOrRelative>]
    - /v/seg/<token>/<encodedAbsoluteOrRelative>
  - Page must postMessage {type:'MAP_TOKEN', token, manifestUrl} before using.
  This is not DRM. It hides raw origins from the DOM and basic extensions.
*/

const tokenToInfo = new Map();

// Enhanced protection in service worker
const protectionEnabled = true;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Block debugging attempts
self.addEventListener('message', (event) => {
  if (protectionEnabled && event.data && typeof event.data === 'object') {
    // Check for debugging attempts
    if (event.data.type === 'DEVTOOLS_DETECTED' || 
        event.data.debug === true ||
        JSON.stringify(event.data).includes('debug')) {
      // Close all clients
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({type: 'CLOSE_WEBSITE'});
        });
      });
      return;
    }
  }
  
  // Original message handling
  const data = event.data || {};
  if (data && data.type === 'MAP_TOKEN' && data.token && data.manifestUrl) {
    try {
      const base = new URL(data.manifestUrl, self.location.origin);
      const entry = { manifestUrl: base.href, baseUrl: base.href };
      if (data.decrypt && data.decrypt.algo === 'AES-CTR' && data.decrypt.keyB64 && data.decrypt.ivB64) {
        entry.decrypt = {
          algo: 'AES-CTR',
          keyB64: data.decrypt.keyB64,
          ivB64: data.decrypt.ivB64,
          counterLength: data.decrypt.counterLength || 64,
          cryptoKey: null,
          ivBytes: null
        };
        try {
          entry.decrypt.ivBytes = base64ToBytes(entry.decrypt.ivB64);
          // Import key asynchronously and store later
          const rawKey = base64ToBytes(entry.decrypt.keyB64);
          crypto.subtle.importKey(
            'raw',
            rawKey,
            { name: 'AES-CTR' },
            false,
            ['decrypt']
          ).then((ck) => {
            const current = tokenToInfo.get(data.token);
            if (current && current.decrypt) {
              current.decrypt.cryptoKey = ck;
              tokenToInfo.set(data.token, current);
            }
          }).catch(() => {});
        } catch (_) {}
      }
      tokenToInfo.set(data.token, entry);
    } catch (_) {
      // ignore bad URLs
    }
  }
});
// Receive token mappings from the page

function resolveAgainstBase(baseHref, maybeRelative) {
  try {
    return new URL(maybeRelative, baseHref).href;
  } catch (_) {
    return maybeRelative;
  }
}

function base64ToBytes(b64) {
  try {
    const norm = b64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '='.repeat((4 - (norm.length % 4)) % 4);
    const s = atob(norm + pad);
    const bytes = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes.buffer;
  } catch (_) {
    return new ArrayBuffer(0);
  }
}

function isManifestPath(p) {
  return /\.m3u8(\?|#|$)/i.test(p);
}

async function fetchAndRewriteManifest(manifestUrl, token) {
  const res = await fetch(manifestUrl, { credentials: 'include', mode: 'cors' });
  if (!res.ok) {
    return new Response('Failed to fetch manifest', { status: res.status });
  }
  const text = await res.text();
  const baseHref = manifestUrl;
  const rewritten = text.split('\n').map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return line;
    }
    const absolute = resolveAgainstBase(baseHref, trimmed);
    if (isManifestPath(absolute)) {
      const encoded = encodeURIComponent(absolute);
      return `/v/manifest/${token}/${encoded}`;
    }
    const encoded = encodeURIComponent(absolute);
    return `/v/seg/${token}/${encoded}`;
  }).join('\n');

  return new Response(rewritten, {
    status: 200,
    headers: { 'Content-Type': 'application/vnd.apple.mpegurl' }
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const { pathname } = url;
  
  // Block debugging requests
  if (protectionEnabled) {
    const blockedPaths = [
      '/devtools', '/__devtools', '/debug', '/__debug',
      '/inspector', '/debugger', '/console'
    ];
    
    if (blockedPaths.some(path => pathname.includes(path))) {
      event.respondWith(new Response('Blocked', { status: 403 }));
      return;
    }
    
    // Block extension requests
    const userAgent = event.request.headers.get('user-agent') || '';
    if (userAgent.includes('Extension') || userAgent.includes('Chrome-Extension')) {
      event.respondWith(new Response('Blocked', { status: 403 }));
      return;
    }
  }

  if (pathname.startsWith('/v/manifest/')) {
    event.respondWith((async () => {
      const parts = pathname.split('/').filter(Boolean); // ['v','manifest', token, encoded?]
      const token = parts[2];
      const info = tokenToInfo.get(token);
      if (!info) {
        return new Response('Unknown token', { status: 400 });
      }

      let target = info.manifestUrl;
      if (parts.length > 3) {
        try {
          target = decodeURIComponent(parts.slice(3).join('/'));
        } catch (_) {}
      }

      return fetchAndRewriteManifest(target, token);
    })());
    return;
  }

  if (pathname.startsWith('/v/seg/')) {
    event.respondWith((async () => {
      const parts = pathname.split('/').filter(Boolean); // ['v','seg', token, encoded]
      const token = parts[2];
      const info = tokenToInfo.get(token);
      if (!info) {
        return new Response('Unknown token', { status: 400 });
      }
      let target = '';
      try {
        target = decodeURIComponent(parts.slice(3).join('/'));
      } catch (_) {
        return new Response('Bad segment path', { status: 400 });
      }

      const reqInit = {
        method: event.request.method,
        headers: event.request.headers,
        credentials: 'include',
        mode: 'cors',
        redirect: 'follow'
      };

      try {
        const upstream = await fetch(target, reqInit);
        if (!upstream.ok) {
          return new Response('Upstream error', { status: upstream.status });
        }
        const decrypt = info.decrypt;
        if (decrypt && decrypt.cryptoKey && decrypt.ivBytes) {
          const cipherBuf = await upstream.arrayBuffer();
          try {
            const plainBuf = await crypto.subtle.decrypt(
              {
                name: 'AES-CTR',
                counter: new Uint8Array(decrypt.ivBytes),
                length: decrypt.counterLength || 64
              },
              decrypt.cryptoKey,
              cipherBuf
            );
            return new Response(plainBuf, { status: 200 });
          } catch (_) {
            // fall back to raw on decrypt failure
            return new Response(cipherBuf, { status: 200 });
          }
        }
        const respHeaders = new Headers(upstream.headers);
        return new Response(upstream.body, { status: upstream.status, headers: respHeaders });
      } catch (e) {
        return new Response('Upstream error', { status: 502 });
      }
    })());
    return;
  }
});


