/* ==========================================================================
   APEX PRO LEAGUE — tournament data
   --------------------------------------------------------------------------
   This file is the single source of truth for the whole site.
   To run your tournament, you only ever edit this file:

   1. CONFIG    — dates, prize pool, Discord invite, season name.
   2. TEAMS     — the 16 clubs and their group assignment.
   3. RESULTS   — add a score as [home, away] once a match is played.
                  Standings, form and stats pages update automatically.
   4. BRACKET   — fill in knockout teams/scores as the groups conclude.
   5. PLAYERS   — leaderboard entries for the stats page.
   ========================================================================== */

const CONFIG = {
  seasonName: "Season I",
  game: "EA SPORTS FC Pro Clubs",
  platform: "Cross-Play · PS5 / Xbox Series X|S / PC",
  discordUrl: "https://discord.gg/pzbBqu87Tb",
  prizePool: "€2,500",
  teamCount: 16,
  // Countdown target + label shown under the timer on the home page.
  countdownTo: "2026-06-28T20:00:00Z",
  countdownLabel: "Registration closes",
  // Shown in the timeline / hero meta.
  registrationDeadline: "2026-06-28",
  groupDraw: "2026-06-30",
  kickoff: "2026-07-03",
  grandFinal: "2026-08-09",
  // While true, a small "preview data" notice is shown on live pages
  // (fixtures, standings, bracket, stats). Set to false on kickoff day.
  previewMode: true,
};

/* Crest colors are [from, to] of a gradient. */
const TEAMS = [
  // Group A
  { id: "VEL", name: "Velocity FC",       tag: "VEL", group: "A", region: "EU West",  colors: ["#e8c15a", "#8a6118"] },
  { id: "CRM", name: "Crimson Athletic",  tag: "CRM", group: "A", region: "UK",       colors: ["#d63a4f", "#6e1622"] },
  { id: "NSU", name: "North Star United", tag: "NSU", group: "A", region: "Nordics",  colors: ["#3d7bd9", "#16315e"] },
  { id: "BAY", name: "Bayside Royals",    tag: "BAY", group: "A", region: "EU West",  colors: ["#7b5cd6", "#33215e"] },
  // Group B
  { id: "IPX", name: "Iron Phoenix CF",   tag: "IPX", group: "B", region: "DACH",     colors: ["#e07b39", "#6e3413"] },
  { id: "SOL", name: "Solar State FC",    tag: "SOL", group: "B", region: "Iberia",   colors: ["#e8b13a", "#7a5410"] },
  { id: "MON", name: "Monarch SC",        tag: "MON", group: "B", region: "UK",       colors: ["#3aa86c", "#14492c"] },
  { id: "ATC", name: "Atlas Calcio",      tag: "ATC", group: "B", region: "Italy",    colors: ["#4ec4d9", "#1a5560"] },
  // Group C
  { id: "NGT", name: "Nightfall FC",      tag: "NGT", group: "C", region: "Benelux",  colors: ["#5460e0", "#1d2360"] },
  { id: "AUR", name: "Aurora United",     tag: "AUR", group: "C", region: "Nordics",  colors: ["#4cd4b0", "#175243"] },
  { id: "VTX", name: "Vortex CF",         tag: "VTX", group: "C", region: "France",   colors: ["#c64ed9", "#521a5e"] },
  { id: "EMB", name: "Ember Athletic",    tag: "EMB", group: "C", region: "UK",       colors: ["#e05050", "#5e1414"] },
  // Group D
  { id: "TTN", name: "Titan Reserve",     tag: "TTN", group: "D", region: "DACH",     colors: ["#8d9bb5", "#39414f"] },
  { id: "OBV", name: "Oblivion FC",       tag: "OBV", group: "D", region: "EU East",  colors: ["#454a66", "#15172a"] },
  { id: "LNR", name: "Lunar XI",          tag: "LNR", group: "D", region: "France",   colors: ["#b8c4e8", "#4a5577"] },
  { id: "SEN", name: "Sentinel SC",       tag: "SEN", group: "D", region: "Iberia",   colors: ["#3a87a8", "#143846"] },
];

/* --------------------------------------------------------------------------
   Group stage schedule
   Double round robin per group — six matchdays. Fixtures are generated
   from a standard round-robin template, so you never edit pairings,
   only the RESULTS map below and the matchday dates here.
   -------------------------------------------------------------------------- */

const MATCHDAY_DATES = {
  1: "2026-07-03T19:00:00Z",
  2: "2026-07-07T19:00:00Z",
  3: "2026-07-10T19:00:00Z",
  4: "2026-07-14T19:00:00Z",
  5: "2026-07-17T19:00:00Z",
  6: "2026-07-21T19:00:00Z",
};

/* Scores keyed by fixture id "<GROUP>-MD<matchday>-<HOME>v<AWAY>".
   Add an entry when a match finishes; remove preview entries before launch. */
const RESULTS = {
  // ---- Matchday 1 ----
  "A-MD1-VELvBAY": [3, 1],
  "A-MD1-CRMvNSU": [2, 2],
  "B-MD1-IPXvATC": [1, 0],
  "B-MD1-SOLvMON": [4, 2],
  "C-MD1-NGTvEMB": [2, 1],
  "C-MD1-AURvVTX": [0, 0],
  "D-MD1-TTNvSEN": [1, 3],
  "D-MD1-OBVvLNR": [2, 0],
  // ---- Matchday 2 ----
  "A-MD2-VELvNSU": [2, 0],
  "A-MD2-BAYvCRM": [1, 2],
  "B-MD2-IPXvMON": [2, 2],
  "B-MD2-ATCvSOL": [1, 3],
  "C-MD2-NGTvVTX": [3, 2],
  "C-MD2-EMBvAUR": [1, 1],
  "D-MD2-TTNvLNR": [0, 1],
  "D-MD2-SENvOBV": [2, 1],
};

/* Round-robin template for 4 teams (indices into each group's team list).
   MD1–3 single round, MD4–6 reverse fixtures. */
const RR_TEMPLATE = [
  [[0, 3], [1, 2]], // MD1
  [[0, 2], [3, 1]], // MD2
  [[1, 0], [2, 3]], // MD3
  [[3, 0], [2, 1]], // MD4
  [[2, 0], [1, 3]], // MD5
  [[0, 1], [3, 2]], // MD6
];

function buildFixtures() {
  const fixtures = [];
  ["A", "B", "C", "D"].forEach((group) => {
    const squad = TEAMS.filter((t) => t.group === group);
    RR_TEMPLATE.forEach((pairings, i) => {
      const md = i + 1;
      pairings.forEach(([h, a]) => {
        const home = squad[h].id;
        const away = squad[a].id;
        const id = `${group}-MD${md}-${home}v${away}`;
        fixtures.push({
          id,
          group,
          matchday: md,
          home,
          away,
          date: MATCHDAY_DATES[md],
          score: RESULTS[id] ?? null,
        });
      });
    });
  });
  return fixtures;
}

const FIXTURES = buildFixtures();

/* --------------------------------------------------------------------------
   Knockout bracket
   team: a team id once known, or a placeholder string like "Winner A".
   score: [home, away] when played, null otherwise. Aggregate over two legs
   is up to you — enter the deciding scoreline here.
   -------------------------------------------------------------------------- */

const BRACKET = {
  quarterFinals: [
    { label: "QF 1", date: "2026-07-24", home: { team: "Winner A" }, away: { team: "Runner-up B" }, score: null },
    { label: "QF 2", date: "2026-07-24", home: { team: "Winner C" }, away: { team: "Runner-up D" }, score: null },
    { label: "QF 3", date: "2026-07-25", home: { team: "Winner B" }, away: { team: "Runner-up A" }, score: null },
    { label: "QF 4", date: "2026-07-25", home: { team: "Winner D" }, away: { team: "Runner-up C" }, score: null },
  ],
  semiFinals: [
    { label: "SF 1", date: "2026-07-31", home: { team: "Winner QF1" }, away: { team: "Winner QF2" }, score: null },
    { label: "SF 2", date: "2026-08-01", home: { team: "Winner QF3" }, away: { team: "Winner QF4" }, score: null },
  ],
  thirdPlace: { label: "Third Place", date: "2026-08-08", home: { team: "Loser SF1" }, away: { team: "Loser SF2" }, score: null },
  final: { label: "Grand Final", date: "2026-08-09", home: { team: "Winner SF1" }, away: { team: "Winner SF2" }, score: null },
};

/* --------------------------------------------------------------------------
   Player leaderboards (stats page)
   -------------------------------------------------------------------------- */

const PLAYERS = {
  scorers: [
    { name: "Kxng_Adebayo", team: "SOL", value: 5 },
    { name: "Vortex-Yanis", team: "NGT", value: 4 },
    { name: "MarcoDieci", team: "VEL", value: 3 },
    { name: "StViper", team: "SEN", value: 3 },
    { name: "RojoNueve", team: "CRM", value: 3 },
    { name: "Daze_TTV", team: "IPX", value: 2 },
  ],
  assists: [
    { name: "PlaymakerLuc", team: "SOL", value: 4 },
    { name: "NoLookNiko", team: "VEL", value: 3 },
    { name: "Ghost_Wing", team: "NGT", value: 3 },
    { name: "EzraTen", team: "CRM", value: 2 },
    { name: "Baptiste10", team: "LNR", value: 2 },
    { name: "CallMeOcho", team: "MON", value: 2 },
  ],
  cleanSheets: [
    { name: "WallOfWarsaw", team: "OBV", value: 2 },
    { name: "GloveStory", team: "VEL", value: 1 },
    { name: "SafeHandsSam", team: "AUR", value: 1 },
    { name: "ElPortero", team: "SEN", value: 1 },
    { name: "NordicNet", team: "NSU", value: 1 },
  ],
  ratings: [
    { name: "Kxng_Adebayo", team: "SOL", value: "9.1" },
    { name: "Vortex-Yanis", team: "NGT", value: "8.8" },
    { name: "StViper", team: "SEN", value: "8.6" },
    { name: "PlaymakerLuc", team: "SOL", value: "8.5" },
    { name: "WallOfWarsaw", team: "OBV", value: "8.4" },
    { name: "MarcoDieci", team: "VEL", value: "8.3" },
  ],
};

/* --------------------------------------------------------------------------
   Helpers shared by the page renderers
   -------------------------------------------------------------------------- */

const TEAM_INDEX = Object.fromEntries(TEAMS.map((t) => [t.id, t]));

function teamById(id) {
  return TEAM_INDEX[id] || null;
}

/* Compute a group table from played fixtures. */
function computeStandings(group) {
  const rows = Object.fromEntries(
    TEAMS.filter((t) => t.group === group).map((t) => [
      t.id,
      { team: t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [] },
    ])
  );

  FIXTURES.filter((f) => f.group === group && f.score).forEach((f) => {
    const [hg, ag] = f.score;
    const home = rows[f.home];
    const away = rows[f.away];
    home.p++; away.p++;
    home.gf += hg; home.ga += ag;
    away.gf += ag; away.ga += hg;
    if (hg > ag) { home.w++; home.pts += 3; away.l++; home.form.push("W"); away.form.push("L"); }
    else if (hg < ag) { away.w++; away.pts += 3; home.l++; home.form.push("L"); away.form.push("W"); }
    else { home.d++; away.d++; home.pts++; away.pts++; home.form.push("D"); away.form.push("D"); }
  });

  return Object.values(rows).sort(
    (a, b) =>
      b.pts - a.pts ||
      (b.gf - b.ga) - (a.gf - a.ga) ||
      b.gf - a.gf ||
      a.team.name.localeCompare(b.team.name)
  );
}
