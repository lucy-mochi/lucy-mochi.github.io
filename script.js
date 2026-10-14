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
      document.getElementById(t).classList.toggle("on", t === h);
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
    return Array.isArray(v) ? v.length : Object.keys(v).reduce(function (n, k) { return n + v[k].length; }, 0);
  }

  function renderArt(catSlug) {
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
    Object.keys(groups).forEach(function (g) {
      var sec = document.createElement("section");
      sec.className = "block";
      if (g) {
        var h = document.createElement("h2");
        h.className = "block-title";
        h.textContent = g;
        sec.appendChild(h);
      }
      var grid = document.createElement("div");
      grid.className = "masonry";
      groups[g].forEach(function (p) {
        var fig = document.createElement("figure");
        fig.className = "frame";
        var im = new Image();
        im.alt = "";
        im.loading = "lazy";
        im.onerror = function () { fig.remove(); };
        im.onload = function () {
          var ar = im.naturalWidth / im.naturalHeight;
          fig.style.flex = ar + " 1 " + Math.round(ar * 250) + "px";
        };
        im.onclick = function () { lbImg.src = im.src; lightbox.hidden = false; };
        im.src = "assets/art/" + p;
        fig.appendChild(im);
        grid.appendChild(fig);
      });
      sec.appendChild(grid);
      gallery.appendChild(sec);
    });
  }


  // ---------- home photo: same size as before, centred between the name and the bottom of the box ----------
  function fitPortrait() {
    var grid = document.querySelector(".home-grid");
    var portrait = document.querySelector(".portrait");
    var name = document.querySelector(".name");
    if (!grid || !portrait || !name || !document.getElementById("home").classList.contains("on")) return;
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
    var letters = [];
    text.split("").forEach(function (ch) {
      var s = document.createElement("span");
      s.className = ch === " " ? "ch sp" : "ch";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch;
      h.appendChild(s);
      letters.push({ el: s, cx: 0, cy: 0 });
    });

    // each letter shows its own slice of one continuous black / light-blue / black gradient
    function layout() {
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
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var RADIUS = 170, timer = null;
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
          var f = 1 - d / RADIUS, push = f * f * 70;
          l.el.style.transition = "transform .16s ease-out";
          l.el.style.transform = "translate(" + (dx / d) * push + "px," + (dy / d) * push + "px) rotate(" + (dx / RADIUS) * f * 28 + "deg)";
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
