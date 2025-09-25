// Website Protection System
export class WebsiteProtection {
  private static instance: WebsiteProtection;
  private devToolsOpen = false;
  private protectionActive = true;
  private observers: MutationObserver[] = [];
  private intervals: NodeJS.Timeout[] = [];

  private constructor() {
    this.initializeProtection();
  }

  public static getInstance(): WebsiteProtection {
    if (!WebsiteProtection.instance) {
      WebsiteProtection.instance = new WebsiteProtection();
    }
    return WebsiteProtection.instance;
  }

  private initializeProtection() {
    this.disableDevTools();
    this.disableRightClick();
    this.disableTextSelection();
    this.disableDragDrop();
    this.disableKeyboardShortcuts();
    this.preventSourceViewing();
    this.obfuscateContent();
    this.antiDebugger();
    this.detectDevTools();
    this.protectConsole();
    this.disableSaveAs();
    this.preventExtensions();
  }

  private disableDevTools() {
    // Detect developer tools opening
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        this.closeWebsite();
      }
    };

    // Multiple detection methods
    setInterval(detectDevTools, 100);
    
    // Console detection
    let devtools = { open: false, orientation: null };
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: () => {
        devtools.open = true;
        this.closeWebsite();
      }
    });
    
    setInterval(() => {
      console.log(element);
      console.clear();
    }, 100);

    // Firebug detection
    setInterval(() => {
      if (window.console && (window.console.firebug || window.console.exception)) {
        this.closeWebsite();
      }
    }, 100);
  }

  private disableRightClick() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }, true);

    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);
  }

  private disableTextSelection() {
    // CSS-based selection prevention
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // JavaScript-based selection prevention
    document.addEventListener('selectstart', (e) => {
      if (!(e.target as HTMLElement).matches('input, textarea')) {
        e.preventDefault();
        return false;
      }
    }, true);

    document.addEventListener('mousedown', (e) => {
      if (!(e.target as HTMLElement).matches('input, textarea, button, a')) {
        e.preventDefault();
      }
    }, true);
  }

  private disableDragDrop() {
    document.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    }, true);

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      return false;
    }, true);

    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      return false;
    }, true);
  }

  private disableKeyboardShortcuts() {
    const blockedKeys = [
      'F12', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11',
      'I', 'J', 'U', 'S', 'A', 'P', 'C', 'V', 'X', 'Z', 'Y'
    ];

    document.addEventListener('keydown', (e) => {
      // Block F12 and other function keys
      if (blockedKeys.includes(e.key)) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.key === 'J') || // Ctrl+Shift+J
            (e.ctrlKey && e.key === 'U') || // Ctrl+U (view source)
            (e.ctrlKey && e.key === 'S') || // Ctrl+S (save)
            (e.ctrlKey && e.key === 'A') || // Ctrl+A (select all)
            (e.ctrlKey && e.key === 'P') || // Ctrl+P (print)
            (e.ctrlKey && e.key === 'C') || // Ctrl+C (copy)
            (e.ctrlKey && e.key === 'V') || // Ctrl+V (paste)
            (e.ctrlKey && e.key === 'X') || // Ctrl+X (cut)
            (e.ctrlKey && e.key === 'Z') || // Ctrl+Z (undo)
            (e.ctrlKey && e.key === 'Y') || // Ctrl+Y (redo)
            (e.ctrlKey && e.shiftKey && e.key === 'C') || // Ctrl+Shift+C
            e.key === 'F5' || // Refresh
            (e.ctrlKey && e.key === 'R')) { // Ctrl+R (refresh)
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    }, true);

    // Block right-click + inspect
    document.addEventListener('keyup', (e) => {
      if (e.key === 'F12') {
        this.closeWebsite();
      }
    }, true);
  }

  private preventSourceViewing() {
    // Override view-source protocol
    if (window.location.protocol === 'view-source:') {
      this.closeWebsite();
    }

    // Prevent iframe inspection
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as Element;
              if (element.tagName === 'IFRAME' && !element.hasAttribute('data-allowed')) {
                element.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    this.observers.push(observer);
  }

  private obfuscateContent() {
    // Enhanced content obfuscation
    const obfuscateElement = (element: Element) => {
      // Look for any data attributes that might contain sensitive information
      const sensitiveAttributes = ['data-title-b64', 'data-url-b64', 'data-content-title', 'data-content-url'];
      
      sensitiveAttributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          const value = element.getAttribute(attr);
          if (value) {
            element.removeAttribute(attr);
            element.setAttribute('data-x-' + Math.random().toString(36).substring(2), this.scrambleString(value));
          }
        }
      });
      
      // Additional obfuscation for title and URL attributes
      if (element.hasAttribute('title')) {
        const title = element.getAttribute('title');
        if (title && title.length > 10) { // Only obfuscate longer titles
          element.setAttribute('title', 'Content');
        }
      }
      
      // Obfuscate href attributes in links
      if (element.tagName === 'A' && element.hasAttribute('href')) {
        const href = element.getAttribute('href');
        if (href && href.startsWith('http')) {
          element.setAttribute('href', '#');
          element.setAttribute('data-protected', 'true');
        }
      }
      
      // Legacy attribute handling
      if (element.hasAttribute('data-title-b64') || element.hasAttribute('data-url-b64')) {
        // Remove or further obfuscate these attributes
        const titleB64 = element.getAttribute('data-title-b64');
        const urlB64 = element.getAttribute('data-url-b64');
        
        if (titleB64) {
          element.removeAttribute('data-title-b64');
          element.setAttribute('data-x', this.scrambleString(titleB64));
        }
        
        if (urlB64) {
          element.removeAttribute('data-url-b64');
          element.setAttribute('data-y', this.scrambleString(urlB64));
        }
      }
    };

    // Obfuscate existing elements
    document.querySelectorAll('[data-title-b64], [data-url-b64], [data-content-title], [data-content-url]').forEach(obfuscateElement);

    // Watch for new elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as Element;
              obfuscateElement(element);
              element.querySelectorAll('[data-title-b64], [data-url-b64], [data-content-title], [data-content-url]').forEach(obfuscateElement);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-title-b64', 'data-url-b64']
    });

    this.observers.push(observer);
  }

  private scrambleString(str: string): string {
    return btoa(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  }

  private antiDebugger() {
    // Anti-debugger techniques
    setInterval(() => {
      debugger;
    }, 100);

    // Detect if debugger is paused
    let start = Date.now();
    debugger;
    if (Date.now() - start > 100) {
      this.closeWebsite();
    }

    // Function integrity check
    const originalLog = console.log;
    console.log = function(...args) {
      if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('debugger')) {
        WebsiteProtection.getInstance().closeWebsite();
      }
      return originalLog.apply(console, args);
    };
  }

  private detectDevTools() {
    // Multiple dev tools detection methods
    const methods = [
      () => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        return end - start > 100;
      },
      () => {
        return window.outerHeight - window.innerHeight > 200 || 
               window.outerWidth - window.innerWidth > 200;
      },
      () => {
        const element = document.createElement('div');
        element.id = 'devtools-detector';
        Object.defineProperty(element, 'id', {
          get: () => {
            this.closeWebsite();
            return 'devtools-detector';
          }
        });
        console.log(element);
        return false;
      }
    ];

    const interval = setInterval(() => {
      methods.forEach(method => {
        try {
          if (method()) {
            this.closeWebsite();
          }
        } catch (e) {
          // Method failed, continue
        }
      });
    }, 1000);

    this.intervals.push(interval);
  }

  private protectConsole() {
    // Override console methods
    const noop = () => {};
    const consoleProps = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 
                         'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
    
    consoleProps.forEach(prop => {
      if (console[prop as keyof Console]) {
        (console as any)[prop] = noop;
      }
    });

    // Prevent console reopening
    Object.defineProperty(window, 'console', {
      get: () => ({
        log: noop, debug: noop, info: noop, warn: noop, error: noop,
        assert: noop, dir: noop, dirxml: noop, group: noop, groupEnd: noop,
        time: noop, timeEnd: noop, count: noop, trace: noop, profile: noop, profileEnd: noop
      }),
      set: () => {}
    });
  }

  private disableSaveAs() {
    // Prevent save as dialog
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
    }, true);

    // Override save methods
    if (document.execCommand) {
      const originalExecCommand = document.execCommand;
      document.execCommand = function(command: string, ...args: any[]) {
        if (command === 'SaveAs') {
          return false;
        }
        return originalExecCommand.apply(document, [command, ...args]);
      };
    }
  }

  private preventExtensions() {
    // Detect common extension patterns
    const extensionDetectors = [
      () => !!(window as any).chrome && !!(window as any).chrome.runtime,
      () => !!(window as any).browser && !!(window as any).browser.runtime,
      () => document.querySelector('*[class*="extension"]'),
      () => document.querySelector('*[id*="extension"]'),
      () => !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__,
      () => !!(window as any).__VUE_DEVTOOLS_GLOBAL_HOOK__
    ];

    const interval = setInterval(() => {
      extensionDetectors.forEach(detector => {
        try {
          if (detector()) {
            console.warn('Extension detected');
            // Could implement stricter measures here
          }
        } catch (e) {
          // Detector failed, continue
        }
      });
    }, 5000);

    this.intervals.push(interval);
  }

  private closeWebsite() {
    if (!this.protectionActive) return;
    
    // Multiple methods to close/redirect
    try {
      // Method 1: Close window
      window.close();
      
      // Method 2: Redirect to blank
      setTimeout(() => {
        window.location.href = 'about:blank';
      }, 100);
      
      // Method 3: Replace content
      setTimeout(() => {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;color:#333;"><h1>Access Denied</h1></div>';
      }, 200);
      
      // Method 4: History manipulation
      setTimeout(() => {
        history.replaceState(null, '', 'about:blank');
      }, 300);
      
    } catch (e) {
      // Fallback
      document.body.style.display = 'none';
    }
  }

  public destroy() {
    this.protectionActive = false;
    this.observers.forEach(observer => observer.disconnect());
    this.intervals.forEach(interval => clearInterval(interval));
    this.observers = [];
    this.intervals = [];
  }
}

// Enhanced content protection for React components
export const protectContent = () => {
  // Initialize protection
  WebsiteProtection.getInstance();
  
  // Additional React-specific protections
  if (typeof window !== 'undefined') {
    // Prevent React DevTools
    if ((window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = null;
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = null;
    }
    
    // Prevent common debugging
    Object.defineProperty(window, 'webkitStorageInfo', {
      get: () => {
        WebsiteProtection.getInstance();
        return undefined;
      }
    });
  }
};

// Utility to safely decode content when needed
export const safeDecodeContent = (encodedData: string, type: 'title' | 'url'): string => {
  try {
    // Simple base64 decode without random suffix removal
    const decoded = decodeURIComponent(atob(encodedData));
    return decoded;
  } catch (e) {
    // If decoding fails, return the original data or a fallback
    return encodedData || (type === 'title' ? 'Content' : '#');
  }
};