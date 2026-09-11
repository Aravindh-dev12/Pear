# Pear Makes You Appear — Ground-Truth Design Direction

## Reference
The provided reference is https://pear.no/. Its visual language is the source of truth for the implementation: an editorial landing page with a cinematic, blurred, blue-toned 3D/film hero; fine grid lines and registration-style marks; serif headlines with compact mono/sans utility labels; asymmetric content placement; and a direct, outcome-led partnership narrative.

This build is an original implementation inspired by the reference, not a pixel-for-pixel copy. The brand message is adapted into a concise, high-contrast single-page story about building software that helps companies appear where customers search.

## Design Movement
**Cinematic editorial web design** — film-title restraint, Swiss grid discipline, and art-directed 3D motion.

## Core Principles
1. **The object is the story:** a translucent pear-like glass form acts as the visual anchor and subtly reacts to pointer movement.
2. **Asymmetry over templates:** the page uses offset columns, floating labels, and horizontal rules instead of centered hero blocks.
3. **Quiet luxury in motion:** slow camera drift, grain, and blur contrast with crisp micro-interactions and precise typography.
4. **Proof before promise:** copy is short, specific, and structured as a clear partnership model rather than generic agency positioning.

## Color Philosophy
A deep mineral blue-black field creates the feeling of looking into a night-lit studio. Pear green is reserved for the interactive object, focus states, and key markers so growth feels tangible rather than decorative. Warm ivory text softens the technical grid and keeps the page editorial rather than sci-fi.

## Layout Paradigm
A full-bleed stage is divided by a measured 12-column rule system. The hero uses a left-anchored editorial lockup and a right-side 3D focal form. Below, sections alternate between wide statements and narrow reading columns with oversized numerals and baseline lines. On mobile, the system collapses into a single vertical reading path while preserving the side-marker rhythm.

## Signature Elements
- Fine cyan grid lines with small crosshair junctions and technical coordinate labels.
- A luminous glass/pear object with a soft internal glow and a living highlight.
- Compact all-caps mono labels paired with italic serif emphasis for the key phrase in every section.

## Interaction Philosophy
Interactions should feel like adjusting a camera or studying an object in a gallery: pointer movement shifts the light and parallax slightly; navigation reveals sections without abrupt jumps; buttons have a tactile press and a directional arrow that changes position. No interaction should feel game-like or noisy.

## Animation
The hero object rotates slowly and drifts on a shallow orbit; a second, smaller form moves on a different phase for depth. Grid markers and copy enter in short staggered fades. Use springy-but-controlled cubic-bezier easing, keep UI state transitions below 300ms, and gate non-essential motion behind prefers-reduced-motion.

## Typography System
- **Display:** Cormorant Garamond, italic and regular, for the large editorial statements.
- **UI and body:** IBM Plex Mono for labels and utility data; Space Grotesk for compact explanatory copy and navigation.
- Headlines use high contrast between serif italic and mono/sans supporting lines; no generic all-sans hero treatment.

## Brand Essence
A revenue-share product studio for businesses that want to be found, built for owners who prefer aligned incentives over retainers.

**Personality:** exacting, candid, catalytic.

## Brand Voice
Headlines are short and declarative. CTAs are invitations, not hype. Microcopy is plainspoken and specific.

Example lines:
- “Build the thing customers are already searching for.”
- “No retainer. No theatre. Just the upside we create together.”

## Wordmark & Logo
A geometric pear mark built from two offset teardrop lobes and a clipped stem, rendered as a thin lime outline with a single filled seed. The wordmark sits as small tracked uppercase text beside the mark; never use the brand name as a default large text lockup.

## Signature Brand Color
**Acid Pear — #B9FF3D**. It is the ownable signal of traction and the only saturated color allowed to dominate the otherwise mineral palette.

## Content Structure
1. Hero: “Pear makes you appear.” with partnership proposition and a request partnership CTA.
2. Model: no upfront fees, shared upside, visible measurement.
3. Fit: who the model is for and who it is not for.
4. Work: software and search treated as one discipline.
5. Terms / questions: expandable answers with practical detail.
6. Closing application panel with email and a repeat CTA.

## Style Decisions
- Preserve the reference's restrained, cinematic tone while introducing a clearer interactive 3D object and stronger section affordances.
- Avoid generic card grids, purple gradients, and excessive rounded containers.
- Use the generated 3D pear assets only in prominent hero / work moments; keep supporting sections typography-led.

## Revision: Reference-Matched 3D Direction

The reference inspection changed the art direction from a dark glass/teal studio to the actual pear.no visual world: saturated cobalt blue, monumental gilded pear sculptures, classical figures in cream and ochre, marble plinths, pixelated clouds, woven black fabric, and small green/black technical markers. The website should read as a single scroll-driven canvas where the image scene changes while the editorial UI shell remains stable. The 3D quality is carried by depth, scale, camera-like parallax, scene swaps, tactile materials, and layered collage rather than by generic glow effects.
