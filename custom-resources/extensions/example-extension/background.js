// Background script
console.log('Custom extension loaded!');

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('Page loaded:', tab.url);
  }
});

// Example: Block specific domains
const blockedDomains = [
  'ads.example.com',
  'tracker.example.com'
];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    if (blockedDomains.some(domain => url.hostname.includes(domain))) {
      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
