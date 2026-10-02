---
name: Analytics
description: Each site shown as a plate in a design annual, its figures set as the printed credits beneath it.
colors:
  ground: "light-dark(oklch(96.8% 0.003 308.4), oklch(19.5% 0.003 248))"
  edge-warm: "light-dark(oklch(97.6% 0.004 34.3), oklch(21.2% 0.005 39.4))"
  edge-green: "light-dark(oklch(95.9% 0.007 151.9), oklch(19.9% 0.009 169.3))"
  ink: "light-dark(oklch(20.8% 0.005 248.1), oklch(93.7% 0.006 84.6))"
  ink-2: "light-dark(oklch(43.4% 0.008 255.5), oklch(74.1% 0.007 88.7))"
  ink-3: "light-dark(oklch(63.9% 0.005 258.3), oklch(53.8% 0.005 91.5))"
  on-ink: "light-dark(oklch(96.8% 0.003 308.4), oklch(19.5% 0.003 248))"
  hair: "light-dark(oklch(83% 0.005 78.3), oklch(34.8% 0.003 106.6))"
  dot: "light-dark(oklch(20.8% 0.005 248.1 / 0.17), oklch(93.7% 0.006 84.6 / 0.13))"
  seal: "light-dark(oklch(90.3% 0.03 283.7), oklch(31.3% 0.061 279.7))"
  page-views: "light-dark(oklch(50.8% 0.177 275.9), oklch(64.4% 0.153 279.1))"
  page-views-fill: "light-dark(oklch(50.8% 0.177 275.9 / 0.11), oklch(64.4% 0.153 279.1 / 0.15))"
  visits: "light-dark(oklch(59.7% 0.134 41.5), oklch(66.7% 0.123 44.6))"
  sequence-1: "light-dark(oklch(39.1% 0.163 273.8), oklch(79.9% 0.088 282.1))"
  sequence-2: "light-dark(oklch(59.3% 0.152 278.6), oklch(64.4% 0.153 279.1))"
  sequence-3: "light-dark(oklch(79.6% 0.078 282), oklch(46.2% 0.147 277.1))"
typography:
  display:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "clamp(56px, 8.2vw, 92px)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "clamp(36px, 4.4vw, 56px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
  figure:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "clamp(40px, 4.4vw, 60px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "tnum"
  body-small:
    fontFamily: "Familjen Grotesk, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.14em"
  axis:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.06em"
rounded:
  none: "0"
  bar-end: "3px"
spacing:
  side: "56px"
  gutter: "40px"
  stamp: "132px"
  wrap-max-width: "1440px"
  section: "120px"
  plate: "88px"
components:
  token:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0 14px"
    height: "34px"
  token-hover:
    backgroundColor: "{colors.seal}"
    textColor: "{colors.ink}"
  token-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  chart-tip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
    width: "168px"
  credit:
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    padding: "20px 24px 26px"
  plate-frame:
    rounded: "{rounded.none}"
    padding: "32px 32px 20px"
---

# Design System: Analytics

## Overview

**Creative North Star: "The Design Annual Plate"**

Each tracked site is presented as a plate in a printed design annual: the site name set huge beside a short lede, the chart framed like a reproduced plate with registration crosshairs at its corners and a slowly rotating stamp pinned to its top edge, and the figures set beneath it as the plate's printed credits. The page is cool paper (or charcoal, following the system theme) printed in near-black ink, structured entirely by hairline rules. Colour is reserved for data; everything else is ink of three strengths.

The density is editorial rather than dashboard: generous vertical rhythm (88 to 140px between sections), a twelve-column grid, large light display type, and small widely tracked mono capitals for every label, axis and meta line. It deliberately refuses the KPI-cards-plus-area-chart dashboard default: no cards, no shadows on surfaces, no rounded containers.

The privacy claim is part of the visual system: the page ends on a colophon of what is counted and what is never recorded, set with the same weight as the figures.

**Key Characteristics:**
- Paper ground with a faint warm top-left and green bottom-right light, fixed behind the scroll.
- Hairline rules (1px) do all structural work; a rule in full ink opens a section, a rule in `hair` divides within it.
- Two data colours only: periwinkle for page views, terracotta for visits.
- Everything set at weight 400; hierarchy comes from size, tracking and ink strength.
- Square corners everywhere except the rounded ends of data bars.
- One periwinkle stamp per plate, rotating once every 48s when motion is allowed.

## Colors

A near-monochrome print palette, ink on paper, with two data hues and a pale periwinkle stamp tint. Every colour is defined through `light-dark()` and follows the system theme; the dashboard has no theme switch of its own.

### Primary
- **Plate Periwinkle** (`page-views`): the page-views series (line, area at `page-views-fill`, bars, dots, legend swatch) and the fill of breakdown share bars. The only saturated colour that covers area.

### Secondary
- **Terracotta** (`visits`): the visits series only: the dashed line, the visit bars, dots and legend swatch. Never used for chrome.

### Tertiary
- **Stamp Tint** (`seal`): the rotating stamp's disc, the hover state of tokens, the chart's active-bucket band (at 0.55 opacity) and text selection. A tint, never a text colour; text on it stays in `ink`.
- **Periwinkle Sequence** (`sequence-1` to `sequence-3`): a three-step ramp, darkest first in light mode, for the parts of one whole (stacked device or locale shares).

### Neutral
- **Paper** (`ground`): page background, and the backing behind anything that must mask the dot field or a line (sticky bar, table head, chart halo).
- **Warm Edge / Green Edge** (`edge-warm`, `edge-green`): the two radial lights on the body background only.
- **Ink** (`ink`): primary text, section-opening rules, the current token, the tooltip, the focus ring.
- **Ink 2** (`ink-2`): secondary text, ledes, labels, axis text.
- **Ink 3** (`ink-3`): registration marks, the chart's zero line and ticks, "other" rows, link underlines at rest.
- **On Ink** (`on-ink`): text set on an ink fill.
- **Hairline** (`hair`): dividing rules within a section, token borders, row separators, dotted grid lines.
- **Dot** (`dot`): the dot-screen texture of empty and pending fields.

### Named Rules
**The Data Owns The Colour Rule.** Periwinkle and terracotta mean page views and visits, everywhere, without exception. Chrome is ink; a new hue needs a new data meaning.

**The Light-Dark Rule.** Every colour token is a `light-dark()` pair on `:root`. No component defines its own dark value and nothing is stamped on `<html>`.

## Typography

**Display Font:** Familjen Grotesk (with Helvetica Neue, sans-serif)
**Body Font:** Familjen Grotesk
**Label/Mono Font:** Geist Mono (with ui-monospace, SFMono-Regular, monospace)

**Character:** A slightly quirky grotesk at a single weight carries everything that is read; a mono at caption size carries everything that is scanned. Both are self-hosted, preloaded, OFL-licensed.

### Hierarchy
- **Display** (400, clamp(56px, 8.2vw, 92px), 0.94, -0.02em): the site name heading a plate. Balanced wrap, breaks anywhere rather than overflow.
- **Headline** (400, clamp(36px, 4.4vw, 56px), 1, -0.02em): section titles and the colophon title. Error and not-found headings sit between Display and Headline (clamp(44px, 6vw, 72px)).
- **Figure** (400, clamp(40px, 4.4vw, 60px), 1, -0.02em, tabular): the four credit figures beneath a plate.
- **Title** (400, 22-26px, 1.15-1.2): breakdown list titles (22px) and the plate caption (26px, 22px on a phone).
- **Body** (400, 17px, 1.55; 16px below 560px): running text, ledes (max 38ch beside a title, 46ch in notices, 70ch in the colophon).
- **Body Small** (400, 15px, 1.4): credit footnotes, legends, tooltip rows, the data table, colophon notes.
- **Label** (Geist Mono 400, 11px, 1.3, 0.14em, uppercase): masthead, footer, token bar, meta lines, list totals, column heads, credit names.
- **Axis** (Geist Mono 400, 11px, 0.06em, not uppercased): chart axis values and dates.

### Named Rules
**The Single Weight Rule.** Everything is set at 400, `strong` and `b` included. Emphasis is ink strength (`ink` against `ink-2`), never bold.

**The Tabular Figures Rule.** The body sets `tabular-nums`, so every number in every column aligns without per-component work.

**The Caption Voice Rule.** Mono capitals label, they never carry a sentence someone has to read.

The direction contract called for Geist Mono small caps; the build sets uppercase with 0.14em tracking. The build is authoritative.

## Layout

A centred measure (max 1440px) with a side margin (`side`) and a twelve-column grid with a gutter (`gutter`), both stepping down at three breakpoints:

- **Wide (> 1100px):** side 56px, gutter 40px. Titles take columns 1-7 or 1-8; their lede sits beside them in columns 9-12, aligned to the baseline end.
- **Below 1100px:** side 40px, gutter 28px. Titles go full width, the lede drops beneath at 8 columns; third-width lists become half-width.
- **Below 860px:** side 24px, gutter 20px, stamp 104px. Credits fold to two per row, the token bar wraps, every list goes full width.
- **Below 560px:** side 16px, stamp 88px, body 16px. Token-bar controls stretch to fill the row at 40px tall; group labels become visually hidden.

Vertical rhythm is large and repeated: 88px above a plate head and a plate frame, 120px above a section head and the footer, 140px above the colophon (each shrinking by roughly a quarter on a phone). Inside sections, 12-28px steps.

The token bar is the one sticky element: it holds site, period and language choices at the top of the viewport over a `ground` fill.

**The Width-Driven Axis Rule.** The chart's date axis shows as many ticks as fit at the current width without touching, computed from the measured label width; it never uses a fixed tick count.

## Elevation & Depth

Flat. Depth is conveyed by rules, the dot-screen texture and the paper's two radial lights, never by shadow on a surface. The only shadow is on the chart tooltip, the one element that floats over content.

### Shadow Vocabulary
- **Tooltip lift** (`box-shadow: 0 10px 28px -12px oklch(0% 0 0 / 0.35)`): the chart tooltip only.

### Named Rules
**The Printed Sheet Rule.** Surfaces are paper; they do not lift. A new floating element (tooltip, popover) may borrow the tooltip lift; a container never does.

## Shapes

Square-cut. Tokens, the plate frame, code snippets, the tooltip and the table carry no radius. The exceptions are data marks: share bars and stacked bars round their outer ends (3px), and legend dots in the tooltip are circles. Registration crosshairs (26px) sit centred on the four corners of every plate frame, and the stamp is a circular seal straddling the frame's top edge.

## Components

### Tokens (buttons and toggles)
Square-cut, ruled, typographic.
- **Shape:** square (0), 34px tall (40px on a phone), 14px horizontal padding, label type.
- **Default:** transparent with a `hair` border, `ink` text.
- **Hover:** `seal` fill, `ink` border.
- **Current:** `ink` fill and border, `on-ink` text; marked by `aria-current="page"` or `data-selected`.
- **Focus:** the shared ink ring (2px, 3px offset).
- **Transition:** background and border at 160ms, `cubic-bezier(0.16, 1, 0.3, 1)`.
- The same control serves as the retry and reload buttons on error screens.

### Plate frame
The chart's frame: a 1px `hair` border, padding 32px 32px 20px, four registration crosshairs in `ink-3`, the stamp at the top right (64px in from the edge, half above the border), and a caption row with the plate title and the series legend. The legend draws page views as a solid 2px swatch and visits as a dashed one, matching the chart.

### Traffic chart
- Daily periods draw lines; monthly periods draw paired bars (page views left, visits right).
- Page views: 2px periwinkle line over a `page-views-fill` area, with a 6px `ground` halo beneath it.
- **Visits are dashed (6 5, butt caps) and drawn over page views.** Visits never exceed page views, so when the two values are equal the dashed terracotta still reads on top of the solid line.
- Grid lines dotted in `hair` (1 3); zero line and ticks in `ink-3`; the hovered bucket gets a `seal` band and an ink crosshair at 0.5.
- Tooltip: `ink` fill, `on-ink` text, min 168px, label-type date, fades and slides 4px in 160ms, flips to the left side near the right edge.

### Credits
The four figures beneath a plate: ruled in full `ink` above and `hair` below, separated by `hair` vertical rules, label-type name, Figure-type value, Body Small footnote. Each credit spans two rows of a **subgrid** so every value and footnote aligns across the row regardless of label length. Four across, two across below 860px.

### Speed credits
The three Core Web Vitals (LCP, INP, CLS) as a second row of credits after the lists, under their own section head: the same rules and subgrid, four rows per credit. Label-type name with its abbreviation in `ink-3`, the p75 as the Figure, a 22px verdict in words (Good, Needs improvement, Poor; "Not measured yet" in `ink-3`), then a threshold scale and a Body Small note naming the question and the number of page loads, the count in `ink`. The scale is a 6px band from 0 to a fixed end per metric: good in `ink-3` at 0.35, needs improvement hatched in `ink-3`, poor solid `ink-3`, the two thresholds as 11px mono ticks under their edges, and a 2px × 18px `ink` marker at the p75, pinned to the end past it. With no sample the band is dotted (`dot`) and carries no marker. Ink only: the verdict is a word, never a colour. Three across, one per row below 860px with a `hair` rule between rows.

### Breakdown lists
Each list opens with a full-ink rule, a 22px title and a label-type total on the same baseline. Rows are a three-column grid (key, count, share at 4.6em) divided by `hair` rules, with a 6px share bar beneath in periwinkle (`ink-3` for the "other" row). Row hover underlines the key in `hair`.

### Empty and pending states
A real empty state, never sample figures: a dot-screen field (`dot`, 14px grid) behind a `ground`-backed copy block with a Headline-sized heading and the install snippet in a ruled mono block. Pending lists show dotted placeholder bars; while loading, the field breathes (2.4s) when motion is allowed.

### Navigation
- **Masthead:** label type in `ink-2`, the registration mark and owner name in `ink`, a source link underlined in `ink-3` that goes to `ink` on hover. The owner name hides on a phone.
- **Token bar:** sticky, `ground` fill, `hair` rules above and below, 72px tall, groups labelled in label type.
- **Skip link:** `ink` block, revealed on focus.

### Privacy colophon
The page's closing section: a full-ink rule, a Headline title in four columns, then lists of what is counted and what is never recorded, each item a check or a never icon (14px) beside the text, divided by `hair` rules.

## Do's and Don'ts

### Do:
- **Do** keep periwinkle for page views and terracotta for visits in every chart, legend, swatch and tooltip.
- **Do** draw visits dashed and on top of page views.
- **Do** separate and open sections with 1px rules: full `ink` to open, `hair` to divide.
- **Do** set every weight at 400 and build hierarchy from size, tracking and `ink`/`ink-2`/`ink-3`.
- **Do** let the axis tick count follow the available width.
- **Do** align repeated figure blocks with subgrid rather than fixed heights.
- **Do** gate every animation (stamp rotation, plate rise, breathing field) behind `prefers-reduced-motion: no-preference`.
- **Do** show the honest number, including zero, and a real empty state when there is no data.

### Don't:
- **Don't** show sample, demo or placeholder figures, and don't add "NEW", "SAMPLE" or similar markers; the dashboard shows real data only.
- **Don't** build KPI cards or put a shadow or radius on a container.
- **Don't** use bold; `strong` is ink, not weight.
- **Don't** set a readable sentence in the mono label style.
- **Don't** introduce a colour outside the tokens, or a dark value outside `light-dark()`.
- **Don't** show anything that could tell two visitors apart.
