// Popup script
document.getElementById('clearCache').addEventListener('click', () => {
  chrome.browsingData.removeCache({}, () => {
    alert('Cache cleared!');
  });
});

document.getElementById('clearCookies').addEventListener('click', () => {
  chrome.browsingData.removeCookies({}, () => {
    alert('Cookies cleared!');
  });
});

document.getElementById('toggleAdBlock').addEventListener('click', () => {
  chrome.storage.local.get(['adBlockEnabled'], (result) => {
    const newState = !result.adBlockEnabled;
    chrome.storage.local.set({ adBlockEnabled: newState }, () => {
      alert(`AdBlock ${newState ? 'enabled' : 'disabled'}`);
    });
  });
});

// Load stats
chrome.storage.local.get(['adsBlocked', 'trackersBlocked'], (result) => {
  document.getElementById('adsBlocked').textContent = result.adsBlocked || 0;
  document.getElementById('trackersBlocked').textContent = result.trackersBlocked || 0;
});
