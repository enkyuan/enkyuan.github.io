# Palette migration

The attached reference anchors the brand near sRGB `0A5CFE`, converted to
OKLCH hue 262.398. The scale keeps that hue fixed and limits chroma to 97%
of each lightness step's sRGB maximum. Neutral surfaces have zero chroma.
Identity text uses darker blue steps; bright and pale blue steps are decorative. The location badge uses the reference black, oklch(0 0 0), with a neutral-black hover surface. White/neutral surfaces dominate, black/gray supplies secondary structure, and blue stays a limited accent, following a 60–30–10 visual hierarchy rather than equal color weighting. T-Mobile magenta is a small semantic brand exception.
Gradient interpolation uses OKLab so perceived lightness changes smoothly.
The T-Mobile shimmer uses its own constant magenta hue and repeats endpoints for a continuous loop. Its brightest stop preserves sRGB E20074; extra decimal precision keeps that named brand color faithful.
Reduced-motion settings retain a static gradient.

Calculated contrast on the authored foreground/background pairs:

| Pair                                   | WCAG ratio | APCA absolute Lc |
| -------------------------------------- | ---------: | ---------------: |
| Body on white                          |      18.10 |            104.8 |
| Secondary text on white                |       7.13 |             84.7 |
| Lightest magenta shimmer stop on white |       4.68 |             69.8 |
| White text on black badge              |      21.00 |            107.9 |
| Blue link hover on white               |       5.27 |             75.1 |

All authored OKLCH literals were checked against the sRGB gamut.

National flag red remains a semantic flag color. Pure white and black are
already OKLCH. No raster favicon artwork is recolored.

Every changed authored color is listed below, including alpha variants.

| Before                              | After                               |
| ----------------------------------- | ----------------------------------- |
| `oklch(0.151 0.03 261.872 / 0.12)`  | `oklch(0 0 0 / 0.12)`               |
| `oklch(0.151 0.03 261.872 / 0.14)`  | `oklch(0 0 0 / 0.14)`               |
| `oklch(0.151 0.03 261.872 / 0.18)`  | `oklch(0 0 0 / 0.18)`               |
| `oklch(0.151 0.03 261.872)`         | `oklch(0.245 0.113 262.398)`        |
| `oklch(0.151 0.03 261.872)`         | `oklch(0.345 0.159 262.398)`        |
| `oklch(0.185 0.005 248.107 / 0.34)` | `oklch(0.545 0.244 262.398)`        |
| `oklch(0.185 0.005 248.107)`        | `oklch(0 0 0)`                      |
| `oklch(0.213 0.008 264.379 / 0.47)` | `oklch(0.46 0 0)`                   |
| `oklch(0.213 0.008 264.379 / 0.48)` | `oklch(0.46 0 0)`                   |
| `oklch(0.213 0.008 264.379 / 0.5)`  | `oklch(0.46 0 0)`                   |
| `oklch(0.213 0.008 264.379 / 0.68)` | `oklch(0.46 0 0)`                   |
| `oklch(0.213 0.008 264.379 / 0.9)`  | `oklch(0.2 0 0 / 0.9)`              |
| `oklch(0.213 0.008 264.379)`        | `oklch(0.2 0 0)`                    |
| `oklch(0.22 0.007 248.165)`         | `oklch(0.16 0 0)`                   |
| `oklch(0.264 0.016 264.249 / 0.7)`  | `oklch(0.46 0 0)`                   |
| `oklch(0.373 0.13 262.31)`          | `oklch(0.445 0.205 262.398)`        |
| `oklch(0.373 0.13 262.31)`          | `oklch(0.545 0.244 262.398)`        |
| `oklch(0.617 0.253 355.343)`        | `oklch(0.54 0.218 1.313)`           |
| `oklch(0.692 0.198 21.503)`         | `oklch(1 0 0)`                      |
| `oklch(0.702 0.088 253.74)`         | `oklch(0.495 0.229 262.398)`        |
| `oklch(0.702 0.088 253.74)`         | `oklch(0.745 0.126 262.398)`        |
| `oklch(0.714 0.019 261.325)`        | `oklch(0.46 0 0)`                   |
| `oklch(0.818 0.114 355.343)`        | `oklch(0.565 0.228 1.313)`          |
| `oklch(0.849 0.083 17.077 / 0.42)`  | `oklch(0.845 0.074 262.398 / 0.42)` |
| `oklch(0.872 0.009 258.338)`        | `oklch(0.9 0 0)`                    |
| `oklch(0.892 0.063 355.343)`        | `oklch(0.590057 0.238555 1.313)`    |
| `oklch(0.922 0.016 239.116)`        | `oklch(0.495 0.229 262.398)`        |
| `oklch(0.928 0.006 264.531 / 0.7)`  | `oklch(0.9 0 0 / 0.7)`              |
| `oklch(0.928 0.006 264.531 / 0.85)` | `oklch(0.9 0 0 / 0.85)`             |
| `oklch(0.928 0.006 264.531)`        | `oklch(0.9 0 0)`                    |
| `oklch(0.931 0.003 264.541)`        | `oklch(0.88 0 0)`                   |
| `oklch(0.967 0.003 264.542)`        | `oklch(0.97 0 0)`                   |
| `oklch(0.972 0.003 247.858)`        | `oklch(0.945 0.025 262.398)`        |
| `oklch(0.979 0.003 264.542 / 0.62)` | `oklch(1 0 0)`                      |
| `oklch(0.979 0.003 264.542)`        | `oklch(1 0 0)`                      |
