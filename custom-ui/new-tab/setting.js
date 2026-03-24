// setting.js
console.log("setting.js loaded");

const DEFAULT_SEARCH_ENGINES = {
  google: {
    name: "Google",
    url: "https://www.google.com/search?q={s}",
    icon: "https://www.google.com/s2/favicons?sz=32&domain_url=google.com",
    isDefault: true,
    removable: false,
    placeholder: "Tìm kiếm với Google hoặc nhập địa chỉ",
  },
  bing: {
    name: "Bing",
    url: "https://www.bing.com/search?q={s}",
    icon: "https://www.google.com/s2/favicons?sz=32&domain_url=bing.com",
    removable: false,
    placeholder: "Tìm kiếm với Bing hoặc nhập địa chỉ",
  },
  duckduckgo: {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q={s}",
    icon: "https://www.google.com/s2/favicons?sz=32&domain_url=duckduckgo.com",
    removable: false,
    placeholder: "Tìm kiếm với DuckDuckGo hoặc nhập địa chỉ",
  },
};

const settingsManager = {
  // DOM Elements
  uploadBackgroundInput: null,
  animatedBackgroundBtn: null,
  backgroundUrlInput: null,
  saveBackgroundUrlBtn: null,
  removeBackgroundImageBtn: null,
  solidColorInput: null,
  saveSolidColorBtn: null,
  mainClockToggle: null,
  mainDateToggle: null,
  weatherToggle: null,
  shortcutsToggle: null, // Thêm toggle lối tắt
  clearShortcutsBtn: null, // Nút xóa tất cả lối tắt
  shortcutsRowsInput: null, // Input số hàng
  shortcutsPerRowInput: null, // Input số lượng trên hàng
  backupSettingsBtn: null, // Nút sao lưu
  restoreSettingsInput: null, // Input file phục hồi
  searchEngineListElement: null,
  newSeNameInput: null,
  newSeUrlInput: null,
  newSeIconUrlInput: null,
  saveNewSeBtn: null,
  collapsibleHeaders: null,
  shortcutsOpacityInput: null, // Input độ trong suốt lối tắt

  // Current Settings State
  currentSettings: {
    backgroundImageUploaded: null,
    backgroundImageUrl: null,
    backgroundColorSolid: null, // Sẽ dùng var(--background-primary-default) nếu null
    mainClockEnabled: true,
    mainDateEnabled: true,
    weatherEnabled: false,
    searchEngines: { ...DEFAULT_SEARCH_ENGINES },
    selectedSearchEngineKey: "google",
    shortcutsEnabled: true, // Thêm bật/tắt lối tắt
    shortcutsRows: 2, // Số hàng mặc định
    shortcutsPerRow: 4, // Số lượng trên một hàng mặc định
    searchHistoryEnabled: true, // Thêm bật/tắt lịch sử tìm kiếm
    browserHistorySyncEnabled: true, // Thêm bật/tắt đồng bộ lịch sử trình duyệt
    shortcutsOpacity: 100, // Độ trong suốt mặc định (100%)
  },

  init() {
    this.cacheDomElements();
    this.loadSettings().then(() => {
      this.populateSettingsUI();
      this.attachEventListeners();
      // Quan trọng: Gửi bản sao của currentSettings để tránh thay đổi không mong muốn từ các listener khác
      document.dispatchEvent(
        new CustomEvent("settingsReady", {
          detail: JSON.parse(JSON.stringify(this.currentSettings)),
        })
      );
    });
  },

  cacheDomElements() {
    this.uploadBackgroundInput = document.getElementById(
      "upload-background-input"
    );
    this.animatedBackgroundBtn = document.getElementById(
      "animated-background-btn"
    );
    this.backgroundUrlInput = document.getElementById("background-url-input");
    this.saveBackgroundUrlBtn = document.getElementById(
      "save-background-url-btn"
    );
    this.removeBackgroundImageBtn = document.getElementById(
      "remove-background-image-btn"
    );
    this.solidColorInput = document.getElementById("solid-color-input");
    this.saveSolidColorBtn = document.getElementById("save-solid-color-btn");
    this.mainClockToggle = document.getElementById("widget-main-clock-toggle");
    this.mainDateToggle = document.getElementById("widget-main-date-toggle");
    this.weatherToggle = document.getElementById("widget-weather-toggle");
    this.shortcutsToggle = document.getElementById("widget-shortcuts-toggle");
    this.clearShortcutsBtn = document.getElementById("clear-shortcuts-btn");
    this.shortcutsRowsInput = document.getElementById("shortcuts-rows-input");
    this.shortcutsPerRowInput = document.getElementById(
      "shortcuts-per-row-input"
    );
    this.backupSettingsBtn = document.getElementById("backup-settings-btn");
    this.restoreSettingsInput = document.getElementById(
      "restore-settings-input"
    );
    this.searchEngineListElement =
      document.getElementById("search-engine-list");
    this.newSeNameInput = document.getElementById("new-se-name");
    this.newSeUrlInput = document.getElementById("new-se-url");
    this.newSeIconUrlInput = document.getElementById("new-se-icon-url");
    this.saveNewSeBtn = document.getElementById("save-new-se-btn");
    this.collapsibleHeaders = document.querySelectorAll(
      ".settings-panel .collapsible-header"
    );
    this.searchHistoryToggle = document.getElementById(
      "widget-search-history-toggle"
    );
    this.browserHistorySyncToggle = document.getElementById(
      "widget-browser-history-sync-toggle"
    );
    this.shortcutsOpacityInput = document.getElementById("shortcuts-opacity-input");
  },

  async loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        [
          "backgroundImageUploaded",
          "backgroundImageUrl",
          "backgroundColorSolid",
          "mainClockEnabled",
          "mainDateEnabled",
          "weatherEnabled",
          "userSearchEngines",
          "selectedSearchEngineKey",
          "shortcutsEnabled",
          "shortcutsRows",
          "shortcutsPerRow",
          "searchHistoryEnabled",
          "browserHistorySyncEnabled",
          "shortcutsOpacity",
        ],
        (result) => {
          if (chrome.runtime.lastError)
            console.error(
              "Error loading settings:",
              chrome.runtime.lastError.message
            );

          this.currentSettings.backgroundImageUploaded =
            result.backgroundImageUploaded || null;
          this.currentSettings.backgroundImageUrl =
            result.backgroundImageUrl || null;
          this.currentSettings.backgroundColorSolid =
            result.backgroundColorSolid || null;

          this.currentSettings.mainClockEnabled =
            typeof result.mainClockEnabled === "boolean"
              ? result.mainClockEnabled
              : true;
          this.currentSettings.mainDateEnabled =
            typeof result.mainDateEnabled === "boolean"
              ? result.mainDateEnabled
              : true;
          this.currentSettings.weatherEnabled =
            typeof result.weatherEnabled === "boolean"
              ? result.weatherEnabled
              : false;
          this.currentSettings.shortcutsEnabled =
            typeof result.shortcutsEnabled === "boolean"
              ? result.shortcutsEnabled
              : true;
          this.currentSettings.shortcutsRows =
            typeof result.shortcutsRows === "number" ? result.shortcutsRows : 2;
          this.currentSettings.shortcutsPerRow =
            typeof result.shortcutsPerRow === "number"
              ? result.shortcutsPerRow
              : 4;
          this.currentSettings.searchHistoryEnabled =
            typeof result.searchHistoryEnabled === "boolean"
              ? result.searchHistoryEnabled
              : true;
          this.currentSettings.browserHistorySyncEnabled =
            typeof result.browserHistorySyncEnabled === "boolean"
              ? result.browserHistorySyncEnabled
              : true;
          this.currentSettings.shortcutsOpacity =
            typeof result.shortcutsOpacity === "number" ? result.shortcutsOpacity : 100;

          const userEngines = result.userSearchEngines || {};
          // Tạo bản sao sâu của DEFAULT_SEARCH_ENGINES để tránh sửa đổi trực tiếp
          let mergedEngines = JSON.parse(
            JSON.stringify(DEFAULT_SEARCH_ENGINES)
          );

          for (const key in userEngines) {
            mergedEngines[key] = {
              ...(mergedEngines[key] || {}),
              ...userEngines[key],
              removable: true,
            };
          }
          // Đảm bảo các default engine không bị đánh dấu là removable=true trừ khi user đã override nó
          for (const defKey in DEFAULT_SEARCH_ENGINES) {
            if (mergedEngines[defKey] && !userEngines[defKey]) {
              // Nếu là default và không bị user override
              mergedEngines[defKey].removable =
                DEFAULT_SEARCH_ENGINES[defKey].removable;
            }
          }

          this.currentSettings.searchEngines = mergedEngines;

          const defaultSelectedKey =
            Object.keys(this.currentSettings.searchEngines).find(
              (k) => this.currentSettings.searchEngines[k].isDefault
            ) || "google";
          this.currentSettings.selectedSearchEngineKey =
            result.selectedSearchEngineKey &&
            this.currentSettings.searchEngines[result.selectedSearchEngineKey]
              ? result.selectedSearchEngineKey
              : defaultSelectedKey;

          console.log(
            "Settings loaded by settingsManager:",
            JSON.parse(JSON.stringify(this.currentSettings))
          );
          resolve();
        }
      );
    });
  },

  // Helper để lấy trạng thái nền hiện tại, dùng khi bắn event backgroundChanged
  getCurrentBackgroundSettings() {
    return {
      uploaded: this.currentSettings.backgroundImageUploaded,
      url: this.currentSettings.backgroundImageUrl,
      solidColor: this.currentSettings.backgroundColorSolid,
    };
  },

  saveSetting(
    key,
    value,
    dispatchEventName = null,
    eventDetail = null,
    isFullObject = false
  ) {
    // Update local state first
    if (isFullObject) {
      // Nếu value là toàn bộ object settings (hiếm khi dùng trừ khi reset)
      this.currentSettings = { ...this.currentSettings, ...value };
    } else {
      this.currentSettings[key] = value;
    }

    let dataToSave = {};
    if (key === "searchEngines") {
      // Khi lưu 'searchEngines', chúng ta chỉ muốn lưu phần 'userSearchEngines' vào storage.
      // currentSettings.searchEngines vẫn giữ bản merged đầy đủ.
      const userSearchEnginesToSave = {};
      for (const engineKey in this.currentSettings.searchEngines) {
        if (this.currentSettings.searchEngines[engineKey].removable === true) {
          userSearchEnginesToSave[engineKey] =
            this.currentSettings.searchEngines[engineKey];
        }
      }
      dataToSave = { userSearchEngines: userSearchEnginesToSave };
    } else if (isFullObject) {
      dataToSave = value; // Lưu toàn bộ object
    } else {
      dataToSave = { [key]: value };
    }

    chrome.storage.local.set(dataToSave, () => {
      if (chrome.runtime.lastError) {
        console.error(
          `Error saving ${Object.keys(dataToSave).join(", ")}:`,
          chrome.runtime.lastError.message
        );
      } else {
        console.log(`${Object.keys(dataToSave).join(", ")} saved:`, dataToSave);
        if (dispatchEventName) {
          let detailToSend;
          if (eventDetail !== null) {
            detailToSend = eventDetail;
          } else if (dispatchEventName === "backgroundChanged") {
            detailToSend = this.getCurrentBackgroundSettings();
          } else if (
            key === "searchEngines" &&
            dispatchEventName === "searchEnginesUpdated"
          ) {
            detailToSend = this.currentSettings.searchEngines; // Gửi bản merged đầy đủ
          } else if (isFullObject) {
            detailToSend = this.currentSettings; // Gửi toàn bộ settings đã cập nhật
          } else {
            detailToSend = { [key]: this.currentSettings[key] }; // Gửi giá trị đã được cập nhật trong currentSettings
          }
          document.dispatchEvent(
            new CustomEvent(dispatchEventName, { detail: detailToSend })
          );
        }
      }
    });
  },

  populateSettingsUI() {
    if (this.backgroundUrlInput && this.currentSettings.backgroundImageUrl)
      this.backgroundUrlInput.value = this.currentSettings.backgroundImageUrl;
    if (this.solidColorInput && this.currentSettings.backgroundColorSolid)
      this.solidColorInput.value = this.currentSettings.backgroundColorSolid;
    else if (this.solidColorInput) this.solidColorInput.value = "#202124"; // Default cho input color

    if (this.mainClockToggle)
      this.mainClockToggle.checked = this.currentSettings.mainClockEnabled;
    if (this.mainDateToggle)
      this.mainDateToggle.checked = this.currentSettings.mainDateEnabled;
    if (this.weatherToggle)
      this.weatherToggle.checked = this.currentSettings.weatherEnabled;
    if (this.shortcutsToggle)
      this.shortcutsToggle.checked = this.currentSettings.shortcutsEnabled;
    if (this.searchHistoryToggle)
      this.searchHistoryToggle.checked =
        this.currentSettings.searchHistoryEnabled;
    if (this.browserHistorySyncToggle)
      this.browserHistorySyncToggle.checked =
        this.currentSettings.browserHistorySyncEnabled;
    if (this.shortcutsRowsInput)
      this.shortcutsRowsInput.value = this.currentSettings.shortcutsRows;
    if (this.shortcutsPerRowInput)
      this.shortcutsPerRowInput.value = this.currentSettings.shortcutsPerRow;
    if (this.shortcutsOpacityInput)
      this.shortcutsOpacityInput.value = this.currentSettings.shortcutsOpacity;
    if (this.shortcutsOpacityInput) {
      const val = this.currentSettings.shortcutsOpacity;
      const valueSpan = document.getElementById("shortcuts-opacity-value");
      if (valueSpan) valueSpan.textContent = val + "%";
    }

    this.renderSearchEngineList();
  },

  attachEventListeners() {
    // Collapsible sections
    if (this.collapsibleHeaders) {
      this.collapsibleHeaders.forEach((header) => {
        header.addEventListener("click", () => {
          const collapsible = header.closest(".collapsible");
          if (!collapsible) return;
          collapsible.classList.toggle("active");
          const content = collapsible.querySelector(".collapsible-content");
          if (content) {
            if (collapsible.classList.contains("active")) {
              content.style.maxHeight = content.scrollHeight + "px";
              content.style.paddingTop = "15px";
            } else {
              content.style.maxHeight = null;
              content.style.paddingTop = null;
            }
          }
        });
      });
    }

    // Background settings
    if (this.uploadBackgroundInput)
      this.uploadBackgroundInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (
          file &&
          (file.type.startsWith("image/") || file.type === "image/gif" || file.type.startsWith("video/"))
        ) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileDataUrl = e.target.result;
            
            // Check file size limit (Chrome extension storage limit is ~5MB)
            const fileSizeKB = Math.round(file.size / 1024);
            const maxSizeKB = 5 * 1024; // 5MB limit
            
            if (fileSizeKB > maxSizeKB) {
              alert(`File quá lớn! Kích thước: ${fileSizeKB}KB. Tối đa: ${maxSizeKB}KB\n\nVui lòng chọn video nhỏ hơn hoặc dùng URL video online.`);
              this.uploadBackgroundInput.value = null;
              return;
            }
            
            this.currentSettings.backgroundImageUploaded = fileDataUrl;
            this.currentSettings.backgroundImageUrl = "";
            this.saveSetting("backgroundImageUploaded", fileDataUrl);
            this.saveSetting("backgroundImageUrl", "", "backgroundChanged");
            if (this.backgroundUrlInput) this.backgroundUrlInput.value = "";
            
            // Trigger background change event to reload video
            document.dispatchEvent(new CustomEvent("backgroundChanged"));
          };
          reader.readAsDataURL(file);
        } else if (file) {
          alert("Vui lòng chọn tệp hình ảnh, GIF hoặc video.");
        }
        this.uploadBackgroundInput.value = null;
      });

    if (this.saveBackgroundUrlBtn)
      this.saveBackgroundUrlBtn.addEventListener("click", () => {
        const url = this.backgroundUrlInput.value.trim();
        if (url && !url.match(/^(https?:\/\/|data:image\/|data:video\/)/i)) {
          alert(
            "URL không hợp lệ. Phải bắt đầu bằng http(s)://, data:image/ hoặc data:video/"
          );
          return;
        }
        this.currentSettings.backgroundImageUrl = url;
        this.currentSettings.backgroundImageUploaded = "";
        this.saveSetting("backgroundImageUrl", url);
        this.saveSetting("backgroundImageUploaded", "", "backgroundChanged");
      });

    if (this.removeBackgroundImageBtn)
      this.removeBackgroundImageBtn.addEventListener("click", () => {
        this.currentSettings.backgroundImageUrl = "";
        this.currentSettings.backgroundImageUploaded = "";
        this.saveSetting("backgroundImageUrl", "");
        this.saveSetting("backgroundImageUploaded", "", "backgroundChanged");
        if (this.backgroundUrlInput) this.backgroundUrlInput.value = "";
      });

    if (this.saveSolidColorBtn)
      this.saveSolidColorBtn.addEventListener("click", () => {
        const color = this.solidColorInput.value;
        this.saveSetting("backgroundColorSolid", color, "backgroundChanged");
      });

    if (this.animatedBackgroundBtn)
      this.animatedBackgroundBtn.addEventListener("click", () =>
        alert("Tính năng hình nền động (không phải GIF) sắp ra mắt!")
      );

    // Widget toggles
    if (this.mainClockToggle)
      this.mainClockToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "mainClockEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "mainClock", enabled: e.target.checked }
        )
      );
    if (this.mainDateToggle)
      this.mainDateToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "mainDateEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "mainDate", enabled: e.target.checked }
        )
      );
    if (this.weatherToggle)
      this.weatherToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "weatherEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "weather", enabled: e.target.checked }
        )
      );
    if (this.shortcutsToggle)
      this.shortcutsToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "shortcutsEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "shortcuts", enabled: e.target.checked }
        )
      );
    if (this.searchHistoryToggle)
      this.searchHistoryToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "searchHistoryEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "searchHistory", enabled: e.target.checked }
        )
      );
    if (this.browserHistorySyncToggle)
      this.browserHistorySyncToggle.addEventListener("change", (e) =>
        this.saveSetting(
          "browserHistorySyncEnabled",
          e.target.checked,
          "widgetToggleChanged",
          { widget: "browserHistorySync", enabled: e.target.checked }
        )
      );
    if (this.clearShortcutsBtn)
      this.clearShortcutsBtn.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa tất cả lối tắt?")) {
          chrome.storage.local.set({ shortcuts: [] }, () => {
            document.dispatchEvent(new CustomEvent("shortcutsCleared"));
          });
        }
      });
    if (this.shortcutsRowsInput)
      this.shortcutsRowsInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        this.saveSetting("shortcutsRows", val, "shortcutsLayoutChanged", {
          rows: val,
          perRow: this.currentSettings.shortcutsPerRow,
        });
      });
    if (this.shortcutsPerRowInput)
      this.shortcutsPerRowInput.addEventListener("change", (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        this.saveSetting("shortcutsPerRow", val, "shortcutsLayoutChanged", {
          rows: this.currentSettings.shortcutsRows,
          perRow: val,
        });
      });
    if (this.shortcutsOpacityInput)
      this.shortcutsOpacityInput.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        this.currentSettings.shortcutsOpacity = val;
        this.saveSetting("shortcutsOpacity", val, "shortcutsOpacityChanged", { opacity: val });
        const valueSpan = document.getElementById("shortcuts-opacity-value");
        if (valueSpan) valueSpan.textContent = val + "%";
      });
    if (this.backupSettingsBtn)
      this.backupSettingsBtn.addEventListener("click", () =>
        this.backupAllSettings()
      );
    if (this.restoreSettingsInput)
      this.restoreSettingsInput.addEventListener("change", (e) =>
        this.restoreAllSettings(e)
      );
    // Add new search engine
    if (this.saveNewSeBtn)
      this.saveNewSeBtn.addEventListener("click", () => {
        const name = this.newSeNameInput.value.trim();
        const url = this.newSeUrlInput.value.trim();
        let iconUrl = this.newSeIconUrlInput.value.trim();

        if (!name || !url || !url.includes("{s}")) {
          alert(
            "Vui lòng nhập tên và URL tìm kiếm (phải chứa {s} cho vị trí của từ khóa tìm kiếm)."
          );
          return;
        }

        const key =
          name
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^\w-]/g, "") || `custom_${Date.now()}`;

        if (this.currentSettings.searchEngines[key]) {
          alert(
            `Công cụ tìm kiếm với key "${key}" (tạo từ tên) đã tồn tại. Vui lòng chọn tên khác.`
          );
          return;
        }
        if (!iconUrl) {
          try {
            const domain = new URL(url.replace("{s}", "example.com")).hostname;
            iconUrl = `https://www.google.com/s2/favicons?sz=32&domain_url=${domain}`;
          } catch (e) {
            // Để trống nếu không lấy được domain, JS sẽ dùng fallback Material Icon
            iconUrl = "";
          }
        }

        const newEngineData = {
          name,
          url,
          icon: iconUrl,
          removable: true,
          placeholder: `Tìm với ${name} hoặc nhập địa chỉ`,
        };
        const updatedEngines = {
          ...this.currentSettings.searchEngines,
          [key]: newEngineData,
        };

        // Lưu toàn bộ object searchEngines (merged) vào currentSettings,
        // sau đó saveSetting sẽ chỉ lưu phần userSearchEngines vào storage.
        this.saveSetting(
          "searchEngines",
          updatedEngines,
          "searchEnginesUpdated"
        );
        this.renderSearchEngineList();

        this.newSeNameInput.value = "";
        this.newSeUrlInput.value = "";
        this.newSeIconUrlInput.value = "";
      });
  },

  renderSearchEngineList() {
    if (!this.searchEngineListElement) return;
    this.searchEngineListElement.innerHTML = "";
    if (!this.currentSettings || !this.currentSettings.searchEngines) {
      console.warn("Dữ liệu công cụ tìm kiếm không có sẵn để render list.");
      return;
    }

    Object.keys(this.currentSettings.searchEngines).forEach((key) => {
      const engine = this.currentSettings.searchEngines[key];
      if (!engine) return; // Bỏ qua nếu engine không hợp lệ

      const li = document.createElement("li");
      li.dataset.key = key;

      const iconContainer = document.createElement("div");
      iconContainer.className = "list-icon-container";

      const img = document.createElement("img");
      img.src = engine.icon || "";
      img.alt = engine.name ? `${engine.name} icon` : "Search engine icon";
      img.className = "list-icon";

      let iconDisplayed = false;
      img.onload = () => {
        iconDisplayed = true;
      }; // Đánh dấu nếu ảnh tải thành công
      img.onerror = function () {
        this.style.display = "none";
        if (!iconDisplayed) {
          // Chỉ thêm fallback nếu img chưa bao giờ load thành công
          const fallbackIcon = document.createElement("span");
          fallbackIcon.className =
            "material-symbols-outlined list-icon-fallback";
          fallbackIcon.textContent = "search";
          iconContainer.appendChild(fallbackIcon);
          iconDisplayed = true; // Đánh dấu fallback đã được hiển thị
        }
      };

      if (!engine.icon) {
        // Nếu không có URL icon, hiển thị fallback ngay
        // img.style.display = 'none'; // không cần thiết vì src rỗng sẽ tự fail
        const fallbackIcon = document.createElement("span");
        fallbackIcon.className = "material-symbols-outlined list-icon-fallback";
        fallbackIcon.textContent = "search";
        iconContainer.appendChild(fallbackIcon);
        iconDisplayed = true;
      } else {
        iconContainer.appendChild(img);
      }

      const span = document.createElement("span");
      span.textContent = `${engine.name || "Không có tên"} (${
        engine.url || "Không có URL"
      })`;

      li.appendChild(iconContainer);
      li.appendChild(span);

      if (engine.removable === true) {
        // Chỉ custom engines mới có thể xóa
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-custom-se-btn icon-button danger";
        deleteBtn.title = `Xóa ${engine.name || "công cụ này"}`;
        deleteBtn.innerHTML =
          '<span class="material-symbols-outlined">delete</span>';
        deleteBtn.onclick = () => {
          if (
            confirm(
              `Bạn có chắc muốn xóa công cụ tìm kiếm "${engine.name || key}"?`
            )
          ) {
            const updatedEngines = { ...this.currentSettings.searchEngines };
            delete updatedEngines[key];

            if (this.currentSettings.selectedSearchEngineKey === key) {
              const newSelectedKey =
                Object.keys(DEFAULT_SEARCH_ENGINES).find(
                  (k) => DEFAULT_SEARCH_ENGINES[k].isDefault
                ) || "google";
              // Lưu selectedSearchEngineKey riêng và bắn event
              this.saveSetting(
                "selectedSearchEngineKey",
                newSelectedKey,
                "selectedSearchEngineChanged",
                newSelectedKey
              );
            }
            // Lưu lại danh sách searchEngines (chỉ phần user) và bắn event
            this.saveSetting(
              "searchEngines",
              updatedEngines,
              "searchEnginesUpdated"
            );
            this.renderSearchEngineList();
          }
        };
        li.appendChild(deleteBtn);
      }
      this.searchEngineListElement.appendChild(li);
    });
  },

  async backupAllSettings() {
    // Lấy tất cả dữ liệu cần thiết
    chrome.storage.local.get(null, (allData) => {
      // Lấy hình ảnh upload (nếu có)
      let images = {};
      if (
        allData.backgroundImageUploaded &&
        (allData.backgroundImageUploaded.startsWith("data:image") || allData.backgroundImageUploaded.startsWith("data:video"))
      ) {
        const extension = allData.backgroundImageUploaded.startsWith("data:video") ? "mp4" : "png";
        images[`backgroundImageUploaded.${extension}`] = allData.backgroundImageUploaded;
      }
      // Tạo file json
      const exportData = {
        settings: allData,
        images: images,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "newtab_settings_backup.json";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    });
  },

  async restoreAllSettings(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        if (data && data.settings) {
          chrome.storage.local.set(data.settings, () => {
            alert("Khôi phục cài đặt thành công! Vui lòng tải lại trang.");
          });
        } else {
          alert("File không hợp lệ!");
        }
      } catch (err) {
        alert("Không thể đọc file sao lưu: " + err.message);
      }
    };
    reader.readAsText(file);
    // Reset input để có thể chọn lại file nếu muốn
    e.target.value = "";
  },
};

document.addEventListener("DOMContentLoaded", () => {
  // Đảm bảo settingsManager được khởi tạo chỉ một lần.
  if (
    typeof settingsManager.init === "function" &&
    !settingsManager.initialized
  ) {
    settingsManager.init();
    settingsManager.initialized = true; // Đánh dấu đã khởi tạo
  }
});
