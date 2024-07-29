document.addEventListener("DOMContentLoaded", function () {
  const statusContainer = document.getElementById("status-container");
  const checkIcon = statusContainer.querySelector(".check-icon");
  const errorIcon = statusContainer.querySelector(".error-icon");
  const successText = statusContainer.querySelector(".success-text");
  const errorText = statusContainer.querySelector(".error-text");
  const progressBar = document.getElementById("progress-bar");
  const progressTexts = document.querySelector(".progress-texts");
  const progressContainer = progressBar.parentNode;
  const mainContent = document.querySelectorAll(
    "#main-content-1, #main-content-2, #main-content-3"
  ); // Tüm içerik alanları

  let dotsInterval;

  // Başlangıçta tüm içerikleri gizle
  mainContent.forEach((content) => content.classList.add("d-none"));

  function updateStatus(isSuccess) {
    if (isSuccess) {
      checkIcon.style.display = "inline-block";
      errorIcon.style.display = "none";
      successText.classList.remove("d-none");
      errorText.classList.add("d-none");
    } else {
      checkIcon.style.display = "none";
      errorIcon.style.display = "inline-block";
      successText.classList.add("d-none");
      errorText.classList.remove("d-none");
    }

    // Progress bar'ı gizle
    progressContainer.style.display = "none";
    progressTexts.style.display = "none";
    // Ana içerik alanlarının hepsinin görünür olmasını sağla
    mainContent.forEach((content) => content.classList.remove("d-none")); // Ana içeriği görünür yap
  }

  function animateProgressBar(callback) {
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        callback();
      } else {
        width++;
        progressBar.style.width = width + "%";
        progressBar.setAttribute("aria-valuenow", width);
      }
    }, 30); // 30ms'de bir artış
  }

  function checkServiceStatus(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors.bridged.cc/" + url, true);
    xhr.timeout = 5000; // 5 saniye zaman aşımı süresi
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log("HTTP Status: " + xhr.status); // HTTP durum kodunu loglayın
        console.log("Response: " + xhr.responseText); // Yanıtı loglayın
        if (xhr.status >= 200 && xhr.status < 300) {
          animateProgressBar(() => updateStatus(true));
        } else {
          animateProgressBar(() => updateStatus(false));
        }
      }
    };
    xhr.ontimeout = function () {
      console.error("Request Timed Out"); // Zaman aşımı hatasını loglayın
      animateProgressBar(() => updateStatus(false));
    };
    xhr.onerror = function () {
      console.error("Request Error: ", xhr); // Hata mesajını loglayın
      animateProgressBar(() => updateStatus(false));
    };
    xhr.send();
  }

  // İlk istek
  checkServiceStatus("https://go.kaankanbur.com");

  // 25 dakikada bir istek
  setInterval(() => {
    checkServiceStatus("https://go.kaankanbur.com");
  }, 25 * 60 * 1000); // 25 dakika (25 * 60 * 1000 milisaniye)
});
