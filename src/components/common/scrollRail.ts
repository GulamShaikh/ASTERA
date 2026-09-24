/**
 * Shared classes for a card grid that becomes a horizontally swipeable rail
 * below `sm` (phones) and hands back to a normal CSS grid from `sm` up
 * (tablet/desktop) — used by ProductGrid/CategoryGrid/BrandGrid when passed
 * `layout="rail"`. Keeps the mobile-first "browse by swiping" pattern out of
 * three near-identical copies.
 */

/** Scroll container. Negative margin bleeds to the screen edge to match Container's `px-4` mobile padding, so peeking the next card looks intentional. */
export const RAIL_CONTAINER =
  'flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 -mx-4 px-4 pb-1 hide-scrollbar sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:snap-none sm:grid sm:gap-5'

/** Wraps each card in rail mode: fixed comfortable width with the next card peeking in, full control handed back to the grid at `sm`. */
export const RAIL_ITEM = 'w-[74%] max-w-[300px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:snap-align-none'
