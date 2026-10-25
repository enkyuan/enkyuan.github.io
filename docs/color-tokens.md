# Hue-named color tokens

`src/lib/styles/colors.css` is the single authored color source, imported by `src/app.css`. Components, SVG presentation attributes, map-gradient strings, focus contours, and shadows reference these inherited tokens. The bundled national flags remain upstream assets; their internal colors are not UI palette values.

Cobalt identifies the constant 262.398-degree blue ramp; magenta names the preserved T-Mobile shimmer; crimson identifies red accents; vermilion names the orange hover accent; indigo names the Kaze blue-violet hover accent. White, black, charcoal, graphite, gray, silver, platinum, and snow identify achromatic neutrals. Components assign roles through variables such as `--surface-fill`, without defining new literal colors. Opacity uses transparent OKLab mixes of the same primitives.

## Token migration

These substitutions preserve the existing colors; the behavior changes are listed separately below. All authored OKLCH literals now live in the shared palette.

| Before                              | After                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| `oklch(0 0 0 / 0.12)`               | `color-mix(in oklab, var(--color-black) 12%, transparent)`      |
| `oklch(0 0 0 / 0.14)`               | `color-mix(in oklab, var(--color-black) 14%, transparent)`      |
| `oklch(0 0 0 / 0.18)`               | `color-mix(in oklab, var(--color-black) 18%, transparent)`      |
| `oklch(0 0 0)`                      | `var(--color-black)`                                            |
| `oklch(0.16 0 0)`                   | `var(--color-charcoal)`                                         |
| `oklch(0.2 0 0 / 0.9)`              | `color-mix(in oklab, var(--color-graphite) 90%, transparent)`   |
| `oklch(0.2 0 0)`                    | `var(--color-graphite)`                                         |
| `oklch(0.245 0.113 262.398)`        | `var(--color-cobalt-950)`                                       |
| `oklch(0.345 0.159 262.398)`        | `var(--color-cobalt-800)`                                       |
| `oklch(0.445 0.205 262.398)`        | `var(--color-cobalt-700)`                                       |
| `oklch(0.46 0 0)`                   | `var(--color-gray)`                                             |
| `oklch(0.495 0.229 262.398)`        | `var(--color-cobalt-600)`                                       |
| `oklch(0.513 0.173 20.342)`         | `var(--color-crimson-700)`                                      |
| `oklch(0.54 0.218 1.313)`           | `var(--color-magenta-700)`                                      |
| `oklch(0.545 0.244 262.398)`        | `var(--color-cobalt-500)`                                       |
| `oklch(0.565 0.228 1.313)`          | `var(--color-magenta-600)`                                      |
| `oklch(0.590057 0.238555 1.313)`    | `var(--color-magenta-500)`                                      |
| `oklch(0.745 0.126 262.398)`        | `var(--color-cobalt-200)`                                       |
| `oklch(0.845 0.074 262.398 / 0.42)` | `color-mix(in oklab, var(--color-cobalt-100) 42%, transparent)` |
| `oklch(0.88 0 0)`                   | `var(--color-silver)`                                           |
| `oklch(0.9 0 0 / 0.7)`              | `color-mix(in oklab, var(--color-platinum) 70%, transparent)`   |
| `oklch(0.9 0 0 / 0.85)`             | `color-mix(in oklab, var(--color-platinum) 85%, transparent)`   |
| `oklch(0.9 0 0)`                    | `var(--color-platinum)`                                         |
| `oklch(0.945 0.025 262.398)`        | `var(--color-cobalt-50)`                                        |
| `oklch(0.97 0 0)`                   | `var(--color-snow)`                                             |
| `oklch(1 0 0)`                      | `var(--color-white)`                                            |

## Accent changes

| Before                                                                                                                                       | After                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| White error X                                                                                                                                | `var(--color-crimson-400)` — `oklch(0.72 0.17 18)`              |
| Cobalt dot field at 42% opacity                                                                                                              | Crimson dot field at 32% opacity                                |
| Cobalt contact-link hover                                                                                                                    | `var(--color-vermilion)` — `oklch(0.671825 0.186467 41.136498)` |
| Inherited project text without rendered links                                                                                                | Project links with vermilion hover                              |
| Cobalt text-button hover                                                                                                                     | Vermilion text-button hover                                     |
| Component-local `--employer-*` and `--map-gradient-blue` names                                                                               | Shared `--color-magenta-*` and `--color-cobalt-500` names       |
| Undefined legacy button palette names (`--gray1`, `--gray2`, `--fg`, `--blue-type`, `--white*`, `--accent`, `--visual-select-bg`, `--red-*`) | Defined neutral, cobalt, crimson, and white tokens              |

The crimson error hue shifts 16.687 degrees from the magenta brand toward red, with higher lightness for visibility against the black badge. Exact brand bytes are retained for T-Mobile (226, 0, 116) the requested hover orange (240, 100, 39), and Kaze indigo (64, 82, 164). Extra precision is intentional for those brand colors.

All primitives are in sRGB. The crimson X has 7.84:1 WCAG contrast against black (APCA |Lc| 50.5). The exact requested orange has 3.2:1 against white (APCA |Lc| 58.4); it is used as a hover accent, with dark resting text and no hover underline. It does not meet 4.5:1 for normal-size text on white, so no AA claim is made for that hover state. Keyboard focus remains a distinct cobalt outline. Existing body, secondary, badge, and sampled shimmer contrast checks continue to enforce 4.5:1.

Hover underlines are explicitly disabled. Kaze links to `https://github.com/hiyoriOS/kaze`.

The automated suite checks every color reference resolves, no component retains a literal, gamut bounds, exact brand bytes, and error-mark contrast. Actual Safari/Firefox rendering remains unverified.
