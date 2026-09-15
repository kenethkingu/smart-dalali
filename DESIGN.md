# Proland — Design Direction Reference

> Save this as `DESIGN.md` at the project root. Every future session
> reads this before making visual decisions so the direction doesn't
> drift back to AI defaults over time.

---

## The direction: Architectural Editorial

Oversized, confident typography carries the brand. Asymmetric broken-grid
layouts on marketing sections. Hairline borders and flat surfaces at rest
(hover-only shadow). One accent color (`--pl-accent` green), used sparingly
enough that it reads as a decision, not a default. A subtle grain texture
layer adds tactile warmth so the monochrome system doesn't feel sterile.

**Why this:** The logo is a strict geometric black mark. Compass's
black-and-white-only rule is the named industry template for this kind of
consistency at scale in real estate. Proland follows the same principle.

---

## Typography rules

- **Archivo only** — one typeface, disciplined weight usage. A third
  typeface anywhere is noise, not hierarchy.
- **Go bigger than feels comfortable on marketing headlines.** Hero h1
  and section h2 use `clamp()` viewport-scaled sizes, not safe `text-4xl`.
  CSS tokens: `--text-display: clamp(2.5rem, 6vw, 5rem)` and
  `--text-title: clamp(1.75rem, 3.5vw, 3rem)`.
- **One optional restrained serif accent** — a single italic serif word
  in exactly one place for editorial warmth. Not deployed everywhere.
- Never more than two typefaces total. If a third appears anywhere, remove it.

---

## Card treatment

- **Hairline border** (`border border-pl-line`) at rest — no drop shadow.
- **Shadow appears only on hover**, using two layered shadows for physical
  realism (not a single `shadow-lg` toggle).
- **Corner radius:** `rounded-lg` on interactive elements (cards, buttons,
  inputs). Structural/layout containers (nav, section dividers) use
  `rounded-none`.
- **Never nest a card inside a card** — use spacing + a hairline divider
  for internal grouping instead.

---

## Layout rules (marketing pages only)

- **Featured Properties:** First card spans 2 columns × 2 rows (editorial
  anchor). The rest fill around it asymmetrically.
- **How It Works:** Ghost/outline numerals (huge, low-opacity background
  layer) behind each step's text. Steps staggered vertically — not three
  equal columns.
- **About page:** Sections can break the container edge. Numbers bleed.
- **Dashboards and forms are the exception — keep them conventionally
  boring.** Spend the "distinctive" budget on Home, About, Property Detail.

---

## Grain texture

Apply `.grain` utility class to large flat background areas (hero, dark
sections). The `::after` pseudo-element adds a barely-visible SVG noise
layer (opacity ~0.03–0.04). This is atmosphere — no one should consciously
notice it.

---

## The ban list — check every new component against this

Do NOT build, and remove if found:

| Pattern | Why it's banned |
|---|---|
| Any gradient on a background, button, or number | Fights the monochrome logo; AI default tell |
| Colored left-border strip on any card/alert | Named "the single most reliable AI tell" |
| `shadow-md`/`shadow-lg` as the default resting state | Should be hover-only |
| A centered hero with a small rounded badge pill above the headline | Very specific, very common AI tell |
| Exactly three feature cards in an identical equal row | Reflexive template behavior |
| Numbered step row using small filled circles (1/2/3) | Named cliché — use ghost numerals instead |
| All-caps section labels on every single section header | Reserve emphasis techniques for when they mean something |
| A second accent color added "because a screen needed to feel finished" | Color ≠ hierarchy fix; fix spacing/type instead |

---

## The guardrail

Distinctiveness stops at the door of anything transactional. The booking
flow, countdown, payment confirmation, and all three dashboards prioritize
absolute clarity over visual novelty. A buyer deciding whether to pay should
never have to parse an unconventional layout to find what matters.
