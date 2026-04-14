import { log } from "../utilities/logStyles.js";
import { splitLineByBreak } from "../utilities/splitLineByBreak.js";
import { appendElement, createElement } from "../utilities/utilities.ts";

/**
 * Create Reserves and Convert Copy Element and Append to Frame Container
 */

export const createReservesAndConvertCopyElement = (
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

    const text = splitLineByBreak(objectValue, isTextResizeEnabled);
    log("COPY", "Creating copy for template:", [templateName]);
    // take copy string and split by <br> tags into array - returns array of strings/elements
    // will also handle auto resize if true/false is passed by adding or removing class

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
};
