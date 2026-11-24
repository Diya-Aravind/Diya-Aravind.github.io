/* Fills each reading page from content.js, adds a zoom view for scans, and shows upload status on the contents page. */
(function () {
  "use strict";
  var P = window.PORTFOLIO || { readings: {} };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  // student name in footer / header
  var who = (P.student || "").trim(), reg = (P.register || "").trim();
  document.querySelectorAll("[data-student]").forEach(function (n) { n.textContent = who ? who + (reg ? " (" + reg + ")" : "") : ""; if (!who) n.hidden = true; });

  // lightbox
  var dlg = document.createElement("dialog"); dlg.className = "lightbox"; dlg.setAttribute("aria-label", "Enlarged page");
  dlg.innerHTML = '<button type="button">Close</button><img alt=""><p class="cap"></p>';
  document.body.appendChild(dlg);
  var canDialog = typeof dlg.showModal === "function";
  dlg.querySelector("button").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg && dlg.close) dlg.close(); });
  function openBox(item) {
    if (!canDialog) { window.open(item.src, "_blank"); return; }
    dlg.querySelector("img").src = item.src; dlg.querySelector("img").alt = item.alt || "";
    dlg.querySelector(".cap").textContent = item.alt || ""; dlg.showModal();
  }

  function renderScans(box, list, emptyMsg) {
    box.innerHTML = "";
    if (!list || !list.length) { box.appendChild(el("p", "empty", emptyMsg)); return; }
    var grid = el("div", "scans");
    list.forEach(function (it, i) {
      var f = el("figure", "scan"), b = el("button"), img = el("img");
      b.type = "button"; b.setAttribute("aria-label", "Enlarge " + (it.alt || "page " + (i + 1)));
      img.src = it.src; img.alt = it.alt || "Scanned page " + (i + 1); img.loading = "lazy";
      b.appendChild(img); f.appendChild(b); if (it.alt) f.appendChild(el("figcaption", "", it.alt));
      b.addEventListener("click", function () { openBox(it); });
      grid.appendChild(f);
    });
    box.appendChild(grid);
  }
  function renderText(box, list, emptyMsg) {
    box.innerHTML = "";
    if (!list || !list.length) { box.appendChild(el("p", "empty", emptyMsg)); return; }
    var d = el("div", "prose"); list.forEach(function (p) { d.appendChild(el("p", "", p)); }); box.appendChild(d);
  }

  var page = document.body.getAttribute("data-reading");
  if (page) {
    var R = (P.readings || {})[page] || {};
    document.querySelectorAll("[data-slot]").forEach(function (box) {
      var k = box.getAttribute("data-slot");
      if (k === "scans") renderScans(box, R.scans, "Annotated pages will be added here.");
      if (k === "notes") renderScans(box, R.notes, "Scanned class notes will be added here.");
      if (k === "analysis") renderText(box, R.analysis, "The analysis of this essay will be added here.");
      if (k === "summary") renderText(box, R.summary, "The summary of learning will be added here.");
    });
  }

  // contents page status
  document.querySelectorAll("[data-state-for]").forEach(function (s) {
    var R = (P.readings || {})[s.getAttribute("data-state-for")] || {};
    var n = (R.scans || []).length;
    if (n) { s.textContent = n + (n === 1 ? " page" : " pages") + " uploaded"; s.setAttribute("data-s", "live"); }
  });
})();
