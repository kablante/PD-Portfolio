(function () {
  "use strict";

  var STORAGE_KEY = "kb-lang";

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch (e) {
      return "en";
    }
  }

  function setLang(lang) {
    document.documentElement.setAttribute("data-active-lang", lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function initLangSwitch() {
    setLang(getLang());
    var enBtn = document.querySelector('[data-lang-btn="en"]');
    var ptBtn = document.querySelector('[data-lang-btn="pt"]');
    if (enBtn) enBtn.addEventListener("click", function () { setLang("en"); });
    if (ptBtn) ptBtn.addEventListener("click", function () { setLang("pt"); });
  }

  function initDownloadCv() {
    var btn = document.querySelector("[data-download-cv]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.alert(getLang() === "pt" ? "Currículo (PDF) — placeholder" : "CV (PDF) — placeholder");
    });
  }

  function initCardFan() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kb-home-cards__row .kb-project-card"));
    if (!cards.length) return;
    cards.forEach(function (card, i) {
      card.addEventListener("mouseenter", function () {
        cards.forEach(function (other, j) {
          if (j < i) other.classList.add("kb-push-left");
          else if (j > i) other.classList.add("kb-push-right");
        });
      });
      card.addEventListener("mouseleave", function () {
        cards.forEach(function (other) {
          other.classList.remove("kb-push-left", "kb-push-right");
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initDownloadCv();
    initCardFan();
  });
})();
