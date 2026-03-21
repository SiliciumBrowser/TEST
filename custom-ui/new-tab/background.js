// Xử lý omnibox cho newtab extension
// Note: Polyfill sẽ handle nếu chrome API không có

if (typeof chrome !== 'undefined' && chrome.omnibox) {
  chrome.omnibox.onInputEntered.addListener((text, disposition) => {
    chrome.storage.local.get(
      ["selectedSearchEngineKey", "userSearchEngines"],
      (result) => {
        // Lấy danh sách search engines (merge default + user)
        const DEFAULT_SEARCH_ENGINES = {
          google: {
            name: "Google",
            url: "https://www.google.com/search?q={s}",
            isDefault: true,
          },
          bing: {
            name: "Bing",
            url: "https://www.bing.com/search?q={s}",
          },
          duckduckgo: {
            name: "DuckDuckGo",
            url: "https://duckduckgo.com/?q={s}",
          },
        };
        let engines = {
          ...DEFAULT_SEARCH_ENGINES,
          ...(result.userSearchEngines || {}),
        };
        let selectedKey = result.selectedSearchEngineKey;
        if (!selectedKey || !engines[selectedKey]) {
          selectedKey =
            Object.keys(engines).find((k) => engines[k].isDefault) || "google";
        }
        const engine = engines[selectedKey];
        let url =
          engine && engine.url
            ? engine.url.replace("{s}", encodeURIComponent(text))
            : `https://www.google.com/search?q=${encodeURIComponent(text)}`;

        // Mở kết quả theo disposition
        if (disposition === "currentTab") {
          chrome.tabs.update({ url });
        } else if (disposition === "newForegroundTab") {
          chrome.tabs.create({ url });
        } else if (disposition === "newBackgroundTab") {
          chrome.tabs.create({ url, active: false });
        }
      }
    );
  });
}

// Lấy lịch sử trình duyệt
async function getBrowserHistory(query = "") {
  return new Promise((resolve) => {
    const searchText = query.toLowerCase();
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 1 tuần trước
    
    chrome.history.search({
      text: searchText,
      startTime: oneWeekAgo,
      maxResults: 20,
      searchType: "url"
    }, (results) => {
      if (chrome.runtime.lastError) {
        console.error('Lỗi lấy lịch sử:', chrome.runtime.lastError);
        resolve([]);
        return;
      }
      
      // Lọc và xử lý kết quả
      const processedResults = results
        .filter(item => {
          // Loại bỏ các URL không phải trang web thông thường
          const url = item.url.toLowerCase();
          return !url.includes('chrome://') && 
                 !url.includes('chrome-extension://') &&
                 !url.includes('file://') &&
                 !url.includes('data:') &&
                 url.startsWith('http');
        })
        .map(item => {
          const url = new URL(item.url);
          return {
            title: item.title || url.hostname,
            url: item.url,
            domain: url.hostname,
            lastVisitTime: item.lastVisitTime,
            visitCount: item.visitCount
          };
        })
        .filter(item => {
          // Lọc theo query nếu có
          if (!searchText) return true;
          return item.title.toLowerCase().includes(searchText) || 
                 item.domain.toLowerCase().includes(searchText);
        })
        .slice(0, 10); // Giới hạn 10 kết quả
      
      resolve(processedResults);
    });
  });
}

// Lấy gợi ý tìm kiếm từ Google
async function getGoogleSuggestions(query) {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // Google trả về mảng [query, [suggestions], ...]
    return data[1] || [];
  } catch (error) {
    console.error('Lỗi lấy gợi ý Google:', error);
    return [];
  }
}

// Xử lý message từ content script
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getBrowserHistory") {
      getBrowserHistory(request.query).then(sendResponse);
      return true; // Giữ kết nối cho async response
    }
    
    if (request.type === "getGoogleSuggestions") {
      getGoogleSuggestions(request.query).then(suggestions => {
        sendResponse({ suggestions });
      });
      return true; // Giữ kết nối cho async response
    }
    
    if (request.type === "fetchGoogleSuggestions") {
      getGoogleSuggestions(request.query).then(suggestions => {
        sendResponse({ suggestions });
      });
      return true; // Giữ kết nối cho async response
    }
  });
}
