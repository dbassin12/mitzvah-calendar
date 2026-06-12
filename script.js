/* ════════════════════════════════════════════════════════════════
   THE MITZVAH CALENDAR — 5787
   Year renderer (hero poster + full editorial calendar) + UI.

   Year 5787 is a shanah me'uberes (leap year), "shleimah" type:
   Cheshvan & Kislev both 30 days → 13 months, 385 days.
   1 Tishrei 5787 = Shabbos, Sept 12 2026.
   Cross-checks: Pesach (15 Nissan) → Thu Apr 22 2027 ✓
                 1 Tishrei 5788 → Shabbos Oct 2 2027 ✓
                 no fast day falls on Shabbos ✓
   start: weekday of day 1 (0 = Sunday … 6 = Shabbos)
   sec:   secular date of day 1 [year, month, day]
   marks: day → { t: "yt" | "chm" | "fast" | "p", label }
   ════════════════════════════════════════════════════════════════ */

const MONTHS = [
  { en: "Tishrei", he: "תשרי", days: 30, start: 6, sec: [2026, 9, 12],
    marks: {
      1: { t: "yt", label: "Rosh Hashanah" }, 2: { t: "yt", label: "Rosh Hashanah" },
      3: { t: "fast", label: "Tzom Gedaliah" }, 10: { t: "yt", label: "Yom Kippur" },
      15: { t: "yt", label: "Sukkos" }, 16: { t: "yt", label: "Sukkos" },
      17: { t: "chm", label: "Chol Hamoed" }, 18: { t: "chm" }, 19: { t: "chm" }, 20: { t: "chm" },
      21: { t: "chm", label: "Hoshana Rabbah" }, 22: { t: "yt", label: "Shmini Atzeres" },
      23: { t: "yt", label: "Simchas Torah" },
    } },
  { en: "Cheshvan", he: "חשון", days: 30, start: 1, sec: [2026, 10, 12], marks: {} },
  { en: "Kislev", he: "כסלו", days: 30, start: 3, sec: [2026, 11, 11],
    marks: {
      25: { t: "chm", label: "Chanukah" }, 26: { t: "chm" }, 27: { t: "chm" },
      28: { t: "chm" }, 29: { t: "chm" }, 30: { t: "chm" },
    } },
  { en: "Teves", he: "טבת", days: 29, start: 5, sec: [2026, 12, 11],
    marks: {
      1: { t: "chm", label: "Chanukah" }, 2: { t: "chm" },
      10: { t: "fast", label: "Asarah B'Teves" },
    } },
  { en: "Shvat", he: "שבט", days: 30, start: 6, sec: [2027, 1, 9],
    marks: { 15: { t: "chm", label: "Tu B'Shvat" } } },
  { en: "Adar I", he: "אדר א׳", days: 30, start: 1, sec: [2027, 2, 8],
    marks: { 14: { t: "chm", label: "Purim Katan" } } },
  { en: "Adar II", he: "אדר ב׳", days: 29, start: 3, sec: [2027, 3, 10],
    marks: {
      13: { t: "fast", label: "Taanis Esther" },
      14: { t: "chm", label: "Purim" }, 15: { t: "chm", label: "Shushan Purim" },
    } },
  { en: "Nissan", he: "ניסן", days: 30, start: 4, sec: [2027, 4, 8],
    marks: {
      15: { t: "yt", label: "Pesach" }, 16: { t: "yt", label: "Pesach" },
      17: { t: "chm", label: "Chol Hamoed" }, 18: { t: "chm" }, 19: { t: "chm" }, 20: { t: "chm" },
      21: { t: "yt", label: "Shvi'i Pesach" }, 22: { t: "yt", label: "Achron Pesach" },
    } },
  { en: "Iyar", he: "אייר", days: 29, start: 6, sec: [2027, 5, 8],
    marks: { 18: { t: "chm", label: "Lag B'Omer" } } },
  { en: "Sivan", he: "סיון", days: 30, start: 0, sec: [2027, 6, 6],
    marks: { 6: { t: "yt", label: "Shavuos" }, 7: { t: "yt", label: "Shavuos" } } },
  { en: "Tammuz", he: "תמוז", days: 29, start: 2, sec: [2027, 7, 6],
    marks: { 17: { t: "fast", label: "17 Tammuz" } } },
  { en: "Av", he: "אב", days: 30, start: 3, sec: [2027, 8, 4],
    marks: { 9: { t: "fast", label: "Tisha B'Av" }, 15: { t: "chm", label: "Tu B'Av" } } },
  { en: "Elul", he: "אלול", days: 29, start: 5, sec: [2027, 9, 3],
    marks: { 29: { t: "p", label: "Erev R״H 5788" } } },
];

/* Hebrew day numerals 1–30, luach style */
const HE_NUM = [
  "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י",
  "י״א", "י״ב", "י״ג", "י״ד", "ט״ו", "ט״ז", "י״ז", "י״ח", "י״ט", "כ",
  "כ״א", "כ״ב", "כ״ג", "כ״ד", "כ״ה", "כ״ו", "כ״ז", "כ״ח", "כ״ט", "ל",
];

const SEC_ABBR = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/* blue-pen goals written on real dates (month index, hebrew day) */
const SCRAWLS = [
  { m: 0, d: 2, text: "UMAN ✈" },
  { m: 1, d: 11, text: "Kever Rochel" },
  { m: 2, d: 25, text: "fly to EY ✈" },
  { m: 7, d: 15, text: "whole fam seder!" },
  { m: 9, d: 5, text: "SIYUM!" },
  { m: 10, d: 3, text: "the Ohel" },
];

const isRoshChodesh = (mIdx, day) =>
  (day === 1 && mIdx > 0) || day === 30;

/* ── Full editorial calendar ─────────────────────────────────── */
function renderYearGrid() {
  const root = document.getElementById("year-grid");
  if (!root) return;
  const frag = document.createDocumentFragment();

  MONTHS.forEach((m, mIdx) => {
    const month = document.createElement("article");
    month.className = "month";

    const head = document.createElement("div");
    head.className = "m-head";
    const en = document.createElement("span");
    en.className = "m-en";
    en.textContent = m.en;
    const he = document.createElement("span");
    he.className = "m-he";
    he.textContent = m.he;
    head.append(en, he);
    month.appendChild(head);

    // secular range, e.g. "SEP 12 – OCT 11"
    const first = new Date(m.sec[0], m.sec[1] - 1, m.sec[2]);
    const last = new Date(m.sec[0], m.sec[1] - 1, m.sec[2] + m.days - 1);
    const sec = document.createElement("span");
    sec.className = "m-sec";
    sec.textContent =
      `${SEC_ABBR[first.getMonth()]} ${first.getDate()} – ${SEC_ABBR[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
    month.appendChild(sec);

    const week = document.createElement("div");
    week.className = "m-week";
    ["S", "M", "T", "W", "T", "F"].forEach((w) => {
      const s = document.createElement("span");
      s.textContent = w;
      week.appendChild(s);
    });
    const shb = document.createElement("span");
    shb.className = "wk-shabbos";
    shb.textContent = "שבת";
    week.appendChild(shb);
    month.appendChild(week);

    const days = document.createElement("div");
    days.className = "m-days";

    for (let i = 0; i < m.start; i++) {
      const c = document.createElement("div");
      c.className = "cell empty";
      days.appendChild(c);
    }

    for (let day = 1; day <= m.days; day++) {
      const c = document.createElement("div");
      const weekday = (m.start + day - 1) % 7;
      const mark = m.marks[day];
      let cls = "cell";
      if (mark && mark.t !== "p") cls += ` ${mark.t}`;
      else if (weekday === 6) cls += " shabbos";
      if (isRoshChodesh(mIdx, day)) cls += " rc";
      c.className = cls;

      const hd = document.createElement("span");
      hd.className = "hd";
      hd.textContent = HE_NUM[day - 1];
      c.appendChild(hd);

      const secDate = new Date(m.sec[0], m.sec[1] - 1, m.sec[2] + day - 1);
      const sd = document.createElement("span");
      sd.className = "sd";
      sd.textContent =
        day === 1 || secDate.getDate() === 1
          ? `${SEC_ABBR[secDate.getMonth()]} ${secDate.getDate()}`
          : String(secDate.getDate());
      c.appendChild(sd);

      let title = `${day} ${m.en} · ${SEC_ABBR[secDate.getMonth()]} ${secDate.getDate()}, ${secDate.getFullYear()}`;
      if (mark && mark.label) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = mark.label;
        c.appendChild(tag);
        title += ` — ${mark.label}`;
      } else if (isRoshChodesh(mIdx, day)) {
        title += " — Rosh Chodesh";
      }
      c.title = title;

      const scrawl = SCRAWLS.find((s) => s.m === mIdx && s.d === day);
      if (scrawl) {
        const pen = document.createElement("span");
        pen.className = "pen";
        pen.textContent = scrawl.text;
        c.appendChild(pen);
      }

      days.appendChild(c);
    }

    month.appendChild(days);
    frag.appendChild(month);
  });

  root.appendChild(frag);
}

/* ── Hero poster (compact product shot) ──────────────────────── */
function renderHeroPoster() {
  const root = document.getElementById("hero-poster");
  if (!root) return;

  const head = document.createElement("div");
  head.className = "hp-head";
  const t = document.createElement("span");
  t.className = "hp-title";
  t.textContent = "The Mitzvah Calendar";
  const y = document.createElement("span");
  y.className = "hp-year";
  y.textContent = "5787";
  head.append(t, y);
  root.appendChild(head);

  const grid = document.createElement("div");
  grid.className = "hp-grid";

  MONTHS.forEach((m, mIdx) => {
    const month = document.createElement("div");
    month.className = "hp-month";

    const name = document.createElement("div");
    name.className = "hp-m";
    const en = document.createElement("span");
    en.textContent = m.en;
    const he = document.createElement("span");
    he.className = "he";
    he.textContent = m.he;
    name.append(en, he);
    month.appendChild(name);

    const days = document.createElement("div");
    days.className = "hp-days";
    for (let i = 0; i < m.start; i++) {
      const d = document.createElement("span");
      d.className = "hp-d e";
      days.appendChild(d);
    }
    for (let day = 1; day <= m.days; day++) {
      const d = document.createElement("span");
      const weekday = (m.start + day - 1) % 7;
      const mark = m.marks[day];
      let cls = "hp-d";
      if (mark && (mark.t === "yt" || mark.t === "chm")) cls += " t";
      else if (mark && mark.t === "fast") cls += " f";
      else if (isRoshChodesh(mIdx, day)) cls += " r";
      else if (weekday === 6) cls += " s";
      d.className = cls;
      days.appendChild(d);
    }
    month.appendChild(days);
    grid.appendChild(month);
  });

  // 13 months + span-3 goals box = clean 4×4
  const goals = document.createElement("div");
  goals.className = "hp-goals";
  ["✓ Uman — Rosh Hashanah", "✓ start Daf Yomi", "Eretz Yisrael — Chanukah ✈", "siyum by Shavuos"].forEach((g) => {
    const line = document.createElement("span");
    line.textContent = g;
    goals.appendChild(line);
  });
  grid.appendChild(goals);

  root.appendChild(grid);
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

/* ── Pre-order form → composes an email (no backend on GitHub
      Pages). Swap for Formspree/Shopify later without HTML changes. ── */
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
      `Name: ${name}\nEmail: ${email}\nQuantity: ${qty}\n\n(Sent from the pre-order page)`
    );
    window.location.href = `mailto:davidbassin12@gmail.com?subject=${subject}&body=${body}`;

    if (note) {
      note.textContent = "Your email app just opened with the reservation — hit send and you're on the list.";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeroPoster();
  renderYearGrid();
  setupNav();
  setupForm();
});
