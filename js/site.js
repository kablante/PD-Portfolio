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

  // Matches Aave's own "Working at Aave Labs" cards: the card's own lean
  // (--card-rot) never changes, and hovering adds a pointer-tracked 3D
  // tilt on a separate inner layer plus a holo glare that follows the
  // cursor (--pointer-x/--pointer-y drive the glare's radial-gradient).
  var MAX_TILT_DEG = 10;

  function initCardTilt() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kb-home-cards__row .kb-project-card"));
    if (!cards.length) return;
    cards.forEach(function (card) {
      var tilt = card.querySelector(".kb-project-card__tilt");
      if (!tilt) return;
      card.addEventListener("mousemove", function (e) {
        var rect = card.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width;
        var relY = (e.clientY - rect.top) / rect.height;
        card.style.setProperty("--pointer-x", (relX * 100).toFixed(1) + "%");
        card.style.setProperty("--pointer-y", (relY * 100).toFixed(1) + "%");
        var tiltX = ((0.5 - relY) * MAX_TILT_DEG * 2).toFixed(2);
        var tiltY = ((relX - 0.5) * MAX_TILT_DEG * 2).toFixed(2);
        tilt.style.transform = "perspective(800px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        tilt.style.transform = "perspective(800px)";
      });
    });
  }

  // Confirmed from Aave's own DevTools (inline style on .styles_cardWrapper
  // caught mid-transition): on hover the card's lean animates back to
  // upright while it scales up, e.g. rotateZ(2.596deg) -> scale(1.025),
  // over ~0.8s ease-out, reversing on mouseleave. That's a Web Animations
  // API call (DevTools reports it as a "Script Animation", not CSS), so it
  // runs here rather than as a CSS transition.
  var HOVER_SCALE = 1.025;
  var HOVER_DURATION = 800;

  function initCardHoverStraighten() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kb-home-cards__row .kb-project-card"));
    if (!cards.length) return;
    cards.forEach(function (card) {
      var rot = parseFloat(getComputedStyle(card).getPropertyValue("--card-rot")) || 0;
      var restTransform = "rotate(" + rot + "deg) scale(1)";
      var hoverTransform = "rotate(0deg) scale(" + HOVER_SCALE + ")";
      var current = null;
      card.addEventListener("mouseenter", function () {
        if (current) current.cancel();
        current = card.animate(
          [{ transform: restTransform }, { transform: hoverTransform }],
          { duration: HOVER_DURATION, easing: "ease-out", fill: "both" }
        );
      });
      card.addEventListener("mouseleave", function () {
        if (current) current.cancel();
        current = card.animate(
          [{ transform: hoverTransform }, { transform: restTransform }],
          { duration: HOVER_DURATION, easing: "ease-out", fill: "both" }
        );
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initDownloadCv();
    initCardTilt();
    initCardHoverStraighten();
  });
})();
