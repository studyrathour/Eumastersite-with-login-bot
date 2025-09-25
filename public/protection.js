// Immediate protection script - loads before React
(function() {
  'use strict';
  
  // Immediate dev tools detection
  let devtools = false;
  
  // Method 1: Console detection
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function() {
      devtools = true;
      closeWebsite();
    }
  });
  
  // Method 2: Timing-based detection
  setInterval(function() {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
      closeWebsite();
    }
  }, 1000);
  
  // Method 3: Window size detection
  setInterval(function() {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
      closeWebsite();
    }
  }, 500);
  
  // Method 4: Console logging detection
  setInterval(function() {
    console.log(element);
    console.clear();
  }, 1000);
  
  function closeWebsite() {
    try {
      window.close();
      setTimeout(function() {
        window.location.href = 'about:blank';
      }, 100);
      setTimeout(function() {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;color:#333;background:#f5f5f5;"><div style="text-align:center;"><h1 style="color:#e74c3c;margin-bottom:20px;">🚫 Access Denied</h1><p style="color:#666;font-size:18px;">Unauthorized access detected.<br>This session has been terminated.</p></div></div>';
      }, 200);
    } catch (e) {
      document.body.style.display = 'none';
    }
  }
  
  // Disable right-click immediately
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  }, true);
  
  // Disable text selection immediately
  document.addEventListener('selectstart', function(e) {
    if (!e.target.matches('input, textarea')) {
      e.preventDefault();
      return false;
    }
  }, true);
  
  // Disable drag and drop immediately
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, true);
  
  // Disable keyboard shortcuts immediately
  document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, etc.
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'A') ||
        (e.ctrlKey && e.key === 'P') ||
        (e.ctrlKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'V') ||
        (e.ctrlKey && e.key === 'X')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, true);
  
  // Protect console
  const noop = function() {};
  const consoleProps = ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 
                       'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'];
  
  consoleProps.forEach(function(prop) {
    if (console[prop]) {
      console[prop] = noop;
    }
  });
  
  // Override console object
  Object.defineProperty(window, 'console', {
    get: function() {
      return {
        log: noop, debug: noop, info: noop, warn: noop, error: noop,
        assert: noop, dir: noop, dirxml: noop, group: noop, groupEnd: noop,
        time: noop, timeEnd: noop, count: noop, trace: noop, profile: noop, profileEnd: noop
      };
    },
    set: function() {}
  });
  
  // Anti-debugger
  setInterval(function() {
    debugger;
  }, 100);
  
  // Prevent extensions
  if (window.chrome && window.chrome.runtime) {
    console.warn('Extension detected');
  }
  
  // Prevent React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberRoot = null;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__.onCommitFiberUnmount = null;
  }
  
})();