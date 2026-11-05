/* =====================================================
   TOOL META landing — configuration & behaviour
   ===================================================== */
const CONFIG = {
  links: {
    app: "https://public.toolmeta.io/",   // Get Started / official website
    support: "https://t.me/rachel_fb2"     // Contact Support & pricing (Telegram)
  },
  defaultLang: "vi"
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const icon = (id, cls = "") => `<svg${cls ? ` class="${cls}"` : ""}><use href="#${id}"/></svg>`;
let lang = CONFIG.defaultLang;
let currentTab = "dashboard";

/* ---------- Links ---------- */
$$("[data-link]").forEach(a => {
  const url = CONFIG.links[a.dataset.link];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
});
$("#year").textContent = new Date().getFullYear();

/* ---------- i18n ---------- */
const t = key => {
  const v = window.T[key]; if (!v) return key;
  return v[window.LANGS.indexOf(lang)] ?? v[1];
};
const list = name => window.L[name][lang] || window.L[name].en;

let benIn = false;
function renderLists() {
  $("#list-before").innerHTML = list("before").map((x, i) => `<li style="--i:${i}">${icon("i-x")}<span>${x}</span></li>`).join("");
  $("#list-after").innerHTML = list("after").map((x, i) => `<li style="--i:${i}">${icon("i-check")}<span>${x}</span></li>`).join("");
  $("#steps-bulk").innerHTML = list("bulk").map(([h, p], i) => `<li style="--i:${i}"><span class="n">${i + 1}</span><div><b>${h}</b><p>${p}</p></div></li>`).join("");
  $("#steps-how").innerHTML = list("how").map(([h, p], i) => `<li style="--i:${i}"><span class="n">${i + 1}</span><div><b>${h}</b><p>${p}</p></div></li>`).join("");
  const B = window.L.benefits;
  $("#benefits").innerHTML = list("benefits").map(([h, p], i) =>
    `<div class="ben tilt ${i === 0 ? "hl" : ""} ${benIn ? "in" : ""}" style="--i:${i}"><div class="ticon ${B.colors[i]}">${icon(B.icons[i])}</div><div><b>${h}</b><p>${p}</p></div></div>`).join("");
  $("#price-list").innerHTML = list("price").map(x => `<li>${icon("i-check")}<span>${x}</span></li>`).join("");
  const S = window.L.sec;
  $("#sec-list").innerHTML = list("sec").map(([h, p], i) =>
    `<div class="sitem"><div class="ticon ${S.colors[i]}">${icon(S.icons[i])}</div><div><b>${h}</b><p>${p}</p></div></div>`).join("");
  renderFAQ();
  renderShow(currentTab);
}

function renderFAQ() {
  $("#faq-list").innerHTML = list("faq").map(([q, a], i) =>
    `<div class="qa"><h3><button aria-expanded="false" aria-controls="qa-${i}" id="qb-${i}">${q}<span class="pm">${icon("i-plus")}</span></button></h3>
     <div class="qa-body" id="qa-${i}" role="region" aria-labelledby="qb-${i}"><div><p>${a}</p></div></div></div>`).join("");
  $$("#faq-list .qa button").forEach(b => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open); b.closest(".qa").classList.toggle("open", open);
  }));
}

function applyLang(next) {
  if (!window.LANGS.includes(next)) next = CONFIG.defaultLang;
  lang = next;
  document.documentElement.lang = lang;
  document.title = t("meta.title");
  $$("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$("[data-lang]").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
  renderLists();
  renderRibbons();
  try { localStorage.setItem("tm2-lang", lang); } catch (e) {}
}
$$("[data-lang]").forEach(b => b.addEventListener("click", () => applyLang(b.dataset.lang)));

/* ---------- Showcase ---------- */
const sk = w => `<i class="sk ${w}"></i>`;
function shotHTML(key) {
  if (key === "dashboard") {
    return `<div class="dash">
      <div class="dbanner"><div><b>TOOL META Dashboard</b><small>${t("ui.dashSub")}</small></div><span class="chip">${icon("i-sync")}${t("ui.sync")}</span></div>
      <div class="dcard"><h5>${t("ui.accInfo")}</h5>
        <div class="drow"><span>${t("ui.install")}</span><i class="toggle on"></i></div>
        <div class="drow"><span>${t("ui.signin")}</span><i class="toggle on"></i></div>
        <div class="drow">${sk("w65")}</div></div>
      <div class="dcard"><h5>${t("ui.updates")}</h5><div class="drow">${sk("w85")}</div><div class="drow">${sk("w65")}</div><div class="drow">${sk("w75")}</div></div>
    </div>`;
  }
  const cols = window.L.show[key].cols[lang];
  const pills = key === "bm"
    ? [`<span class="pill ver"><i></i>${t("st.verified")}</span>`, `<span class="pill live"><i></i>LIVE</span>`, `<span class="pill rev"><i></i>${t("st.review")}</span>`, `<span class="pill ver"><i></i>${t("st.verified")}</span>`, `<span class="pill die"><i></i>DIE</span>`]
    : key === "page"
    ? [`<span class="pill act"><i></i>ACTIVE</span>`, `<span class="pill act"><i></i>ACTIVE</span>`, `<span class="pill die"><i></i>DIE</span>`, `<span class="pill act"><i></i>ACTIVE</span>`, `<span class="pill act"><i></i>ACTIVE</span>`]
    : [`<span class="pill live"><i></i>LIVE</span>`, `<span class="pill live"><i></i>LIVE</span>`, `<span class="pill die"><i></i>DIE</span>`, `<span class="pill live"><i></i>LIVE</span>`, `<span class="pill live"><i></i>LIVE</span>`];
  const widths = [["w85", "w55", "w65"], ["w75", "w65", "w40"], ["w65", "w40", "w55"], ["w85", "w75", "w65"], ["w55", "w55", "w40"]];
  const rows = pills.map((p, i) => `<div class="row" style="--i:${i}"><i class="box ${[0, 1, 3].includes(i) ? "on" : ""}" style="--i:${i}"></i>${p}${widths[i].map(sk).join("")}</div>`).join("");
  return `<div class="tbar"><span class="chip on">${icon("i-play")}${t("ui.start")}</span><span class="chip">${icon("i-filter")}${t("ui.filter")}</span><span class="chip">${icon("i-refresh")}</span><span class="chip grow">${icon("i-search")}${t("ui.search")}</span></div>
    <div class="row h"><span></span>${cols.map(c => `<span>${c}</span>`).join("")}</div>${rows}
    <div class="sbar"><span>${t("ui.total")}</span><span>${t("ui.selected")}</span><span>LIVE</span><span>DIE</span></div>`;
}
function renderShow(key) {
  currentTab = key;
  const [title, text, points] = window.L.show[key][lang];
  $("#panel-show").innerHTML = `
    <div class="show-copy fade"><h3>${title}</h3><p>${text}</p><ul class="ok">${points.map(x => `<li>${icon("i-check")}<span>${x}</span></li>`).join("")}</ul></div>
    <div class="fade"><div class="browser" role="img" aria-label="${title}">
      <div class="bbar"><div class="dots"><i></i><i></i><i></i></div><div class="url">TOOL META · ${key === "dashboard" ? "Dashboard" : key.toUpperCase()}</div><span class="slot">${icon("i-image")}${t("ui.slot")}</span></div>
      ${shotHTML(key)}</div></div>`;
  $("#panel-show").setAttribute("aria-labelledby", "tab-" + key);
}
const tabs = $$(".tab");
function selectTab(tab, focus, auto) {
  tabs.forEach(x => { const on = x === tab; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; });
  renderShow(tab.dataset.tab); if (focus) tab.focus();
  if (!auto) stopAuto(); else restartBar(tab);
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", e => {
    const n = e.key === "ArrowRight" ? (i + 1) % tabs.length : e.key === "ArrowLeft" ? (i - 1 + tabs.length) % tabs.length : e.key === "Home" ? 0 : e.key === "End" ? tabs.length - 1 : -1;
    if (n > -1) { e.preventDefault(); selectTab(tabs[n], true); }
  });
});

/* ---------- Header, menu, back to top ---------- */
const header = $(".header"), totop = $(".totop"), menuBtn = $(".menu-btn"), mnav = $("#mobile-nav");
const onScroll = () => { header.classList.toggle("scrolled", scrollY > 10 || mnav.classList.contains("open")); totop.classList.toggle("show", scrollY > 900); };
addEventListener("scroll", onScroll, { passive: true });
const setMenu = open => { menuBtn.setAttribute("aria-expanded", open); mnav.classList.toggle("open", open); onScroll(); };
menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
$$("a", mnav).forEach(a => a.addEventListener("click", () => setMenu(false)));
addEventListener("keydown", e => { if (e.key === "Escape" && mnav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
addEventListener("resize", () => { if (innerWidth > 1000) setMenu(false); });
totop.addEventListener("click", () => scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));

/* ---------- Init ---------- */
let saved = CONFIG.defaultLang;
try { saved = localStorage.getItem("tm2-lang") || saved; } catch (e) {}
applyLang(saved);
onScroll();

/* ---------- Reveal on scroll ---------- */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce || !("IntersectionObserver" in window)) $$(".reveal").forEach(el => el.classList.add("in"));
else {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .1, rootMargin: "0px 0px -30px 0px" });
  $$(".reveal").forEach(el => io.observe(el));
}


/* =====================================================
   MOTION
   ===================================================== */
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;

/* Ribbons (marquee) */
function renderRibbons() {
  const a = [[t("asset.adFull"), "i-bolt"], ["Business Manager", "i-layers"], [t("asset.pageFull"), "i-doc"], [t("hero.f3"), "i-sliders"], [t("t3.t"), "i-id"]];
  const b = [[t("t1.t"), "i-shield"], [t("hero.f2"), "i-sync"], [t("hero.f1"), "i-puzzle"], [t("t2.t"), "i-download"], ["LIVE · DIE · ACTIVE", "i-chart"]];
  const html = arr => { const one = arr.map(([x, ic]) => `<span class="titem">${icon(ic)}${x}</span>`).join(""); return one + one + one + one; };
  $("#track-1").innerHTML = html(a); $("#track-2").innerHTML = html(b);
}
renderRibbons();

/* Benefits reveal (cards are re-rendered on language change) */
const benWrap = $("#benefits");
if (REDUCED || !("IntersectionObserver" in window)) { benIn = true; $$(".ben", benWrap).forEach(x => x.classList.add("in")); }
else new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { benIn = true; $$(".ben", benWrap).forEach(x => x.classList.add("in")); o.disconnect(); } }), { threshold: .15 }).observe(benWrap);

/* Scroll progress */
const bar = $(".progress");
const onProg = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
addEventListener("scroll", onProg, { passive: true }); onProg();

/* Showcase autoplay: rotates tabs until the visitor interacts */
const AUTO_MS = 7000; let autoTimer = null, autoOn = !REDUCED;
function restartBar(tab) {
  $$(".tab .bar").forEach(b => b.classList.remove("run"));
  if (!autoOn) return;
  const b = $(".bar", tab); void b.offsetWidth; b.style.setProperty("--dur", AUTO_MS + "ms"); b.classList.add("run");
}
function stopAuto() { autoOn = false; clearInterval(autoTimer); $$(".tab .bar").forEach(b => b.classList.remove("run")); }
function startAuto() {
  if (!autoOn) return;
  restartBar(tabs.find(x => x.getAttribute("aria-selected") === "true"));
  autoTimer = setInterval(() => {
    const i = tabs.findIndex(x => x.getAttribute("aria-selected") === "true");
    selectTab(tabs[(i + 1) % tabs.length], false, true);
  }, AUTO_MS);
}
const showWrap = $(".show-wrap");
if (autoOn && "IntersectionObserver" in window) {
  let started = false;
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !started) { started = true; startAuto(); }
  }), { threshold: .35 }).observe(showWrap);
  showWrap.addEventListener("pointerenter", () => { if (autoOn) { clearInterval(autoTimer); $$(".tab .bar").forEach(b => b.style.animationPlayState = "paused"); } });
  showWrap.addEventListener("pointerleave", () => { if (autoOn) { $$(".tab .bar").forEach(b => b.style.animationPlayState = ""); clearInterval(autoTimer); startAuto(); } });
}

/* Mascot eyes follow the pointer */
if (!REDUCED && FINE) {
  let raf = 0, px = 0, py = 0;
  addEventListener("pointermove", e => { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(look); }, { passive: true });
  function look() {
    raf = 0;
    $$(".mascot").forEach(m => {
      const r = m.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      const cx = r.left + r.width / 2, cy = r.top + r.height * .42;
      const dx = px - cx, dy = py - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
      m.style.setProperty("--ex", (dx / d * 5 * k).toFixed(2) + "px");
      m.style.setProperty("--ey", (dy / d * 4 * k).toFixed(2) + "px");
    });
  }
}

/* Gentle 3D tilt + spotlight on cards */
if (!REDUCED && FINE) {
  document.addEventListener("pointermove", e => {
    const c = e.target.closest && e.target.closest(".tilt"); if (!c) return;
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.transform = `perspective(900px) rotateX(${(.5 - y) * 6}deg) rotateY(${(x - .5) * 8}deg) translateY(-4px)`;
    c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
  }, { passive: true });
  document.addEventListener("pointerout", e => {
    const c = e.target.closest && e.target.closest(".tilt");
    if (c && !c.contains(e.relatedTarget)) c.style.transform = "";
  });
}
