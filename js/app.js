/* ==========================================================================
   APEX PRO LEAGUE — shared shell (header, footer, countdown, animations)
   ========================================================================== */

const LOGO_SVG = `
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="apexGold" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f6dd9a"/><stop offset="0.5" stop-color="#e8c15a"/><stop offset="1" stop-color="#b8860b"/>
    </linearGradient>
  </defs>
  <path d="M24 4 44 42H32.5L24 24.5 15.5 42H4L24 4Z" fill="url(#apexGold)"/>
  <path d="M24 31.5 29 42H19L24 31.5Z" fill="#07070b"/>
</svg>`;

const DISCORD_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M20.32 4.37a19.8 19.8 0 0 0-4.93-1.51 13.8 13.8 0 0 0-.64 1.28 18.3 18.3 0 0 0-5.5 0 13.8 13.8 0 0 0-.64-1.28c-1.71.29-3.37.8-4.93 1.51C.6 9.06-.25 13.62.17 18.11a19.9 19.9 0 0 0 6.04 3.03c.49-.66.92-1.37 1.29-2.1a12.9 12.9 0 0 1-2.03-.97c.17-.12.34-.25.5-.38a14.2 14.2 0 0 0 12.06 0c.16.13.33.26.5.38-.65.38-1.33.71-2.04.97.37.73.8 1.44 1.29 2.1a19.8 19.8 0 0 0 6.05-3.03c.5-5.2-.85-9.71-3.51-13.74ZM8.02 15.33c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.42 0-1.33.95-2.42 2.15-2.42 1.21 0 2.17 1.1 2.15 2.42 0 1.34-.94 2.42-2.15 2.42Z"/>
</svg>`;

const TIKTOK_ICON = `
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z"/>
</svg>`;

const INSTAGRAM_ICON = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
  <rect x="3" y="3" width="18" height="18" rx="5"/>
  <circle cx="12" cy="12" r="4.2"/>
  <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/>
</svg>`;

const NAV_LINKS = [
  ["index.html", "Home"],
  ["teams.html", "Teams"],
  ["fixtures.html", "Fixtures"],
  ["standings.html", "Standings"],
  ["bracket.html", "Bracket"],
  ["stats.html", "Stats"],
  ["rules.html", "Rules"],
];

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function renderShell() {
  const page = currentPage();
  const nav = NAV_LINKS.map(
    ([href, label]) =>
      `<a href="${href}" class="${href === page ? "is-active" : ""}">${label}</a>`
  ).join("");

  document.body.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="bg-aurora" aria-hidden="true"></div>
    <div class="bg-grid" aria-hidden="true"></div>
    <header class="site-header" id="siteHeader">
      <div class="site-header__inner">
        <a class="brand" href="index.html" aria-label="Apex Pro League — home">
          <span class="brand__mark">${LOGO_SVG}</span>
          <span class="brand__name">Apex <em>Pro League</em></span>
        </a>
        <nav class="site-nav" id="siteNav" aria-label="Main navigation">${nav}</nav>
        <a class="btn btn--gold btn--sm header-cta" href="${CONFIG.discordUrl}" target="_blank" rel="noopener">
          ${DISCORD_ICON} Join Discord
        </a>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </button>
      </div>
    </header>`
  );

  document.body.insertAdjacentHTML(
    "beforeend",
    `
    <footer class="site-footer">
      <div class="container">
        <div class="site-footer__grid">
          <div class="site-footer__about">
            <a class="brand" href="index.html">
              <span class="brand__mark">${LOGO_SVG}</span>
              <span class="brand__name">Apex <em>Pro League</em></span>
            </a>
            <p>The premier community-run ${CONFIG.game} tournament. ${CONFIG.teamCount} clubs. One champion. Built by players, for players.</p>
            <div class="socials">
              <a href="${CONFIG.discordUrl}" target="_blank" rel="noopener" aria-label="Discord">${DISCORD_ICON}</a>
              <a href="${CONFIG.tiktokUrl}" target="_blank" rel="noopener" aria-label="TikTok">${TIKTOK_ICON}</a>
              <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">${INSTAGRAM_ICON}</a>
            </div>
          </div>
          <div>
            <h4>Competition</h4>
            <div class="site-footer__links">
              <a href="teams.html">Teams</a>
              <a href="fixtures.html">Fixtures &amp; Results</a>
              <a href="standings.html">Standings</a>
              <a href="bracket.html">Knockout Bracket</a>
            </div>
          </div>
          <div>
            <h4>League</h4>
            <div class="site-footer__links">
              <a href="stats.html">Player Stats</a>
              <a href="rules.html">Official Rulebook</a>
              <a href="index.html#format">Format</a>
              <a href="index.html#prizes">Prize Pool</a>
            </div>
          </div>
          <div>
            <h4>Community</h4>
            <div class="site-footer__links">
              <a href="${CONFIG.discordUrl}" target="_blank" rel="noopener">Discord Server</a>
              <a href="${CONFIG.discordUrl}" target="_blank" rel="noopener">Register Your Club</a>
              <a href="${CONFIG.tiktokUrl}" target="_blank" rel="noopener">TikTok</a>
              <a href="${CONFIG.instagramUrl}" target="_blank" rel="noopener">Instagram</a>
            </div>
          </div>
        </div>
        <div class="site-footer__bottom">
          <span>© ${new Date().getFullYear()} Apex Pro League. All rights reserved.</span>
          <span>Not affiliated with EA SPORTS. ${CONFIG.platform}.</span>
        </div>
      </div>
    </footer>`
  );

  // Header scroll state
  const header = document.getElementById("siteHeader");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile nav
  const toggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  toggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  siteNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") siteNav.classList.remove("is-open");
  });
}

/* ----- helpers used by page renderers ----- */

function crestStyle(team) {
  return `background: linear-gradient(135deg, ${team.colors[0]}, ${team.colors[1]});`;
}

function fmtDate(iso, opts) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    ...opts,
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function previewNotice() {
  if (!CONFIG.previewMode) return "";
  return `
    <p class="notice">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
      Preview data shown — live results begin when ${CONFIG.seasonName} kicks off on ${fmtDate(CONFIG.kickoff + "T19:00:00Z")}.
    </p>`;
}

/* ----- countdown (home page) ----- */

function startCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const target = new Date(CONFIG.countdownTo).getTime();
  const units = ["days", "hours", "mins", "secs"];

  el.innerHTML =
    units
      .map(
        (u) => `
        <div class="countdown__unit">
          <div class="countdown__value" data-unit="${u}">00</div>
          <div class="countdown__label">${u}</div>
        </div>`
      )
      .join("");

  const fields = Object.fromEntries(
    units.map((u) => [u, el.querySelector(`[data-unit="${u}"]`)])
  );

  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    fields.days.textContent = String(d).padStart(2, "0");
    fields.hours.textContent = String(h).padStart(2, "0");
    fields.mins.textContent = String(m).padStart(2, "0");
    fields.secs.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

/* ----- scroll reveal ----- */

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
}

/* ----- boot ----- */

document.addEventListener("DOMContentLoaded", () => {
  renderShell();
  startCountdown();

  const page = document.body.dataset.page;
  if (page && typeof PAGE_RENDERERS !== "undefined" && PAGE_RENDERERS[page]) {
    PAGE_RENDERERS[page]();
  }

  // Wire all generic Discord CTAs to the configured invite.
  document.querySelectorAll("[data-discord]").forEach((a) => {
    a.href = CONFIG.discordUrl;
    a.target = "_blank";
    a.rel = "noopener";
  });

  initReveal();
});
