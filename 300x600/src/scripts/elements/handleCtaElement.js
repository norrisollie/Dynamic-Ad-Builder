import { log } from "../utilities/logStyles.js";
import { appendElement, createElement } from "../utilities/utilities.ts";

/**
 * Create CTA button and optional CTA icon, then append to the provided container.
 *
 * Expected keys in global data:
 * - cta: button text / config
 * - cta_icon: image config for the icon (optional)
 */
export const handleCtaElement = (
    templateName,
    isFrameElement,
    frameNumber,
    elementKey,
    elementValue,
    configObject,
    containerToAppend
) => {
    log("CTA", "Creating CTA element with config:", [
        elementKey,
        elementValue,
        configObject,
        containerToAppend,
        templateName,
    ]);

    if (!containerToAppend) return; // checks if containerToAppend is valid and if not, exits the function early.

    const isTemplateAttract = templateName && templateName.includes("attract");
    const isTemplateConvert = templateName && templateName.includes("convert");
    const isTemplateReserves =
        templateName && templateName.includes("reserves");

    // Check if template is one of the known templates, add another else if for each new template CTA structure if needed
    // if attract, convert or reserves template then create CTA element
    if (isTemplateAttract || isTemplateConvert || isTemplateReserves) {
        log("CTA", "Creating CTA for template:", [templateName]);
    } else {
        log("WARNING", "Unknown template for CTA element:", [templateName]);
        return;
    }

    // Initialise iconImageValue to null
    let iconImageValue = null;
    let ctaIcon = null;

    // create cta button element - shared structure for current templates
    const ctaButton = createElement(
        "div",
        `${
            isFrameElement
                ? `frame${frameNumber}__${elementKey}`
                : `global__${elementKey}`
        }`, // class name is frameX__cta or global__cta
        `${
            isFrameElement ? `frame${frameNumber}__${elementKey}` : "global__"
        }${elementKey}`,
        elementValue
    );

    // check for cta_icon in config object and get url if exists
    if (configObject.hasOwnProperty("cta_icon")) {
        log("CTA", "Creating CTA icon element for:", [elementKey]);
        // If a CTA icon value is provided, create and append the icon
        iconImageValue = configObject["cta_icon"];

        log("CTA", "CTA Icon Value:", [iconImageValue]);

        ctaIcon = createElement(
            "img",
            `${
                isFrameElement
                    ? `frame${frameNumber}__${elementKey}-icon`
                    : `global__${elementKey}-icon`
            }`, // class name is frameX__cta-icon or global__cta-icon
            `${
                isFrameElement
                    ? `frame${frameNumber}__${elementKey}-icon`
                    : `global__${elementKey}-icon`
            }`,
            iconImageValue
        );

        // append icon to cta button
        appendElement(ctaButton, ctaIcon);
    } else {
        log("CTA", "No CTA icon found for:", [elementKey]);
    }

    // append cta button to container
    appendElement(containerToAppend, ctaButton);
};
