document.addEventListener("DOMContentLoaded", function () {
  const statusContainer = document.getElementById("status-container");
  const checkIcon = statusContainer.querySelector(".check-icon");
  const errorIcon = statusContainer.querySelector(".error-icon");
  const successText = statusContainer.querySelector(".success-text");
  const errorText = statusContainer.querySelector(".error-text");
  const progressBar = document.getElementById("progress-bar");
  const progressContainer = progressBar.parentNode;
  const mainContent = document.querySelectorAll(
    "#main-content-1, #main-content-2, #main-content-3"
  );
  const progressMessage = document.getElementById("progress-message");

  const messages = [
    "Bağlantı Kontrolü",
    "Veritabanı Kontrolü",
    "Servis Durumları",
    "Performans Analizi",
    "Güvenlik Taraması",
  ];

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

    // Progress bar'ı ve mesajları gizle
    progressContainer.style.display = "none";
    progressMessage.style.display = "none";

    // Ana içerik alanlarının hepsinin görünür olmasını sağla
    mainContent.forEach((content) => content.classList.remove("d-none"));
  }

  function animateProgressBar(callback) {
    let width = 0;
    const totalDuration = messages.length * 3000; // Toplam süre (mesaj başına 3 saniye)
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        callback();
      } else {
        width += 100 / (totalDuration / 60); // İlerleme hızı
        progressBar.style.width = width + "%";
        progressBar.setAttribute("aria-valuenow", width);
      }
    }, 60);

    let messageIndex = 0;
    let messageInterval = setInterval(() => {
      if (messageIndex < messages.length) {
        progressMessage.classList.add("fade-out");
        setTimeout(() => {
          progressMessage.innerText = messages[messageIndex];
          progressMessage.classList.remove("fade-out");
          progressMessage.classList.add("fade-in");
          setTimeout(() => {
            progressMessage.classList.remove("fade-in");
          }, 500);
          messageIndex++;
        }, 500);
      } else {
        clearInterval(messageInterval);
      }
    }, 3000);
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
