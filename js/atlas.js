(function () {
  var root = document.querySelector("[data-atlas]");
  if (!root) return;
  root.classList.add("atlas");

  var BALI = "M360.9 328.8 L354.7 339.9 L377.8 358.2 L350.5 379.2 L315.4 374.0 L316.5 363.7 L346.6 349.4 L348.8 322.5 L337.7 300.1 L319.8 287.5 L307.5 266.9 L248.6 215.6 L194.7 189.3 L158.1 180.8 L121.3 186.5 L99.4 178.0 L77.0 155.1 L44.4 103.7 L37.1 81.4 L41.2 48.8 L62.2 48.7 L83.0 68.3 L102.2 58.8 L148.7 71.0 L170.7 81.1 L216.9 93.3 L277.4 83.9 L326.9 42.5 L354.4 33.5 L421.5 56.4 L469.8 79.0 L517.1 110.1 L546.6 148.9 L575.0 163.2 L581.0 182.1 L565.9 202.2 L550.5 209.4 L535.9 229.1 L507.9 226.7 L489.3 247.5 L467.1 256.2 L430.4 261.0 L390.1 295.0 L388.5 316.3 L360.9 328.8 Z M542.0 346.8 L526.9 366.4 L483.3 344.0 L466.5 324.3 L485.0 302.4 L517.4 301.9 L541.9 336.5 L542.0 346.8 Z";
  var LOMBOK = "M864.2 426.5 L858.6 406.4 L831.0 404.6 L808.0 410.0 L781.8 407.8 L774.1 386.7 L710.5 403.1 L676.0 372.9 L630.3 358.1 L624.5 334.3 L638.3 323.2 L664.1 346.1 L703.6 327.8 L729.6 325.1 L742.3 299.3 L740.5 237.8 L728.4 225.8 L725.3 204.0 L736.8 185.4 L757.0 179.9 L819.9 118.6 L857.1 101.4 L889.7 105.6 L955.6 132.5 L975.4 135.0 L1002.9 161.9 L999.7 203.3 L980.5 222.2 L981.8 252.3 L963.8 274.1 L928.0 342.8 L916.4 350.2 L940.7 399.0 L902.3 411.6 L891.9 402.2 L901.4 367.7 L881.9 370.9 L867.7 386.0 L871.5 419.9 L864.2 426.5 Z";

  var places = [
    {
      id: "tabanan",
      name: "Tabanan",
      group: "Window",
      stat: "5–8M",
      unit: "IDR / m² in the file",
      blurb: "The strategy names this as the window. Lower land than Canggu in the same file, still inside the corridor. The company page says Tabanan. The Carrd says Seminyak.",
      href: "areas.html#tabanan",
      file: "Areas · the window",
      photo: "assets/photos/tabanan.jpg",
      alt: "Jatiluwih rice terraces, Tabanan",
      map: "overview",
      window: true,
      x: 278, y: 205, rx: 36, ry: 28
    },
    {
      id: "canggu",
      name: "Canggu",
      group: "Land print",
      stat: "23.8%",
      unit: "land CAGR, 2019–2024",
      blurb: "The expensive print, and the highest figure in the internal land file. Listing growth on this coast is the supply problem. The percent is not a guest count, and it is not a forecast.",
      href: "areas.html#canggu",
      file: "Areas · land file",
      photo: "assets/photos/canggu.jpg",
      alt: "Volcanic shore at Canggu",
      map: "inset",
      x: 118, y: 78
    },
    {
      id: "ubud",
      name: "Ubud",
      group: "Land print",
      stat: "17.6%",
      unit: "land CAGR, 2019–2024",
      blurb: "Inland, a different guest from the coast. The internal file prints it under Canggu. The spatial plan still decides whether a house there is allowed to be a business.",
      href: "areas.html#ubud",
      file: "Areas · land file",
      photo: "assets/photos/ubud.jpg",
      alt: "Rice terraces at Tegallalang, in the Ubud hills",
      map: "overview",
      x: 388, y: 229, rx: 26, ry: 20
    },
    {
      id: "uluwatu",
      name: "Uluwatu",
      group: "Land print",
      stat: "17.1%",
      unit: "land CAGR, 2019–2024",
      blurb: "The cliff market. The view sells the picture. The setback, the PBG, and the SLF decide whether that view can be let.",
      href: "areas.html#uluwatu",
      file: "Areas · land file",
      photo: "assets/photos/uluwatu.jpg",
      alt: "The cliff at Uluwatu, with buildings already on the edge",
      focus: "30% center",
      map: "inset",
      x: 92, y: 228
    },
    {
      id: "seminyak",
      name: "Seminyak",
      group: "Land print",
      stat: "14.9%",
      unit: "land CAGR, 2019–2024",
      blurb: "In the land file, and on the Carrd as an address. The company page says Tabanan. Pick the place, then prove the zone.",
      href: "areas.html#seminyak",
      file: "Areas · land file",
      photo: "assets/photos/seminyak.jpg",
      alt: "A street in Seminyak, gates and houses rather than the beach clubs",
      map: "inset",
      x: 132, y: 132
    },
    {
      id: "north",
      name: "North Bali",
      group: "Scouting",
      stat: "Scout",
      unit: "airport belt",
      blurb: "On the Carrd with Lombok. Uplift percentages from the LinkedIn bio are not on this map. The cohort notes are the correspondence.",
      href: "areas.html#north-bali",
      file: "Areas · scouting",
      photo: "assets/photos/north-bali.jpg",
      alt: "The north coast of Bali, Buleleng, from the air",
      focus: "center 38%",
      map: "overview",
      x: 355, y: 62, rx: 30, ry: 18
    },
    {
      id: "lombok",
      name: "Lombok",
      group: "Scouting",
      stat: "Scout",
      unit: "Carrd focus",
      blurb: "Named with Bali and the surrounding islands. There is no separate return table for Lombok in this file yet.",
      href: "areas.html#lombok",
      file: "Areas · scouting",
      photo: "assets/photos/lombok.jpg",
      alt: "A bay near Senggigi, Lombok",
      map: "overview",
      x: 820, y: 250, rx: 42, ry: 32
    },
    {
      id: "benoa",
      name: "Benoa",
      group: "Infrastructure",
      stat: "75",
      unit: "yacht berths, open",
      blurb: "Bali Gapura Marina, inside the Bali Maritime Tourism Hub. Dock B and Dock C opened in July 2026. This is the infrastructure item that is actually operating.",
      href: "index.html#benoa",
      file: "Fundamentals · marina",
      photo: "assets/photos/benoa.jpg",
      alt: "A superyacht alongside at Benoa harbour",
      map: "inset",
      x: 390, y: 158
    },
    {
      id: "kura",
      name: "Kura Kura",
      group: "Infrastructure",
      stat: "498 ha",
      unit: "SEZ on Serangan",
      blurb: "Designated under Government Regulation 23 of 2023. A tourism, culture, and creative zone. Not, by itself, a financial-centre licence.",
      href: "index.html#kura-kura",
      file: "Fundamentals · SEZ",
      photo: "assets/photos/serangan.jpg",
      alt: "The working shore at Serangan, the island named in the Kura Kura zone",
      map: "inset",
      x: 456, y: 176
    },
    {
      id: "sanur",
      name: "Sanur",
      group: "Infrastructure",
      stat: "Study",
      unit: "financial centre",
      blurb: "Named with Kura Kura and sites near Benoa as a location being looked at. As of May 2026 an international financial centre in Bali had not been designated.",
      href: "index.html#financial-centre",
      file: "Fundamentals · study",
      photo: "assets/photos/sanur.jpg",
      alt: "The Sanur shore, one of the coasts named in the financial-centre study",
      focus: "center 28%",
      map: "inset",
      x: 368, y: 86
    },
    {
      id: "subway",
      name: "Subway",
      group: "Infrastructure",
      stat: "2024",
      unit: "ground broken, not running",
      blurb: "First stone at Kuta, September 2024. A later phase is described as Cemagi–Canggu–Mengwi. In February 2026 the public record used here still showed no follow-on works.",
      href: "index.html#subway",
      file: "Fundamentals · subway",
      photo: "assets/photos/kuta.jpg",
      alt: "Kuta beach and the hotels along the shore. The groundbreaking was here. No line is running.",
      map: "inset",
      x: 108, y: 186
    },
    {
      id: "toll",
      name: "Pekutatan–Mengwi",
      group: "Infrastructure",
      stat: "42 km",
      unit: "toll still on the table",
      blurb: "Gilimanuk–Pekutatan is no longer a toll. What remains is about 42 km, Pekutatan to Mengwi. Tender aimed at late 2026, physical works early 2027. Not a yield.",
      href: "index.html#toll",
      file: "Fundamentals · toll",
      photo: "assets/photos/medewi.jpg",
      alt: "Medewi beach, in Pekutatan. The toll to Mengwi is still a tender, not a road.",
      map: "overview",
      line: true
    }
  ];

  var byId = {};
  places.forEach(function (place) { byId[place.id] = place; });

  var NS = "http://www.w3.org/2000/svg";
  function svg(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) { node.setAttribute(key, attrs[key]); });
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  root.innerHTML = "";
  var layout = document.createElement("div");
  layout.className = "atlas-layout";
  var main = document.createElement("div");
  main.className = "atlas-main";
  var mapWrap = document.createElement("div");
  mapWrap.className = "atlas-map";
  var featured = document.createElement("aside");
  featured.className = "featured";
  featured.id = "south-corridor";
  var panel = document.createElement("aside");
  panel.className = "atlas-panel";
  panel.innerHTML =
    '<p class="kicker" data-kicker>The file</p>' +
    '<h3 data-title>Bali, read as a profile.</h3>' +
    '<figure class="atlas-photo" data-photo hidden><img alt="" /></figure>' +
    '<p class="atlas-stat" data-stat hidden><strong></strong><span></span></p>' +
    '<p data-blurb>Hover a coast, or the shaded south corridor. Land rates are the research file, not a forecast. Tabanan is the window the strategy is built around.</p>' +
    '<a class="btn" data-open hidden>Open the file</a>' +
    '<div class="atlas-index" data-index></div>' +
    '<p class="note">Internal research file. Not a cleared forecast.</p>';

  layout.appendChild(main);
  layout.appendChild(panel);
  main.appendChild(mapWrap);
  main.appendChild(featured);
  root.appendChild(layout);

  var legend = document.createElement("p");
  legend.className = "atlas-legend";
  legend.textContent = "Shaded panel: the south corridor, enlarged. It lights when you hover it. Dashed line: the toll that is still a tender, not a yield. Nusa Penida is drawn, and it is not a KHC place.";
  root.appendChild(legend);

  var overview = svg("svg", { viewBox: "0 0 1040 460", role: "img", "aria-label": "Map of Bali and Lombok. Places in the KHC file are marked." }, mapWrap);
  svg("rect", { class: "sea", x: "0", y: "0", width: "1040", height: "460" }, overview);
  var defs = svg("defs", {}, overview);
  var hatch = svg("pattern", { id: "window-hatch", width: "7", height: "7", patternUnits: "userSpaceOnUse", patternTransform: "rotate(40)" }, defs);
  svg("rect", { width: "7", height: "7", fill: "#10241c" }, hatch);
  svg("line", { x1: "0", y1: "0", x2: "0", y2: "7", stroke: "#8fb0c8", "stroke-width": "2", opacity: "0.45" }, hatch);
  var land = svg("g", { class: "land" }, overview);
  svg("path", { d: BALI }, land);
  svg("path", { d: LOMBOK }, land);
  var baliLabel = svg("text", { class: "geo", x: "230", y: "130" }, overview);
  baliLabel.textContent = "Bali";
  var lombokLabel = svg("text", { class: "geo", x: "800", y: "168" }, overview);
  lombokLabel.textContent = "Lombok";

  var toll = byId.toll;
  var tollLink = svg("a", { class: "zone toll", "data-place": "toll", href: toll.href }, overview);
  tollLink.setAttribute("aria-label", "Pekutatan to Mengwi toll. Opens the infrastructure note.");
  svg("line", { class: "toll-hit", x1: "210", y1: "198", x2: "348", y2: "250" }, tollLink);
  svg("line", { class: "toll-line", x1: "210", y1: "198", x2: "348", y2: "250" }, tollLink);
  var tollText = svg("text", { x: "188", y: "188", "text-anchor": "start" }, tollLink);
  tollText.textContent = "Toll";

  places.forEach(function (place) {
    if (place.map === "overview" || place.map === "both") {
      if (!place.line) addZone(overview, place, place.x, place.y, place.rx, place.ry);
    }
  });

  var south = svg("a", { class: "zone cluster", "data-place": "south", href: "#south-corridor" }, overview);
  south.setAttribute("aria-label", "South corridor. Moves to the enlarged panel.");
  svg("ellipse", { cx: "348", cy: "318", rx: "28", ry: "22", fill: "rgba(143, 176, 200, 0.22)" }, south);
  var southText = svg("text", { x: "348", y: "352", "text-anchor": "middle" }, south);
  southText.textContent = "South corridor";

  featured.innerHTML =
    '<div class="featured-shade" aria-hidden="true"></div>' +
    '<div class="featured-copy"><p class="kicker">Featured</p><h3>South corridor</h3><p>Enlarged past the overview scale, so the crowded coast can be opened place by place.</p></div>' +
    '<p class="featured-hint">Hover</p>';
  var insetWrap = document.createElement("div");
  insetWrap.className = "featured-map";
  featured.appendChild(insetWrap);
  var inset = svg("svg", { viewBox: "0 0 520 280", role: "img", "aria-label": "Enlarged south corridor of Bali." }, insetWrap);
  svg("rect", { class: "sea", width: "520", height: "280" }, inset);
  var insetLand = svg("g", { class: "land inset-land" }, inset);
  svg("path", { d: "M36 28 C92 8 168 24 176 86 C184 146 148 196 112 246 C86 276 48 268 34 214 C18 150 8 64 36 28 Z" }, insetLand);
  svg("path", { d: "M248 36 C330 16 446 38 486 96 C512 146 478 198 412 214 C346 230 286 186 274 128 C264 78 236 52 248 36 Z" }, insetLand);
  svg("ellipse", { cx: "456", cy: "176", rx: "28", ry: "15" }, insetLand);
  var westLabel = svg("text", { class: "geo", x: "78", y: "46" }, inset);
  westLabel.textContent = "West coast";
  var eastLabel = svg("text", { class: "geo", x: "330", y: "58" }, inset);
  eastLabel.textContent = "Sanur bay";

  places.forEach(function (place) {
    if (place.map === "inset") addZone(inset, place, place.x, place.y, 16, 16, true);
    if (place.map === "both") addZone(inset, place, place.ix, place.iy, 16, 16, true);
  });

  var index = panel.querySelector("[data-index]");
  places.forEach(function (place) {
    var row = document.createElement("a");
    row.href = place.href;
    row.className = "atlas-row";
    row.setAttribute("data-place", place.id);
    var name = document.createElement("span");
    name.textContent = place.name;
    var stat = document.createElement("span");
    stat.textContent = place.stat;
    row.appendChild(name);
    row.appendChild(stat);
    index.appendChild(row);
  });

  function addZone(parent, place, x, y, rx, ry, round) {
    var link = svg("a", {
      class: "zone" + (place.window ? " window" : ""),
      href: place.href,
      "data-place": place.id
    }, parent);
    link.setAttribute("aria-label", place.name + ". " + place.file);
    var shape = round
      ? svg("circle", { cx: x, cy: y, r: rx }, link)
      : svg("ellipse", { cx: x, cy: y, rx: rx, ry: ry }, link);
    shape.setAttribute("fill", place.window ? "url(#window-hatch)" : "rgba(143, 176, 200, 0.22)");
    var labelX = round ? (x < 260 ? x + rx + 8 : x - rx - 8) : x;
    var labelY = round ? y + 4 : y + ry + 16;
    var label = svg("text", {
      x: labelX,
      y: labelY,
      "text-anchor": round ? (x < 260 ? "start" : "end") : "middle"
    }, link);
    label.textContent = place.name;
    bind(link, place.id);
    return link;
  }

  var coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) legend.textContent = "Tap a place once to read its profile, and again to open the note. Dashed line: the toll that is still a tender. Nusa Penida is drawn, and it is not a KHC place.";
  function bind(el, id) {
    el.addEventListener("mouseenter", function () { activate(id); });
    el.addEventListener("focus", function () { activate(id); });
    el.addEventListener("click", function (event) {
      if (!coarse || current === id) return;
      event.preventDefault();
      activate(id);
    });
  }

  root.querySelectorAll(".atlas-row").forEach(function (row) {
    bind(row, row.getAttribute("data-place"));
  });
  bind(south, "south");
  bind(tollLink, "toll");
  featured.addEventListener("mouseenter", function () {
    featured.classList.add("is-lit");
  });
  featured.addEventListener("mouseleave", function () {
    if (!byId[current] || (byId[current].map !== "inset" && byId[current].map !== "both")) {
      featured.classList.remove("is-lit");
    }
  });

  var current = null;
  function activate(id) {
    current = id;
    root.querySelectorAll("[data-place]").forEach(function (el) {
      el.classList.toggle("is-on", el.getAttribute("data-place") === id);
    });
    var place = byId[id];
    var inCorridor = place && (place.map === "inset" || place.map === "both");
    featured.classList.toggle("is-lit", id === "south" || inCorridor);
    if (id === "south") {
      root.querySelectorAll(".zone.cluster").forEach(function (el) { el.classList.add("is-on"); });
      show({
        group: "Land print",
        name: "South corridor",
        stat: "14.9–23.8%",
        unit: "Canggu to Seminyak, in the file",
        blurb: "The crowded coast, enlarged in the shaded panel: Canggu, Seminyak, Uluwatu, and the infrastructure pinned beside them. Open a place to read the note.",
        href: "areas.html#canggu",
        file: "Areas · land file",
        photo: "assets/photos/canggu.jpg",
        alt: "Volcanic shore at Canggu, on the south corridor"
      });
      return;
    }
    if (place) show(place);
  }

  var swapTimer = null;
  var shown = null;
  function show(place) {
    if (shown === place) return;
    shown = place;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { paint(place); return; }
    clearTimeout(swapTimer);
    panel.classList.add("is-swapping");
    swapTimer = setTimeout(function () {
      paint(place);
      panel.classList.remove("is-swapping");
    }, 180);
  }

  function paint(place) {
    panel.querySelector("[data-kicker]").textContent = place.group;
    panel.querySelector("[data-title]").textContent = place.name;
    var stat = panel.querySelector("[data-stat]");
    stat.hidden = false;
    stat.querySelector("strong").textContent = place.stat;
    stat.querySelector("span").textContent = place.unit;
    panel.querySelector("[data-blurb]").textContent = place.blurb;
    var photo = panel.querySelector("[data-photo]");
    var img = photo.querySelector("img");
    if (place.photo) {
      photo.hidden = false;
      panel.classList.add("has-photo");
      photo.classList.toggle("deed", !!place.deed);
      if (img.getAttribute("src") !== place.photo) img.src = place.photo;
      img.alt = place.alt || place.name;
      img.style.objectPosition = place.focus || "center";
    } else {
      photo.hidden = true;
      panel.classList.remove("has-photo");
    }
    var open = panel.querySelector("[data-open]");
    open.hidden = false;
    open.href = place.href;
    open.textContent = place.file;
  }

  var hash = (location.hash || "").replace("#", "");
  var fromHash = {
    tabanan: "tabanan",
    canggu: "canggu",
    ubud: "ubud",
    uluwatu: "uluwatu",
    seminyak: "seminyak",
    "north-bali": "north",
    lombok: "lombok",
    benoa: "benoa",
    "kura-kura": "kura",
    "financial-centre": "sanur",
    subway: "subway",
    toll: "toll",
    "south-corridor": "south"
  };
  if (fromHash[hash]) activate(fromHash[hash]);
})();
