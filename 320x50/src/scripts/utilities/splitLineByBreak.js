/* Splits a text string by <br> tags and wraps each line in a div element.
 * Optionally adds a 'text-shrink' class to each line for text resizing.
 * @param {string} textString - The text string to be split.
 * @param {boolean} isTextResizeEnabled - Whether to add 'text-shrink' class for resizing.
 * @returns {string[]} Array of HTML strings, each representing a line wrapped in a div.
 */

export const splitLineByBreak = (textString, isTextResizeEnabled = false) => {
    if (!textString || typeof textString !== "string") {
        return [];
    }
    const regex = /<\s*br\s*\/?\s*>/i;

    // split text string by <br> or <br/> or <br /> tags
    const textToSplit = textString.split(regex);

    // remove br tags that may have been left in the text
    const textToSplitCleaned = textToSplit.map((line) =>
        line.replace(regex, "").trim()
    );

    let lineCount = 0; // initialise line counter

    // map through the array of split text and wrap each line in a div with class text-shrink and copy
    const arrayOfCopyElements = textToSplitCleaned.map((line) => {
        lineCount++; // increment line counter, starts at 1
        return `<div class="frame__copy-line ${
            isTextResizeEnabled ? "text-shrink" : ""
        }" id="frame__copy-line-${lineCount}">${line}</div>`; // e.g
    });

    return arrayOfCopyElements;
};
