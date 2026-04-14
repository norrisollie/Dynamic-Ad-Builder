// src/animation.js
// This module handles the animation logic for the ad

import { attractAnimation } from "./animation/attract.js";
import { convertAnimation } from "./animation/convert.js";
import { reservesAnimation } from "./animation/reserves.js";
import { log } from "./utilities/logStyles.js";

/* src/animation.js
 * This module handles the animation logic for the ad
 * It selects and runs the appropriate animation based on the ad template
 * @param {Object} formattedFeed - The formatted feed data containing metadata for the ad
 * @returns {void}
 */
export const handleAnimation = (formattedFeed) => {
    // destructure properties from formattedFeed metadata object
    const { frameOrder } = formattedFeed.metadata;
    const { template, frameDwellTime } = formattedFeed.global.config;

    // log template and frame order info
    log("ANIMATE", "Template:", [
        template,
        "| Frame Order:",
        frameOrder,
        "| Frame Dwell Time:",
        `${frameDwellTime}s`,
    ]);

    // handle template names for animation selection
    const isTemplateReserves =
        template.startsWith("reserves") || template.includes("reserves");
    const isTemplateAttract =
        template.startsWith("attract") || template.includes("attract");
    const isTemplateConvert =
        template.startsWith("convert") || template.includes("convert");

    // template specific animation, e.g reserves, attract, convert
    if (isTemplateReserves) {
        // reserves template animation
        reservesAnimation(formattedFeed);
    } else if (isTemplateAttract) {
        // attract template animation
        attractAnimation(formattedFeed);
    } else if (isTemplateConvert) {
        // convert template animation
        convertAnimation(formattedFeed);
    } else {
        // warning for undefined templates
        log("INIT", "No animation defined for template:", [template]);
    }
};
