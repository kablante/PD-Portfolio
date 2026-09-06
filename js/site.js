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

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initDownloadCv();
  });
})();
