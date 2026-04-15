import { log } from "../utilities/logStyles.js";
import { splitLineByBreak } from "../utilities/splitLineByBreak.js";
import { appendElement, createElement } from "../utilities/utilities.ts";

/**
 * Creates and appends the copy element structure specific to "attract" templates.
 */
export const createAttractCopyElement = (
    templateName,
    isFrameElement,
    frameNumber,
    objectKey,
    objectValue,
    tagName,
    containerToAppend,
    isTextResizeEnabled = false
) => {
    // Create class name for copy element
    const copyClass = `${isFrameElement ? "frame__copy" : "global__copy"} ${
        isFrameElement ? "frame-" : "global-"
    }${frameNumber}__${objectKey}`;

    // Create ID name for copy element
    const copyId = `${
        isFrameElement ? "frame-" : "global-"
    }${frameNumber}__${objectKey}`;

    let text = objectValue;

    if (frameNumber === 1 || frameNumber === "1") {
        // keep text as is on f1
        text = objectValue;
    } else {
        // if not f1, split by <br> tags
        text = splitLineByBreak(objectValue, isTextResizeEnabled);
    }

    // Handle different structure for frame 1 for Attract template
    if (frameNumber === "1") {
        log(
            "COPY",
            "Creating copy for frame 1 of " + templateName + " template:",
            [templateName]
        );

        // creates frame 1 specific copy structure for attract template
        // searchbar -> (copyWrapper -> (copyText + cursor), icon)

        // create classes for searchbar, copy, text, cursor and icon
        const basePrefix = isFrameElement ? "frame" : "global";
        const searchbarClass = `${basePrefix}__searchbar ${basePrefix}-${frameNumber}__searchbar`;
        const copyClassTypewriter = `${basePrefix}__copy ${basePrefix}-${frameNumber}__${objectKey}`;
        const copyTextClass = `${basePrefix}__copy-text ${basePrefix}-${frameNumber}__${objectKey}-text`;
        const cursorClass = `${basePrefix}__copy-cursor ${basePrefix}-${frameNumber}__${objectKey}-cursor`;
        const iconWrapperClass = `${basePrefix}__copy-icon-wrapper ${basePrefix}-${frameNumber}__${objectKey}-icon-wrapper`;
        const iconClass = `${basePrefix}__copy-icon ${basePrefix}-${frameNumber}__${objectKey}-icon`;

        // derive ids from the second class token in each class string
        const searchbarId = searchbarClass.split(" ")[1];
        const copyIdTypewriter = copyClassTypewriter.split(" ")[1];
        const copyTextId = copyTextClass.split(" ")[1];
        const cursorId = cursorClass.split(" ")[1];
        const iconWrapperId = iconWrapperClass.split(" ")[1];
        const iconId = iconClass.split(" ")[1];

        // Create Search bar element
        const searchbar = createElement(
            tagName, // div
            searchbarClass, // class, e.g "frame__searchbar frame-1__searchbar"
            searchbarId, // id, e.g "frame-1__searchbar"
            null // no inner html
        );

        const copyWrapper = createElement(
            tagName, // div
            copyClassTypewriter, // class, e.g "frame__copy frame-1__copy"
            copyIdTypewriter, // id, e.g "frame-1__copy"
            null // no inner html
        );

        const copyText = createElement(
            tagName, // div
            copyTextClass, // class, e.g "frame__copy-text frame-1__copy-text"
            copyTextId, // id, e.g "frame-1__copy-text"
            text // copy text of f1_copy
        );

        // create cursor element
        const cursor = createElement(tagName, cursorClass, cursorId, null);

        // create icon wrapper element
        const iconWrapper = createElement(
            tagName,
            iconWrapperClass,
            iconWrapperId,
            null
        );

        // create icon element
        const icon = createElement(
            "img",
            iconClass,
            iconId,
            assets/images/search.svg" // icon image path
        );

        // assemble: copyWrapper -> (copyText + cursor), iconWrapper -> icon, searchbar -> (copyWrapper + iconWrapper)
        appendElement(copyWrapper, copyText);
        appendElement(copyWrapper, cursor);
        appendElement(searchbar, copyWrapper);
        appendElement(iconWrapper, icon);
        appendElement(searchbar, iconWrapper);

        // append searchbar to the provided container
        appendElement(containerToAppend, searchbar);
    } else {
        // Handles the rest of the frame copy for Attract template
        log(
            "COPY",
            "Creating copy for other frames of " + templateName + " template:",
            [templateName]
        );

        // create copy element
        const copy = createElement(tagName, copyClass, copyId, null);

        // loop through text array and append each line to copy element
        // not using appendElement here as it only appends html as a string
        // we need to append the line as html elements
        text.forEach((element) => {
            copy.innerHTML += element;
        });

        // create copy container element
        const copyContainer = createElement(
            tagName,
            `${isFrameElement ? "frame__" : "global__"}copy-container ${
                isFrameElement ? "frame-" : "global-"
            }${frameNumber}__copy-container`,
            `${
                isFrameElement ? "frame-" : "global-"
            }${frameNumber}__copy-container`,
            null
        );

        // append copy to copy container, then append to frame container
        appendElement(copyContainer, copy);
        appendElement(containerToAppend, copyContainer);
    }
};
