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

  // Reverse-engineered from Aave's own bundled source (their card-spread
  // component, module 46518): hovering or focusing card h re-targets every
  // card i by delta = i - h. The hovered card straightens and scales up;
  // its neighbors get pushed by an amount inversely proportional to their
  // distance from it (closer neighbors move much more than far ones), each
  // side with a different constant, plus a small extra lean. There's no
  // z-index change anywhere in their source — the "swallow" look comes
  // purely from a near neighbor sliding, via its larger translateX, past
  // and underneath a farther neighbor that barely moved (DOM order alone
  // decides who's on top, same as our own card order).
  //
  // Their x values are percentages of the animated element's own width
  // (a fixed 275px there); ours is decoupled from the slot (see the CSS
  // comment on .kb-project-card), so the percentages here are read against
  // .kb-project-card__tilt's actual width instead, converted to px.
  //
  // Their transition is Motion's `{type:"spring",bounce:0,duration:.3}` —
  // a critically damped spring. CSS/WAAPI have no native spring easing, so
  // it's reproduced with a small spring stepper below, using Motion's own
  // initial-guess formula for a bounce:0 spring's angular frequency,
  // omega = 5 / duration, which is exact for the critically damped case.
  var REST_ROTATION_FALLBACK = 0;
  var RIGHT_SPREAD_PCT = 33.9757; // Aave's flat constant for viewport >=1082px
  var LEFT_SPREAD_PCT = 5;
  var ROTATE_STEP_DEG = 2.5;
  var ACTIVE_SCALE = 1.025;
  var SPRING_OMEGA = 5 / 0.3; // duration 0.3s, bounce 0

  function initCardSpread() {
    var row = document.querySelector(".kb-home-cards__row");
    if (!row) return;
    var cards = Array.prototype.slice.call(row.querySelectorAll(".kb-project-card"));
    if (!cards.length) return;

    var restRotation = cards.map(function (card) {
      return parseFloat(getComputedStyle(card).getPropertyValue("--card-rot")) || REST_ROTATION_FALLBACK;
    });
    var tilts = cards.map(function (card) {
      return card.querySelector(".kb-project-card__tilt");
    });
    var springs = cards.map(function (_, i) {
      return { x: 0, rot: restRotation[i], scale: 1, vx: 0, vrot: 0, vscale: 0 };
    });
    var targets = cards.map(function (_, i) {
      return { x: 0, rot: restRotation[i], scale: 1 };
    });
    var activeIndex; // undefined = nothing hovered/focused
    var rafId = null;
    var lastTime = null;

    function recomputeTargets() {
      cards.forEach(function (card, i) {
        if (activeIndex === undefined) {
          targets[i] = { x: 0, rot: restRotation[i], scale: 1 };
          return;
        }
        var delta = i - activeIndex;
        if (delta === 0) {
          targets[i] = { x: 0, rot: 0, scale: ACTIVE_SCALE };
          return;
        }
        var distance = Math.abs(delta);
        if (delta < 0) {
          targets[i] = {
            x: -LEFT_SPREAD_PCT / distance,
            rot: restRotation[i] - ROTATE_STEP_DEG / distance,
            scale: 1
          };
        } else {
          var wrapCorrection = delta === cards.length - 1 ? 0.25 : 1;
          targets[i] = {
            x: (RIGHT_SPREAD_PCT / distance) * wrapCorrection,
            rot: restRotation[i] + ROTATE_STEP_DEG / distance,
            scale: 1
          };
        }
      });
    }

    function step(now) {
      if (lastTime === null) lastTime = now;
      var dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      var settled = true;

      cards.forEach(function (card, i) {
        var s = springs[i];
        var t = targets[i];
        ["x", "rot", "scale"].forEach(function (key) {
          var vKey = "v" + key;
          var accel = -SPRING_OMEGA * SPRING_OMEGA * (s[key] - t[key]) - 2 * SPRING_OMEGA * s[vKey];
          s[vKey] += accel * dt;
          s[key] += s[vKey] * dt;
          if (Math.abs(s[key] - t[key]) > (key === "scale" ? 0.0005 : 0.01) || Math.abs(s[vKey]) > (key === "scale" ? 0.0005 : 0.01)) {
            settled = false;
          }
        });
        var tiltWidth = tilts[i] ? tilts[i].offsetWidth : 0;
        var px = (s.x / 100) * tiltWidth;
        card.style.transform = "translateX(" + px.toFixed(2) + "px) rotate(" + s.rot.toFixed(3) + "deg) scale(" + s.scale.toFixed(4) + ")";
      });

      if (!settled) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
        lastTime = null;
      }
    }

    function kick() {
      recomputeTargets();
      if (rafId === null) {
        lastTime = null;
        rafId = requestAnimationFrame(step);
      }
    }

    cards.forEach(function (card, i) {
      card.addEventListener("mouseenter", function () { activeIndex = i; kick(); });
      card.addEventListener("mouseleave", function () { activeIndex = undefined; kick(); });
      card.addEventListener("focus", function () { activeIndex = i; kick(); });
      card.addEventListener("blur", function () { activeIndex = undefined; kick(); });
    });
  }

  // Site-wide cursor spotlight: a soft light patch that follows the mouse
  // on every page, like a flashlight over the dark aurora background.
  // Injected as a canvas rather than markup so it applies everywhere
  // without touching any page's HTML.
  var SPOTLIGHT_RADIUS = 220;
  var SPOTLIGHT_BRIGHTNESS = 0.14;
  var SPOTLIGHT_COLOR = "#48f7fa"; // --kb-cyan

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255);
  }

  function initCursorSpotlight() {
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;

    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var mouseX = -1000;
    var mouseY = -1000;
    var rgb = hexToRgb(SPOTLIGHT_COLOR);

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (mouseX !== -1000) {
        var gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, SPOTLIGHT_RADIUS);
        gradient.addColorStop(0, "rgba(" + rgb + "," + SPOTLIGHT_BRIGHTNESS + ")");
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener("mouseleave", function () {
      mouseX = -1000;
      mouseY = -1000;
    });
    requestAnimationFrame(draw);
  }

  // Mouse-driven depth parallax on the fixed aurora background: sets
  // --kb-px/--kb-py (-0.5..0.5) on .kb-bg, which site.css's kb-aurora__mesh
  // and kb-aurora__stars read via the standalone `translate` property so
  // each layer drifts a different amount without touching kb-drift's own
  // `transform` animation. Skipped on touch (no hover/mouse) and when the
  // user has asked for reduced motion.
  function initAuroraParallax() {
    var bg = document.querySelector(".kb-bg");
    if (!bg) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.addEventListener("mousemove", function (e) {
      var px = e.clientX / window.innerWidth - 0.5;
      var py = e.clientY / window.innerHeight - 0.5;
      bg.style.setProperty("--kb-px", px.toFixed(3));
      bg.style.setProperty("--kb-py", py.toFixed(3));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initDownloadCv();
    initCardTilt();
    initCardSpread();
    initCursorSpotlight();
    initAuroraParallax();
  });
})();
