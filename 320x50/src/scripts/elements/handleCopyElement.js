import { log } from "../utilities/logStyles.js";
import { createAttractCopyElement } from "./createAttractCopyElement.js";
import { createReservesAndConvertCopyElement } from "./createReservesAndConvertCopyElement.js";
/* Create Copy Element and Append to Frame Container */

/**
 *
 * Function that handles the creation of copy elements within frames. It works by taking in various parameters related to the frame and copy element details, including configuration options for text resizing. The function splits the provided copy text by <br> tags, creates the necessary HTML elements, and appends them to the specified container in the DOM.
 * @param {*} frameNumber
 * @param {*} objectKey
 * @param {*} objectValue
 * @param {*} configKey
 * @param {*} configValue
 * @param {*} tagName
 * @param {*} containerToAppend
 * @param {*} isTextResizeEnabled
 */
export const handleCopyElement = (
    templateName,
    isFrameElement,
    frameNumber,
    objectKey,
    objectValue,
    configKey,
    configValue,
    tagName = "div",
    containerToAppend,
    isTextResizeEnabled = false
) => {
    const isTemplateAttract = templateName && templateName.includes("attract");
    const isTemplateConvert = templateName && templateName.includes("convert");
    const isTemplateReserves =
        templateName && templateName.includes("reserves");

    // Check if template is one of the known templates, add another else if for each new template copy structure if needed
    // default copy structure for most templates
    if (isTemplateConvert || isTemplateReserves) {
        createReservesAndConvertCopyElement(
            templateName,
            isFrameElement,
            frameNumber,
            objectKey,
            objectValue,
            tagName,
            containerToAppend,
            isTextResizeEnabled
        );
    } else if (isTemplateAttract) {
        createAttractCopyElement(
            templateName,
            isFrameElement,
            frameNumber,
            objectKey,
            objectValue,
            tagName,
            containerToAppend,
            isTextResizeEnabled
        );
    } else {
        log("WARNING", "Unknown template for copy element:", [templateName]);
    }
};
