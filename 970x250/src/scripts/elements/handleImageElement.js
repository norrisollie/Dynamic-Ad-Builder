import { log } from "../utilities/logStyles.js";
import { appendElement, createElement } from "../utilities/utilities.ts";

/* Create Image Element and Append to Frame Container*/
export const handleImageElement = (
    templateName,
    isFrameElement,
    frameNumber,
    elementKey,
    elementValue,
    tagName = "img",
    container
) => {
    // check for empty in image url to avoid creating empty image elements
    const isValidImage = !elementValue.endsWith("empty.png");

    if (isValidImage) {
        log("IMAGE", "Creating image element:", [
            "Key" + elementKey,
            "Value" + elementValue,
            "template: " + templateName,
        ]);

        const isTemplateAttract =
            templateName && templateName.includes("attract");
        const isTemplateConvert =
            templateName && templateName.includes("convert");
        const isTemplateReserves =
            templateName && templateName.includes("reserves");

        // checks to see if it's a frame or global element and assigns container accordingly
        if (isFrameElement) {
            container = document.querySelector(`.frame-${frameNumber}`);
        } else {
            container = document.querySelector(".global");
        }

        // Check if template is one of the known templates, add another else if for each new template image structure if needed
        // if attract, convert or reserves template then create image element
        if (isTemplateReserves) {
            // log creating image for convert or reserves template
            log("IMAGE", "Creating image for convert or reserves template:", [
                templateName,
            ]);

            // define class and id names based on whether it's a frame or global element
            let className = "";
            let idName = "";

            // assign class and id names (shared structure for current templates)
            if (isFrameElement) {
                className = `frame__${elementKey} frame-${frameNumber}__${elementKey}`; // e.g. frame__image frame-1__image
                idName = `frame-${frameNumber}__${elementKey}`; // e.g. frame-1__image
            } else {
                className = `global__${elementKey}`; // e.g. global__logo
                idName = `global__${elementKey}`; // e.g. global__logo
            }

            // create image element
            const imageElement = createElement(
                tagName,
                className,
                idName,
                elementValue
            );

            // append image element to container
            appendElement(container, imageElement);
        } else if (isTemplateAttract) {
            // if attract template then create image element
            log("IMAGE", "Creating image for attract template:", [
                templateName,
            ]);

            // set container to inner frame X if frame, global remains same
            if (isFrameElement) {
                container = container.querySelector(
                    `.frame-${frameNumber}__inner`
                );
            }

            // create image element
            const imageElement = createElement(
                tagName,
                `${isFrameElement ? "frame__" : "global__"}image ${
                    isFrameElement
                        ? `frame-${frameNumber}__image`
                        : "global__image"
                }`,
                isFrameElement
                    ? `frame-${frameNumber}__image`
                    : "global__image",
                elementValue
            );

            // append image element to container
            appendElement(container, imageElement);
        } else if (isTemplateConvert) {
            // if attract template then create image element
            log("IMAGE", "Creating image for attract template:", [
                templateName,
            ]);

            // create image container
            const imageContainer = createElement(
                "div",
                `${isFrameElement ? "frame__" : "global__"}image-container ${
                    isFrameElement
                        ? `frame-${frameNumber}__image-container`
                        : "global__image-container"
                }`,
                `${
                    isFrameElement
                        ? `frame-${frameNumber}__image-container`
                        : "global__image-container"
                }`
            );

            // create image element
            const imageElement = createElement(
                tagName,
                `${isFrameElement ? "frame__" : "global__"}image ${
                    isFrameElement ? "frame-" : "global-"
                }${frameNumber}__image`,
                `${isFrameElement ? "frame-" : "global-"}${frameNumber}__image`,
                elementValue
            );

            // append image to image container
            appendElement(imageContainer, imageElement);

            // append image container to frame or global container
            appendElement(container, imageContainer);
        } else {
            log("WARNING", "Unknown template for image element:", [
                templateName,
            ]);
            return;
        }
    } else {
        log("IMAGE", "Skipping empty image:", [elementKey]);
    }
};
