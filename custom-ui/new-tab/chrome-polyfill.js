// Chrome API Polyfill for standalone browser
// Thay thế chrome.storage bằng localStorage

(function() {
  'use strict';
  
  // Check if chrome API exists
  if (typeof chrome !== 'undefined' && chrome.storage) {
    console.log('Chrome API available, using native implementation');
    return;
  }
  
  console.log('Chrome API not available, using polyfill');
  
  // Create chrome object if not exists
  window.chrome = window.chrome || {};
  
  // Storage API polyfill
  chrome.storage = {
    local: {
      get: function(keys, callback) {
        const result = {};
        
        if (keys === null || keys === undefined) {
          // Get all items
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
              result[key] = JSON.parse(localStorage.getItem(key));
            } catch (e) {
              result[key] = localStorage.getItem(key);
            }
          }
        } else if (typeof keys === 'string') {
          // Single key
          try {
            const value = localStorage.getItem(keys);
            result[keys] = value ? JSON.parse(value) : undefined;
          } catch (e) {
            result[keys] = localStorage.getItem(keys);
          }
        } else if (Array.isArray(keys)) {
          // Array of keys
          keys.forEach(key => {
            try {
              const value = localStorage.getItem(key);
              result[key] = value ? JSON.parse(value) : undefined;
            } catch (e) {
              result[key] = localStorage.getItem(key);
            }
          });
        } else if (typeof keys === 'object') {
          // Object with default values
          Object.keys(keys).forEach(key => {
            try {
              const value = localStorage.getItem(key);
              result[key] = value ? JSON.parse(value) : keys[key];
            } catch (e) {
              result[key] = localStorage.getItem(key) || keys[key];
            }
          });
        }
        
        if (callback) {
          setTimeout(() => callback(result), 0);
        }
        return Promise.resolve(result);
      },
      
      set: function(items, callback) {
        Object.keys(items).forEach(key => {
          try {
            localStorage.setItem(key, JSON.stringify(items[key]));
          } catch (e) {
            console.error('Error saving to localStorage:', e);
          }
        });
        
        if (callback) {
          setTimeout(callback, 0);
        }
        return Promise.resolve();
      },
      
      remove: function(keys, callback) {
        if (typeof keys === 'string') {
          localStorage.removeItem(keys);
        } else if (Array.isArray(keys)) {
          keys.forEach(key => localStorage.removeItem(key));
        }
        
        if (callback) {
          setTimeout(callback, 0);
        }
        return Promise.resolve();
      },
      
      clear: function(callback) {
        localStorage.clear();
        
        if (callback) {
          setTimeout(callback, 0);
        }
        return Promise.resolve();
      }
    }
  };
  
  // Runtime API polyfill
  chrome.runtime = chrome.runtime || {
    lastError: null,
    
    sendMessage: function(message, callback) {
      console.warn('chrome.runtime.sendMessage not available in standalone mode');
      if (callback) {
        setTimeout(() => callback(null), 0);
      }
      return Promise.resolve(null);
    },
    
    onMessage: {
      addListener: function(callback) {
        console.warn('chrome.runtime.onMessage not available in standalone mode');
      }
    }
  };
  
  // History API polyfill (mock)
  chrome.history = chrome.history || {
    search: function(query, callback) {
      console.warn('chrome.history not available in standalone mode');
      if (callback) {
        setTimeout(() => callback([]), 0);
      }
      return Promise.resolve([]);
    }
  };
  
  // Tabs API polyfill
  chrome.tabs = chrome.tabs || {
    create: function(options) {
      window.open(options.url, '_blank');
    },
    
    update: function(tabId, options) {
      if (options.url) {
        window.location.href = options.url;
      }
    }
  };
  
  // Omnibox API polyfill (not needed for standalone)
  chrome.omnibox = chrome.omnibox || {
    onInputEntered: {
      addListener: function(callback) {
        console.warn('chrome.omnibox not available in standalone mode');
      }
    }
  };
  
  console.log('Chrome API polyfill loaded successfully');
})();
