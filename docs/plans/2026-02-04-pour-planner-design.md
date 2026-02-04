# Pour Planner - Design Document

> Smart alcohol quantity estimator for weddings and events

## Overview

Pour Planner is a clean, slider-based web app that instantly estimates alcohol quantities, cost, and "vibe level" for any event. Built for DIY couples, professional planners, and venues/caterers alike.

**Core value proposition:** Answer the question "How much alcohol do I need?" with a fast, beautiful, shareable tool.

---

## Target Users

1. **Couples planning their own wedding** - Need guidance, first-time planners
2. **Professional wedding/event planners** - Quick estimates for client consultations
3. **Venues and caterers** - Advising clients on quantities and budgets

---

## Platform

- **Phase 1:** Web app (React/Next.js)
- **Phase 2:** Mobile apps if demand warrants

---

## User Flow

1. User lands on single-page app
2. Adjusts sliders on left, results update in real-time on right
3. "Party Vibe" meter shows their 1-5 scale rating
4. Taps "Share Results" to generate link or downloadable image

---

## Inputs

All inputs use sliders or simple selectors for immediate feedback.

### Primary Inputs (Sliders)

| Input | Range | Default |
|-------|-------|---------|
| Guest count | 10 - 500 | 100 |
| Event duration | 2 - 8 hours | 4 |
| Drinker intensity | Light / Moderate / Heavy | Moderate |
| Age skew | Younger / Mixed / Older | Mixed |

### Bar Style (Selector)

- **Beer Only** - casual, backyard BBQ vibe
- **Beer & Wine** - classic, covers most crowds
- **Beer, Wine & Cocktails** - full bar experience

### Pricing Options (Toggles)

**Service type:**
- BYOB (buying yourself)
- Venue/Catered (vendor pricing)

**Quality tier:**
- Budget
- Mid-range
- Premium

### Location (State)

- **Desktop:** Interactive US map - states light up on hover, click to select
- **Mobile:** Dropdown selector (tiny states are hard to tap)

State selection applies regional tax/pricing multipliers.

---

## Outputs

Results panel updates in real-time as inputs change.

### Quantities

Large, clear numbers:

- **Beer:** X cases (Y bottles)
- **Wine:** X bottles (breakdown of red/white)
- **Spirits:** X bottles (suggested breakdown: vodka, whiskey, rum, tequila) - only shown for full bar selection

### Estimated Cost

- Range based on quality tier and service type
- Example: "Estimated total: **$450 - $650**"
- Subtext: "Based on mid-range BYOB pricing in Texas"

### Party Vibe Meter

A 1-5 scale with fun, memorable labels:

| Level | Name | Description |
|-------|------|-------------|
| 1 | Stone Cold Sober Squad | Minimal alcohol presence |
| 2 | "I'll Have ONE Beer" | Light, controlled sipping |
| 3 | Social Sippers | Moderate, dinner-party vibes |
| 4 | We're Here to Party | Generous pours, good time |
| 5 | Eternal Frat Boys | Hold onto your hats |

Visual: Horizontal meter that animates smoothly between levels as inputs change. Includes tooltip with vibe description.

---

## Calculation Logic

### Base Formula

```
Total drinks = Guests × Hours × Drinks-per-hour modifier × Age adjustment
```

### Drinks-per-hour Modifier

| Intensity | Modifier |
|-----------|----------|
| Light | 0.75 |
| Moderate | 1.0 |
| Heavy | 1.5 |

### Age Skew Adjustment

| Skew | Adjustment |
|------|------------|
| Younger crowd | +15% |
| Mixed | No change |
| Older crowd | -15% |

### Drink Equivalents

- 1 drink = 12oz beer = 5oz wine = 1.5oz spirit
- Beer case = 24 bottles
- Wine bottle = 5 glasses
- Spirit bottle = 16 shots

### Split by Bar Style

| Style | Beer | Wine | Spirits |
|-------|------|------|---------|
| Beer Only | 100% | - | - |
| Beer & Wine | 60% | 40% | - |
| Full Bar | 40% | 35% | 25% |

### Vibe Meter Thresholds

Maps to drinks-per-person-per-hour:

| Level | Drinks/person/hour |
|-------|-------------------|
| 1 - Stone Cold Sober Squad | < 0.5 |
| 2 - "I'll Have ONE Beer" | 0.5 - 0.75 |
| 3 - Social Sippers | 0.75 - 1.0 |
| 4 - We're Here to Party | 1.0 - 1.5 |
| 5 - Eternal Frat Boys | > 1.5 |

### Pricing

Base prices (mid-range, national average):
- Beer: ~$1.25/bottle
- Wine: ~$12/bottle
- Spirits: ~$25/bottle

Modifiers:
- **Quality tier:** Budget (0.6x), Mid-range (1x), Premium (1.8x)
- **Service type:** BYOB (1x), Venue/Catered (3x)
- **State multiplier:** Based on state alcohol taxes (range: 1.0 - 1.4)

---

## Visual Design

### Aesthetic

Apple-inspired: clean, minimal, generous whitespace, smooth interactions.

### Color Palette

- Background: Clean white / off-white
- Accent: Warm gold or soft burgundy (wedding-appropriate, alcohol-adjacent)
- Text: Dark gray (#333), not pure black

### Typography

- Single font family: Inter, SF Pro, or similar clean sans-serif
- Large, bold numbers for results
- Generous spacing

### Layout

**Desktop:**
- Left side: Input sliders, stacked vertically with labels
- Right side: Results panel (Vibe Meter at top, quantities below, cost at bottom)
- Share button fixed at bottom-right of results

**Mobile:**
- Inputs stack on top
- Results in sticky/collapsible card below
- Results remain accessible as user scrolls through inputs

### Micro-interactions

- Sliders: Smooth drag, subtle snap points
- Numbers: Animate (count up/down) when changing
- Vibe Meter: Slides smoothly between levels
- Map states: Fade/glow on hover

---

## Sharing

### Share Button Options

**1. Copy Link**
- URL with all inputs as query params
- Example: `pourplanner.com/?guests=120&hours=5&style=full&state=TX&intensity=moderate`
- No database needed - state lives in URL
- Anyone opening link sees same calculator state

**2. Download Image**
- Clean, branded PNG summarizing results
- Contents: guest count, quantities, cost estimate, vibe level
- Subtle branding and URL at bottom
- Optimized for texting/sharing in group chats

### Shareable Image Layout

```
┌─────────────────────────────────┐
│      Your Event Bar Plan        │
│                                 │
│   120 guests · 5 hours · Texas  │
│                                 │
│   🍺 5 cases of beer            │
│   🍷 14 bottles of wine         │
│   🍸 6 bottles of spirits       │
│                                 │
│   Est. cost: $680 - $850        │
│                                 │
│   Vibe: Social Sippers (3/5)    │
│                                 │
│        pourplanner.com          │
└─────────────────────────────────┘
```

---

## Tech Stack

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS or CSS Modules
- **Map:** react-simple-maps or custom SVG
- **Image generation:** html-to-image or similar
- **Hosting:** Vercel (pairs well with Next.js)
- **Analytics:** Plausible or Simple Analytics (privacy-friendly)

---

## Data Requirements

### State Pricing Multipliers

51 entries (50 states + DC) with tax/cost-of-living multipliers.

**Maintenance:** Review annually (~1 hour/year). State alcohol taxes change infrequently.

### No Database Required

- All calculator state lives in URL params
- No user accounts (Phase 1)
- No server-side storage needed

---

## Monetization (Future)

Starting free. Options to add later if traffic grows:

1. **Affiliate links** - Alcohol delivery services, party supply retailers
2. **Premium features** - Save multiple events, PDF exports, vendor sharing
3. **Lead generation** - Connect users with local caterers/venues
4. **White-label** - License to wedding planning platforms

---

## Success Metrics

- Unique visitors
- Calculations completed (share button clicked)
- Shares generated (link copies + image downloads)
- Return visitors

---

## Open Questions

- Exact state multiplier values (research needed)
- Specific spirit breakdown recommendations for full bar
- Red/white wine split logic (season? preference input?)

---

## Next Steps

1. Set up Next.js project with Tailwind
2. Build slider components with real-time state
3. Implement calculation logic
4. Design and integrate US map component
5. Build results display with Vibe Meter
6. Add sharing functionality (URL + image export)
7. Polish animations and responsive layout
8. Deploy to Vercel
