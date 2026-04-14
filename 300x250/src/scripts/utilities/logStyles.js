const styles = {
    IMAGE: "background:#00BCD4; color:#fff; padding:2px 6px; border-radius:4px;",
    BUILD: "background:#4CAF50; color:#fff; padding:2px 6px; border-radius:4px;",
    COPY: "background:#E91E63; color:#fff; padding:2px 6px; border-radius:4px;",
    GLOBAL: "background:#673AB7; color:#fff; padding:2px 6px; border-radius:4px;",
    FEED: "background:#2196F3; color:#fff; padding:2px 6px; border-radius:4px;",
    ANIMATE:
        "background:#9C27B0; color:#fff; padding:2px 6px; border-radius:4px;",
    INIT: "background:#607D8B; color:#fff; padding:2px 6px; border-radius:4px;",
    WARNING:
        "background:#FF9800; color:#fff; padding:2px 6px; border-radius:4px;",
    CLICK: "background:#9E9E9E; color:#fff; padding:2px 6px; border-radius:4px;",
    TEXT: "background:#FF5722; color:#fff; padding:2px 6px; border-radius:4px;",
    ERROR: "background:#F44336; color:#fff; padding:2px 6px; border-radius:4px;",
};

const textStyles = {
    IMAGE: "color:#00BCD4; font-weight:bold;",
    BUILD: "color:#4CAF50; font-weight:bold;",
    COPY: "color:#E91E63; font-weight:bold;",
    GLOBAL: "color:#673AB7; font-weight:bold;",
    FEED: "color:#2196F3; font-weight:bold;",
    ANIMATE: "color:#9C27B0; font-weight:bold;",
    INIT: "color:#607D8B; font-weight:bold;",
    WARNING: "color:#FF9800; font-weight:bold;",
    CLICK: "color:#9E9E9E; font-weight:bold;",
    TEXT: "color:#FF5722; font-weight:bold;",
    ERROR: "color:#F44336; font-weight:bold;",
};

/**
 * Unified logging function with styled output
 * @param {string} type - Log type (IMAGE, BUILD, COPY, etc.)
 * @param {string} message - The message to log
 * @param {any[]} args - Additional arguments to log (objects will be logged separately)
 * @param {string} level - Console method to use: 'log', 'warn', or 'error'
 */
export const log = (type, message, args = [], level = "log") => {
    const badge = styles[type] || styles.BUILD;
    const text = textStyles[type] || textStyles.BUILD;
    const highlight = "color:#000;";

    // Build the format string with appropriate placeholders
    let format = `%c[${type}]%c ${message}`;
    const formatArgs = [badge, text];

    args.forEach((arg) => {
        if (arg !== null && typeof arg === "object") {
            // Use %o for objects to get proper formatting
            format += " %o";
            formatArgs.push(arg);
        } else {
            // Use %c%s for primitives with highlight color
            format += " %c%s";
            formatArgs.push(highlight);
            formatArgs.push(arg);
        }
    });

    console[level](format, ...formatArgs);
};

// Backwards compatibility
export const logStyles = (type) => ({
    badge: styles[type],
    text: textStyles[type],
    highlight: "color:#000;",
});
