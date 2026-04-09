# ☠ DOOM NEWS — GLOBAL THREAT INTELLIGENCE SYSTEM

> A military-grade desktop news aggregator with real-time global threat mapping.

---

## 🖥 FEATURES

- **Live RSS News Feed** — Pulls from 13+ major global news sources (BBC, Reuters, Al Jazeera, AP, DW, France24, Guardian, NPR, VOA, Bloomberg, FT, Ars Technica, MIT Tech Review)
- **Tactical World Map** — All incidents plotted by geographic coordinates with pulsing threat rings
- **Threat Classification** — Every story auto-classified: CRITICAL / HIGH / MEDIUM / LOW
- **DEFCON Level Display** — Dynamic DEFCON 1-5 computed from live news data
- **Intel Briefing Panel** — Military-style intelligence brief for each selected incident
- **Region Threat Bars** — Threat level breakdown by world region
- **Auto-Refresh** — Feed refreshes every 5 minutes automatically
- **Live Ticker** — Scrolling headline ticker at the bottom
- **Filter System** — Filter by: ALL / CRITICAL / CONFLICT / POLITICS / ECONOMY / TECH+WMD
- **CRT Military HUD** — Full scanline overlay, green phosphor aesthetic, coordinate display
- **0 Paid APIs** — Uses only free public RSS feeds + free CORS proxies

---

## 🔧 HOW TO BUILD THE EXE

### Requirements
- **Node.js** (LTS version) — https://nodejs.org/

### Windows (.exe installer + portable)
1. Install Node.js from https://nodejs.org/
2. Double-click `BUILD_WINDOWS.bat`
3. Wait ~3-5 minutes for build
4. Find your files in the `dist/` folder:
   - `DOOM NEWS Setup 1.0.0.exe` — Installer
   - `DOOM NEWS 1.0.0.exe` — Portable (no install needed)

### macOS (.dmg)
```bash
chmod +x build.sh
./build.sh
# Output: dist/DOOM NEWS-1.0.0.dmg
```

### Linux (.AppImage)
```bash
chmod +x build.sh
./build.sh
# Output: dist/DOOM NEWS-1.0.0.AppImage
chmod +x dist/*.AppImage
./dist/*.AppImage
```

---

## 🚀 RUN WITHOUT BUILDING

If you just want to run the app without building an exe:

```bash
npm install
npm start
```

---

## 📡 NEWS SOURCES

| Source | Region | Category |
|--------|--------|----------|
| BBC World | UK | General |
| Reuters | International | General |
| Al Jazeera | Qatar | Conflict |
| Deutsche Welle | Germany | General |
| France 24 | France | General |
| AP News | USA | General |
| NPR World | USA | General |
| VOA News | USA | General |
| The Guardian | UK | General |
| Ars Technica | USA | Technology |
| MIT Tech Review | USA | Technology |
| Financial Times | UK | Economy |
| Bloomberg | USA | Economy |

---

## ⚠️ NOTES

- News feed requires internet connection
- First load uses fallback static data if RSS sources are unreachable (CORS restrictions)
- For best results, run on a machine with unrestricted internet access
- The app uses free public CORS proxies to fetch RSS feeds; if these are down, fallback intel data is shown

---

## 🎨 INTERFACE

```
┌─────────────────────────────────────────────────────────────────┐
│  ☠ DOOM NEWS          ◈ GLOBAL THREAT INTELLIGENCE ◈    UTC CLOCK│
├──────────────┬──────────────────────────────────┬───────────────┤
│ INTEL FEED   │                                  │ INTEL         │
│              │      TACTICAL WORLD MAP          │ BRIEFING      │
│ [news items] │   [threat dots + ping rings]     │ [selected     │
│              │                                  │  incident]    │
│ [filters]    │        [DEFCON display]          │               │
│              │                                  │ [region       │
│              │                                  │  threat bars] │
├──────────────┴──────────────────────────────────┴───────────────┤
│ ● LIVE  13 SOURCES  ◈ [SCROLLING HEADLINE TICKER...]            │
└─────────────────────────────────────────────────────────────────┘
```

---
## 🤖 AI ASSISTANCE

- This project was organized, structured, and developed with the assistance of artificial intelligence.
- AI was used to help design system architecture, generate code components, and streamline development, while maintaining full human direction and control over functionality and design.
- Most of the fundemental code was made by me, the repetitive and time consuming things were taken care of by AI.

*DOOM NEWS is for informational purposes only. Data sourced from public RSS feeds.*
