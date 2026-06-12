/* ════════════════════════════════════════════════════════════════
   THE MITZVAH CALENDAR — 5787
   Poster mockup renderer + page interactions.
   ════════════════════════════════════════════════════════════════ */

/* ── Year 5787 data (verified) ─────────────────────────────────────
   A shanah me'uberes (leap year), "shleimah" type: Cheshvan & Kislev
   both 30 days → 13 months, 385 days.
   1 Tishrei 5787 = Shabbos, Sept 12 2026.
   Cross-checks: Pesach (15 Nissan) → Thu Apr 22 2027 ✓
                 1 Tishrei 5788 → Shabbos Oct 2 2027 ✓
                 no fast day falls on Shabbos ✓
   start: weekday of day 1 (0 = Sunday … 6 = Shabbos)
   tov:   Yamim Tovim & yamim of simcha (gold)
   fast:  fast days (pomegranate)                                     */

const MONTHS = [
  { en: "Tishrei",  he: "תשרי",   sec: "Sep–Oct", days: 30, start: 6,
    tov: [1, 2, 10, 15, 16, 17, 18, 19, 20, 21, 22, 23], fast: [3] },
  { en: "Cheshvan", he: "חשון",   sec: "Oct–Nov", days: 30, start: 1,
    tov: [], fast: [] },
  { en: "Kislev",   he: "כסלו",   sec: "Nov–Dec", days: 30, start: 3,
    tov: [25, 26, 27, 28, 29, 30], fast: [] },          // Chanukah begins
  { en: "Teves",    he: "טבת",    sec: "Dec–Jan", days: 29, start: 5,
    tov: [1, 2], fast: [10] },                          // Chanukah ends, Asarah B'Teves
  { en: "Shvat",    he: "שבט",    sec: "Jan–Feb", days: 30, start: 6,
    tov: [15], fast: [] },                              // Tu B'Shvat
  { en: "Adar I",   he: "אדר א׳", sec: "Feb–Mar", days: 30, start: 1,
    tov: [14], fast: [] },                              // Purim Katan
  { en: "Adar II",  he: "אדר ב׳", sec: "Mar–Apr", days: 29, start: 3,
    tov: [14, 15], fast: [13] },                        // Purim & Shushan Purim
  { en: "Nissan",   he: "ניסן",   sec: "Apr–May", days: 30, start: 4,
    tov: [15, 16, 17, 18, 19, 20, 21, 22], fast: [] },  // Pesach
  { en: "Iyar",     he: "אייר",   sec: "May–Jun", days: 29, start: 6,
    tov: [18], fast: [] },                              // Lag B'Omer
  { en: "Sivan",    he: "סיון",   sec: "Jun–Jul", days: 30, start: 0,
    tov: [6, 7], fast: [] },                            // Shavuos
  { en: "Tammuz",   he: "תמוז",   sec: "Jul–Aug", days: 29, start: 2,
    tov: [], fast: [17] },                              // 17 Tammuz
  { en: "Av",       he: "אב",     sec: "Aug–Sep", days: 30, start: 3,
    tov: [15], fast: [9] },                             // Tisha B'Av, Tu B'Av
  { en: "Elul",     he: "אלול",   sec: "Sep–Oct", days: 29, start: 5,
    tov: [], fast: [] },
];

/* ── Render the poster's 13 months ── */
function renderPoster() {
  const grid = document.getElementById("poster-grid");
  if (!grid) return;

  const frag = document.createDocumentFragment();

  MONTHS.forEach((m) => {
    const month = document.createElement("div");
    month.className = "month";

    const name = document.createElement("div");
    name.className = "m-name";
    const enEl = document.createElement("span");
    enEl.className = "m-en";
    enEl.textContent = m.en;
    const heEl = document.createElement("span");
    heEl.className = "m-he";
    heEl.textContent = m.he;
    name.append(enEl, heEl);
    month.appendChild(name);

    const sec = document.createElement("span");
    sec.className = "m-sec";
    sec.textContent = m.sec;
    month.appendChild(sec);

    const daysEl = document.createElement("div");
    daysEl.className = "m-days";

    // leading blanks so day 1 sits on its true weekday
    for (let i = 0; i < m.start; i++) {
      const d = document.createElement("span");
      d.className = "d empty";
      daysEl.appendChild(d);
    }

    for (let day = 1; day <= m.days; day++) {
      const d = document.createElement("span");
      const weekday = (m.start + day - 1) % 7;
      let cls = "d";
      if (m.tov.includes(day))        cls += " tov";
      else if (m.fast.includes(day))  cls += " fast";
      else if (day === 1)             cls += " rc";       // Rosh Chodesh
      else if (weekday === 6)         cls += " shabbos";  // Shabbos column
      d.className = cls;
      daysEl.appendChild(d);
    }

    month.appendChild(daysEl);
    frag.appendChild(month);
  });

  // 13 months + this span-3 cell = 16 cells = a clean 4×4 grid
  const goals = document.createElement("div");
  goals.className = "goals-cell";
  const gTitle = document.createElement("span");
  gTitle.className = "g-title";
  gTitle.textContent = "My mitzvos this year";
  goals.appendChild(gTitle);
  [
    { text: " Uman — Rosh Hashanah", done: true },
    { text: " Start Daf Yomi", done: true },
    { text: "Eretz Yisrael — Chanukah ✈", done: false },
    { text: "Make a siyum by Shavuos", done: false },
  ].forEach((g) => {
    const line = document.createElement("span");
    if (g.done) {
      line.className = "done";
      const check = document.createElement("span");
      check.className = "check";
      check.textContent = "✓";
      line.appendChild(check);
    }
    line.appendChild(document.createTextNode(g.text));
    goals.appendChild(line);
  });
  frag.appendChild(goals);

  grid.appendChild(frag);
}

/* ── Scroll-triggered reveals ── */
function setupReveals() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => io.observe(el));
}

/* ── Seamless marquee (duplicate content, scroll -50%) ── */
function setupMarquee() {
  const track = document.getElementById("marquee-track");
  if (!track) return;
  Array.from(track.children).forEach((child) =>
    track.appendChild(child.cloneNode(true))
  );
}

/* ── Mobile nav ── */
function setupNav() {
  const toggle = document.getElementById("navtoggle");
  const nav = document.getElementById("topnav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ── Pre-order form → composes an email (no backend needed on GitHub
      Pages). Swap for Formspree/Shopify later without touching HTML. ── */
function setupForm() {
  const form = document.getElementById("preorder-form");
  const note = document.getElementById("form-note");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim();
    const qty = form.elements.qty.value;

    const subject = encodeURIComponent("Mitzvah Calendar — pre-order reservation");
    const body = encodeURIComponent(
      `Please reserve me a spot in the first printing.\n\n` +
      `Name: ${name}\nEmail: ${email}\nQuantity: ${qty}\n\n(Sent from themitzvahcalendar pre-order page)`
    );
    window.location.href =
      `mailto:davidbassin12@gmail.com?subject=${subject}&body=${body}`;

    if (note) {
      note.textContent =
        "Your email app just opened with the reservation — hit send and you're on the list. ✦";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPoster();
  setupReveals();
  setupMarquee();
  setupNav();
  setupForm();
});
