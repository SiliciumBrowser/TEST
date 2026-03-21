// widget.js
console.log("widget.js loaded");

// --- Yêu cầu 1: Khai báo biến interval cho đồng hồ ---
let mainClockIntervalId = null;

// --- Helper: Lấy setting ngày giờ và thời tiết ---
function getDateCustomSettings(cb) {
  chrome.storage.local.get(["dateCustomSettings"], (result) => {
    cb(result.dateCustomSettings || {});
  });
}
function getWeatherCustomSettings(cb) {
  chrome.storage.local.get(["weatherCustomSettings"], (result) => {
    cb(result.weatherCustomSettings || {});
  });
}

// --- Sửa lại initMainDate để áp dụng style và định dạng ---
function initMainDate(dateElement, isEnabled) {
  if (!dateElement) return;
  if (!isEnabled) {
    dateElement.classList.add("hidden");
    return;
  }
  dateElement.classList.remove("hidden");
  getDateCustomSettings((settings) => {
    // Định dạng ngày
    const today = new Date();
    let text = "";
    if (settings.format === "short") {
      text = today.toLocaleDateString("vi-VN");
    } else if (settings.format === "iso") {
      text = today.toISOString().slice(0, 10);
    } else {
      text = today.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    dateElement.textContent = text;
    // Font
    dateElement.style.fontFamily = settings.fontFamily || "";
    // Màu
    dateElement.style.color = settings.fontColor || "";
    // Kích cỡ
    dateElement.style.fontSize = settings.fontSize
      ? settings.fontSize + "px"
      : "";
    // Đổ bóng
    if (settings.shadow) dateElement.classList.add("date-shadow");
    else dateElement.classList.remove("date-shadow");
    // Viền động
    if (settings.borderAnimated)
      dateElement.classList.add("date-border-animated");
    else dateElement.classList.remove("date-border-animated");
  });
}

/**
 * Khởi tạo và cập nhật đồng hồ chính.
 * @param {HTMLElement} clockElement - Phần tử DOM để hiển thị đồng hồ.
 * @param {boolean} isEnabled - Trạng thái bật/tắt của widget.
 */
function initMainClock(clockElement, isEnabled) {
  if (!clockElement) return;

  function update() {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      // second: '2-digit', // Bỏ giây cho gọn hơn nếu muốn
      hour12: false,
    });
  }

  if (isEnabled) {
    clockElement.classList.remove("hidden");
    update(); // Cập nhật ngay lập tức
    if (mainClockIntervalId) clearInterval(mainClockIntervalId); // Xóa interval cũ nếu có
    mainClockIntervalId = setInterval(update, 1000); // Cập nhật mỗi giây
  } else {
    clockElement.classList.add("hidden");
    if (mainClockIntervalId) {
      clearInterval(mainClockIntervalId);
      mainClockIntervalId = null;
    }
  }
}

/**
 * Lấy dữ liệu thời tiết từ API Open-Meteo.
 * @param {number} latitude - Vĩ độ.
 * @param {number} longitude - Kinh độ.
 * @returns {Promise<object|null>} Dữ liệu thời tiết hoặc null nếu lỗi.
 */
async function fetchWeatherData(latitude, longitude) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&hourly=weather_code&current=is_day,temperature_2m,apparent_temperature,weather_code&timezone=Asia%2FBangkok&forecast_days=1`;

  try {
    console.log("Đang gọi API thời tiết:", apiUrl);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lỗi API thời tiết:", response.status, errorText);
      return null;
    }
    const data = await response.json();
    console.log("Dữ liệu thời tiết nhận được:", data);
    return {
      current: data.current,
      daily: data.daily,
    };
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu thời tiết:", error);
    return null;
  }
}

/**
 * Khởi tạo widget thời tiết.
 * @param {HTMLElement} weatherContainer - Container của widget thời tiết.
 * @param {boolean} isEnabled - Trạng thái bật/tắt của widget.
 */
async function initWeatherWidget(weatherContainer, isEnabled) {
  if (!weatherContainer) return;
  const iconEl = weatherContainer.querySelector("#weather-icon");
  const tempEl = weatherContainer.querySelector("#weather-temp");
  const descEl = weatherContainer.querySelector("#weather-desc");
  const locationEl = weatherContainer.querySelector("#weather-location");

  if (!iconEl || !tempEl || !descEl || !locationEl) {
    if (isEnabled) weatherContainer.classList.remove("hidden");
    else weatherContainer.classList.add("hidden");
    if (descEl && isEnabled) descEl.textContent = "Lỗi cấu hình widget";
    return;
  }

  if (!isEnabled) {
    weatherContainer.classList.add("hidden");
    return;
  }
  weatherContainer.classList.remove("hidden");

  // Lấy setting thời tiết
  getWeatherCustomSettings(async (settings) => {
    // Đơn vị độ
    const unit = settings.unit || "C";
    // Tọa độ thủ công
    const manualCoord = settings.manualCoord;
    const lat = parseFloat(settings.lat);
    const lon = parseFloat(settings.lon);
    // Hiển thị icon
    const showIcon = settings.showIcon !== false;
    // Thông báo
    const notify = !!settings.notify;

    iconEl.textContent = "autorenew";
    iconEl.classList.add("spin");
    tempEl.textContent = "--°" + unit;
    descEl.textContent = "Đang tải...";
    locationEl.textContent = "";

    function displayError(message = "Không thể tải thời tiết.") {
      iconEl.textContent = "error_outline";
      iconEl.classList.remove("spin");
      tempEl.textContent = "--°" + unit;
      descEl.textContent = message;
      locationEl.textContent = "";
    }

    async function getCityName(latitude, longitude) {
      return `(${latitude.toFixed(1)}°, ${longitude.toFixed(1)}°)`;
    }

    // Lấy vị trí
    function fetchAndDisplayWeather(latitude, longitude) {
      fetchWeatherData(latitude, longitude).then(async (weatherApiResponse) => {
        iconEl.classList.remove("spin");
        if (weatherApiResponse && weatherApiResponse.current) {
          const currentData = weatherApiResponse.current;
          // --- Yêu cầu 2: Đổi cách chuyển đổi độ K ---
          let temp = currentData.temperature_2m;
          if (unit === "F") temp = Math.round((temp * 9) / 5 + 32);
          else if (unit === "K") temp = (temp + 273.15).toFixed(2);
          else temp = Math.round(temp);
          tempEl.textContent = temp + "°" + unit;

          const wmoCodeData = WMO_WEATHER_CODES[currentData.weather_code];
          if (wmoCodeData) {
            descEl.textContent = wmoCodeData.description;
            iconEl.textContent = showIcon
              ? currentData.is_day
                ? wmoCodeData.icon_day
                : wmoCodeData.icon_night || wmoCodeData.icon_day
              : "cloud";
          } else {
            descEl.textContent = "Không rõ";
            iconEl.textContent = showIcon ? "thermostat" : "";
          }
          locationEl.textContent = await getCityName(latitude, longitude);

          // Thông báo thời tiết (nếu bật)
          if (notify && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Thời tiết hiện tại", {
                body: `${descEl.textContent}, ${tempEl.textContent}`,
                icon: "",
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission().then((perm) => {
                if (perm === "granted") {
                  new Notification("Thời tiết hiện tại", {
                    body: `${descEl.textContent}, ${tempEl.textContent}`,
                    icon: "",
                  });
                }
              });
            }
          }
        } else {
          displayError();
        }
      });
    }

    if (manualCoord && !isNaN(lat) && !isNaN(lon)) {
      fetchAndDisplayWeather(lat, lon);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAndDisplayWeather(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          iconEl.classList.remove("spin");
          let userMessage = "Không thể lấy vị trí.";
          if (error.code === 1)
            userMessage = "Bạn đã từ chối quyền truy cập vị trí.";
          else if (error.code === 2)
            userMessage = "Thông tin vị trí không khả dụng.";
          else if (error.code === 3)
            userMessage = "Yêu cầu vị trí quá thời gian.";
          displayError(userMessage);
        },
        { timeout: 15000, enableHighAccuracy: false }
      );
    } else {
      iconEl.classList.remove("spin");
      displayError("Vị trí không được hỗ trợ.");
    }
  });
}

/**
 * Hàm tổng để khởi tạo tất cả các widget dựa trên cài đặt.
 * @param {object} settings - Đối tượng chứa trạng thái bật/tắt của các widget.
 */
function initializeAllWidgets(settings) {
  console.log("Khởi tạo widgets với cài đặt:", settings);
  const mainClockElement = document.getElementById("main-clock-widget");
  const mainDateElement = document.getElementById("main-date-widget");
  const weatherWidgetElement = document.getElementById(
    "weather-widget-container"
  );

  // Đảm bảo các hàm init tồn tại trước khi gọi
  if (typeof initMainClock === "function") {
    initMainClock(mainClockElement, settings.mainClockEnabled);
  } else {
    console.error("initMainClock function is not defined in widget.js");
  }

  if (typeof initMainDate === "function") {
    initMainDate(mainDateElement, settings.mainDateEnabled);
  } else {
    console.error("initMainDate function is not defined in widget.js");
  }

  if (weatherWidgetElement && typeof initWeatherWidget === "function") {
    initWeatherWidget(weatherWidgetElement, settings.weatherEnabled);
  } else if (!weatherWidgetElement && settings.weatherEnabled) {
    console.error(
      "Weather widget container not found, but weather is enabled."
    );
  } else if (weatherWidgetElement && typeof initWeatherWidget !== "function") {
    console.error("initWeatherWidget function is not defined in widget.js");
  }
}

// WMO Weather Codes (Mã thời tiết của Tổ chức Khí tượng Thế giới)
const WMO_WEATHER_CODES = {
  0: {
    description: "Trời quang",
    icon_day: "clear_day",
    icon_night: "clear_night",
  },
  1: {
    description: "Gần quang",
    icon_day: "partly_cloudy_day",
    icon_night: "partly_cloudy_night",
  },
  2: { description: "Mây rải rác", icon_day: "cloud", icon_night: "cloud" },
  3: { description: "Nhiều mây", icon_day: "cloudy", icon_night: "cloudy" },
  45: { description: "Sương mù", icon_day: "foggy", icon_night: "foggy" },
  48: { description: "Sương mù đọng", icon_day: "foggy", icon_night: "foggy" },
  51: {
    description: "Mưa phùn nhẹ",
    icon_day: "rainy_light",
    icon_night: "rainy_light",
  },
  53: { description: "Mưa phùn vừa", icon_day: "rainy", icon_night: "rainy" },
  55: {
    description: "Mưa phùn dày",
    icon_day: "rainy_heavy",
    icon_night: "rainy_heavy",
  },
  56: {
    description: "Mưa phùn đông nhẹ",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  57: {
    description: "Mưa phùn đông dày",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  61: {
    description: "Mưa nhỏ",
    icon_day: "rainy_light",
    icon_night: "rainy_light",
  },
  63: { description: "Mưa vừa", icon_day: "rainy", icon_night: "rainy" },
  65: {
    description: "Mưa to",
    icon_day: "rainy_heavy",
    icon_night: "rainy_heavy",
  },
  66: {
    description: "Mưa đông nhẹ",
    icon_day: "weather_hail",
    icon_night: "weather_hail",
  },
  67: {
    description: "Mưa đông to",
    icon_day: "weather_hail",
    icon_night: "weather_hail",
  },
  71: {
    description: "Tuyết rơi nhẹ",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  73: {
    description: "Tuyết rơi vừa",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  75: {
    description: "Tuyết rơi dày",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  77: { description: "Hạt tuyết", icon_day: "grain", icon_night: "grain" },
  80: { description: "Mưa rào nhẹ", icon_day: "rainy", icon_night: "rainy" },
  81: { description: "Mưa rào vừa", icon_day: "rainy", icon_night: "rainy" },
  82: {
    description: "Mưa rào to",
    icon_day: "thunderstorm",
    icon_night: "thunderstorm",
  },
  85: {
    description: "Tuyết rào nhẹ",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  86: {
    description: "Tuyết rào to",
    icon_day: "weather_snowy",
    icon_night: "weather_snowy",
  },
  95: {
    description: "Dông",
    icon_day: "thunderstorm",
    icon_night: "thunderstorm",
  },
  96: {
    description: "Dông kèm mưa đá nhỏ",
    icon_day: "weather_hail",
    icon_night: "weather_hail",
  },
  99: {
    description: "Dông kèm mưa đá to",
    icon_day: "weather_hail",
    icon_night: "weather_hail",
  },
};
