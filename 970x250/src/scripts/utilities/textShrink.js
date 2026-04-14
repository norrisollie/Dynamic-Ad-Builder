import { log } from "./logStyles.js";

/* Auto Text Shrink for .frame__copy elements with .text-shrink lines
 * Shrinks each line with .text-shrink to fit its own width,
 * then scales the entire .frame__copy to fit within its .frame__copy-container height.
 * @param {number} min - Minimum font size in pixels (default: 10).
 * @returns {boolean} True when complete.
 */
export const autoTextShrink = function (min = 10) {
    const copies = document.querySelectorAll(".frame__copy");

    log("TEXT", "Resizing text elements:", [`${copies.length} found`]);

    for (let i = 0; i < copies.length; i++) {
        fitFrameCopy(copies[i], min);
    }
    return true;
};

// === Fit .frame__copy inside its .frame__copy-container =====================
function fitFrameCopy(copyEl, min) {
    if (!copyEl) return;

    const wrapper = copyEl.closest(".frame__copy-container");
    if (!wrapper) return;

    // Derive frame number from the closest frame id, e.g. #frame-1
    let frameNumber = null;
    const frameEl = copyEl.closest(".frame");
    if (frameEl && frameEl.id) {
        const match = frameEl.id.match(/frame-(\d+)/);
        if (match) {
            frameNumber = match[1];
        }
    }

    // Step 1: shrink .text-shrink lines individually to fit width
    const lines = copyEl.querySelectorAll(".text-shrink");
    const lineSummaries = [];

    for (let i = 0; i < lines.length; i++) {
        const lineEl = lines[i];
        const finalSize = shrinkLineToOwnContentBox(lineEl, min);

        const text = (lineEl.textContent || "").trim();
        if (text) {
            lineSummaries.push({
                text,
                size: finalSize,
            });
        }
    }

    if (lineSummaries.length && frameNumber !== null) {
        const frameLabel = `F${frameNumber}`;
        const message = `Text Resized: ${frameLabel}:`;
        log("TEXT", message, [lineSummaries]);
    }

    // Step 2: scale .frame__copy vertically if escaping container
    scaleToFitContainerHeight(copyEl, wrapper);
}

// === Step 1: Binary search font shrink (content-box fit) ====================
function shrinkLineToOwnContentBox(lineEl, min = 10) {
    const original = lineEl.getFontSize();
    let low = min;
    let high = original;

    // Measure available width from the parent container so the line
    // shrinks to fit its parent, not its initial own width.
    const parent = lineEl.parentElement || lineEl;
    const style = getComputedStyle(parent);
    const paddingLeft = parseFloat(style.paddingLeft || 0);
    const paddingRight = parseFloat(style.paddingRight || 0);
    const availableWidth = parent.clientWidth - (paddingLeft + paddingRight);

    if (availableWidth <= 0) return original;

    while (high - low > 0.5) {
        const mid = (low + high) / 2;
        lineEl.setFontSize(mid);

        const fits = lineEl.scrollWidth <= availableWidth;
        if (fits) low = mid;
        else high = mid;
    }

    lineEl.setFontSize(low);
    return low;
}

function scaleToFitContainerHeight(copyEl, wrapperEl) {
    copyEl.style.transform = "scale(1)";
    copyEl.style.transformOrigin = "center";
    void copyEl.offsetWidth; // reflow

    const wrapperStyle = getComputedStyle(wrapperEl);
    const paddingTop = parseFloat(wrapperStyle.paddingTop || 0);
    const paddingBottom = parseFloat(wrapperStyle.paddingBottom || 0);
    const contentTop = wrapperEl.getBoundingClientRect().top + paddingTop;
    const contentBottom =
        wrapperEl.getBoundingClientRect().bottom - paddingBottom;

    const copyRect = copyEl.getBoundingClientRect();

    // check if .frame__copy extends beyond the content box
    const overTop = copyRect.top < contentTop;
    const overBottom = copyRect.bottom > contentBottom;
    if (!overTop && !overBottom) return; // fits fine

    let scale = 1;
    const step = 0.01;
    let fits = false;

    while (!fits && scale > 0.1) {
        scale -= step;
        copyEl.style.transform = `scale(${scale})`;
        const newRect = copyEl.getBoundingClientRect();
        fits =
            newRect.top >= contentTop - 0.5 &&
            newRect.bottom <= contentBottom + 0.5;
    }
}

HTMLElement.prototype.setFontSize = function (size) {
    this.style.fontSize = `${parseFloat(size)}px`;
};

HTMLElement.prototype.getFontSize = function () {
    return parseFloat(getComputedStyle(this).fontSize) || 0;
};
