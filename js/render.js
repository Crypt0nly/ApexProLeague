/* ==========================================================================
   APEX PRO LEAGUE — page renderers
   Each renderer reads from data.js and fills the page's containers.
   Dispatched from app.js via <body data-page="...">.
   ========================================================================== */

const PAGE_RENDERERS = {
  teams: renderTeamsPage,
  fixtures: renderFixturesPage,
  standings: renderStandingsPage,
  bracket: renderBracketPage,
  stats: renderStatsPage,
};

/* --------------------------------------------------------------------------
   Teams
   -------------------------------------------------------------------------- */

function teamCard(team) {
  return `
    <article class="team-card reveal">
      <div class="team-card__crest" style="${crestStyle(team)}">${team.tag}</div>
      <h3>${team.name}</h3>
      <div class="team-card__meta">
        <span>Group <b>${team.group}</b></span>
        <span>${team.region}</span>
      </div>
    </article>`;
}

function renderTeamsPage() {
  const root = document.getElementById("teamsRoot");
  if (!root) return;

  const groups = ["A", "B", "C", "D"];
  root.innerHTML = groups
    .map((g) => {
      const cards = TEAMS.filter((t) => t.group === g).map(teamCard).join("");
      return `
        <h2 class="group-label">Group ${g}</h2>
        <div class="team-grid">${cards}</div>`;
    })
    .join("");

  document.getElementById("teamsNotice").innerHTML = previewNotice();
}

/* --------------------------------------------------------------------------
   Fixtures
   -------------------------------------------------------------------------- */

function fixtureRow(f) {
  const home = teamById(f.home);
  const away = teamById(f.away);
  const played = !!f.score;
  const homeWins = played && f.score[0] > f.score[1];
  const awayWins = played && f.score[1] > f.score[0];

  const scoreHtml = played
    ? `<div class="fixture__score">${f.score[0]} – ${f.score[1]}</div>`
    : `<div class="fixture__score is-upcoming">${fmtTime(f.date)}</div>`;

  return `
    <div class="fixture reveal" data-group="${f.group}">
      <div class="fixture__group"><b>Group ${f.group}</b>Matchday ${f.matchday}</div>
      <div class="fixture__team fixture__team--home ${homeWins ? "is-winner" : ""}">
        <span>${home.name}</span>
        <i class="crest-dot" style="${crestStyle(home)}">${home.tag}</i>
      </div>
      ${scoreHtml}
      <div class="fixture__team fixture__team--away ${awayWins ? "is-winner" : ""}">
        <i class="crest-dot" style="${crestStyle(away)}">${away.tag}</i>
        <span>${away.name}</span>
      </div>
      <div class="fixture__when">
        <b>${fmtDate(f.date)}</b>
        <span class="fixture__status ${played ? "fixture__status--ft" : "fixture__status--up"}">
          ${played ? "Full Time" : "Upcoming"}
        </span>
      </div>
    </div>`;
}

function renderFixturesPage() {
  const root = document.getElementById("fixturesRoot");
  if (!root) return;

  document.getElementById("fixturesNotice").innerHTML = previewNotice();

  const groups = ["ALL", "A", "B", "C", "D"];
  document.getElementById("fixtureFilters").innerHTML = groups
    .map(
      (g, i) =>
        `<button data-filter="${g}" class="${i === 0 ? "is-active" : ""}">
          ${g === "ALL" ? "All groups" : "Group " + g}
        </button>`
    )
    .join("");

  function draw(filter) {
    const matchdays = [...new Set(FIXTURES.map((f) => f.matchday))].sort((a, b) => a - b);
    root.innerHTML = matchdays
      .map((md) => {
        const list = FIXTURES.filter(
          (f) => f.matchday === md && (filter === "ALL" || f.group === filter)
        );
        if (!list.length) return "";
        return `
          <section class="matchday-block">
            <h2 class="matchday-block__title"><b>Matchday ${md}</b> ${fmtDate(MATCHDAY_DATES[md], { year: "numeric" })}</h2>
            <div class="fixture-list">${list.map(fixtureRow).join("")}</div>
          </section>`;
      })
      .join("");
    root.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  document.getElementById("fixtureFilters").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    document
      .querySelectorAll("#fixtureFilters button")
      .forEach((b) => b.classList.toggle("is-active", b === btn));
    draw(btn.dataset.filter);
  });

  draw("ALL");
}

/* --------------------------------------------------------------------------
   Standings
   -------------------------------------------------------------------------- */

function formDots(form) {
  const last = form.slice(-5);
  if (!last.length) return `<span style="color:var(--faint)">—</span>`;
  return `<span class="form-dots">${last
    .map((r) => `<i class="form-dot form-dot--${r.toLowerCase()}" title="${r}"></i>`)
    .join("")}</span>`;
}

function groupTable(group) {
  const rows = computeStandings(group)
    .map(
      (r, i) => `
      <tr class="${i < 2 ? "qualifies" : ""}">
        <td class="t-team"><span class="pos">${i + 1}</span>${r.team.name}</td>
        <td>${r.p}</td><td>${r.w}</td><td>${r.d}</td><td>${r.l}</td>
        <td>${r.gf}</td><td>${r.ga}</td>
        <td>${r.gf - r.ga > 0 ? "+" : ""}${r.gf - r.ga}</td>
        <td>${formDots(r.form)}</td>
        <td class="t-pts">${r.pts}</td>
      </tr>`
    )
    .join("");

  return `
    <div class="table-card reveal">
      <div class="table-card__head">
        <h3>Group <b>${group}</b></h3>
        <span>Top 2 advance</span>
      </div>
      <table class="league">
        <thead>
          <tr>
            <th class="t-team">Club</th>
            <th>P</th><th>W</th><th>D</th><th>L</th>
            <th>GF</th><th>GA</th><th>GD</th><th>Form</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderStandingsPage() {
  const root = document.getElementById("standingsRoot");
  if (!root) return;
  document.getElementById("standingsNotice").innerHTML = previewNotice();
  root.innerHTML = ["A", "B", "C", "D"].map(groupTable).join("");
}

/* --------------------------------------------------------------------------
   Bracket
   -------------------------------------------------------------------------- */

function tieSide(side, score, idx, otherIdx) {
  const team = teamById(side.team);
  const isTbd = !team;
  const isWinner = score && score[idx] > score[otherIdx];
  const crest = team
    ? `<i class="crest-dot" style="${crestStyle(team)}">${team.tag}</i>`
    : `<i class="crest-dot" style="background:var(--panel-2);color:var(--faint)">?</i>`;
  return `
    <div class="tie__row ${isTbd ? "is-tbd" : ""} ${isWinner ? "is-winner" : ""}">
      ${crest}
      <span class="name">${team ? team.name : side.team}</span>
      <span class="score">${score ? score[idx] : ""}</span>
    </div>`;
}

function tieCard(tie, extraClass = "") {
  return `
    <div class="tie ${extraClass}">
      <div class="tie__label">${tie.label} · ${fmtDate(tie.date + "T19:00:00Z")}</div>
      ${tieSide(tie.home, tie.score, 0, 1)}
      ${tieSide(tie.away, tie.score, 1, 0)}
    </div>`;
}

function renderBracketPage() {
  const root = document.getElementById("bracketRoot");
  if (!root) return;
  document.getElementById("bracketNotice").innerHTML = previewNotice();

  const champion =
    BRACKET.final.score &&
    teamById(
      BRACKET.final.score[0] > BRACKET.final.score[1]
        ? BRACKET.final.home.team
        : BRACKET.final.away.team
    );

  root.innerHTML = `
    <div class="bracket">
      <div class="bracket__round">
        <div class="bracket__round-title">Quarter-Finals</div>
        <div class="bracket__matches">
          ${BRACKET.quarterFinals.map((t) => tieCard(t)).join("")}
        </div>
      </div>
      <div class="bracket__round">
        <div class="bracket__round-title">Semi-Finals</div>
        <div class="bracket__matches">
          ${BRACKET.semiFinals.map((t) => tieCard(t)).join("")}
        </div>
      </div>
      <div class="bracket__round">
        <div class="bracket__round-title">Third Place</div>
        <div class="bracket__matches">${tieCard(BRACKET.thirdPlace)}</div>
      </div>
      <div class="bracket__round">
        <div class="bracket__round-title">Grand Final</div>
        <div class="bracket__matches">
          <div>
            ${tieCard(BRACKET.final, "tie--final")}
            <div class="champion-slot">
              <svg class="crown" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3 18h18v2H3v-2Zm0-11 4.5 4L12 4l4.5 7L21 7v9H3V7Z"/>
              </svg>
              <b>${champion ? champion.name : "Champion"}</b>
              <span>${champion ? "Apex Pro League " + CONFIG.seasonName + " winners" : "To be crowned " + fmtDate(CONFIG.grandFinal + "T19:00:00Z", { year: "numeric" })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------------
   Stats
   -------------------------------------------------------------------------- */

function statTable(title, icon, entries, unit) {
  const rows = entries
    .map((e, i) => {
      const team = teamById(e.team);
      return `
        <tr>
          <td class="s-rank">${String(i + 1).padStart(2, "0")}</td>
          <td class="s-player">${e.name}<small>${team ? team.name : e.team}</small></td>
          <td class="s-value">${e.value}</td>
        </tr>`;
    })
    .join("");

  return `
    <div class="stat-table-card reveal">
      <div class="stat-table-card__head">${icon}<h3>${title}</h3></div>
      <table class="stat-table" aria-label="${title} (${unit})">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function renderStatsPage() {
  const root = document.getElementById("statsRoot");
  if (!root) return;
  document.getElementById("statsNotice").innerHTML = previewNotice();

  const icons = {
    ball: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9.2"/><path d="M12 7.5 16 10.4l-1.5 4.7h-5L8 10.4l4-2.9Z"/><path d="M12 2.8v4.7M20.7 9.6l-4.7.8M17.5 20l-3-3.9M6.5 20l3-3.9M3.3 9.6l4.7.8"/></svg>`,
    boot: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5v9a3 3 0 0 0 3 3h13v-3l-7-2-2-7H4Z"/><path d="M11 12l9 2.5"/></svg>`,
    glove: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4 6v6c0 5 3.4 7.8 8 9 4.6-1.2 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>`,
  };

  root.innerHTML =
    statTable("Golden Boot · Top Scorers", icons.ball, PLAYERS.scorers, "goals") +
    statTable("Playmaker · Most Assists", icons.boot, PLAYERS.assists, "assists") +
    statTable("Golden Glove · Clean Sheets", icons.glove, PLAYERS.cleanSheets, "clean sheets") +
    statTable("MVP Race · Average Rating", icons.star, PLAYERS.ratings, "average match rating");
}
