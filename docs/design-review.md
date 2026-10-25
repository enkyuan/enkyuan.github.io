# Interface and motion review

Mode: full for the changed location, flag, badge, palette and shimmer surfaces.
Svelte 5 with existing plain CSS and native WAAPI; no new motion library.

| Category    | Evidence inspected                         | Result                                                                     |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| Typography  | Page, map and about styles                 | Stable coordinate numerals; readable contrast                              |
| Surfaces    | Badge styles and supplied reference        | Black badge, white/neutral dominance, restrained blue accents              |
| Animations  | Location hook, map, about and entry styles | Shorter marker entrance, no badge overshoot, reduced-motion rules retained |
| Icons       | Flags and shared circular dot field        | Same-origin SVGs; semantic flag colors retained                            |
| Performance | Animation properties and dependencies      | No spring dependency; simpler pill snapshots                               |

| Severity | Location                 | Before                                | After                                        | Why                                                               |
| -------- | ------------------------ | ------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| Medium   | src/lib/styles/about.css | Blue employer shimmer                 | E20074-anchored magenta shimmer              | Preserve the employer's identity with a subtle constant-hue sweep |
| Medium   | src/lib/styles/badge.css | Saturated blue surface and hover      | Reference black and neutral-black hover      | Keep blue within the accent budget                                |
| Low      | src/lib/styles/map.css   | 420ms marker drop                     | 280ms marker drop                            | Avoid making location feedback feel delayed                       |
| Low      | src/lib/styles/map.css   | Pill overshoot, blur and ease-in exit | Small scale/opacity transition with ease-out | Calm, brief state feedback without a bounce or paint-heavy blur   |
| Low      | src/lib/styles/badge.css | 160ms press                           | 100ms press, 160ms release                   | Immediate tactile feedback, interruptible CSS transition          |
| Low      | src/lib/styles/map.css   | Proportional coordinate numerals      | Tabular numerals                             | Prevent changing numbers from shifting the readout                |

| Location       | Candidate                            | Rejected because                                                                 |
| -------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| Location badge | Add a spring library                 | No drag or momentum interaction needs one                                        |
| About shimmer  | Remove the shimmer                   | User explicitly wants it retained; bounded chroma/lightness preserves legibility |
| Page surfaces  | Spread blue across large backgrounds | Would overpower the 60–30–10 hierarchy and the user's black badge choice         |

Verification: Bun palette tests calculate gamut and contrast at every shimmer sample.
Runtime browser evidence and slow-motion inspection are recorded in the release QA report.
Actual Safari/Firefox and physical-device gestures are not established by Chromium or unit fixtures.

Mobile refinement: at widths up to 560px the location readout stays at the same safe-area-aware fixed bottom position as loading and error states, keeping its place name and coordinates readable instead of shrinking to the anchor-positioning area. Desktop retains the marker-adjacent callout.
