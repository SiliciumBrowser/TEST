// Content script - runs on every page
console.log('Content script loaded on:', window.location.href);

// Example: Remove ads by class name
function removeAds() {
  const adSelectors = [
    '.ad',
    '.advertisement',
    '[class*="ad-"]',
    '[id*="ad-"]'
  ];
  
  adSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.remove();
    });
  });
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', removeAds);
} else {
  removeAds();
}

// Watch for dynamic content
const observer = new MutationObserver(removeAds);
observer.observe(document.body, {
  childList: true,
  subtree: true
});
