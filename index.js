document.addEventListener("DOMContentLoaded", function () {
  const statusContainer = document.getElementById("status-container");
  const checkIcon = statusContainer.querySelector(".check-icon");
  const errorIcon = statusContainer.querySelector(".error-icon");
  const successText = statusContainer.querySelector(".success-text");
  const errorText = statusContainer.querySelector(".error-text");

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
  }

  function checkServiceStatus(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://cors.bridged.cc/" + url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log("HTTP Status: " + xhr.status); // HTTP durum kodunu loglayın
        console.log("Response: " + xhr.responseText); // Yanıtı loglayın
        if (xhr.status >= 200 && xhr.status < 300) {
          updateStatus(true);
        } else {
          updateStatus(false);
        }
      }
    };
    xhr.onerror = function () {
      console.error("Request Error: ", xhr); // Hata mesajını loglayın
      updateStatus(false);
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
