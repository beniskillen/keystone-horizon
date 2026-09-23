(function () {
  var menu = document.querySelector(".menu");
  var links = document.querySelector(".links");
  if (menu && links) {
    menu.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".section h1, .section h2, .section .lede, .stat, .card, .step, .tick, .cta, .faq details, .split article").forEach(function (el) {
    if (el.classList.contains("rise")) return;
    el.classList.add("rise");
    var siblings = el.parentElement ? el.parentElement.children : [];
    var index = Array.prototype.indexOf.call(siblings, el);
    el.setAttribute("data-delay", String(Math.max(0, index) * 80));
  });
  var rise = document.querySelectorAll(".rise");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = el.getAttribute("data-delay") || "0";
        el.style.animationDelay = delay + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.28 });
    rise.forEach(function (el) { io.observe(el); });
  } else {
    rise.forEach(function (el) { el.classList.add("in"); });
  }

  var bars = document.querySelectorAll(".bar");
  if ("IntersectionObserver" in window) {
    var barsIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var bar = entry.target;
        var value = parseFloat(bar.getAttribute("data-value"));
        var max = parseFloat(bar.getAttribute("data-max")) || 30;
        var fill = bar.querySelector(".fill");
        if (fill) {
          requestAnimationFrame(function () {
            fill.style.width = (value / max) * 100 + "%";
          });
        }
        var num = bar.querySelector("[data-count]");
        if (num) count(num, value);
        barsIo.unobserve(bar);
      });
    }, { threshold: 0.4 });
    bars.forEach(function (bar) { barsIo.observe(bar); });
  }

  function count(el, target) {
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (String(target).split(".")[1] || "").length;
    if (reduce) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / 900);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll("[data-count-standalone]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-standalone"));
    function run() { count(el, target); }
    if (!("IntersectionObserver" in window)) { run(); return; }
    var one = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      el.setAttribute("data-suffix", "%");
      run();
      one.disconnect();
    }, { threshold: 0.4 });
    one.observe(el);
  });

  var form = document.querySelector("form[data-draft]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var note = form.querySelector("[data-sent]");
      if (note) note.hidden = false;
    });
  }
})();
