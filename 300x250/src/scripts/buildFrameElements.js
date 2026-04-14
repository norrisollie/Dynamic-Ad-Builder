import { createLogoElement } from "./elements/createLogoElement.js";
import { handleCopyElement } from "./elements/handleCopyElement.js";
import { handleImageElement } from "./elements/handleImageElement.js";
import { log } from "./utilities/logStyles.js";
import {
    appendElement,
    assignTagNameFromObjectKey,
    createElement,
} from "./utilities/utilities.ts";

/**
 * Builds and appends frame elements to their corresponding frame containers.
 *
 * @param {Object} framesObject - An object containing frame data.
 * Each key represents a frame ID (e.g. "frame1", "frame2"), and its value is
 * an object describing the elements to be created within that frame.
 *
 * Example structure:
 * {
 *   frame1: {
 *     copy1: "Welcome",
 *     img1: "path/to/image.png",
 *     cta: "Shop Now"
 *
 *   frame2: {
 *     copy1: "Discover more",
 *     img1: "path/to/next.png"
 *   }
 * }
 *
 * @returns {void}
 */
export const buildFrameElements = (feed) => {
    const framesObject = feed.frames;

    log("BUILD", "Building frame elements:", [framesObject]);

    const framesObjectEntries = Object.entries(framesObject || {});

    // loop through frames, create frame elements and append to respective frame containers as specified in frames object
    framesObjectEntries.forEach(([frameNumber, frameData]) => {
        let frameContainer = null;
        const frameElementEntries = Object.entries(frameData.elements);
        const frameConfig = frameData.config;

        // log frame config if exists
        log("CONFIG", "Frame config:", [frameConfig]);

        const isFrameElement = true; // indicates it's a frame element
        const templateName = feed.global.config.template;

        // is template convert, reserves or attract
        const isTemplateAttract =
            templateName && templateName.includes("attract");
        const isTemplateConvert =
            templateName && templateName.includes("convert");
        const isTemplateReserves =
            templateName && templateName.includes("reserves");

        // create logo for frame elements once per frame
        // only for attract template and not for F1
        if (isTemplateAttract && frameNumber !== "1") {
            createLogoElement(templateName, isFrameElement, frameNumber);
        }

        // loop through frame objects
        frameElementEntries.forEach(([frameElementKey, frameElementValue]) => {
            log("BUILD", "Creating frame element:", [
                "Element: " + frameElementKey,
                " | ",
                "Value: " + frameElementValue,
            ]);

            // if attract
            if (isTemplateAttract) {
                // handle F1
                if (frameNumber === "1") {
                    frameContainer = document.querySelector(
                        `.frame-${frameNumber}`
                    );
                } else {
                    // handle F2, F3, F4 etc. put in inner
                    frameContainer = document.querySelector(
                        `.frame-${frameNumber}__inner`
                    );
                }
            } else if (isTemplateConvert || isTemplateReserves) {
                // for convert and reserves, all frames go into frame
                frameContainer = document.querySelector(
                    `.frame-${frameNumber}`
                );
            } else {
                log("WARNING", "Unknown template for frame element:", [
                    feed.global.config.template,
                ]);
            }

            // Assign tag name based on object key
            const tagName = assignTagNameFromObjectKey(frameElementKey);

            // get config value for frame element if exists
            // x.find to return undefined if not found and replace with null to show no config values
            const [frameConfigKey, frameConfigValue] = Object.entries(
                frameConfig
            ).find(([key]) => key === frameElementKey) || [null, null]; //

            // check for auto resize config value
            //  if not set, default to false
            const isTextResizeEnabled =
                frameConfig.isTextResizeEnabled || false;

            // Check if element key starts with 'copy',
            const keyStartsWithCopy = frameElementKey.startsWith("copy");

            // Check if element key starts with 'image' or 'bg'
            const keyStartsWithImageOrBg =
                frameElementKey.startsWith("image") ||
                frameElementKey.startsWith("bg");

            // Check if frame element value exists for other elements
            const frameElementValueExists = Boolean(frameElementValue);

            if (keyStartsWithCopy) {
                // handle copy elements
                handleCopyElement(
                    templateName,
                    isFrameElement,
                    frameNumber,
                    frameElementKey,
                    frameElementValue,
                    frameConfigKey,
                    frameConfigValue,
                    tagName,
                    frameContainer,
                    isTextResizeEnabled
                );
            } else if (keyStartsWithImageOrBg) {
                // handle image or bg elements
                handleImageElement(
                    templateName,
                    isFrameElement,
                    frameNumber,
                    frameElementKey,
                    frameElementValue,
                    tagName,
                    frameContainer
                );
            } else if (frameElementValueExists) {
                // handle other elements like shapes, lines, etc.
                const frameElement = createElement(
                    tagName,
                    `frame__${frameElementKey} frame-${frameNumber}__${frameElementKey}`,
                    `frame-${frameNumber}__${frameElementKey}`,
                    frameElementValue
                );
                appendElement(frameContainer, frameElement);
            } else {
                // log skipping element
                log("BUILD", "Skipping element (no value):", [frameElementKey]);
            }
        });
    });
};
