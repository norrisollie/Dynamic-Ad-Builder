/**
 * Checks if the provided value is an image or background object as per Google Studio format for images.
 *
 * @param {Object} value - The value to check. e.g { Type: "file", Url: "path/to/image.jpg" } as returned by Google Studio dynamic data.
 * @returns {boolean} True if the value is an image or background object, otherwise false.
 */
export const checkForImageOrBgObject = (value) => {
    return (
        typeof value === "object" &&
        value !== null &&
        value.Type === "file" &&
        value.Url
    );
};
