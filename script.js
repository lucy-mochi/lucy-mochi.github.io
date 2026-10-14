(function () {
  // github links
  document.querySelectorAll("[data-gh]").forEach(function (el) { el.href = SITE.github; });

  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-"); }

  // ---------- tabs ----------
  var tabs = ["home", "projects", "art", "project"];
  function show() {
    var h = (location.hash || "#home").slice(1);
    var parts = h.split("/");
    var active = parts[0];
    if (parts[0] === "projects" && parts[1] !== undefined && SITE.projects[+parts[1]]) {
      renderDetail(SITE.projects[+parts[1]]);
      h = "project";
    } else if (parts[0] === "art") {
      renderArt(parts[1]);
      h = "art";
    } else {
      if (tabs.indexOf(active) < 0 || active === "project") active = "home";
      h = active;
    }
    tabs.forEach(function (t) {
      document.getElementById("page-" + t).classList.toggle("on", t === h);
    });
    document.querySelectorAll("[data-tab]").forEach(function (a) {
      a.classList.toggle("active", a.dataset.tab === (h === "project" ? "projects" : h));
    });
    document.body.classList.toggle("is-home", h === "home");
    window.scrollTo(0, 0);
  }

  // ---------- project page ----------
  function renderDetail(p) {
    var all = p.links || [];
    function pill(l, cls) {
      return '<a class="pill ' + cls + '" href="' + l.url + '" target="_blank" rel="noopener">' + l.label + " <span>&#8599;</span></a>";
    }
    var primary = all.length ? '<div class="primary-link">' + pill(all[0], "primary") + "</div>" : "";
    var others = all.slice(1).map(function (l) { return pill(l, ""); }).join("");
    var tags = (p.tags || []).map(function (t) { return "<span>" + t + "</span>"; }).join("");
    var refs = p.references ? '<div class="refs"><em>References</em>' + p.references.map(function (r) {
      return '<a class="inline" href="' + r.url + '" target="_blank" rel="noopener">' + r.label + "</a>";
    }).join("") + "</div>" : "";
    document.getElementById("detail").innerHTML =
      '<a class="back" href="#projects">&#8249; Projects</a>' +
      '<div class="meta"><em>' + (p.year || "") + "</em></div>" +
      '<h1 class="page-title">' + p.title + "</h1>" +
      primary +
      "<p>" + p.description + "</p>" +
      (p.reference ? '<p class="ref"><em>' + p.reference + "</em></p>" : "") +
      refs +
      (tags ? '<div class="tags">' + tags + "</div>" : "") +
      (others ? '<div class="links">' + others + "</div>" : "");
  }

  // ---------- projects list ----------
  var cards = document.getElementById("cards");
  var lastGroup = null, rows = null;
  SITE.projects.forEach(function (p, i) {
    var g = p.group || "";
    if (rows === null || g !== lastGroup) {
      var block = document.createElement("section");
      block.className = "block";
      if (g) {
        var h = document.createElement("h2");
        h.className = "block-title";
        h.textContent = g;
        block.appendChild(h);
      }
      rows = document.createElement("div");
      rows.className = "rows";
      block.appendChild(rows);
      cards.appendChild(block);
      lastGroup = g;
    }
    var a = document.createElement("a");
    a.className = "row";
    a.href = "#projects/" + i;
    a.innerHTML =
      '<span class="row-title">' + p.title + "</span>" +
      '<span class="row-meta"><em>' + (p.year || "") + "</em></span>";
    rows.appendChild(a);
  });

  // ---------- design imagery (optional) ----------
  function tryImg(src, cb) {
    if (!src) return;
    var im = new Image();
    im.onload = function () { cb(src); };
    im.src = src;
  }
  tryImg(SITE.backdrop, function (src) {
    var b = document.getElementById("backdrop");
    b.style.backgroundImage = "url('" + src + "')";
    b.classList.add("on");
  });

  // ---------- art ----------
  var lightbox = document.getElementById("lightbox");
  var lbImg = lightbox.querySelector("img");
  lightbox.addEventListener("click", function () { lightbox.hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") lightbox.hidden = true; });

  function count(v) {
    return Array.isArray(v) ? v.length : Object.keys(v).reduce(function (n, k) {
      return n + (Array.isArray(v[k]) ? v[k].length : v[k].images.length);
    }, 0);
  }

  // ---------- calendar view (used when every group in a tab is a date, like the steaks) ----------
  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function parseDate(label) {
    var m = /^\s*([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})\s*$/.exec(label);
    if (!m) return null;
    var mi = MONTHS.indexOf(m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase());
    return mi < 0 ? null : { y: +m[3], m: mi, d: +m[2] };
  }

  var tip = null, overlay = null;
  function ensurePopups() {
    if (tip) return;
    tip = document.createElement("div");
    tip.className = "cal-tip";
    tip.hidden = true;
    document.body.appendChild(tip);
    overlay = document.createElement("div");
    overlay.className = "entry-overlay";
    overlay.hidden = true;
    overlay.addEventListener("click", function (e) { if (e.target === overlay) overlay.hidden = true; });
    document.body.appendChild(overlay);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") overlay.hidden = true; });
  }
  function showTip(cell, text) {
    if (!text) return;
    tip.textContent = text;
    tip.hidden = false;
    var r = cell.getBoundingClientRect();
    var left = Math.min(r.left, window.innerWidth - tip.offsetWidth - 12);
    var top = r.bottom + 8;
    if (top + tip.offsetHeight > window.innerHeight - 8) top = Math.max(8, r.top - tip.offsetHeight - 8);
    tip.style.left = Math.max(8, left) + "px";
    tip.style.top = top + "px";
  }
  function openEntry(label, entry) {
    var images = Array.isArray(entry) ? entry : entry.images;
    var note = Array.isArray(entry) ? "" : (entry.note || "");
    overlay.innerHTML = "";
    var card = document.createElement("div");
    card.className = "entry-card";
    var close = document.createElement("button");
    close.className = "entry-close";
    close.setAttribute("aria-label", "Close");
    close.innerHTML = "&times;";
    close.onclick = function () { overlay.hidden = true; };
    var h = document.createElement("h2");
    h.className = "block-title";
    h.textContent = label;
    card.appendChild(close);
    card.appendChild(h);
    if (note) {
      var p = document.createElement("p");
      p.className = "group-note";
      p.textContent = note;
      card.appendChild(p);
    }
    var photos = document.createElement("div");
    photos.className = "entry-photos";
    var shown = [], loaded = 0;
    images.forEach(function (src) {
      var im = new Image();
      im.alt = "";
      im.onclick = function () { lbImg.src = im.src; lightbox.hidden = false; };
      im.onload = function () {
        im.style.flex = (im.naturalWidth / im.naturalHeight) + " 1 0px";
        if (++loaded === images.length) {
          // all photos share one row at the same height, never taller than 62% of the window
          var sum = shown.reduce(function (a, p) { return a + p.naturalWidth / p.naturalHeight; }, 0);
          photos.style.maxWidth = Math.round(window.innerHeight * 0.62 * sum + 14 * (shown.length - 1)) + "px";
        }
      };
      im.src = "assets/art/" + src;
      shown.push(im);
      photos.appendChild(im);
    });
    card.appendChild(photos);
    overlay.appendChild(card);
    overlay.hidden = false;
    tip.hidden = true;
  }

  function renderCalendar(container, groups) {
    ensurePopups();
    var months = {};
    Object.keys(groups).forEach(function (label) {
      var p = parseDate(label);
      var key = p.y * 12 + p.m;
      if (!months[key]) months[key] = { y: p.y, m: p.m, days: {} };
      months[key].days[p.d] = { label: label, entry: groups[label] };
    });
    Object.keys(months).map(Number).sort(function (a, b) { return b - a; }).forEach(function (key) {
      var mo = months[key];
      var sec = document.createElement("section");
      sec.className = "block cal-month";
      var title = document.createElement("h2");
      title.className = "block-title";
      title.textContent = MONTHS[mo.m] + " " + mo.y;
      sec.appendChild(title);
      var grid = document.createElement("div");
      grid.className = "cal-grid";
      ["S", "M", "T", "W", "T", "F", "S"].forEach(function (d) {
        var c = document.createElement("div");
        c.className = "cal-dow";
        c.textContent = d;
        grid.appendChild(c);
      });
      var first = new Date(mo.y, mo.m, 1).getDay();
      var count = new Date(mo.y, mo.m + 1, 0).getDate();
      for (var b = 0; b < first; b++) grid.appendChild(document.createElement("div"));
      for (var d = 1; d <= count; d++) {
        var data = mo.days[d];
        var cell = document.createElement(data ? "button" : "div");
        cell.className = "cal-day" + (data ? " has" : "");
        var num = document.createElement("span");
        num.className = "cal-num";
        num.textContent = d;
        if (data) {
          (function (cell, data) {
            var images = Array.isArray(data.entry) ? data.entry : data.entry.images;
            var note = Array.isArray(data.entry) ? "" : (data.entry.note || "");
            cell.type = "button";
            cell.setAttribute("aria-label", data.label);
            var im = new Image();
            im.alt = "";
            // the tile shows entry.cover if one is set, otherwise the first photo
            im.src = "assets/art/" + ((!Array.isArray(data.entry) && data.entry.cover) || images[0]);
            cell.appendChild(im);
            cell.addEventListener("click", function () { openEntry(data.label, data.entry); });
            cell.addEventListener("pointerenter", function () { showTip(cell, note); });
            cell.addEventListener("pointerleave", function () { tip.hidden = true; });
            cell.addEventListener("focus", function () { showTip(cell, note); });
            cell.addEventListener("blur", function () { tip.hidden = true; });
          })(cell, data);
        }
        cell.appendChild(num);
        grid.appendChild(cell);
      }
      sec.appendChild(grid);
      container.appendChild(sec);
    });
  }

  // ---------- photo rows: balanced so no photo is huge and none is tiny ----------
  var galleries = [];
  function layoutGallery(g) {
    var W = g.grid.clientWidth;
    if (!W) return;                       // page hidden: laid out again when shown / resized
    var items = g.items.filter(function (it) { return it.ok && it.ar > 0; });
    var n = items.length;
    if (!n) return;
    var GAP = 14;
    var T = Math.max(260, Math.min(window.innerHeight * 0.5, 600));   // preferred row height for this window
    var HMAX = T * 1.25;                                              // rows that would be taller are not stretched
    function rowH(i, j) {
      var sum = 0;
      for (var k = i; k < j; k++) sum += items[k].ar;
      return (W - GAP * (j - i - 1)) / sum;
    }
    // pick the row breaks (keeping the order) whose row heights are closest to the preferred height
    var best = [0], from = [0];
    for (var j = 1; j <= n; j++) {
      best[j] = Infinity;
      for (var i = 0; i < j; i++) {
        var cost = best[i] + Math.pow(rowH(i, j) - T, 2);
        if (cost < best[j]) { best[j] = cost; from[j] = i; }
      }
    }
    var rows = [], end = n;
    while (end > 0) { rows.unshift([from[end], end]); end = from[end]; }
    g.grid.innerHTML = "";
    rows.forEach(function (r) {
      var row = document.createElement("div");
      row.className = "jrow";
      var h = rowH(r[0], r[1]), capped = h > HMAX;
      for (var k = r[0]; k < r[1]; k++) {
        var it = items[k];
        it.fig.style.flex = capped ? "0 0 " + (it.ar * HMAX) + "px" : it.ar + " 1 0px";
        row.appendChild(it.fig);
      }
      g.grid.appendChild(row);
    });
  }
  function registerGallery(grid, items) {
    var g = { grid: grid, items: items };
    galleries.push(g);
    var pending = items.length;
    function done() { if (--pending === 0) layoutGallery(g); }
    items.forEach(function (it) {
      it.im.onload = function () { it.ar = it.im.naturalWidth / it.im.naturalHeight; done(); };
      it.im.onerror = function () { it.ok = false; done(); };
      it.im.src = it.src;
    });
  }
  var relayoutTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(function () { galleries.forEach(layoutGallery); }, 120);
  });

  function renderArt(catSlug) {
    galleries.length = 0;
    var names = Object.keys(SITE.art).filter(function (k) { return count(SITE.art[k]); });
    var cat = names.filter(function (k) { return slug(k) === catSlug; })[0] || names[0];
    var sub = document.getElementById("subnav");
    sub.innerHTML = "";
    sub.hidden = !names.length;
    names.forEach(function (k) {
      var a = document.createElement("a");
      a.href = "#art/" + slug(k);
      a.textContent = k;
      if (k === cat) a.className = "active";
      sub.appendChild(a);
    });
    var gallery = document.getElementById("gallery");
    gallery.innerHTML = "";
    if (!cat) return;
    var v = SITE.art[cat];
    var groups = Array.isArray(v) ? { "": v } : v;
    var keys = Object.keys(groups);
    if (keys.length && keys.every(function (k) { return parseDate(k); })) {
      renderCalendar(gallery, groups);
      return;
    }
    var order = Object.keys(groups);
    // if every group is a date (like the steaks), show the newest first
    if (order.length > 1 && order.every(function (k) { return !isNaN(Date.parse(k)); })) {
      order.sort(function (a, b) { return Date.parse(b) - Date.parse(a); });
    }
    order.forEach(function (g) {
      var sec = document.createElement("section");
      sec.className = "block";
      if (g) {
        var h = document.createElement("h2");
        h.className = "block-title";
        h.textContent = g;
        sec.appendChild(h);
      }
      var grid = document.createElement("div");
      grid.className = "jgallery";
      var entry = groups[g];
      var list = Array.isArray(entry) ? entry : entry.images;
      if (!Array.isArray(entry) && entry.note) {
        var note = document.createElement("p");
        note.className = "group-note";
        note.textContent = entry.note;
        sec.appendChild(note);
      }
      var items = list.map(function (p) {
        var fig = document.createElement("figure");
        fig.className = "frame";
        var im = new Image();
        im.alt = "";
        im.onclick = function () { lbImg.src = im.src; lightbox.hidden = false; };
        fig.appendChild(im);
        return { fig: fig, im: im, ar: 0, ok: true, src: "assets/art/" + p };
      });
      sec.appendChild(grid);
      gallery.appendChild(sec);
      registerGallery(grid, items);
    });
  }


  // ---------- home photo: same size as before, centred between the name and the bottom of the box ----------
  function fitPortrait() {
    var grid = document.querySelector(".home-grid");
    var portrait = document.querySelector(".portrait");
    var name = document.querySelector(".name");
    if (!grid || !portrait || !name || !document.getElementById("page-home").classList.contains("on")) return;
    grid.style.gridTemplateColumns = "";
    grid.style.marginTop = "";
    if (window.innerWidth <= 760) return;
    var defaultMargin = parseFloat(getComputedStyle(grid).marginTop) || 0;
    var top0 = portrait.getBoundingClientRect().top + window.scrollY;
    // photo size (unchanged rule): fill down to the box with a 40px gap
    var boxInnerBottom = window.innerHeight - 14 - 3;
    var h = Math.max(360, Math.min(boxInnerBottom - 40 - top0, 760));
    grid.style.gridTemplateColumns = Math.round(h * 573 / 802) + "px 1fr";
    // where the name's letters visibly end (baseline plus the g's descender)
    var probe = document.createElement("span");
    probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline";
    name.appendChild(probe);
    var baselineY = probe.getBoundingClientRect().bottom + window.scrollY;
    name.removeChild(probe);
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.font = getComputedStyle(name).fontSize + " Carlito, Calibri, sans-serif";
    var inkBottom = baselineY + (ctx.measureText("g").actualBoundingBoxDescent || 0);
    // equal space above and below the photo
    var g = (boxInnerBottom - inkBottom - h) / 2;
    if (g >= 24) grid.style.marginTop = (defaultMargin + inkBottom + g - top0) + "px";
  }
  window.addEventListener("resize", fitPortrait);
  window.addEventListener("load", fitPortrait);


  // ---------- home rows: slow, endless growth while hovered (CSS animation; this only eases it back) ----------
  document.querySelectorAll(".index .row").forEach(function (row) {
    var parts = row.querySelectorAll(".row-title, .row-meta");
    row.addEventListener("mouseenter", function () {
      parts.forEach(function (el) { el.style.animation = ""; el.style.transition = "none"; el.style.transform = ""; });
    });
    row.addEventListener("mouseleave", function () {
      parts.forEach(function (el) {
        var current = getComputedStyle(el).transform;
        el.style.animation = "none";
        el.style.transition = "none";
        el.style.transform = current;
      });
      void row.offsetWidth;
      parts.forEach(function (el) {
        el.style.transition = "transform .6s cubic-bezier(.2,.7,.2,1)";
        el.style.transform = "scale(1)";
      });
    });
  });


  // ---------- front-page name: letters are pushed around by the cursor, then spring back ----------
  (function () {
    var h = document.querySelector(".name");
    if (!h || h.dataset.split) return;
    var text = h.textContent;
    h.setAttribute("aria-label", text);
    h.dataset.split = "1";
    h.classList.add("split");
    h.textContent = "";
    var letters = [], word = null;
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.className = ch === " " ? "ch sp" : "ch";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch;
      if (ch === " ") {
        word = null;
        h.appendChild(s);
      } else {
        // letters live inside a no-wrap word, so the name only ever wraps between words
        if (!word) { word = document.createElement("span"); word.className = "word"; h.appendChild(word); }
        word.appendChild(s);
      }
      letters.push({ el: s, cx: 0, cy: 0 });
    });

    // each letter shows its own slice of one continuous black / light-blue / black gradient
    function layout() {
      if (!h.offsetWidth) return;   // home page is hidden right now: measure when it is shown again
      var w = h.offsetWidth, hb = h.getBoundingClientRect();
      letters.forEach(function (l) {
        l.el.style.transform = "none";
        l.el.style.backgroundSize = w + "px 100%";
        l.el.style.backgroundPosition = -l.el.offsetLeft + "px 0";
        var r = l.el.getBoundingClientRect();
        l.cx = r.left - hb.left + r.width / 2;
        l.cy = r.top - hb.top + r.height / 2;
      });
    }
    layout();
    window.addEventListener("resize", layout);
    // re-measure whenever you navigate (after the page has switched), so returning to Home always shows the name
    window.addEventListener("hashchange", function () { setTimeout(layout, 0); setTimeout(layout, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var RADIUS = 110, timer = null;
    function release() {
      letters.forEach(function (l) {
        l.el.style.transition = "transform 1.1s cubic-bezier(.2, 1.7, .4, 1)";
        l.el.style.transform = "none";
      });
    }
    h.addEventListener("pointermove", function (e) {
      var hb = h.getBoundingClientRect(), px = e.clientX - hb.left, py = e.clientY - hb.top;
      letters.forEach(function (l) {
        var dx = l.cx - px, dy = l.cy - py, d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < RADIUS) {
          var f = 1 - d / RADIUS, push = f * f * 26;
          l.el.style.transition = "transform .16s ease-out";
          l.el.style.transform = "translate(" + (dx / d) * push + "px," + (dy / d) * push + "px) rotate(" + (dx / RADIUS) * f * 10 + "deg)";
        } else {
          l.el.style.transition = "transform .5s ease-out";
          l.el.style.transform = "none";
        }
      });
      clearTimeout(timer);
      timer = setTimeout(release, 280);
    });
    h.addEventListener("pointerleave", function () { clearTimeout(timer); release(); });
  })();


  window.addEventListener("hashchange", function () { show(); fitPortrait(); });
  show();
  fitPortrait();
})();
