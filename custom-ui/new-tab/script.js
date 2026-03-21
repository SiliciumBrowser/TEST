// script.js
console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements - Main Page
  const body = document.body;
  const backgroundVideo = document.getElementById("background-video");
  const searchInput = document.getElementById("search-input");
  const searchEngineSelector = document.getElementById(
    "search-engine-selector"
  );
  const currentSearchIconDisplay = document.getElementById(
    "current-search-icon"
  );
  const searchEngineDropdown = document.getElementById(
    "search-engine-dropdown"
  );
  const topLinksWidget = document.getElementById("top-right-links-widget"); // <--- thêm dòng này

  // DOM Elements - Shortcut Modal
  const addShortcutBtn = document.getElementById("add-shortcut-btn");
  const shortcutModal = document.getElementById("shortcut-modal");
  const closeShortcutModalBtn = shortcutModal.querySelector(
    ".shortcut-modal-close-btn"
  );
  const shortcutModalTitle = document.getElementById("modal-title");
  const shortcutNameInput = document.getElementById("shortcut-name");
  const shortcutUrlInput = document.getElementById("shortcut-url");
  const shortcutIndexInput = document.getElementById("shortcut-index");
  const saveShortcutBtn = document.getElementById("save-shortcut-btn");
  const shortcutsContainer = document.getElementById("shortcuts-container");

  // DOM Elements - Settings Modal
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const closeSettingsModalBtn = settingsModal.querySelector(
    ".settings-modal-close-btn"
  );

  // State Variables
  let currentSearchEngines = {};
  let currentSelectedEngineKey = "google";
  let shortcuts = [];
  let defaultPageBackgroundColor = "#202124";
  let shortcutsEnabled = true;
  let shortcutsRows = 2;
  let shortcutsPerRow = 4;
  let searchHistoryEnabled = true;
  let browserHistorySyncEnabled = true;
  let shortcutBorderAnimated = false; // --- Thêm biến state cho hiệu ứng border động
  let shortcutsOpacity = 100; // Thêm biến state cho opacity

  // Function to get default background color after CSS is applied
  function updateDefaultBackgroundColor() {
    const bodyStyles = getComputedStyle(body);
    const cssVarColor = bodyStyles
      .getPropertyValue("--background-primary-default")
      .trim();
    if (cssVarColor) {
      defaultPageBackgroundColor = cssVarColor;
    }
    console.log(
      "Default page background color set to:",
      defaultPageBackgroundColor
    );
  }
  // Call it once, and potentially again if styles might change dynamically (though unlikely for this var)
  if (document.readyState === "complete") {
    updateDefaultBackgroundColor();
  } else {
    window.addEventListener("load", updateDefaultBackgroundColor);
  }

  // --- EVENT LISTENERS FROM SETTING.JS ---
  document.addEventListener("settingsReady", (e) => {
    console.log("Event: settingsReady, Detail:", e.detail);
    const loadedSettings = e.detail;

    // Sửa: Áp dụng background dựa trên settings mới nhất
    applyBackgroundFromSettings({
      uploaded: loadedSettings.backgroundImageUploaded,
      url: loadedSettings.backgroundImageUrl,
      solidColor: loadedSettings.backgroundColorSolid,
    });

    if (typeof initializeAllWidgets === "function") {
      // From widget.js
      initializeAllWidgets({
        mainClockEnabled: loadedSettings.mainClockEnabled,
        mainDateEnabled: loadedSettings.mainDateEnabled,
        weatherEnabled: loadedSettings.weatherEnabled,
      });
    } else {
      console.error(
        "initializeAllWidgets function not found. Ensure widget.js is loaded."
      );
    }

    currentSearchEngines = loadedSettings.searchEngines || {};
    currentSelectedEngineKey =
      loadedSettings.selectedSearchEngineKey || "google";

    populateMainSearchEngineDropdown();
    updateMainSearchUI();
    loadShortcutsFromStorage(); // Load shortcuts after settings are ready

    // Listen for background change events to reload video
    document.addEventListener("backgroundChanged", () => {
      console.log("Background changed event received");
      // Re-apply background from current settings
      chrome.storage.local.get([
        "backgroundImageUploaded",
        "backgroundImageUrl", 
        "backgroundColorSolid"
      ], (result) => {
        applyBackgroundFromSettings({
          uploaded: result.backgroundImageUploaded,
          url: result.backgroundImageUrl,
          solidColor: result.backgroundColorSolid,
        });
      });
    });

    // Thêm xử lý widget links
    if (topLinksWidget) {
      if (
        typeof loadedSettings.topLinksEnabled === "boolean"
          ? loadedSettings.topLinksEnabled
          : true
      ) {
        topLinksWidget.classList.remove("hidden");
      } else {
        topLinksWidget.classList.add("hidden");
      }
    }

    shortcutsEnabled =
      typeof loadedSettings.shortcutsEnabled === "boolean"
        ? loadedSettings.shortcutsEnabled
        : true;
    shortcutsRows =
      typeof loadedSettings.shortcutsRows === "number"
        ? loadedSettings.shortcutsRows
        : 2;
    shortcutsPerRow =
      typeof loadedSettings.shortcutsPerRow === "number"
        ? loadedSettings.shortcutsPerRow
        : 4;

    searchHistoryEnabled =
      typeof loadedSettings.searchHistoryEnabled === "boolean"
        ? loadedSettings.searchHistoryEnabled
        : true;

    browserHistorySyncEnabled =
      typeof loadedSettings.browserHistorySyncEnabled === "boolean"
        ? loadedSettings.browserHistorySyncEnabled
        : true;

    shortcutBorderAnimated =
      typeof e.detail.shortcutBorderAnimated === "boolean"
        ? e.detail.shortcutBorderAnimated
        : false;

    shortcutsOpacity =
      typeof loadedSettings.shortcutsOpacity === "number"
        ? loadedSettings.shortcutsOpacity
        : 100;

    updateShortcutsVisibility();
  });

  document.addEventListener("backgroundChanged", (e) => {
    console.log("Event: backgroundChanged, Detail:", e.detail);
    // Sửa: Áp dụng background dựa trên settings mới nhất với null check
    const detail = e.detail || {};
    applyBackgroundFromSettings({
      uploaded: detail.uploaded,
      url: detail.url,
      solidColor: detail.solidColor,
    });
  });

  document.addEventListener("widgetToggleChanged", (e) => {
    console.log("Event: widgetToggleChanged, Detail:", e.detail);
    const { widget, enabled } = e.detail;
    const mainClockEl = document.getElementById("main-clock-widget");
    const mainDateEl = document.getElementById("main-date-widget");
    const weatherEl = document.getElementById("weather-widget-container");

    if (widget === "mainClock" && typeof initMainClock === "function")
      initMainClock(mainClockEl, enabled);
    else if (widget === "mainDate" && typeof initMainDate === "function")
      initMainDate(mainDateEl, enabled);
    else if (widget === "weather" && typeof initWeatherWidget === "function")
      initWeatherWidget(weatherEl, enabled);
    else if (widget === "topLinks" && topLinksWidget) {
      if (enabled) topLinksWidget.classList.remove("hidden");
      else topLinksWidget.classList.add("hidden");
    } else if (widget === "shortcuts") {
      shortcutsEnabled = enabled;
      updateShortcutsVisibility();
    } else if (widget === "searchHistory") {
      searchHistoryEnabled = enabled;
      if (!enabled && searchHistoryDropdown) {
        searchHistoryDropdown.style.display = "none";
        const searchBar =
          searchInput && searchInput.closest(".search-bar-container");
        if (searchBar) searchBar.classList.remove("search-bar-open");
      }
    } else if (widget === "browserHistorySync") {
      browserHistorySyncEnabled = enabled;
    }
  });

  document.addEventListener("searchEnginesUpdated", (e) => {
    console.log("Event: searchEnginesUpdated, Detail:", e.detail);
    currentSearchEngines = e.detail || {};
    populateMainSearchEngineDropdown();
    if (!currentSearchEngines[currentSelectedEngineKey]) {
      currentSelectedEngineKey = "google";
      if (
        typeof settingsManager !== "undefined" &&
        settingsManager.saveSetting
      ) {
        settingsManager.saveSetting(
          "selectedSearchEngineKey",
          currentSelectedEngineKey,
          "selectedSearchEngineChanged",
          currentSelectedEngineKey
        );
      } else {
        chrome.storage.local.set({
          selectedSearchEngineKey: currentSelectedEngineKey,
        });
      }
      updateMainSearchUI();
    }
  });

  document.addEventListener("selectedSearchEngineChanged", (e) => {
    console.log("Event: selectedSearchEngineChanged, Detail:", e.detail);
    currentSelectedEngineKey = e.detail;
    updateMainSearchUI();
  });

  // --- MAIN SEARCH ENGINE UI LOGIC ---
  function populateMainSearchEngineDropdown() {
    if (!searchEngineDropdown) return;
    searchEngineDropdown.innerHTML = "";
    if (Object.keys(currentSearchEngines).length === 0) {
      console.warn("No search engines available to populate dropdown.");
      return;
    }
    Object.keys(currentSearchEngines).forEach((key) => {
      const engine = currentSearchEngines[key];
      if (!engine || !engine.name || !engine.url) return;

      const item = document.createElement("div");
      item.className = "search-engine-item";
      item.dataset.engineKey = key;
      item.tabIndex = 0;

      const iconContainer = document.createElement("div");
      iconContainer.className = "search-engine-item-icon-container";

      const img = document.createElement("img");
      img.src = engine.icon || "";
      img.alt = engine.name;

      let iconDisplayedInDropdown = false;
      img.onload = () => {
        iconDisplayedInDropdown = true;
      };
      img.onerror = function () {
        this.style.display = "none";
        if (!iconDisplayedInDropdown) {
          const fallbackIcon = document.createElement("span");
          fallbackIcon.className = "material-symbols-outlined";
          fallbackIcon.textContent = "search";
          fallbackIcon.style.fontSize = "16px";
          fallbackIcon.style.marginRight = "12px";
          iconContainer.appendChild(fallbackIcon);
          iconDisplayedInDropdown = true;
        }
      };

      if (!engine.icon) {
        img.style.display = "none"; // Hide img if no src
        const fallbackIcon = document.createElement("span");
        fallbackIcon.className = "material-symbols-outlined";
        fallbackIcon.textContent = "search";
        fallbackIcon.style.fontSize = "16px";
        fallbackIcon.style.marginRight = "12px";
        iconContainer.appendChild(fallbackIcon);
        iconDisplayedInDropdown = true;
      } else {
        iconContainer.appendChild(img);
      }

      const nameSpan = document.createElement("span");
      nameSpan.textContent = engine.name;

      item.appendChild(iconContainer);
      item.appendChild(nameSpan);
      searchEngineDropdown.appendChild(item);

      item.addEventListener("click", function () {
        const newKey = this.dataset.engineKey;
        currentSelectedEngineKey = newKey;
        if (
          typeof settingsManager !== "undefined" &&
          settingsManager.saveSetting
        ) {
          settingsManager.saveSetting(
            "selectedSearchEngineKey",
            newKey,
            "selectedSearchEngineChanged",
            newKey
          );
        } else {
          chrome.storage.local.set({ selectedSearchEngineKey: newKey }, () => {
            document.dispatchEvent(
              new CustomEvent("selectedSearchEngineChanged", { detail: newKey })
            );
          });
        }
        // updateMainSearchUI() will be called by the event listener for 'selectedSearchEngineChanged'
        toggleMainDropdown(false);
        if (searchEngineSelector) searchEngineSelector.focus();
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const newKey = this.dataset.engineKey;
          currentSelectedEngineKey = newKey;
          if (
            typeof settingsManager !== "undefined" &&
            settingsManager.saveSetting
          ) {
            settingsManager.saveSetting(
              "selectedSearchEngineKey",
              newKey,
              "selectedSearchEngineChanged",
              newKey
            );
          } else {
            chrome.storage.local.set(
              { selectedSearchEngineKey: newKey },
              () => {
                document.dispatchEvent(
                  new CustomEvent("selectedSearchEngineChanged", {
                    detail: newKey,
                  })
                );
              }
            );
          }
          toggleMainDropdown(false);
          if (searchEngineSelector) searchEngineSelector.focus();
        }
      });
    });
  }

  function updateMainSearchUI() {
    const engine = currentSearchEngines[currentSelectedEngineKey];
    if (!currentSearchIconDisplay || !searchInput) return;

    while (currentSearchIconDisplay.firstChild) {
      currentSearchIconDisplay.removeChild(currentSearchIconDisplay.firstChild);
    }

    if (engine) {
      searchInput.placeholder =
        engine.placeholder || `Tìm với ${engine.name} hoặc nhập địa chỉ`;

      if (engine.icon) {
        const img = document.createElement("img");
        img.src = engine.icon;
        img.alt = `${engine.name} icon`;
        img.className = "current-search-icon-img";
        let mainIconDisplayed = false;
        img.onload = () => {
          mainIconDisplayed = true;
        };
        img.onerror = function () {
          this.style.display = "none";
          if (!mainIconDisplayed) {
            const fallback = document.createElement("span");
            fallback.className = "material-symbols-outlined";
            fallback.textContent = "search";
            fallback.style.fontSize = "20px";
            currentSearchIconDisplay.appendChild(fallback);
            mainIconDisplayed = true;
          }
        };
        currentSearchIconDisplay.appendChild(img);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "material-symbols-outlined";
        fallback.textContent = "search";
        fallback.style.fontSize = "20px";
        currentSearchIconDisplay.appendChild(fallback);
      }
    } else {
      const fallback = document.createElement("span");
      fallback.className = "material-symbols-outlined";
      fallback.textContent = "search";
      fallback.style.fontSize = "20px";
      currentSearchIconDisplay.appendChild(fallback);
      searchInput.placeholder = "Tìm kiếm hoặc nhập địa chỉ";
    }
  }

  function toggleMainDropdown(forceShow) {
    if (!searchEngineDropdown) return;
    const isVisible = searchEngineDropdown.classList.contains("visible");
    if (typeof forceShow === "boolean") {
      searchEngineDropdown.classList.toggle("visible", forceShow);
    } else {
      searchEngineDropdown.classList.toggle("visible");
    }
    // Khi mở dropdown search engine, ẩn bảng gợi ý tìm kiếm
    if (searchEngineDropdown.classList.contains("visible")) {
      if (searchHistoryDropdown) {
        searchHistoryDropdown.style.display = "none";
        // Xóa class search-bar-open khỏi search-bar-container
        const searchBar =
          searchInput && searchInput.closest(".search-bar-container");
        if (searchBar) searchBar.classList.remove("search-bar-open");
      }
      const firstItem = searchEngineDropdown.querySelector(
        ".search-engine-item"
      );
      if (firstItem) firstItem.focus();
    }
  }

  if (searchEngineSelector)
    searchEngineSelector.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMainDropdown();
    });
  if (searchEngineSelector)
    searchEngineSelector.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMainDropdown();
      }
    });
  if (searchInput)
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performMainSearch();
    });
  // Khi nhập vào ô tìm kiếm, nếu dropdown search engine đang mở thì đóng lại
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (
        searchEngineDropdown &&
        searchEngineDropdown.classList.contains("visible")
      ) {
        searchEngineDropdown.classList.remove("visible");
      }
    });
  }

  function performMainSearch() {
    const query = searchInput.value.trim();
    if (query === "") return;

    saveSearchHistory(query); // Thêm dòng này

    if (isValidURL(query)) {
      let urlToNavigate = query;
      if (!/^(https?:)?\/\//i.test(query)) {
        urlToNavigate = "https://" + query;
      }
      window.location.href = urlToNavigate;
    } else {
      const engine = currentSearchEngines[currentSelectedEngineKey];
      if (engine && engine.url) {
        const searchUrl = engine.url.replace("{s}", encodeURIComponent(query));
        window.location.href = searchUrl;
      } else {
        console.error(
          "Công cụ tìm kiếm đã chọn không hợp lệ:",
          currentSelectedEngineKey,
          engine
        );
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(
          query
        )}`; // Fallback
      }
    }
  }

  function isValidURL(string) {
    try {
      const url = new URL(
        string.startsWith("http") || string.startsWith("//")
          ? string
          : `https://${string}`
      );
      return (
        (url.protocol === "http:" || url.protocol === "https:") &&
        (url.hostname === "localhost" || url.hostname.includes("."))
      );
    } catch (_) {
      const pattern = new RegExp(
        "^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$" +
          "|^localhost$" +
          "|^((\\d{1,3}\\.){3}\\d{1,3})$"
      );
      return pattern.test(string);
    }
  }

  // --- BACKGROUND APPLICATION LOGIC ---
  function applyBackgroundFromSettings(bgSettings) {
    console.log("Applying background with settings in script.js:", bgSettings);
    if (!body) return; // Guard clause

    const { uploaded, url, solidColor } = bgSettings;

    function applySolidOrDef(color) {
      body.style.backgroundImage = "";
      body.style.backgroundColor = color || defaultPageBackgroundColor;
      if (backgroundVideo) {
        backgroundVideo.pause();
        backgroundVideo.src = "";
        backgroundVideo.style.display = "none";
      }
      console.log(
        "Applied solid/default color in script.js:",
        color || defaultPageBackgroundColor
      );
    }

    function isVideoUrl(urlString) {
      return urlString && (
        urlString.includes('.mp4') || 
        urlString.includes('.webm') || 
        urlString.includes('.ogg') ||
        urlString.includes('.mov') ||
        urlString.includes('video') ||
        urlString.startsWith('data:video')
      );
    }

    if (
      uploaded &&
      typeof uploaded === "string"
    ) {
      if (uploaded.startsWith("data:video")) {
        // Handle uploaded video
        if (backgroundVideo) {
          backgroundVideo.src = uploaded;
          backgroundVideo.style.display = "block";
          backgroundVideo.play().catch(e => console.log("Video autoplay failed:", e));
          body.style.backgroundImage = "";
          body.style.backgroundColor = "transparent";
        }
        console.log("Applied uploaded video in script.js:", uploaded.substring(0, 60) + "...");
      } else if (uploaded.startsWith("data:image")) {
        // Handle uploaded image
        body.style.backgroundImage = `url('${uploaded}')`;
        body.style.backgroundColor = "transparent";
        if (backgroundVideo) {
          backgroundVideo.pause();
          backgroundVideo.src = "";
          backgroundVideo.style.display = "none";
        }
        console.log("Applied uploaded background in script.js:", uploaded.substring(0, 60) + "...");
      }
    } else if (url && typeof url === "string" && url.trim() !== "") {
      try {
        new URL(url);
        if (isVideoUrl(url)) {
          // Handle video URL
          if (backgroundVideo) {
            backgroundVideo.src = url;
            backgroundVideo.style.display = "block";
            backgroundVideo.play().catch(e => console.log("Video autoplay failed:", e));
            body.style.backgroundImage = "";
            body.style.backgroundColor = "transparent";
          }
          console.log("Applied video URL background in script.js:", url);
        } else {
          // Handle image URL
          body.style.backgroundImage = `url('${CSS.escape(url)}')`;
          body.style.backgroundColor = "transparent";
          if (backgroundVideo) {
            backgroundVideo.pause();
            backgroundVideo.src = "";
            backgroundVideo.style.display = "none";
          }
          console.log("Applied URL background in script.js:", url);
        }
      } catch (e) {
        console.warn(
          "Invalid Background URL in applyBackgroundFromSettings (script.js):",
          url,
          e
        );
        applySolidOrDef(solidColor);
      }
    } else {
      applySolidOrDef(solidColor);
    }
  }

  // --- MODAL VISIBILITY ---
  function openModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = "flex";
    const firstInput = modalElement.querySelector(
      'input[type="text"],textarea,select'
    );
    if (firstInput) firstInput.focus();
  }
  function closeModal(modalElement) {
    if (!modalElement) return;
    modalElement.style.display = "none";
  }

  if (addShortcutBtn)
    addShortcutBtn.addEventListener("click", () => {
      if (shortcutModalTitle)
        shortcutModalTitle.textContent = "Thêm Lối tắt Mới";
      if (shortcutNameInput) shortcutNameInput.value = "";
      if (shortcutUrlInput) shortcutUrlInput.value = "";
      if (shortcutIndexInput) shortcutIndexInput.value = "-1";
      openModal(shortcutModal);
    });
  if (closeShortcutModalBtn)
    closeShortcutModalBtn.addEventListener("click", () =>
      closeModal(shortcutModal)
    );
  if (settingsBtn)
    settingsBtn.addEventListener("click", () => openModal(settingsModal));
  if (closeSettingsModalBtn)
    closeSettingsModalBtn.addEventListener("click", () =>
      closeModal(settingsModal)
    );

  // --- Widget Setting Modal Logic ---
  const widgetSettingModal = document.getElementById("widget-setting-modal");
  const widgetSettingModalTitle = document.getElementById(
    "widget-setting-modal-title"
  );
  const widgetSettingModalBody = document.getElementById(
    "widget-setting-modal-body"
  );
  let widgetSettingModalCloseBtn = document.querySelector(
    ".widget-setting-modal-close-btn"
  );

  // Đảm bảo nút X luôn hoạt động kể cả khi modal render lại nội dung
  function attachWidgetModalCloseBtn() {
    widgetSettingModalCloseBtn = document.querySelector(
      ".widget-setting-modal-close-btn"
    );
    if (widgetSettingModalCloseBtn) {
      widgetSettingModalCloseBtn.onclick = () => {
        if (widgetSettingModal) widgetSettingModal.style.display = "none";
      };
    }
  }
  attachWidgetModalCloseBtn();

  // --- Đồng hồ: Áp dụng style từ settings ---
  function applyClockCustomSettings(settings) {
    const el = document.getElementById("main-clock-widget");
    if (!el) return;
    // Font
    el.style.fontFamily = settings?.fontFamily || "";
    // Màu
    el.style.color = settings?.fontColor || "";
    // Kích cỡ
    el.style.fontSize = settings?.fontSize ? settings.fontSize + "px" : "";
    // Đổ bóng
    if (settings?.shadow) el.classList.add("clock-shadow");
    else el.classList.remove("clock-shadow");
    // Viền động
    if (settings?.borderAnimated) el.classList.add("clock-border-animated");
    else el.classList.remove("clock-border-animated");
  }

  // --- Lấy/lưu settings đồng hồ từ storage ---
  function getClockCustomSettings(cb) {
    chrome.storage.local.get(["clockCustomSettings"], (result) => {
      cb(result.clockCustomSettings || {});
    });
  }
  function saveClockCustomSettings(newSettings, cb) {
    chrome.storage.local.set({ clockCustomSettings: newSettings }, cb);
  }

  // --- Render form cài đặt đồng hồ ---
  function renderClockSettingsForm() {
    getClockCustomSettings((settings) => {
      const formHtml = `
        <form id="clock-settings-form">
          <div class="setting-subsection">
            <label>Font chữ:
              <select id="clock-font-family">
                <option value="inherit"${
                  !settings.fontFamily || settings.fontFamily === "inherit"
                    ? " selected"
                    : ""
                }>Mặc định</option>
                <option value="Roboto"${
                  settings.fontFamily === "Roboto" ? " selected" : ""
                }>Roboto</option>
                <option value="Segoe UI"${
                  settings.fontFamily === "Segoe UI" ? " selected" : ""
                }>Segoe UI</option>
                <option value="Arial"${
                  settings.fontFamily === "Arial" ? " selected" : ""
                }>Arial</option>
                <option value="monospace"${
                  settings.fontFamily === "monospace" ? " selected" : ""
                }>Monospace</option>
              </select>
            </label>
          </div>
          <div class="setting-subsection">
            <label>Màu chữ:
              <input type="color" id="clock-font-color" value="${
                settings.fontColor || "#e8eaed"
              }">
            </label>
          </div>
          <div class="setting-subsection">
            <label>Đổ bóng:
              <input type="checkbox" id="clock-shadow-toggle"${
                settings.shadow ? " checked" : ""
              }>
            </label>
          </div>
          <div class="setting-subsection">
            <label>Định dạng:
              <select id="clock-format">
                <option value="24h"${
                  !settings.format || settings.format === "24h"
                    ? " selected"
                    : ""
                }>24h</option>
                <option value="12h"${
                  settings.format === "12h" ? " selected" : ""
                }>12h (AM/PM)</option>
              </select>
            </label>
          </div>
          <div class="setting-subsection">
            <label>Kích cỡ:
              <input type="range" id="clock-font-size" min="24" max="120" value="${
                settings.fontSize || 76
              }">
              <span id="clock-font-size-value">${
                settings.fontSize || 76
              }px</span>
            </label>
          </div>
          <div class="setting-subsection">
            <label>
              <input type="checkbox" id="clock-border-toggle"${
                settings.borderAnimated ? " checked" : ""
              }> Viền động trong suốt
            </label>
          </div>
          <div class="setting-actions">
            <button type="submit" class="setting-action-button">Lưu</button>
            <button type="button" id="clock-reset-default-btn" class="setting-action-button danger" style="margin-left:8px;">Đặt mặc định</button>
          </div>
        </form>
      `;
      if (widgetSettingModalBody) widgetSettingModalBody.innerHTML = formHtml;

      // Sự kiện cập nhật preview khi thay đổi
      const form = document.getElementById("clock-settings-form");
      if (!form) return;
      const fontFamily = form.querySelector("#clock-font-family");
      const fontColor = form.querySelector("#clock-font-color");
      const fontSize = form.querySelector("#clock-font-size");
      const fontSizeValue = form.querySelector("#clock-font-size-value");
      const shadow = form.querySelector("#clock-shadow-toggle");
      const border = form.querySelector("#clock-border-toggle");

      function updatePreview() {
        const previewSettings = {
          fontFamily: fontFamily.value,
          fontColor: fontColor.value,
          fontSize: fontSize.value,
          shadow: shadow.checked,
          borderAnimated: border.checked,
        };
        applyClockCustomSettings(previewSettings);
        if (fontSizeValue) fontSizeValue.textContent = fontSize.value + "px";
      }
      fontFamily.addEventListener("change", updatePreview);
      fontColor.addEventListener("input", updatePreview);
      fontSize.addEventListener("input", updatePreview);
      shadow.addEventListener("change", updatePreview);
      border.addEventListener("change", updatePreview);

      // Lưu settings
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newSettings = {
          fontFamily: fontFamily.value,
          fontColor: fontColor.value,
          fontSize: fontSize.value,
          shadow: shadow.checked,
          borderAnimated: border.checked,
          format: form.querySelector("#clock-format").value,
        };
        saveClockCustomSettings(newSettings, () => {
          applyClockCustomSettings(newSettings);
          document.dispatchEvent(
            new CustomEvent("clockCustomSettingsChanged", {
              detail: newSettings,
            })
          );
          if (widgetSettingModal) widgetSettingModal.style.display = "none";
        });
      });

      // Nút đặt mặc định
      const resetBtn = form.querySelector("#clock-reset-default-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          const defaultSettings = {
            fontFamily: "inherit",
            fontColor: "#e8eaed",
            fontSize: 76,
            shadow: true,
            borderAnimated: false,
            format: "24h",
          };
          saveClockCustomSettings(defaultSettings, () => {
            applyClockCustomSettings(defaultSettings);
            document.dispatchEvent(
              new CustomEvent("clockCustomSettingsChanged", {
                detail: defaultSettings,
              })
            );
            if (widgetSettingModal) widgetSettingModal.style.display = "none";
          });
        });
      }

      // Áp dụng preview ban đầu
      updatePreview();
    });
  }

  // --- Ngày giờ: Áp dụng style từ settings ---
  function applyDateCustomSettings(settings) {
    const el = document.getElementById("main-date-widget");
    if (!el) return;
    el.style.fontFamily = settings?.fontFamily || "";
    el.style.color = settings?.fontColor || "";
    el.style.fontSize = settings?.fontSize ? settings.fontSize + "px" : "";
    if (settings?.shadow) el.classList.add("date-shadow");
    else el.classList.remove("date-shadow");
    if (settings?.borderAnimated) el.classList.add("date-border-animated");
    else el.classList.remove("date-border-animated");
    // Định dạng ngày
    if (settings?.format) {
      const today = new Date();
      let text = "";
      if (settings.format === "full") {
        text = today.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } else if (settings.format === "short") {
        text = today.toLocaleDateString("vi-VN");
      } else if (settings.format === "iso") {
        text = today.toISOString().slice(0, 10);
      }
      el.textContent = text;
    }
  }

  function getDateCustomSettings(cb) {
    chrome.storage.local.get(["dateCustomSettings"], (result) => {
      cb(result.dateCustomSettings || {});
    });
  }
  function saveDateCustomSettings(newSettings, cb) {
    chrome.storage.local.set({ dateCustomSettings: newSettings }, cb);
  }

  function renderDateSettingsForm() {
    getDateCustomSettings((settings) => {
      const form = document.getElementById("date-settings-form");
      if (!form) return;
      // Set initial values
      form.querySelector("#date-font-family").value =
        settings.fontFamily || "inherit";
      form.querySelector("#date-font-color").value =
        settings.fontColor || "#bdc1c6";
      form.querySelector("#date-shadow-toggle").checked = !!settings.shadow;
      form.querySelector("#date-format").value = settings.format || "full";
      form.querySelector("#date-font-size").value = settings.fontSize || 17;
      form.querySelector("#date-font-size-value").textContent =
        (settings.fontSize || 17) + "px";
      form.querySelector("#date-border-toggle").checked =
        !!settings.borderAnimated;

      function updatePreview() {
        const previewSettings = {
          fontFamily: form.querySelector("#date-font-family").value,
          fontColor: form.querySelector("#date-font-color").value,
          fontSize: form.querySelector("#date-font-size").value,
          shadow: form.querySelector("#date-shadow-toggle").checked,
          borderAnimated: form.querySelector("#date-border-toggle").checked,
          format: form.querySelector("#date-format").value,
        };
        applyDateCustomSettings(previewSettings);
        form.querySelector("#date-font-size-value").textContent =
          previewSettings.fontSize + "px";
      }
      form
        .querySelector("#date-font-family")
        .addEventListener("change", updatePreview);
      form
        .querySelector("#date-font-color")
        .addEventListener("input", updatePreview);
      form
        .querySelector("#date-shadow-toggle")
        .addEventListener("change", updatePreview);
      form
        .querySelector("#date-format")
        .addEventListener("change", updatePreview);
      form
        .querySelector("#date-font-size")
        .addEventListener("input", updatePreview);
      form
        .querySelector("#date-border-toggle")
        .addEventListener("change", updatePreview);

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newSettings = {
          fontFamily: form.querySelector("#date-font-family").value,
          fontColor: form.querySelector("#date-font-color").value,
          fontSize: form.querySelector("#date-font-size").value,
          shadow: form.querySelector("#date-shadow-toggle").checked,
          borderAnimated: form.querySelector("#date-border-toggle").checked,
          format: form.querySelector("#date-format").value,
        };
        saveDateCustomSettings(newSettings, () => {
          applyDateCustomSettings(newSettings);
          if (dateSettingsModal) dateSettingsModal.style.display = "none";
        });
      });

      const resetBtn = document.getElementById("date-reset-default-btn");
      if (resetBtn) {
        resetBtn.onclick = function () {
          const defaultSettings = {
            fontFamily: "inherit",
            fontColor: "#bdc1c6",
            fontSize: 17,
            shadow: false,
            borderAnimated: false,
            format: "full",
          };
          saveDateCustomSettings(defaultSettings, () => {
            applyDateCustomSettings(defaultSettings);
            if (dateSettingsModal) dateSettingsModal.style.display = "none";
          });
        };
      }

      updatePreview();
    });
  }

  // --- Weather: Settings ---
  function getWeatherCustomSettings(cb) {
    chrome.storage.local.get(["weatherCustomSettings"], (result) => {
      cb(result.weatherCustomSettings || {});
    });
  }
  function saveWeatherCustomSettings(newSettings, cb) {
    chrome.storage.local.set({ weatherCustomSettings: newSettings }, cb);
  }

  function renderWeatherSettingsForm() {
    getWeatherCustomSettings((settings) => {
      const form = document.getElementById("weather-settings-form");
      if (!form) return;
      form.querySelector("#weather-temp-unit").value = settings.unit || "C";
      form.querySelector("#weather-coord-toggle").checked =
        !!settings.manualCoord;
      form.querySelector("#weather-lat").value = settings.lat || "";
      form.querySelector("#weather-lon").value = settings.lon || "";
      form.querySelector("#weather-icon-toggle").checked =
        settings.showIcon !== false;
      form.querySelector("#weather-notify-toggle").checked = !!settings.notify;

      // Hiện/ẩn input tọa độ
      function updateCoordInputs() {
        const show = form.querySelector("#weather-coord-toggle").checked;
        form.querySelector("#weather-lat").style.display = show ? "" : "none";
        form.querySelector("#weather-lon").style.display = show ? "" : "none";
      }
      form
        .querySelector("#weather-coord-toggle")
        .addEventListener("change", updateCoordInputs);
      updateCoordInputs();

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const newSettings = {
          unit: form.querySelector("#weather-temp-unit").value,
          manualCoord: form.querySelector("#weather-coord-toggle").checked,
          lat: form.querySelector("#weather-lat").value,
          lon: form.querySelector("#weather-lon").value,
          showIcon: form.querySelector("#weather-icon-toggle").checked,
          notify: form.querySelector("#weather-notify-toggle").checked,
        };
        saveWeatherCustomSettings(newSettings, () => {
          if (weatherSettingsModal) weatherSettingsModal.style.display = "none";
        });
      });

      const resetBtn = document.getElementById("weather-reset-default-btn");
      if (resetBtn) {
        resetBtn.onclick = function () {
          const defaultSettings = {
            unit: "C",
            manualCoord: false,
            lat: "",
            lon: "",
            showIcon: true,
            notify: false,
          };
          saveWeatherCustomSettings(defaultSettings, () => {
            if (weatherSettingsModal)
              weatherSettingsModal.style.display = "none";
          });
        };
      }
    });
  }

  // --- Modal open/close for Ngày giờ & Thời tiết ---
  const dateSettingsModal = document.getElementById("date-settings-modal");
  const weatherSettingsModal = document.getElementById(
    "weather-settings-modal"
  );
  const closeDateSettingsModalBtn = document.querySelector(
    ".date-settings-modal-close-btn"
  );
  const closeWeatherSettingsModalBtn = document.querySelector(
    ".weather-settings-modal-close-btn"
  );

  if (closeDateSettingsModalBtn) {
    closeDateSettingsModalBtn.onclick = () => {
      if (dateSettingsModal) dateSettingsModal.style.display = "none";
    };
  }
  if (closeWeatherSettingsModalBtn) {
    closeWeatherSettingsModalBtn.onclick = () => {
      if (weatherSettingsModal) weatherSettingsModal.style.display = "none";
    };
  }

  // Gắn sự kiện click cho icon ngày giờ/thời tiết trong setting
  document
    .querySelectorAll(".widget-item-info-icon[data-widget]")
    .forEach((icon) => {
      icon.style.cursor = "pointer";
      icon.addEventListener("click", function (e) {
        e.stopPropagation();
        const widgetKey = this.getAttribute("data-widget");
        if (widgetKey === "mainClock") {
          if (widgetSettingModalTitle)
            widgetSettingModalTitle.textContent = "Cài đặt Đồng hồ chính";
          renderClockSettingsForm();
          if (widgetSettingModal) {
            widgetSettingModal.style.display = "flex";
            attachWidgetModalCloseBtn();
          }
          return;
        }
        if (widgetKey === "mainDate") {
          if (dateSettingsModal) {
            dateSettingsModal.style.display = "flex";
            renderDateSettingsForm();
          }
          return;
        }
        if (widgetKey === "weather") {
          if (weatherSettingsModal) {
            weatherSettingsModal.style.display = "flex";
            renderWeatherSettingsForm();
          }
          return;
        }
        const info = widgetSettingInfo[widgetKey] || {
          title: "Cài đặt Widget",
          body: "Chưa có thông tin cài đặt cho widget này.",
        };
        if (widgetSettingModalTitle)
          widgetSettingModalTitle.textContent = info.title;
        if (widgetSettingModalBody)
          widgetSettingModalBody.textContent = info.body;
        if (widgetSettingModal) {
          widgetSettingModal.style.display = "flex";
        }
      });
    });

  // Khi load trang, áp dụng settings đồng hồ nếu có
  getClockCustomSettings(applyClockCustomSettings);

  // Khi đổi settings đồng hồ từ nơi khác
  document.addEventListener("clockCustomSettingsChanged", (e) => {
    applyClockCustomSettings(e.detail);
  });

  // --- SHORTCUTS LOGIC ---
  function loadShortcutsFromStorage() {
    chrome.storage.local.get(["shortcuts"], (result) => {
      if (chrome.runtime.lastError)
        console.error("Lỗi tải shortcuts:", chrome.runtime.lastError.message);
      shortcuts = (result && result.shortcuts) || [];
      renderShortcutsUI();
    });
  }

  function renderShortcutsUI() {
    if (!shortcutsContainer) return;
    shortcutsContainer.innerHTML = "";
    if (!shortcutsEnabled) {
      shortcutsContainer.style.display = "none";
      if (addShortcutBtn) addShortcutBtn.style.display = "none";
      return;
    }
    shortcutsContainer.style.display = "";
    if (addShortcutBtn) addShortcutBtn.style.display = "";

    // Tính toán layout grid
    let rows = shortcutsRows > 0 ? shortcutsRows : 2;
    let perRow = shortcutsPerRow > 0 ? shortcutsPerRow : 4;
    shortcutsContainer.style.gridTemplateColumns = `repeat(${perRow}, 1fr)`;
    let maxShortcuts = rows * perRow;
    let displayShortcuts = shortcuts.slice(0, maxShortcuts);

    // Lấy giá trị opacity từ settings (0-100)
    let opacity = shortcutsOpacity / 100;

    displayShortcuts.forEach((shortcut, index) => {
      const shortcutElement = document.createElement("a");
      shortcutElement.href = shortcut.url;
      shortcutElement.className = "shortcut-item";
      shortcutElement.setAttribute("aria-label", shortcut.name || "Lối tắt");
      shortcutElement.style.opacity = opacity;
      // Áp dụng viền động nếu có bật
      if (shortcutBorderAnimated) {
        shortcutElement.classList.add("shortcut-border-animated");
      } else {
        shortcutElement.classList.remove("shortcut-border-animated");
      }
      // --- Drag & Drop attributes ---
      shortcutElement.draggable = true;
      shortcutElement.dataset.index = index;
      // --- Drag & Drop events ---
      shortcutElement.addEventListener("dragstart", handleShortcutDragStart);
      shortcutElement.addEventListener("dragover", handleShortcutDragOver);
      shortcutElement.addEventListener("drop", handleShortcutDrop);
      shortcutElement.addEventListener("dragend", handleShortcutDragEnd);
      shortcutElement.addEventListener("dragenter", handleShortcutDragEnter);
      shortcutElement.addEventListener("dragleave", handleShortcutDragLeave);

      const iconContainer = document.createElement("div");
      iconContainer.className = "shortcut-icon-container";

      const favicon = document.createElement("img");
      favicon.className = "shortcut-favicon";
      let domain;
      try {
        domain = new URL(shortcut.url).hostname;
      } catch (e) {
        domain = shortcut.url;
      }

      favicon.src = `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(
        domain
      )}`;
      favicon.alt = shortcut.name
        ? shortcut.name.substring(0, 1).toUpperCase()
        : "?";
      let shortcutIconDisplayed = false;
      favicon.onload = () => {
        shortcutIconDisplayed = true;
      };
      favicon.onerror = function () {
        this.style.display = "none";
        if (!shortcutIconDisplayed) {
          iconContainer.innerHTML = `<span class="shortcut-fallback-icon">${
            shortcut.name ? shortcut.name.charAt(0).toUpperCase() : "?"
          }</span>`;
          shortcutIconDisplayed = true;
        }
      };
      iconContainer.appendChild(favicon);

      const nameElement = document.createElement("span");
      nameElement.className = "shortcut-name";
      nameElement.textContent = shortcut.name || "Lối tắt";

      const actionsContainer = document.createElement("div");
      actionsContainer.className = "shortcut-actions";

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<span class="material-symbols-outlined">edit</span>';
      editBtn.className = "action-btn edit-shortcut-btn";
      editBtn.title = `Sửa lối tắt ${shortcut.name || ""}`;
      editBtn.dataset.index = index;
      editBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openShortcutModalForEdit(index);
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML =
        '<span class="material-symbols-outlined">delete</span>';
      deleteBtn.className = "action-btn delete-shortcut-btn";
      deleteBtn.title = `Xóa lối tắt ${shortcut.name || ""}`;
      deleteBtn.dataset.index = index;
      deleteBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteShortcutFromUI(index);
      };

      actionsContainer.appendChild(editBtn);
      actionsContainer.appendChild(deleteBtn);

      shortcutElement.appendChild(iconContainer);
      shortcutElement.appendChild(nameElement);
      shortcutElement.appendChild(actionsContainer);
      shortcutsContainer.appendChild(shortcutElement);
    });
  }

  // --- Drag & Drop logic for shortcuts ---
  let dragSrcIndex = null;

  function handleShortcutDragStart(e) {
    dragSrcIndex = Number(this.dataset.index);
    this.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    // For Firefox compatibility
    e.dataTransfer.setData("text/plain", dragSrcIndex);
  }
  function handleShortcutDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    this.classList.add("drag-over");
  }
  function handleShortcutDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");
    const targetIndex = Number(this.dataset.index);
    if (dragSrcIndex === null || dragSrcIndex === targetIndex) return;
    // Swap or move shortcut
    const moved = shortcuts.splice(dragSrcIndex, 1)[0];
    shortcuts.splice(targetIndex, 0, moved);
    chrome.storage.local.set({ shortcuts: shortcuts }, () => {
      renderShortcutsUI();
    });
  }
  function handleShortcutDragEnd(e) {
    dragSrcIndex = null;
    document
      .querySelectorAll(".shortcut-item.dragging")
      .forEach((el) => el.classList.remove("dragging"));
    document
      .querySelectorAll(".shortcut-item.drag-over")
      .forEach((el) => el.classList.remove("drag-over"));
  }
  function handleShortcutDragEnter(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }
  function handleShortcutDragLeave(e) {
    this.classList.remove("drag-over");
  }

  function openShortcutModalForEdit(index) {
    const shortcut = shortcuts[index];
    if (
      !shortcut ||
      !shortcutModalTitle ||
      !shortcutNameInput ||
      !shortcutUrlInput ||
      !shortcutIndexInput
    )
      return;
    shortcutModalTitle.textContent = "Sửa Lối tắt";
    shortcutNameInput.value = shortcut.name;
    shortcutUrlInput.value = shortcut.url;
    shortcutIndexInput.value = index;
    openModal(shortcutModal);
  }

  if (saveShortcutBtn)
    saveShortcutBtn.addEventListener("click", function () {
      if (!shortcutNameInput || !shortcutUrlInput || !shortcutIndexInput)
        return;
      const name = shortcutNameInput.value.trim();
      let url = shortcutUrlInput.value.trim();

      if (!name || !url) {
        alert("Vui lòng nhập tên và URL.");
        return;
      }
      if (!/^(https?:)?\/\//i.test(url)) url = "https://" + url;

      const indexToEdit = parseInt(shortcutIndexInput.value, 10);
      if (indexToEdit > -1 && shortcuts[indexToEdit]) {
        shortcuts[indexToEdit] = { name, url };
      } else {
        shortcuts.push({ name, url });
      }

      chrome.storage.local.set({ shortcuts: shortcuts }, () => {
        if (chrome.runtime.lastError)
          console.error("Lỗi lưu shortcuts:", chrome.runtime.lastError.message);
        renderShortcutsUI();
        closeModal(shortcutModal);
      });
    });

  function deleteShortcutFromUI(index) {
    if (index < 0 || index >= shortcuts.length) return;
    if (
      confirm(
        `Bạn có chắc muốn xóa lối tắt "${
          shortcuts[index].name || "này"
        }" không?`
      )
    ) {
      shortcuts.splice(index, 1);
      chrome.storage.local.set({ shortcuts: shortcuts }, () => {
        if (chrome.runtime.lastError)
          console.error("Lỗi xóa shortcut:", chrome.runtime.lastError.message);
        renderShortcutsUI();
      });
    }
  }

  document.addEventListener("shortcutsCleared", () => {
    shortcuts = [];
    renderShortcutsUI();
  });

  document.addEventListener("shortcutsLayoutChanged", (e) => {
    if (e.detail) {
      shortcutsRows = e.detail.rows;
      shortcutsPerRow = e.detail.perRow;
      renderShortcutsUI();
    }
  });

  function updateShortcutsVisibility() {
    if (!shortcutsContainer) return;
    if (shortcutsEnabled) {
      shortcutsContainer.style.display = "";
    } else {
      shortcutsContainer.style.display = "none";
    }
    if (addShortcutBtn)
      addShortcutBtn.style.display = shortcutsEnabled ? "" : "none";
  }

  // Initial load of shortcuts is now triggered by 'settingsReady' event
  // loadShortcutsFromStorage();

  console.log("New Tab Main Script Initialized and Ready!");

  // Lưu lịch sử tìm kiếm (search suggestions)
  function saveSearchHistory(query) {
    if (!query) return;
    chrome.storage.local.get(["searchHistory"], (result) => {
      let history = Array.isArray(result.searchHistory)
        ? result.searchHistory
        : [];
      // Không lưu trùng liên tiếp
      if (history[0] !== query) {
        history.unshift(query);
        // Giới hạn tối đa 50 gợi ý
        if (history.length > 50) history = history.slice(0, 50);
        chrome.storage.local.set({ searchHistory: history });
      }
    });
  }

  // Search history dropdown
  let searchHistoryDropdown = null;

  // Đảm bảo searchHistoryDropdown tồn tại và gắn vào DOM đúng chỗ
  function ensureSearchHistoryDropdown() {
    if (!searchHistoryDropdown) {
      searchHistoryDropdown = document.createElement("div");
      searchHistoryDropdown.className = "search-history-dropdown";
      // Gắn vào search-bar-container
      const searchBar =
        searchInput && searchInput.closest(".search-bar-container");
      if (searchBar) {
        searchBar.style.position = "relative";
        searchBar.appendChild(searchHistoryDropdown);
      }
    }
  }

  // --- Lấy lịch sử trình duyệt ---
  async function getBrowserHistory(query = "") {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: "getBrowserHistory",
          query: query,
        },
        (response) => {
          if (chrome.runtime.lastError || !Array.isArray(response)) {
            resolve([]);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  // --- Google PSE Suggestion ---
  async function fetchGooglePSESuggestions(query) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          type: "fetchGoogleSuggestions",
          query: query,
        },
        (response) => {
          if (
            chrome.runtime.lastError ||
            !response ||
            !Array.isArray(response.suggestions)
          ) {
            resolve([]);
          } else {
            resolve(response.suggestions);
          }
        }
      );
    });
  }

  // Hàm cập nhật bảng gợi ý tìm kiếm
  async function onSearchInputChanged() {
    ensureSearchHistoryDropdown();
    if (!searchInput || !searchHistoryDropdown) return;
    if (!searchHistoryEnabled) {
      searchHistoryDropdown.style.display = "none";
      const searchBar = searchInput.closest(".search-bar-container");
      if (searchBar) searchBar.classList.remove("search-bar-open");
      return;
    }
    const searchBar = searchInput.closest(".search-bar-container");
    const query = searchInput.value.trim().toLowerCase();

    // Lấy dữ liệu từ nhiều nguồn
    const [extensionHistory, browserHistory, googleSuggestions] =
      await Promise.all([
        // Lịch sử extension
        new Promise((resolve) => {
          chrome.storage.local.get(["searchHistory"], (result) => {
            let history = Array.isArray(result.searchHistory)
              ? result.searchHistory
              : [];
            // Lọc và loại bỏ trùng lặp
            let seen = new Set();
            let filtered = [];
            for (let item of history) {
              let lower = item.toLowerCase();
              if (!seen.has(lower)) {
                seen.add(lower);
                filtered.push(item);
              }
            }
            // Lọc theo query nếu có
            if (query) {
              filtered = filtered.filter((item) =>
                item.toLowerCase().includes(query)
              );
            }
            resolve(filtered.slice(0, 5)); // Giới hạn 5 gợi ý
          });
        }),
        // Lịch sử trình duyệt
        query.length >= 2 && browserHistorySyncEnabled
          ? getBrowserHistory(query)
          : Promise.resolve([]),
        // Gợi ý Google
        query.length >= 2
          ? fetchGooglePSESuggestions(query)
          : Promise.resolve([]),
      ]);

    // Tạo danh sách gợi ý tổng hợp
    const allSuggestions = [];
    const seenItems = new Set();

    // 1. Lịch sử extension (ưu tiên cao nhất)
    extensionHistory.forEach((item) => {
      if (!seenItems.has(item.toLowerCase())) {
        seenItems.add(item.toLowerCase());
        allSuggestions.push({
          type: "extension_history",
          text: item,
          icon: "history",
        });
      }
    });

    // 2. Lịch sử trình duyệt
    browserHistory.forEach((item) => {
      if (!seenItems.has(item.title.toLowerCase())) {
        seenItems.add(item.title.toLowerCase());
        allSuggestions.push({
          type: "browser_history",
          text: item.title,
          url: item.url,
          domain: item.domain,
          icon: "public",
        });
      }
    });

    // 3. Gợi ý Google
    googleSuggestions.forEach((item) => {
      if (!seenItems.has(item.toLowerCase())) {
        seenItems.add(item.toLowerCase());
        allSuggestions.push({
          type: "google_suggestion",
          text: item,
          icon: "search",
        });
      }
    });

    // Giới hạn tổng số gợi ý
    const finalSuggestions = allSuggestions.slice(0, 12);

    searchHistoryDropdown.innerHTML = "";
    if (finalSuggestions.length === 0) {
      searchHistoryDropdown.style.display = "none";
      if (searchBar) searchBar.classList.remove("search-bar-open");
      return;
    }

    finalSuggestions.forEach((item, idx) => {
      const div = document.createElement("div");
      div.className = "search-history-item";
      div.setAttribute("data-type", item.type);
      div.tabIndex = 0;
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.justifyContent = "space-between";

      // Icon bên trái
      const leftIcon = document.createElement("span");
      leftIcon.className = "material-symbols-outlined";
      leftIcon.textContent = item.icon;
      leftIcon.style.marginRight = "10px";
      leftIcon.style.flexShrink = "0";

      // Nội dung
      const textSpan = document.createElement("span");
      textSpan.textContent = item.text;
      textSpan.style.flexGrow = "1";
      textSpan.style.textAlign = "left";
      textSpan.style.overflow = "hidden";
      textSpan.style.textOverflow = "ellipsis";
      textSpan.style.whiteSpace = "nowrap";

      // Thêm domain info cho browser history
      if (item.type === "browser_history" && item.domain) {
        const domainSpan = document.createElement("span");
        domainSpan.className = "domain-info";
        domainSpan.textContent = `(${item.domain})`;
        textSpan.appendChild(domainSpan);
      }

      // Icon X bên phải (chỉ cho extension history)
      let rightIcon = null;
      if (item.type === "extension_history") {
        rightIcon = document.createElement("span");
        rightIcon.className = "material-symbols-outlined";
        rightIcon.textContent = "close";
        rightIcon.title = "Xóa từ khóa này";
        rightIcon.style.marginLeft = "10px";
        rightIcon.style.cursor = "pointer";
        rightIcon.style.flexShrink = "0";
        rightIcon.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          e.preventDefault();
          // Xóa từ khóa khỏi lịch sử extension
          chrome.storage.local.get(["searchHistory"], (res) => {
            let hist = Array.isArray(res.searchHistory)
              ? res.searchHistory
              : [];
            let newHist = hist.filter(
              (h) => h.toLowerCase() !== item.text.toLowerCase()
            );
            chrome.storage.local.set({ searchHistory: newHist }, () => {
              onSearchInputChanged();
            });
          });
        });
      }

      // Click vào dòng chọn từ khóa/gợi ý
      div.addEventListener("mousedown", (e) => {
        if (rightIcon && e.target === rightIcon) return;
        e.preventDefault();

        if (item.type === "browser_history" && item.url) {
          // Mở URL trực tiếp nếu là lịch sử trình duyệt
          window.location.href = item.url;
        } else {
          // Điền vào ô tìm kiếm
          searchInput.value = item.text;
          searchHistoryDropdown.style.display = "none";
          searchInput.focus();
        }
      });

      div.addEventListener("mouseenter", () => {
        Array.from(searchHistoryDropdown.children).forEach((el) =>
          el.classList.remove("active")
        );
        div.classList.add("active");
      });

      div.appendChild(leftIcon);
      textSpan.style.marginRight = rightIcon ? "0" : "10px";
      div.appendChild(textSpan);
      if (rightIcon) div.appendChild(rightIcon);
      searchHistoryDropdown.appendChild(div);
    });

    searchHistoryDropdown.style.display = "block";
    if (searchBar) searchBar.classList.add("search-bar-open");
  }

  searchInput.addEventListener("input", onSearchInputChanged);

  // Tắt hoàn toàn autocomplete của trình duyệt cho input tìm kiếm vì extension sẽ quản lý gợi ý
  // Điều này giúp tránh xung đột với gợi ý từ extension
  if (searchInput) {
    searchInput.setAttribute("autocomplete", "off");
    searchInput.setAttribute("autocorrect", "off");
    searchInput.setAttribute("autocapitalize", "off");
    searchInput.setAttribute("spellcheck", "false");
    // Nếu input nằm trong form, tắt autocomplete cho form luôn
    if (searchInput.form) {
      searchInput.form.setAttribute("autocomplete", "off");
    }
  }

  // Ví dụ: Gắn sự kiện cho checkbox hiệu ứng viền động shortcut trong modal settings
  const shortcutBorderToggle = document.getElementById(
    "shortcut-border-toggle"
  );
  if (shortcutBorderToggle) {
    shortcutBorderToggle.checked = shortcutBorderAnimated; // đồng bộ trạng thái ban đầu
    shortcutBorderToggle.addEventListener("change", function () {
      shortcutBorderAnimated = this.checked;
      chrome.storage.local.set(
        { shortcutBorderAnimated: shortcutBorderAnimated },
        () => {
          document.dispatchEvent(
            new CustomEvent("shortcutBorderAnimatedChanged", {
              detail: shortcutBorderAnimated,
            })
          );
          renderShortcutsUI();
        }
      );
    });
  }

  // Khi load trang, lấy giá trị shortcutBorderAnimated từ storage nếu có
  chrome.storage.local.get(["shortcutBorderAnimated"], (result) => {
    if (typeof result.shortcutBorderAnimated === "boolean") {
      shortcutBorderAnimated = result.shortcutBorderAnimated;
      if (shortcutBorderToggle)
        shortcutBorderToggle.checked = shortcutBorderAnimated;
      renderShortcutsUI();
    }
  });

  // Đảm bảo cập nhật hiệu ứng khi nhận event từ tab khác
  document.addEventListener("shortcutBorderAnimatedChanged", (e) => {
    shortcutBorderAnimated = !!e.detail;
    if (shortcutBorderToggle)
      shortcutBorderToggle.checked = shortcutBorderAnimated;
    renderShortcutsUI();
  });

  document.addEventListener("shortcutsOpacityChanged", (e) => {
    console.log("shortcutsOpacityChanged event received:", e.detail);
    // Cập nhật giá trị opacity và render lại shortcut
    shortcutsOpacity = e.detail.opacity; // Cập nhật biến state
    if (settingsManager && settingsManager.currentSettings) {
      settingsManager.currentSettings.shortcutsOpacity = e.detail.opacity;
      console.log("Updated shortcutsOpacity to:", e.detail.opacity);
      renderShortcutsUI();
    } else {
      console.log("settingsManager not available, trying direct update");
      // Fallback: cập nhật trực tiếp các shortcut hiện tại
      const opacity = e.detail.opacity / 100;
      document.querySelectorAll('.shortcut-item').forEach(item => {
        item.style.setProperty('opacity', opacity, 'important');
      });
    }
    
    // Thêm fallback để cập nhật trực tiếp ngay cả khi renderShortcutsUI được gọi
    setTimeout(() => {
      const opacity = e.detail.opacity / 100;
      const shortcuts = document.querySelectorAll('.shortcut-item');
      console.log(`Applying opacity ${opacity} to ${shortcuts.length} shortcuts`);
      shortcuts.forEach(item => {
        item.style.setProperty('opacity', opacity, 'important');
        console.log(`Applied opacity ${opacity} to:`, item);
      });
    }, 100);
  });
});
