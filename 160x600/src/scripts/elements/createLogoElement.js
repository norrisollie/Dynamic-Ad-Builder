import { appendElement, createElement } from "../utilities/utilities";

export const createLogoElement = (
    templateName,
    isFrameElement,
    frameNumber
) => {
    const isTemplateAttract = templateName && templateName.includes("attract");
    const isTemplateConvert = templateName && templateName.includes("convert");
    const isTemplateReserves =
        templateName && templateName.includes("reserves");

    const isTemplateRoyalMarines = templateName.includes("royal-marines");

    let container = null;
    let logoClass = null;

    if (isFrameElement) {
        // if frame element
        // set container to frame
        container = document.querySelector(`.frame-${frameNumber}__inner`);

        // set logo class based on template
        logoClass = isTemplateAttract
            ? "frame__logo frame__logo-attract"
            : isTemplateConvert
              ? "frame__logo frame__logo-convert"
              : isTemplateReserves
                ? "frame__logo frame__logo-reserves"
                : "frame__logo";
    } else {
        container = document.querySelector(".global");
        logoClass = "global__logo";
    }

    let logoUrl = null; // null by default

    // determine logo url based on template, if marines, attract/convert or reserves
    if (isTemplateRoyalMarines) {
        // if attract or convert marines template, set to marines logo
        logoUrl = "/assets/images/royal-marines-logo.png";
    } else if (isTemplateAttract || isTemplateConvert) {
        // if attract template, set to colour logo
        logoUrl = "/assets/images/royal-navy-logo-colour.png";
    } else if (isTemplateReserves) {
        // if reserves template, set to flat logo
        logoUrl = "/assets/images/royal-navy-flat.svg";
    }

    const logoElement = createElement("img", logoClass, null, logoUrl);

    appendElement(container, logoElement);

    // trim template to get
};
