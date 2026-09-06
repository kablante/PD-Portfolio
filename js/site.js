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

  // Enter/leave use a springy overshoot (picking the card up / dropping it
  // back); while the cursor moves across the card, a snappier ease-out
  // keeps the tilt feeling responsive instead of bouncy on every pixel.
  var POP_TRANSITION = "transform 420ms cubic-bezier(.34,1.56,.64,1), box-shadow 420ms cubic-bezier(.34,1.56,.64,1)";
  var TILT_TRANSITION = "transform 120ms ease-out, box-shadow 420ms cubic-bezier(.34,1.56,.64,1)";
  var MAX_TILT_DEG = 12;

  function applyTilt(card, clientX, clientY) {
    var rect = card.getBoundingClientRect();
    var relX = (clientX - rect.left) / rect.width - 0.5;
    var relY = (clientY - rect.top) / rect.height - 0.5;
    var tiltX = (relY * -MAX_TILT_DEG).toFixed(2);
    var tiltY = (relX * MAX_TILT_DEG).toFixed(2);
    card.style.transform =
      "translateY(-30px) scale(1.08) perspective(700px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
  }

  function initCardFan() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".kb-home-cards__row .kb-project-card"));
    if (!cards.length) return;
    cards.forEach(function (card, i) {
      card.addEventListener("mouseenter", function (e) {
        cards.forEach(function (other, j) {
          if (j < i) other.classList.add("kb-push-left");
          else if (j > i) other.classList.add("kb-push-right");
        });
        card.style.transition = POP_TRANSITION;
        applyTilt(card, e.clientX, e.clientY);
      });
      card.addEventListener("mousemove", function (e) {
        card.style.transition = TILT_TRANSITION;
        applyTilt(card, e.clientX, e.clientY);
      });
      card.addEventListener("mouseleave", function () {
        cards.forEach(function (other) {
          other.classList.remove("kb-push-left", "kb-push-right");
        });
        card.style.transition = POP_TRANSITION;
        card.style.transform = "";
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initDownloadCv();
    initCardFan();
  });
})();
