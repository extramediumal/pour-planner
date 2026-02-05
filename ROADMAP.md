# Pour Planner Roadmap

## Proposed Future Enhancements

### 1. Cocktail Hour Toggle
**Priority:** Medium

Add optional "Cocktail Hour" checkbox that adds +1 drink/person for the first hour.

**Rationale:** Industry data shows guests consume 2-3 drinks in the first hour of a reception, then slow to ~1/hour after. This would give more accurate estimates for events with a dedicated cocktail hour.

**Implementation:**
- Add `hasCocktailHour: boolean` to `CalculatorInputs`
- In calculator: if enabled, add `guests * 1` to total drinks
- Add toggle switch to InputPanel UI

**Impact:** 100 guests, 4 hours would go from 340 drinks → 440 drinks when enabled.

---

### 2. Non-Drinker Percentage Slider
**Priority:** Medium

Add slider for "% of guests who don't drink" (default 0%, range 0-50%).

**Rationale:** Many weddings have 15-20% non-drinkers (religious reasons, designated drivers, pregnancy, etc.). This prevents over-buying alcohol.

**Implementation:**
- Add `nonDrinkerPercent: number` (0-50) to `CalculatorInputs`
- In calculator: multiply guests by `(1 - nonDrinkerPercent/100)` before calculating
- Add slider to InputPanel UI with label like "Non-drinkers"

**Impact:** 100 guests with 20% non-drinkers → calculates for 80 drinking guests.

---

## Completed

- [x] 5-level intensity scale (v1.0)
- [x] Interactive US map for state selection (v1.0)
- [x] Shareable URL with encoded state (v1.0)
- [x] Venue markup adjusted to 4x (Feb 2026 - based on QC analysis)
