(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ease = "cubic-bezier(0.22, 1, 0.36, 1)";
  function narrow() { return window.innerWidth <= 1100; }

  /* ---------- Shared scroll loop ---------- */
  var scrollFns = [];
  var ticking = false;
  function onScroll(fn) { scrollFns.push(fn); }
  function runScroll() {
    ticking = false;
    for (var i = 0; i < scrollFns.length; i++) scrollFns[i](window.scrollY);
  }
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(runScroll);
  }, { passive: true });
  window.addEventListener("resize", function () { requestAnimationFrame(runScroll); });

  /* ---------- Navigation ---------- */
  var mast = document.querySelector(".mast");
  var pill = document.querySelector(".pill");
  var menu = document.querySelector(".menu");

  function setMenu(open) {
    if (!pill) return;
    pill.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (menu) {
      menu.setAttribute("aria-expanded", open ? "true" : "false");
      menu.setAttribute("aria-label", open ? "Close menu" : "Menu");
    }
    if (mast) mast.classList.remove("is-hidden");
    if (!open) closeDrops(null);
  }
  if (menu && pill) {
    menu.addEventListener("click", function (event) {
      event.stopPropagation();
      setMenu(!pill.classList.contains("is-open"));
    });
    pill.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (link && pill.classList.contains("is-open")) setMenu(false);
    });
  }

  function closeDrops(except) {
    document.querySelectorAll(".drop.is-open").forEach(function (el) {
      if (el === except) return;
      el.classList.remove("is-open");
      var toggle = el.querySelector(":scope > button");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  }
  function openDrop(drop) {
    closeDrops(drop);
    drop.classList.add("is-open");
    var button = drop.querySelector(":scope > button");
    if (button) button.setAttribute("aria-expanded", "true");
  }
  document.querySelectorAll(".drop").forEach(function (drop) {
    var button = drop.querySelector(":scope > button");
    var timer;
    drop.addEventListener("mouseenter", function () {
      if (narrow()) return;
      clearTimeout(timer);
      openDrop(drop);
    });
    drop.addEventListener("mouseleave", function () {
      if (narrow()) return;
      timer = setTimeout(function () {
        drop.classList.remove("is-open");
        if (button) button.setAttribute("aria-expanded", "false");
      }, 160);
    });
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        var willOpen = !drop.classList.contains("is-open");
        closeDrops(drop);
        drop.classList.toggle("is-open", willOpen);
        button.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
      button.addEventListener("keydown", function (event) {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDrop(drop);
          var first = drop.querySelector(".panel a");
          if (first) first.focus();
        }
      });
    }
    drop.addEventListener("keydown", function (event) {
      var links = Array.prototype.slice.call(drop.querySelectorAll(".panel a"));
      var i = links.indexOf(document.activeElement);
      if (i === -1) return;
      if (event.key === "ArrowDown") { event.preventDefault(); (links[i + 1] || links[0]).focus(); }
      if (event.key === "ArrowUp") { event.preventDefault(); (links[i - 1] || links[links.length - 1]).focus(); }
      if (event.key === "Tab" && !narrow()) {
        var last = !event.shiftKey && i === links.length - 1;
        var firstBack = event.shiftKey && i === 0;
        if (last || firstBack) {
          drop.classList.remove("is-open");
          if (button) button.setAttribute("aria-expanded", "false");
        }
      }
    });
    drop.addEventListener("focusout", function (event) {
      if (narrow()) return;
      if (!drop.contains(event.relatedTarget)) {
        drop.classList.remove("is-open");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  });
  document.addEventListener("click", function () { closeDrops(null); });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    var openDrops = document.querySelectorAll(".drop.is-open");
    if (openDrops.length) {
      var toggle = openDrops[0].querySelector(":scope > button");
      closeDrops(null);
      if (toggle && !narrow()) toggle.focus();
      return;
    }
    if (pill && pill.classList.contains("is-open")) {
      setMenu(false);
      if (menu) menu.focus();
    }
  });
  document.querySelectorAll(".panel").forEach(function (panel) {
    panel.addEventListener("click", function (event) { event.stopPropagation(); });
  });
  window.addEventListener("resize", function () {
    if (!narrow() && pill && pill.classList.contains("is-open")) setMenu(false);
  });

  // Mark the current page in the navigation.
  (function markCurrent() {
    if (!pill) return;
    var here = location.pathname.replace(/\/$/, "/index.html");
    var inNotes = here.indexOf("/notes/") !== -1;
    pill.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href.charAt(0) === "#") return;
      var path;
      try { path = new URL(href, location.href).pathname.replace(/\/$/, "/index.html"); } catch (e) { return; }
      if (path !== here) return;
      if (a.classList.contains("pill-cta")) return;
      a.setAttribute("aria-current", "page");
      var drop = a.closest(".drop");
      if (drop) {
        var button = drop.querySelector(":scope > button");
        if (button) button.setAttribute("aria-current", "true");
      }
    });
    if (inNotes) {
      var resources = pill.querySelector(".drop.resources > button");
      if (resources) resources.setAttribute("aria-current", "true");
    }
  })();

  // Compact on scroll, hide on scroll down, return on scroll up.
  if (mast) {
    var lastY = window.scrollY;
    onScroll(function (y) {
      mast.classList.toggle("is-scrolled", y > 24);
      var menuOpen = pill && pill.classList.contains("is-open");
      var dropOpen = document.querySelector(".drop.is-open");
      if (menuOpen || dropOpen) { lastY = y; return; }
      if (y > lastY + 6 && y > 360) mast.classList.add("is-hidden");
      else if (y < lastY - 6 || y <= 360) mast.classList.remove("is-hidden");
      lastY = y;
    });
    mast.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  /* ---------- Reveal on scroll ---------- */
  var riseSelector = [
    ".section h1", ".section h2", ".section .lede", ".stat", ".card", ".step", ".tick", ".cta",
    ".faq details", ".split article", ".mod", ".infra article", ".feature", ".related a",
    ".credits article", ".note-row", ".marks li", ".logo-chip"
  ].join(", ");
  document.querySelectorAll(riseSelector).forEach(function (el) {
    if (el.classList.contains("rise")) return;
    if (el.closest(".rise")) return;
    el.classList.add("rise");
    var siblings = el.parentElement ? el.parentElement.children : [];
    var index = Array.prototype.indexOf.call(siblings, el);
    el.setAttribute("data-delay", String(Math.min(320, Math.max(0, index) * 70)));
  });
  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight * 0.92;
  }
  var rise = document.querySelectorAll(".rise");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.animationDelay = (el.getAttribute("data-delay") || "0") + "ms";
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    rise.forEach(function (el) {
      if (inView(el)) el.classList.add("in");
      else io.observe(el);
    });
  } else {
    rise.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Spotlight hover on cards ---------- */
  if (window.matchMedia("(hover: hover)").matches) {
    var spotSelector = ".stat, .card, .mod, .infra article, .learn-card, .feature, .related a, .marks li, .atlas-panel, .split article, .featured";
    document.querySelectorAll(spotSelector).forEach(function (el) {
      el.classList.add("spot");
      el.addEventListener("pointermove", function (event) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((event.clientX - r.left) / r.width * 100).toFixed(2) + "%");
        el.style.setProperty("--my", ((event.clientY - r.top) / r.height * 100).toFixed(2) + "%");
      });
    });
  }

  /* ---------- Bars and counters ---------- */
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
  } else {
    bars.forEach(function (bar) {
      var fill = bar.querySelector(".fill");
      var value = parseFloat(bar.getAttribute("data-value"));
      var max = parseFloat(bar.getAttribute("data-max")) || 30;
      if (fill) fill.style.width = (value / max) * 100 + "%";
      var num = bar.querySelector("[data-count]");
      if (num) count(num, value);
    });
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
      var t = Math.min(1, (now - start) / 1000);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  document.querySelectorAll("[data-count-standalone]").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-count-standalone"));
    function run() { el.setAttribute("data-suffix", "%"); count(el, target); }
    if (!("IntersectionObserver" in window)) { run(); return; }
    var one = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      run();
      one.disconnect();
    }, { threshold: 0.4 });
    one.observe(el);
  });

  /* ---------- Line charts ---------- */
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var arrivals2024 = [420037, 455277, 469227, 503194, 544601, 520898, 625665, 616641, 593909, 559911, 472900, 551100];
  var arrivals2025 = [529897, 450697, 470851, 591221, 602213, 637868, 697107, 682866, 635149, 594853, 483364, 572668];
  var yoy = arrivals2025.map(function (value, i) {
    return ((value - arrivals2024[i]) / arrivals2024[i]) * 100;
  });

  document.querySelectorAll(".linechart[data-chart]").forEach(function (el) {
    var kind = el.getAttribute("data-chart");
    if (kind === "arrivals") {
      drawChart(el, [
        { name: "2024", color: "rgba(228,235,230,0.55)", values: arrivals2024 },
        { name: "2025", color: "#8fb0c8", values: arrivals2025, fill: true }
      ], { format: "visits" });
    } else if (kind === "yoy") {
      drawChart(el, [
        { name: "2025 vs 2024", color: "#8fb0c8", values: yoy, fill: true }
      ], { format: "percent", zero: true });
    }
  });

  function niceStep(rough) {
    var pow = Math.pow(10, Math.floor(Math.log10(Math.abs(rough) || 1)));
    var n = rough / pow;
    var step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
    return step * pow;
  }

  function niceTicks(min, max, count) {
    var step = niceStep((max - min) / count);
    var start = Math.ceil(min / step) * step;
    var ticks = [];
    for (var v = start; v <= max + step * 0.01; v += step) ticks.push(v);
    return ticks;
  }

  function svgEl(svg, name, attrs) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.keys(attrs || {}).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    svg.appendChild(node);
    return node;
  }

  function drawChart(el, series, opts) {
    var w = 640;
    var h = 280;
    var pad = { l: 46, r: 8, t: 18, b: 32 };
    var all = [];
    series.forEach(function (s) { all = all.concat(s.values); });
    var min = Math.min.apply(null, all);
    var max = Math.max.apply(null, all);
    if (opts.zero) min = Math.min(0, min);
    var span = (max - min) || 1;
    min -= span * 0.08;
    max += span * 0.14;
    if (opts.zero && min > 0) min = 0;
    span = max - min;
    function x(i) { return pad.l + (i / (months.length - 1)) * (w - pad.l - pad.r); }
    function y(v) { return pad.t + (1 - (v - min) / span) * (h - pad.t - pad.b); }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    var ticks = niceTicks(min, max, opts.format === "percent" ? 5 : 4);
    ticks.forEach(function (value) {
      var yy = y(value);
      svgEl(svg, "line", { x1: pad.l, x2: w - pad.r, y1: yy, y2: yy, class: "grid" });
      var label = svgEl(svg, "text", { x: 0, y: yy + 4, class: "axis" });
      label.textContent = opts.format === "percent" ? Math.round(value) + "%" : Math.round(value / 1000) + "k";
    });
    if (opts.zero && min < 0 && max > 0) {
      svgEl(svg, "line", { x1: pad.l, x2: w - pad.r, y1: y(0), y2: y(0), class: "zero" });
    }
    months.forEach(function (month, i) {
      if (i % 2) return;
      var label = svgEl(svg, "text", { x: x(i), y: h - 8, "text-anchor": "middle", class: "axis" });
      label.textContent = month;
    });
    series.forEach(function (s) {
      var d = s.values.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
      if (s.fill) {
        var base = y(opts.zero ? 0 : min);
        svgEl(svg, "path", {
          d: d + " L" + x(s.values.length - 1).toFixed(1) + " " + base.toFixed(1) + " L" + x(0).toFixed(1) + " " + base.toFixed(1) + " Z",
          fill: "rgba(143,176,200,0.16)"
        });
      }
      var path = svgEl(svg, "path", {
        d: d, fill: "none", stroke: s.color, "stroke-width": "2.5", "stroke-linejoin": "round", "stroke-linecap": "round"
      });
      if (!reduce) {
        var length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        path.style.transition = "stroke-dashoffset 1.3s " + ease;
        if ("IntersectionObserver" in window) {
          var io = new IntersectionObserver(function (entries) {
            if (!entries[0].isIntersecting) return;
            path.style.strokeDashoffset = "0";
            io.disconnect();
          }, { threshold: 0.4 });
          io.observe(el);
        } else {
          path.style.strokeDashoffset = "0";
        }
      }
    });
    // Crosshair and dots for hover and touch.
    var hover = svgEl(svg, "g", { class: "hover", opacity: "0" });
    var cross = svgEl(hover, "line", { class: "cross", x1: 0, x2: 0, y1: pad.t, y2: h - pad.b });
    var dots = series.map(function (s) {
      return svgEl(hover, "circle", { class: "dot", r: 4.5, fill: s.color, cx: 0, cy: 0 });
    });
    el.appendChild(svg);
    var legend = document.createElement("div");
    legend.className = "legend";
    series.forEach(function (s) {
      var item = document.createElement("span");
      item.innerHTML = '<i class="swatch" style="background:' + s.color + '"></i>' + s.name;
      legend.appendChild(item);
    });
    el.appendChild(legend);
    var tip = document.createElement("div");
    tip.className = "chart-tip";
    tip.hidden = true;
    el.appendChild(tip);
    function show(i) {
      var lines = series.map(function (s) {
        var v = s.values[i];
        var text = opts.format === "percent" ? (v > 0 ? "+" : "") + v.toFixed(1) + "%" : Math.round(v).toLocaleString("en-AU");
        return s.name + " " + text;
      });
      tip.hidden = false;
      tip.textContent = months[i] + " · " + lines.join(" · ");
      tip.style.left = ((x(i) / w) * 100) + "%";
      tip.style.top = "18px";
      hover.setAttribute("opacity", "1");
      cross.setAttribute("x1", x(i));
      cross.setAttribute("x2", x(i));
      series.forEach(function (s, k) {
        dots[k].setAttribute("cx", x(i));
        dots[k].setAttribute("cy", y(s.values[i]));
      });
    }
    function hide() {
      tip.hidden = true;
      hover.setAttribute("opacity", "0");
    }
    svg.addEventListener("pointermove", function (event) {
      var rect = svg.getBoundingClientRect();
      var px = ((event.clientX - rect.left) / rect.width) * w;
      var i = Math.round(((px - pad.l) / (w - pad.l - pad.r)) * (months.length - 1));
      show(Math.max(0, Math.min(months.length - 1, i)));
    });
    svg.addEventListener("pointerleave", hide);
    svg.addEventListener("pointercancel", hide);
  }

  /* ---------- FAQ: animated disclosure ---------- */
  document.querySelectorAll(".faq details").forEach(function (details) {
    var summary = details.querySelector("summary");
    if (!summary) return;
    var body = document.createElement("div");
    body.className = "faq-body";
    while (summary.nextSibling) body.appendChild(summary.nextSibling);
    details.appendChild(body);
    var busy = false;
    // Resolve once, whether the animation finishes or the tab is throttled.
    function settle(anim, ms, done) {
      var called = false;
      function once() { if (called) return; called = true; done(); }
      anim.onfinish = once;
      anim.oncancel = once;
      setTimeout(once, ms + 150);
    }
    summary.addEventListener("click", function (event) {
      event.preventDefault();
      if (busy) return;
      if (reduce || !body.animate) { details.open = !details.open; return; }
      busy = true;
      if (details.open) {
        var from = body.offsetHeight;
        var closing = body.animate(
          [{ height: from + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
          { duration: 300, easing: ease }
        );
        settle(closing, 300, function () { details.open = false; busy = false; });
      } else {
        details.open = true;
        var to = body.offsetHeight;
        var opening = body.animate(
          [{ height: "0px", opacity: 0 }, { height: to + "px", opacity: 1 }],
          { duration: 380, easing: ease }
        );
        settle(opening, 380, function () { busy = false; });
      }
    });
  });

  /* ---------- Learn tabs ---------- */
  document.querySelectorAll(".learn-tabs").forEach(function (tabs) {
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll("button[role='tab']"));
    var section = tabs.closest(".learn") || document;
    function select(button, focus) {
      var id = button.getAttribute("aria-controls");
      buttons.forEach(function (el) {
        var on = el === button;
        el.setAttribute("aria-selected", on ? "true" : "false");
        el.setAttribute("tabindex", on ? "0" : "-1");
      });
      section.querySelectorAll(".learn-panel").forEach(function (panel) {
        var on = panel.id === id;
        if (on && !panel.classList.contains("is-on")) {
          panel.classList.add("is-on");
          panel.querySelectorAll(".rise").forEach(function (el) { el.classList.add("in"); });
        } else if (!on) {
          panel.classList.remove("is-on");
        }
      });
      if (focus) button.focus();
    }
    buttons.forEach(function (el) {
      el.setAttribute("tabindex", el.getAttribute("aria-selected") === "true" ? "0" : "-1");
    });
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button[role='tab']");
      if (button) select(button, false);
    });
    tabs.addEventListener("keydown", function (event) {
      var i = buttons.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (event.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
      if (event.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
      if (event.key === "Home") next = buttons[0];
      if (event.key === "End") next = buttons[buttons.length - 1];
      if (next) { event.preventDefault(); select(next, true); }
    });
  });

  /* ---------- Hero: word reveal, video control, cue, parallax ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    var h1 = hero.querySelector("h1");
    if (h1 && !reduce) {
      var wordIndex = 0;
      function splitWords(node) {
        if (node.nodeType === 3) {
          var frag = document.createDocumentFragment();
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var outer = document.createElement("span");
            outer.className = "w";
            var inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--d", (0.08 + wordIndex * 0.1).toFixed(2) + "s");
            wordIndex += 1;
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === 1) {
          Array.prototype.slice.call(node.childNodes).forEach(splitWords);
        }
      }
      Array.prototype.slice.call(h1.childNodes).forEach(splitWords);
      h1.classList.add("is-split");
    }

    var video = hero.querySelector("video");
    var ctl = hero.querySelector(".hero-ctl");
    if (video) {
      var userPaused = false;
      function setPaused(paused) {
        if (paused) video.pause(); else video.play().catch(function () {});
        if (ctl) {
          ctl.setAttribute("aria-pressed", paused ? "true" : "false");
          ctl.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
        }
      }
      if (ctl) {
        ctl.addEventListener("click", function () {
          userPaused = !userPaused;
          setPaused(userPaused);
        });
      }
      if (reduce) { userPaused = true; setPaused(true); }
      if ("IntersectionObserver" in window) {
        var vidIo = new IntersectionObserver(function (entries) {
          if (userPaused) return;
          if (entries[0].isIntersecting) video.play().catch(function () {});
          else video.pause();
        }, { threshold: 0.05 });
        vidIo.observe(video);
      }
    }

    var copy = hero.querySelector(".copy");
    var frame = hero.querySelector(".hero-frame");
    onScroll(function (y) {
      var limit = frame ? frame.offsetHeight : window.innerHeight;
      hero.classList.toggle("is-past", y > 80);
      if (reduce || !copy || y > limit) return;
      var t = y / limit;
      copy.style.transform = "translate3d(0, " + (y * 0.22).toFixed(1) + "px, 0)";
      copy.style.opacity = String(Math.max(0, 1 - t * 1.4));
    });
  }

  /* ---------- Scroll spy (process rail, chapter rail, blog subnav) ---------- */
  function spy(items, onChange) {
    var current = null;
    function update() {
      var line = window.innerHeight * 0.38;
      var active = null;
      for (var i = 0; i < items.length; i++) {
        var r = items[i].target.getBoundingClientRect();
        if (r.top <= line) active = items[i];
      }
      if (active && active.target.getBoundingClientRect().bottom < 0 && items.indexOf(active) === items.length - 1) {
        // Past the last section: keep it, the reader is still in the flow.
      }
      if (active !== current) {
        current = active;
        items.forEach(function (item) { item.set(item === active); });
        if (onChange) onChange(active);
      }
    }
    onScroll(update);
    update();
    return update;
  }

  // Process rail on the homepage.
  var processRail = document.querySelector(".process-rail");
  if (processRail) {
    var marker = processRail.querySelector(".marker");
    var process = document.querySelector(".process-grid .process");
    var railItems = Array.prototype.slice.call(processRail.querySelectorAll("li")).map(function (li) {
      var link = li.querySelector("a");
      var id = link ? link.getAttribute("href").replace("#", "") : "";
      var target = document.getElementById(id);
      return target ? {
        target: target,
        set: function (on) {
          li.classList.toggle("is-on", on);
          target.classList.toggle("is-on", on);
          if (on && marker) {
            marker.style.transform = "translateY(" + li.offsetTop + "px)";
            marker.style.height = li.offsetHeight + "px";
          }
        }
      } : null;
    }).filter(Boolean);
    spy(railItems, function (active) {
      if (process) process.classList.toggle("has-active", !!active);
    });
    processRail.addEventListener("click", function (event) {
      var link = event.target.closest("a[href^='#']");
      if (!link) return;
      var target = document.getElementById(link.getAttribute("href").slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", link.getAttribute("href"));
    });
  }

  // Chapter rail, built from sections that carry data-chapter.
  var chapters = document.querySelectorAll("[data-chapter]");
  if (chapters.length >= 3) {
    var rail = document.createElement("ol");
    rail.className = "rail";
    rail.setAttribute("aria-label", "Chapters");
    var railEntries = [];
    chapters.forEach(function (section) {
      if (!section.id) return;
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + section.id;
      a.innerHTML = "<span>" + section.getAttribute("data-chapter") + "</span><i></i>";
      li.appendChild(a);
      rail.appendChild(li);
      railEntries.push({ target: section, set: function (on) { li.classList.toggle("is-on", on); } });
    });
    document.body.appendChild(rail);
    spy(railEntries);
    var heroHeight = hero ? hero.offsetHeight : 400;
    onScroll(function (y) {
      var footer = document.querySelector("footer");
      var nearEnd = footer && footer.getBoundingClientRect().top < window.innerHeight * 0.7;
      rail.classList.toggle("is-on", y > heroHeight * 0.6 && !nearEnd && !(pill && pill.classList.contains("is-open")));
    });
  }

  // Blog sub-navigation.
  var subnav = document.querySelector(".subnav");
  if (subnav) {
    var subItems = Array.prototype.slice.call(subnav.querySelectorAll("a[href^='#']")).map(function (a) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      return target ? { target: target, set: function (on) { a.classList.toggle("is-on", on); } } : null;
    }).filter(Boolean);
    spy(subItems);
  }

  /* ---------- Reading progress and read time on notes ---------- */
  var prose = document.querySelector("article.section .prose");
  if (prose) {
    var progress = document.createElement("div");
    progress.className = "progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);
    var article = prose.closest("article");
    onScroll(function (y) {
      var top = article.offsetTop;
      var span = Math.max(1, article.offsetHeight - window.innerHeight * 0.6);
      var p = Math.max(0, Math.min(1, (y - top + window.innerHeight * 0.2) / span));
      progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
    });
    var meta = prose.querySelector(".meta");
    if (meta) {
      var words = (prose.textContent || "").trim().split(/\s+/).length;
      var mins = Math.max(1, Math.round(words / 220));
      var time = document.createElement("span");
      time.className = "readtime";
      time.textContent = mins + " min read";
      meta.appendChild(time);
    }
  }

  /* ---------- Smooth anchor scrolling for in-page links and back to top ---------- */
  document.addEventListener("click", function (event) {
    var link = event.target.closest("a[href^='#']");
    if (!link) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) return;
    if (id === "top") {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;
    if (link.closest(".process-rail")) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", "#" + id);
    if (pill && pill.classList.contains("is-open")) setMenu(false);
  });

  /* ---------- Draft form ---------- */
  var form = document.querySelector("form[data-draft]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var note = form.querySelector("[data-sent]");
      if (note) note.hidden = false;
      var button = form.querySelector("button[type='submit']");
      if (button) { button.textContent = "Held"; button.disabled = true; }
    });
  }

  requestAnimationFrame(runScroll);
})();
