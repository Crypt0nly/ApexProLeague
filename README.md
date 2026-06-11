# Apex Pro League

Official website for the **Apex Pro League** — a premium, community-run
EA SPORTS FC Pro Clubs tournament. 16 clubs, a €2,500 prize pool, a group
stage, a knockout bracket and a broadcast Grand Final.

Registration happens on Discord: **https://discord.gg/pzbBqu87Tb**

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Landing page — hero, countdown, format, prize pool, roadmap, how to register, FAQ |
| `teams.html` | The 16 clubs, grouped A–D |
| `fixtures.html` | Full schedule and results, filterable by group |
| `standings.html` | Group tables (computed automatically from results) |
| `bracket.html` | Knockout bracket through to the Grand Final |
| `stats.html` | Golden Boot / Playmaker / Golden Glove / MVP leaderboards |
| `rules.html` | The complete official rulebook |

## Running locally

It's a fully static site — no build step, no backend. Open `index.html`
directly, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Hosting

Deploy the repository as-is to GitHub Pages, Netlify, Vercel or any static
host. For GitHub Pages: Settings → Pages → deploy from the `main` branch root.

## Running your tournament

Everything on the site is driven by **one file: `js/data.js`**. You never
touch the HTML to run a season.

1. **`CONFIG`** — season name, dates, prize pool, Discord invite, countdown
   target. Set `previewMode: false` on kickoff day to remove the
   "preview data" notices.
2. **`TEAMS`** — the 16 clubs: name, 3-letter tag, group, region and two
   crest gradient colors.
3. **`RESULTS`** — after each match, add one line with the score, e.g.
   `"A-MD3-NSUvVEL": [2, 1],`. Fixture ids follow the pattern
   `<GROUP>-MD<matchday>-<HOME>v<AWAY>` and are generated automatically from
   the round-robin template — standings, form guides and fixture states all
   update from this single map.
4. **`BRACKET`** — once groups finish, replace placeholder strings
   (`"Winner A"`) with team ids (`"VEL"`) and fill in scores as ties finish.
   The champion card lights up automatically when the final has a score.
5. **`PLAYERS`** — update the four leaderboards after each matchday.

> The repo ships with sample results for matchdays 1–2 so every page renders
> with realistic data. Clear the `RESULTS` map (and the sample `PLAYERS`
> entries) before your real season starts.
