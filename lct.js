/* Fills the pages from content.js. Nothing here needs editing. */
(function () {
  "use strict";
  var P = window.PORTFOLIO || {};
  var $$ = function (s) { return document.querySelectorAll(s); };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }
  function okUrl(u) { return /^https?:\/\//i.test((u || "").trim()); }

  var who = (P.student || "").trim(), reg = (P.register || "").trim();
  $$("[data-student]").forEach(function (n) { n.textContent = who ? who + (reg ? " (" + reg + ")" : "") : ""; if (!who) n.hidden = true; });

  function renderLink(box, url) {
    box.innerHTML = "";
    if (!okUrl(url)) { var sec = box.closest("[data-section]"); if (sec) sec.hidden = true; return; }
    var p = el("p", "readlink"), a = el("a", "", url.trim());
    a.href = url.trim(); a.target = "_blank"; a.rel = "noopener"; p.appendChild(a); box.appendChild(p);
  }
  function renderText(box, list, emptyMsg) {
    box.innerHTML = "";
    if (!list || !list.length) { box.appendChild(el("p", "empty", emptyMsg)); return; }
    var d = el("div", "prose"); list.forEach(function (t) { d.appendChild(el("p", "", t)); }); box.appendChild(d);
  }

  // lightbox for photos
  var dlg = document.createElement("dialog"); dlg.className = "lightbox"; dlg.setAttribute("aria-label", "Enlarged photo");
  dlg.innerHTML = '<button type="button">Close</button><img alt=""><p class="cap"></p>';
  document.body.appendChild(dlg);
  var canDialog = typeof dlg.showModal === "function";
  dlg.querySelector("button").addEventListener("click", function () { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  function openBox(it) {
    if (!canDialog) { window.open(it.src, "_blank"); return; }
    dlg.querySelector("img").src = it.src; dlg.querySelector("img").alt = it.alt || "";
    dlg.querySelector(".cap").textContent = it.alt || ""; dlg.showModal();
  }
  function renderPhotos(box, list) {
    box.innerHTML = "";
    if (!list || !list.length) return;
    var grid = el("div", "scans");
    list.forEach(function (it, i) {
      var f = el("figure", "scan"), b = el("button"), img = el("img");
      b.type = "button"; b.setAttribute("aria-label", "Enlarge " + (it.alt || "photo " + (i + 1)));
      img.src = it.src; img.alt = it.alt || "Photo " + (i + 1); img.loading = "lazy";
      b.appendChild(img); f.appendChild(b); if (it.alt) f.appendChild(el("figcaption", "", it.alt));
      b.addEventListener("click", function () { openBox(it); });
      grid.appendChild(f);
    });
    box.appendChild(grid);
  }

  var page = document.body.getAttribute("data-reading");
  if (page) {
    var R = (P.readings || {})[page] || {};
    $$("[data-slot]").forEach(function (box) {
      var k = box.getAttribute("data-slot");
      if (k === "byline" && (R.byline || "").trim()) box.textContent = R.byline.trim();
      if (k === "link") renderLink(box, R.link);
      if (k === "reflection") renderText(box, R.reflection, "My reflection will be added here.");
    });
  }
  $$('[data-slot="plink"]').forEach(function (box) { box.innerHTML = ""; if (okUrl((P.proposal || {}).link)) renderLink(box, P.proposal.link); });
  $$('[data-slot="photos"]').forEach(function (box) { renderPhotos(box, (P.proposal || {}).photos); });

  // contents page badges
  $$("[data-state-for]").forEach(function (s) {
    var k = s.getAttribute("data-state-for"), link = k === "proposal" ? (P.proposal || {}).link : ((P.readings || {})[k] || {}).link;
    if (okUrl(link)) { s.textContent = "Drive link added"; s.setAttribute("data-s", "live"); }
  });
})();
