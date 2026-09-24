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

  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var arrivals2024 = [420037, 455277, 469227, 503194, 544601, 520898, 625665, 616641, 593909, 559911, 472900, 551100];
  var arrivals2025 = [529897, 450697, 470851, 591221, 602213, 637868, 697107, 682866, 635149, 594853, 483364, 572668];
  var yoy = arrivals2025.map(function (value, i) {
    return ((value - arrivals2024[i]) / arrivals2024[i]) * 100;
  });

  document.querySelectorAll(".linechart").forEach(function (el) {
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
      var line = document.createElementNS(svg.namespaceURI, "line");
      line.setAttribute("x1", pad.l);
      line.setAttribute("x2", w - pad.r);
      line.setAttribute("y1", yy);
      line.setAttribute("y2", yy);
      line.setAttribute("class", "grid");
      svg.appendChild(line);
      var label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", 0);
      label.setAttribute("y", yy + 4);
      label.setAttribute("class", "axis");
      label.textContent = opts.format === "percent" ? Math.round(value) + "%" : Math.round(value / 1000) + "k";
      svg.appendChild(label);
    });
    if (opts.zero && min < 0 && max > 0) {
      var zero = document.createElementNS(svg.namespaceURI, "line");
      zero.setAttribute("x1", pad.l);
      zero.setAttribute("x2", w - pad.r);
      zero.setAttribute("y1", y(0));
      zero.setAttribute("y2", y(0));
      zero.setAttribute("class", "zero");
      svg.appendChild(zero);
    }
    months.forEach(function (month, i) {
      if (i % 2) return;
      var label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", x(i));
      label.setAttribute("y", h - 8);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "axis");
      label.textContent = month;
      svg.appendChild(label);
    });
    series.forEach(function (s) {
      var d = s.values.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
      if (s.fill) {
        var area = document.createElementNS(svg.namespaceURI, "path");
        var base = y(opts.zero ? 0 : min);
        area.setAttribute("d", d + " L" + x(s.values.length - 1).toFixed(1) + " " + base.toFixed(1) + " L" + x(0).toFixed(1) + " " + base.toFixed(1) + " Z");
        area.setAttribute("fill", "rgba(143,176,200,0.16)");
        svg.appendChild(area);
      }
      var path = document.createElementNS(svg.namespaceURI, "path");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", s.color);
      path.setAttribute("stroke-width", "2.5");
      path.setAttribute("stroke-linejoin", "round");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      if (!reduce) {
        var length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = String(length);
        path.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)";
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
    svg.addEventListener("mousemove", function (event) {
      var rect = svg.getBoundingClientRect();
      var px = ((event.clientX - rect.left) / rect.width) * w;
      var i = Math.round(((px - pad.l) / (w - pad.l - pad.r)) * (months.length - 1));
      i = Math.max(0, Math.min(months.length - 1, i));
      var lines = series.map(function (s) {
        var v = s.values[i];
        var text = opts.format === "percent" ? (v > 0 ? "+" : "") + v.toFixed(1) + "%" : Math.round(v).toLocaleString("en-AU");
        return s.name + " " + text;
      });
      tip.hidden = false;
      tip.textContent = months[i] + " · " + lines.join(" · ");
      tip.style.left = ((x(i) / w) * 100) + "%";
      tip.style.top = "18px";
    });
    svg.addEventListener("mouseleave", function () { tip.hidden = true; });
  }

  document.querySelectorAll(".blog-drop").forEach(function (drop) {
    drop.addEventListener("click", function (event) { event.stopPropagation(); });
  });
  document.querySelectorAll(".blog-toggle").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      var nav = button.closest(".blog-nav");
      var open = !nav.classList.contains("is-open");
      document.querySelectorAll(".blog-nav.is-open").forEach(function (el) {
        el.classList.remove("is-open");
        var toggle = el.querySelector(".blog-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
      nav.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".blog-nav.is-open").forEach(function (el) {
      el.classList.remove("is-open");
      var toggle = el.querySelector(".blog-toggle");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".learn-tabs").forEach(function (tabs) {
    tabs.addEventListener("click", function (event) {
      var button = event.target.closest("button[role='tab']");
      if (!button) return;
      var id = button.getAttribute("aria-controls");
      tabs.querySelectorAll("button").forEach(function (el) {
        el.setAttribute("aria-selected", el === button ? "true" : "false");
      });
      var section = tabs.closest(".learn");
      section.querySelectorAll(".learn-panel").forEach(function (panel) {
        panel.classList.toggle("is-on", panel.id === id);
      });
    });
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
