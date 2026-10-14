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
      '<span class="row-meta"><em>' + (p.year || "") + "</em></span>" +
      '<span class="pill">View <span>&#8250;</span></span>';
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


  // ---------- home photo: sized so the space below it matches the space above ----------
  function fitPortrait() {
    var grid = document.querySelector(".home-grid");
    var portrait = document.querySelector(".portrait");
    if (!grid || !portrait || !document.getElementById("home").classList.contains("on")) return;
    if (window.innerWidth <= 760) { grid.style.gridTemplateColumns = ""; return; }
    grid.style.gridTemplateColumns = "";
    var top = portrait.getBoundingClientRect().top + window.scrollY;
    // viewport bottom minus page margin (14), box border (3) and the gap that matches the one above the photo (24)
    var h = window.innerHeight - 14 - 3 - 24 - top;
    h = Math.max(360, Math.min(h, 760));
    grid.style.gridTemplateColumns = Math.round(h * 573 / 802) + "px 1fr";
  }
  window.addEventListener("resize", fitPortrait);
  window.addEventListener("load", fitPortrait);

  window.addEventListener("hashchange", function () { show(); fitPortrait(); });
  show();
  fitPortrait();
})();
