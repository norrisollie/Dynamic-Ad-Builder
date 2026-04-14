import { log } from "./utilities/logStyles.js";
import { appendElement, createElement } from "./utilities/utilities.ts";

/**
 * Create frames based on the frameOrder array in the feed content
 * this will create a div for each frame and append it to the adContainer
 * e.g. if frames has keys "f1", "f2", "f3", it will create divs with classes "frame frame-1", "frame frame-2", "frame frame-3"
 * @param {Object} framesObject - An object containing frame keys
 * @returns {void}
 */
export const buildFrames = (formattedFeed) => {
    // var to store frame order string from metadata
    const frameOrderString = formattedFeed.metadata.frameOrder;
    // log frame order info
    log("BUILD", "Building frames:", [frameOrderString]);

    // var to store ad container
    const adContainer = document.getElementById("ad");

    // convert frameOrder string to array. Reversed to stack frames correctly when being appended to ad container
    const frameOrderArray = frameOrderString.split(",").reverse();

    // get template name from global config
    const templateName = formattedFeed.global.config.template;

    const isTemplateAttract = templateName && templateName.includes("attract");
    const isTemplateConvert = templateName && templateName.includes("convert");
    const isTemplateReserves =
        templateName && templateName.includes("reserves");

    // Determine class name based on template e.g template-attract template-[templateName] frame
    // frame number will be added when creating each frame
    const frameClassName = isTemplateAttract
        ? `template-attract template-${templateName} frame`
        : isTemplateConvert
        ? `template-convert template-${templateName} frame`
        : isTemplateReserves
        ? `template-reserves template-${templateName} frame`
        : "frame";

    // Loop through frameOrder array, create frame container and append to ad container
    if (isTemplateReserves || isTemplateConvert) {
        // handle reserves and convert templates the same way for now
        frameOrderArray.forEach((frameKey) => {
            // create frame containers
            const frameContainer = createElement(
                "div",
                `${frameClassName} frame-${frameKey}`,
                `frame-${frameKey}`,
                null
            );

            // append frame containers to ad container
            appendElement(adContainer, frameContainer);
        });
    } else if (isTemplateAttract) {
        // handle attract template
        frameOrderArray.forEach((frameKey) => {
            // create frame containers
            const frameContainer = createElement(
                "div",
                `${frameClassName} frame-${frameKey}`,
                `frame-${frameKey}`,
                null
            );

            // only create inner for frame 2 onwards
            if (frameKey !== "1") {
                const innerFrameContainer = createElement(
                    "div",
                    `template-${templateName} frame__inner frame-${frameKey}__inner`,
                    `frame-${frameKey}__inner`,
                    null
                );

                // append inner frame container to frame container
                appendElement(frameContainer, innerFrameContainer);
            } else {
                // no inner for frame 1
            }

            // append frame containers to ad container
            appendElement(adContainer, frameContainer);
        });
    } else {
        log("WARNING", "Unknown template for frame building:", [templateName]);
        return;
    }
};
