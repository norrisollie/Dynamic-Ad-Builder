import { createLogoElement } from "./elements/createLogoElement.js";
import { handleCtaElement } from "./elements/handleCtaElement.js";
import { handleImageElement } from "./elements/handleImageElement.js";
import { log } from "./utilities/logStyles.js";
import {
    appendElement,
    assignTagNameFromObjectKey,
    createElement,
} from "./utilities/utilities.ts";

/** Builds global elements based on the provided global object.
 * @param {Object} globalObject - An object containing global elements and optional config.
 * Example structure:
 * global: {
 *   elements: {
 *     cta: "Shop Now",
 *     logo: "path/to/logo.png"
 *   },
 *   config: {
 *     cta_icon: "path/to/cta_icon.png"
 *   }
 * },
 *
 *
 * @returns {void}
 */
export const buildGlobalElements = (formattedFeed) => {
    log("GLOBAL", "Creating global container");

    const globalObject = formattedFeed.global || {};

    const isFrameElement = false; // Placeholder variable to indicate it's a global element, to be passed to functions to handle global/frame logic

    // Variable to store ad container
    const adContainer = document.querySelector("#ad");

    const templateName = formattedFeed.global?.config?.template;

    const isTemplateAttract = templateName && templateName.includes("attract");
    const isTemplateConvert = templateName && templateName.includes("convert");
    const isTemplateReserves =
        templateName && templateName.includes("reserves");

    // Determine class name based on template e.g
    const className = isTemplateAttract
        ? `template-attract template-${templateName} global`
        : isTemplateConvert
        ? `template-convert template-${templateName} global`
        : isTemplateReserves
        ? `template-reserves template-${templateName} global`
        : "global";

    // Create global container and append to ad container
    const globalContainerElement = createElement(
        "div",
        templateName ? `${className}` : "global",
        null,
        null
    );

    // Append global container to ad container
    appendElement(adContainer, globalContainerElement);

    // Variable to store global container
    const globalContainer = document.querySelector(".global");

    // Variable to store config object from global object. Empty object if there is no config in feed.
    // Turn to array to allow for easier looping.
    const globalConfigObject = globalObject.config || {};

    // Variable to store elements object from global object
    const globalElementsObject = Object.entries(globalObject.elements || {});

    if (isTemplateAttract) {
        // create element for grid background .visual-grid
        const visualGridElement = createElement(
            "div",
            "global__visual-grid",
            "global__visual-grid",
            null
        );
        appendElement(globalContainer, visualGridElement);
    } else if (isTemplateConvert || isTemplateReserves) {
        // create logo in global for convert and reserves templates
        // attract handled in frame ONLY see buildFrameElements.js
        createLogoElement(templateName, isFrameElement);
    } else {
        log("GLOBAL", "No visual grid for template:", [templateName]);
    }

    // Loop to get each global element key and value.
    // No need to loop through config as you can get the config value by key when needed
    globalElementsObject.forEach((element) => {
        const [globalElementKey, globalElementValue] = element;

        // Check if global element is a cta
        const checkForCta = globalElementKey.startsWith("cta"); // returns true or false
        const keyStartsWithImageOrBg =
            globalElementKey.startsWith("image") ||
            globalElementKey.startsWith("bg");

        // Handle any other global elements
        // assign tag name based on object key
        const tagName = assignTagNameFromObjectKey(globalElementKey);

        // If statement to check if there is a cta element in the global elements object
        if (checkForCta) {
            // cta exists, call createCtaElement
            // pass in global object for config access
            handleCtaElement(
                templateName,
                isFrameElement,
                null, // no frame number for global elements
                globalElementKey,
                globalElementValue,
                globalConfigObject,
                globalContainer
            );
        } else if (keyStartsWithImageOrBg) {
            // handle image or bg elements
            handleImageElement(
                templateName,
                isFrameElement,
                null, // no frame number for global elements
                globalElementKey,
                globalElementValue
            );
        } else {
            // Log creation of global element
            log("GLOBAL", "Creating global element:", [
                globalElementKey,
                globalElementValue,
            ]);

            // Create global element
            const globalElement = createElement(
                tagName,
                `global__${globalElementKey}`,
                `global__${globalElementKey}`,
                globalElementValue
            );

            // Append global element to global container
            appendElement(globalContainer, globalElement);
        }
    });
};
