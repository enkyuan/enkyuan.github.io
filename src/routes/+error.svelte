<script lang="ts">
    import { page } from "$app/state";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import Button from "../lib/components/ui/button.svelte";
    import { DOT_PATTERNS, CHAR_W, CHAR_H } from "$lib/constants/digits";

    const CHAR_GAP = 0;

    function computeKern(left: string, right: string): number {
        const lp = DOT_PATTERNS[left] ?? DOT_PATTERNS["0"];
        const rp = DOT_PATTERNS[right] ?? DOT_PATTERNS["0"];
        let minGap = CHAR_W;
        for (let r = 0; r < CHAR_H; r++) {
            let rightmost = -1;
            for (let c = CHAR_W - 1; c >= 0; c--) {
                if (lp[r]?.[c] === 1) {
                    rightmost = c;
                    break;
                }
            }
            let leftmost = CHAR_W;
            for (let c = 0; c < CHAR_W; c++) {
                if (rp[r]?.[c] === 1) {
                    leftmost = c;
                    break;
                }
            }
            if (rightmost === -1 || leftmost === CHAR_W) continue;
            const gap = CHAR_W - 1 - rightmost + leftmost;
            if (gap < minGap) minGap = gap;
        }
        return Math.max(0, minGap);
    }

    const ERROR_CODES: Record<number, string> = {
        400: "Bad Request",
        401: "Unauthorized",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        418: "I'm a Teapot",
        422: "Unprocessable Entity",
        429: "Too Many Requests",
        500: "Internal Server Error",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
    };

    let status = $derived(page.status);
    let digits = $derived(String(status).split(""));
    let errorMessage = $derived(
        page.error?.message || ERROR_CODES[status] || "Unknown Error",
    );

    let fieldEl: HTMLDivElement | undefined = $state();
    let gridCols = $state(0);
    let ready = $state(false);
    const gridRows = CHAR_H + 2;

    let kerns = $derived.by(() => {
        const k: number[] = [];
        for (let i = 0; i < digits.length - 1; i++) {
            k.push(computeKern(digits[i], digits[i + 1]));
        }
        return k;
    });

    function getCodeWidth(): number {
        let w = digits.length * CHAR_W + (digits.length - 1) * CHAR_GAP;
        for (const k of kerns) w -= k;
        return w;
    }

    function isFilledAt(row: number, colInCode: number): boolean {
        let x = colInCode;
        for (let d = 0; d < digits.length; d++) {
            if (x < CHAR_W) {
                const pattern = DOT_PATTERNS[digits[d]] ?? DOT_PATTERNS["0"];
                return pattern[row]?.[x] === 1;
            }
            x -= CHAR_W;
            if (d < digits.length - 1) {
                const gap = CHAR_GAP - kerns[d];
                if (gap > 0 && x < gap) return false;
                x -= gap;
            }
        }
        return false;
    }

    function measureGrid() {
        if (!fieldEl) return;
        const style = getComputedStyle(fieldEl);
        const dotSize = parseFloat(style.getPropertyValue("--dot-size")) || 12;
        const dotGap = parseFloat(style.getPropertyValue("--dot-gap")) || 8;
        const paddingX =
            parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const availW = fieldEl.clientWidth - paddingX;
        gridCols = Math.floor((availW + dotGap) / (dotSize + dotGap));
    }

    onMount(() => {
        measureGrid();
        ready = true;
        const ro = new ResizeObserver(() => measureGrid());
        if (fieldEl) ro.observe(fieldEl);
        return () => ro.disconnect();
    });

    let codeWidth = $derived(getCodeWidth());
    let spacingBetween = $derived(Math.max(10, Math.floor(gridCols * 0.32)));
    let repeatUnit = $derived(codeWidth + spacingBetween);

    let charRowOffset = 1;

    let carvedMap = $derived.by(() => {
        if (gridCols === 0) return [];
        const totalCols = gridCols * 3;
        const emptyRow = new Array(totalCols).fill(false);

        const unitTemplates: boolean[][] = [];
        for (let charRow = 0; charRow < CHAR_H; charRow++) {
            const unit: boolean[] = [];
            for (let c = 0; c < repeatUnit; c++) {
                unit.push(c < codeWidth && isFilledAt(charRow, c));
            }
            unitTemplates.push(unit);
        }

        const rows: boolean[][] = [];
        for (let r = 0; r < gridRows; r++) {
            const charRow = r - charRowOffset;
            if (charRow < 0 || charRow >= CHAR_H) {
                rows.push(emptyRow);
                continue;
            }
            const unit = unitTemplates[charRow];
            const row = new Array(totalCols);
            for (let c = 0; c < totalCols; c++) {
                row[c] = unit[c % repeatUnit];
            }
            rows.push(row);
        }
        return rows;
    });
</script>

<div class="error-container">
    <div class="error-content">
        <h3 class="error-label">{errorMessage}</h3>
        <div style="margin-top: 0.5rem;">
            <Button onclick={() => goto("/")}>Return home</Button>
        </div>
    </div>

    <div class="dot-field" class:visible={ready} bind:this={fieldEl}>
        {#if gridCols > 0 && carvedMap.length > 0}
            <div class="dot-viewport">
                <div
                    class="dot-scroll-track"
                    style="animation-duration: {Math.max(
                        12,
                        repeatUnit * 0.3,
                    )}s"
                >
                    {#each carvedMap as row}
                        <div class="dot-row">
                            {#each row as carved}
                                <span class="dot" class:carved></span>
                            {/each}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .error-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #fff;
        display: flex;
        flex-direction: column;
        z-index: 9999;
        overflow: hidden;
    }

    .error-content {
        text-align: center;
        color: #000;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        flex: 1;
        justify-content: center;
    }

    .error-label {
        font-weight: 500;
        font-size: 1.1rem;
        color: #000;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        opacity: 0.6;
    }

    .dot-field {
        --dot-size: 12px;
        --dot-gap: 8px;
        width: 100%;
        flex-shrink: 0;
        overflow: hidden;
        padding: 0 2.5rem 2.5rem;
        margin-top: auto;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .dot-field.visible {
        opacity: 1;
    }

    .dot-viewport {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .dot-scroll-track {
        display: flex;
        flex-direction: column;
        gap: var(--dot-gap);
        width: max-content;
        animation: dot-marquee 20s linear infinite;
    }

    .dot-row {
        display: flex;
        gap: var(--dot-gap);
    }

    .dot {
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 50%;
        background: #f3f4f6;
        flex-shrink: 0;
    }

    .dot.carved {
        visibility: hidden;
    }

    @keyframes dot-marquee {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-33.333%);
        }
    }

    @media (max-width: 767px) {
        .dot-field {
            --dot-size: 8px;
            --dot-gap: 5px;
            padding: 0 1rem 1rem;
        }
    }

    @media (min-width: 768px) {
        .dot-field {
            --dot-size: 12px;
            --dot-gap: 8px;
        }
    }

    @media (min-width: 1024px) {
        .dot-field {
            --dot-size: 16px;
            --dot-gap: 10px;
        }
    }
</style>
