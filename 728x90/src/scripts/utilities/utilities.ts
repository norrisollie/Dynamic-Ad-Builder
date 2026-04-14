import { log } from "./logStyles.js";

// object key to HTML tag mapping, iuf
const keyMapping = {
    image1: "img",
    bg1: "img",
    image: "img",
    bg: "img",
    logo: "img",
};

/**
 * Creates an HTML element based on the provided tag and class name
 * This function is used to create elements dynamically based on the feed data
 * It allows for flexibility in the type of elements created, such as divs, images,
 * and other HTML tags as specified in the column name in feed content.
 * @param {string} tag - The HTML tag to create (e.g., 'div', 'img', etc.)
 * @param {string} className - The class name that will be assigned to the element.
 * @param {string} textContent - The content to assign to the element, this comes from the feed. if the tag is an image, this will be used as the src attribute
 * @returns {HTMLElement} - The created HTML element
 */
export const createElement = (
    tag: string,
    className: string,
    id: string,
    textContent: string = ""
): HTMLElement => {
    const element = document.createElement(tag);

    // assign class and id if provided, otherwise skip
    if (className) element.className = className;
    if (id) element.id = id;

    // handle images differently to other elements
    if (tag === "img") {
        log("IMAGE", "Creating image element with src:", [textContent]);

        // @ts-ignore
        element.src = textContent; // for images, use textContent as src
    } else {
        if (textContent) {
            log("COPY", "Creating element with text content:", [textContent]);

            element.innerHTML = textContent;
        }
    }

    return element;
};

/**
 * Determines the appropriate HTML tag name for a given object key.
 *
 * Uses a predefined key-to-tag mapping to decide which element to create.
 * This approach allows flexibility for adding new key mappings in the future.
 * For example, a key of `"image"` could map to an `<img>` tag.
 * If the key is not found in the mapping, the function defaults to returning `'div'`.
 *
 * @param {string} key - The key name used to determine the corresponding HTML tag.
 * @returns {string} The HTML tag name to be used when creating the element.
 */
export const assignTagNameFromObjectKey = (key: string): string =>
    keyMapping[key] || "div"; // default to 'div' if no mapping found

/**
 * Appends one or more child elements to a specified parent element.
 *
 * Accepts either a single HTMLElement or an array of HTMLElements.
 * Each provided element is appended in order to the parent.
 *
 * @param {HTMLElement} parent - The parent element that will receive the child element(s).
 * @param {HTMLElement | HTMLElement[]} child - A single HTMLElement or an array of HTMLElements to append.
 * @returns {void} This function does not return a value.
 */
export const appendElement = (
    parent: HTMLElement,
    child: HTMLElement | HTMLElement[]
): void => {
    // checks if child is an array or a single HTMLElement, element.append() handles appending differently if a single element or multiple elements are passed

    const isArrayOfElements = Array.isArray(child);

    if (isArrayOfElements) {
        parent.append(...child); // spread operator to append multiple children
    } else {
        parent.append(child); // append single child
    }
};

type ImageOrBgObject = {
    Type: string;
    Url: string;
};

/**
 * Checks if the provided value is an image or background object as per Google Studio format for images.
 *
 * @param {Object|null|undefined} value - The value to check. e.g { Type: "file", Url: "path/to/image.jpg" } as returned by Google Studio dynamic data.
 * @returns {boolean} True if the value is an image or background object, otherwise false.
 */
export const checkForImageOrBgObject = (
    value: ImageOrBgObject | null | undefined
): boolean => {
    if (!value || typeof value !== "object") return false;
    return (
        value.Type === "file" &&
        typeof value.Url === "string" &&
        value.Url.length > 0
    );
};
