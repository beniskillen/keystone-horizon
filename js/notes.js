(function () {
  var sets = {
    denpasar: {
      labels: ["Q4 22", "Q4 23", "Q4 24", "Q4 25", "Q2 26"],
      format: "index",
      series: [
        { name: "Denpasar", color: "#8fb0c8", values: [102.28, 102.71, 104.55, 105.66, 106.04], fill: true },
        { name: "Indonesia", color: "rgba(228,235,230,0.55)", values: [106.3, 108.15, 109.65, 110.56, 110.89] }
      ]
    },
    "au-annual": {
      type: "bars",
      labels: ["Australia", "Sydney", "Melbourne", "Brisbane", "Adelaide", "Perth"],
      format: "percent",
      series: [
        { name: "Year to August 2026", color: "#8fb0c8", values: [2.7, -4.6, -4.7, 10.8, 8.6, 15.6] }
      ]
    }
  };

  document.querySelectorAll("[data-series]").forEach(function (el) {
    var set = sets[el.getAttribute("data-series")];
    if (!set) return;
    if (set.type === "bars") drawBars(el, set);
    else draw(el, set);
  });

  function drawBars(el, set) {
    var labels = set.labels;
    var values = set.series[0].values;
    var w = 640;
    var h = 36 * labels.length + 28;
    var pad = { l: 108, r: 54, t: 8, b: 8 };
    var maxAbs = Math.max.apply(null, values.map(function (v) { return Math.abs(v); }));
    var span = maxAbs * 1.15;
    var mid = pad.l + (w - pad.l - pad.r) / 2;
    var half = (w - pad.l - pad.r) / 2;
    function x(v) { return mid + (v / span) * half; }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    var axis = document.createElementNS(svg.namespaceURI, "line");
    axis.setAttribute("x1", mid);
    axis.setAttribute("x2", mid);
    axis.setAttribute("y1", 4);
    axis.setAttribute("y2", h - 4);
    axis.setAttribute("class", "zero");
    svg.appendChild(axis);
    labels.forEach(function (name, i) {
      var v = values[i];
      var cy = pad.t + i * 36 + 14;
      var label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", 0);
      label.setAttribute("y", cy + 4);
      label.setAttribute("class", "axis");
      label.textContent = name;
      svg.appendChild(label);
      var bar = document.createElementNS(svg.namespaceURI, "rect");
      var x0 = Math.min(mid, x(v));
      bar.setAttribute("x", x0.toFixed(1));
      bar.setAttribute("y", cy - 8);
      bar.setAttribute("width", Math.max(2, Math.abs(x(v) - mid)).toFixed(1));
      bar.setAttribute("height", 16);
      bar.setAttribute("rx", 4);
      bar.setAttribute("fill", v < 0 ? "rgba(228,235,230,0.45)" : "#8fb0c8");
      svg.appendChild(bar);
      var num = document.createElementNS(svg.namespaceURI, "text");
      num.setAttribute("x", (v < 0 ? x(v) - 8 : x(v) + 8).toFixed(1));
      num.setAttribute("y", cy + 4);
      num.setAttribute("text-anchor", v < 0 ? "end" : "start");
      num.setAttribute("class", "axis");
      num.textContent = (v > 0 ? "+" : "") + v.toFixed(1) + "%";
      svg.appendChild(num);
    });
    el.appendChild(svg);
    var legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML = '<span><i class="swatch" style="background:#8fb0c8"></i>' + set.series[0].name + "</span>";
    el.appendChild(legend);
  }

  function niceStep(rough) {
    var pow = Math.pow(10, Math.floor(Math.log10(Math.abs(rough) || 1)));
    var n = Math.abs(rough) / pow;
    var step = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10;
    return step * pow;
  }

  function ticks(min, max, count) {
    var step = niceStep((max - min) / count) || 1;
    var start = Math.ceil(min / step) * step;
    var out = [];
    for (var v = start; v <= max + step * 0.01; v += step) out.push(Math.round(v * 1000) / 1000);
    return out;
  }

  function draw(el, set) {
    var labels = set.labels;
    var series = set.series;
    var w = 640;
    var h = 300;
    var pad = { l: 52, r: 12, t: 16, b: 36 };
    var all = [];
    series.forEach(function (s) { all = all.concat(s.values); });
    var min = Math.min.apply(null, all);
    var max = Math.max.apply(null, all);
    if (set.zero) {
      min = Math.min(0, min);
      max = Math.max(0, max);
    }
    var span = (max - min) || 1;
    min -= span * 0.12;
    max += span * 0.16;
    if (set.zero && min > 0) min = 0;
    span = max - min;
    function x(i) {
      return pad.l + (labels.length === 1 ? 0.5 : i / (labels.length - 1)) * (w - pad.l - pad.r);
    }
    function y(v) {
      return pad.t + (1 - (v - min) / span) * (h - pad.t - pad.b);
    }
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("role", "img");
    ticks(min, max, 4).forEach(function (value) {
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
      label.textContent = set.format === "percent" ? Math.round(value) + "%" : value.toFixed(0);
      svg.appendChild(label);
    });
    if (set.zero && min < 0 && max > 0) {
      var zero = document.createElementNS(svg.namespaceURI, "line");
      zero.setAttribute("x1", pad.l);
      zero.setAttribute("x2", w - pad.r);
      zero.setAttribute("y1", y(0));
      zero.setAttribute("y2", y(0));
      zero.setAttribute("class", "zero");
      svg.appendChild(zero);
    }
    labels.forEach(function (name, i) {
      var label = document.createElementNS(svg.namespaceURI, "text");
      label.setAttribute("x", x(i));
      label.setAttribute("y", h - 10);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "axis");
      label.textContent = name;
      svg.appendChild(label);
    });
    series.forEach(function (s) {
      var d = s.values.map(function (v, i) {
        return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1);
      }).join(" ");
      if (s.fill) {
        var area = document.createElementNS(svg.namespaceURI, "path");
        var base = y(set.zero ? 0 : min);
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
      s.values.forEach(function (v, i) {
        var dot = document.createElementNS(svg.namespaceURI, "circle");
        dot.setAttribute("cx", x(i).toFixed(1));
        dot.setAttribute("cy", y(v).toFixed(1));
        dot.setAttribute("r", "3.5");
        dot.setAttribute("fill", s.color);
        svg.appendChild(dot);
      });
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
  }
})();
