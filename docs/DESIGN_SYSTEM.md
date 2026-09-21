# ASTERA Design System

## Brand essence
**Exploration + discovery + quality + technology + local opportunity**

## Visual metaphor
A new star becoming visible in a large universe.

Use cosmic references subtly:
- orbit
- star
- horizon
- constellation
- glow
- discovery

Do not make the site look like a gaming website or sci-fi movie.

## Colors

| Token | Hex | Usage |
|---|---|---|
| `--space-black` | #111111 | Deep backgrounds, premium surfaces |
| `--midnight` | #0B132B | Primary dark brand background |
| `--cosmic-blue` | #2563EB | CTA/accent |
| `--cosmic-blue-light` | #8EC5FF | Gradient highlight only (logo swoosh/accent) — never a surface or text color |
| `--starlight` | #E5E7EB | Light surfaces/text |
| `--white` | #FFFFFF | Primary light text/surfaces |

Recommended CSS variables:
```css
:root {
  --space-black: #111111;
  --midnight: #0B132B;
  --cosmic-blue: #2563EB;
  --cosmic-blue-light: #8EC5FF;
  --starlight: #E5E7EB;
  --white: #FFFFFF;
}
```

Note: `--cosmic-blue-light` was first added in the rejected v1 logo, removed for being unverified, and reintroduced here in the v2 logo (see below) as a deliberate design choice — see the "Logo — current status" section for why it isn't extracted from the source image.

## Typography
Use a clean modern sans-serif.
Preferred approach:
- strong display heading
- highly readable body text
- restrained letter spacing
- avoid decorative fonts

If using a web font, load only required weights.

## Logo direction
Primary concept:
- geometric "A"
- subtle orbital ring/swoosh
- optional small star
- wordmark: ASTERA

The symbol should work independently as:
- favicon
- app icon
- social avatar
- packaging mark
- storefront mark

## Logo — current status

**v1 SVG variants rejected (2026-09-18).** The first production attempt was hand-built from approximate geometry (freehand estimation, not measured against the reference) and did not accurately represent the approved mark. Deleted entirely — do not recreate from memory or approximation.

**v2 SVG variants approved-pending-review (2026-09-18).** Rebuilt in `brand/logo/` by tracing `brand/references/astera-logo-master.png` directly: Canny edge detection + contour extraction on the actual pixel data (method approved by the owner before implementation), not visual approximation. Where the ribbon occludes the letter (two spots — bottom-left and bottom-right corners), the true corner position was reconstructed from the letter's own visible edges either side of the occlusion, not guessed. See the review artifact for the traced-outline proof overlaid on the master reference.

**Known limitations of v2, disclosed rather than hidden:**
- The ribbon's gradient (`#8EC5FF` → `#2563EB`, using the existing `--cosmic-blue` token plus a new `--cosmic-blue-light` tint) is a **deliberate design choice**, not a color extracted from the source — the master reference's ribbon has glossy multi-directional 3D lighting (specular highlights, ambient shading), not a simple 2-stop gradient, so pixel-sampling it produced inconsistent/unusable results. Using the brand's own defined blue tokens is more correct than false precision from noisy pixels.
- The wordmark is not covered by this vectorization — the v2 master reference is mark-only. Wordmark still renders as live `<text>` in Poppins (placeholder pending a typeface decision).
- Light-background colorway is still derived, not shown in any approved reference — needs sign-off same as v1.

**Visual source of truth:** `brand/references/astera-logo-master.png` (1:1 master, mark-only) plus `brand/references/astera-brand-board.png` (context: color story, usage, tone).

**Files** (all four share identical traced path data — only a transform, fill color, and wordmark/badge presence differ, so proportions can't drift between variants):

| File | Contains | Use on |
|---|---|---|
| `astera-logo-mark.svg` | Mark only (A + swoosh + sparkle), white ink | Dark surfaces; compact spaces, social avatars, loading states |
| `astera-logo-dark-bg.svg` | Mark + wordmark, white ink | Dark surfaces — the **primary logo** |
| `astera-logo-light-bg.svg` | Mark + wordmark, Space Black ink | White/Starlight surfaces — derived, pending sign-off |
| `astera-favicon.svg` | Mark only on a rounded Midnight badge | Browser favicon, app icon |

**Two-layer asset system** (this is the production logo layer; the glossy master PNG is the brand-artwork layer):

| Layer | Purpose | Look |
|---|---|---|
| Brand artwork | Hero sections, posters, social media | Glossy/cinematic — `astera-logo-master.png` itself |
| Production logo | Navbar, favicon, invoices, print, signage | Clean flat vector — the v2 SVGs above |

Use the SVGs, not the PNGs, for any production placement. Don't stretch/distort, rotate, or add glow/bevel back into the production logo — that belongs exclusively to the brand-artwork layer.

## Layout
- generous spacing
- clear grid
- strong alignment
- 12-column desktop grid where appropriate
- compact but comfortable mobile spacing
- rounded corners used consistently, not excessively

## Components
Build reusable components for:
- Header
- Hero
- ProductCard
- BrandCard
- CategoryCard
- SectionHeading
- CTA
- Footer
- Trust/quality points
- Responsive navigation

## Motion
Motion should communicate discovery, not decoration.
Good:
- subtle orbital movement
- hover lift
- gentle reveal
- smooth page transitions

Avoid:
- constant floating objects
- excessive parallax
- long loading animations
- motion that affects usability

## Accessibility
- WCAG-minded contrast
- keyboard navigation
- visible focus states
- meaningful alt text
- semantic headings
- buttons for actions
- links for navigation
- respect reduced-motion preferences

## Photography
Prefer real ASTERA shop/product photography where available.
Do not replace authentic local-store identity with generic stock imagery everywhere.

## UI tone
Premium but accessible.
Modern but not intimidating.
Local but not amateur.
Futuristic but not gimmicky.
