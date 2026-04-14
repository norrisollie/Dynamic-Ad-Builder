import { log } from "./utilities/logStyles.js";
import { checkForImageOrBgObject } from "./utilities/utilities.ts";

/* src/formatFeed.js
 * This module formats the feed data for the ad builder and processes it into a structured format
 * It extracts metadata, global config, and frame data from the feed content
 * and is used by the dynamic builder to create the ad structure
 * @module formatFeed
 * @param {Object} feedContent - The raw feed data from the dynamic data source
 * @returns {Object} - An object containing formatted feed data with metadata, global config, and frames
 */
export const formatFeed = (feedContent) => {
    log("FEED", "Raw feed data:", [feedContent]);

    // init formattedFeed object
    // this will hold the metadata, global config, and frames
    let formattedFeed = {
        metadata: {}, // object to hold metadata
        global: {
            config: {}, // object to hold global config
            elements: {}, // object to hold global elements
        },
        frames: {}, // object to hold frame data, e.g "f1: { config: {}, elements: {} }"
    };

    // extract allowed frames from frameOrder string in feedContent
    const allowedFrames = feedContent.frameOrder
        .split(",")
        .map((frame) => frame.trim())
        .filter(Boolean);

    log("FEED", "Permitted frames, as found in frameOrder:", allowedFrames);

    const feedEntries = Object.entries(feedContent);

    // Loop though feedContent entries...
    feedEntries.forEach(([key, value]) => {
        // check if frame key matches the regex for frame keys
        // e.g. "f1_", "f2_", etc. and store value
        // returns an array with frame number and property if it matches conditions
        // e.g. ["f1", "copy1"] for "f1_copy1
        const frameMatch = key.match(/^f(\d+)_(.+)$/);

        // check if value is a string and trim it to ensure empty strings are handled
        // taking in to account empty strings with spaces
        // e.g. "   " should be converted to null
        if (typeof value === "string") {
            value = value.trim();
            if (value === "") value = null; // set to null if empty string
        }

        const isKeyGlobal = key.startsWith("global");

        switch (true) {
            // assign global keys to global object
            case isKeyGlobal: {
                // use slice to remove "global_" from key)
                const globalKey = key.slice("7");

                // check if key includes/contains "config" within key name
                const isConfigKey = key.includes("config");

                // remove "config_" from key name for config keys as we don't need it in final object, e.g. "global_config_template" becomes "template"
                const cleanedGlobalKey = globalKey.replace("config_", "");

                // var to hold references to config and elements objects
                const globalConfigObject = formattedFeed.global.config;
                const globalElementsObject = formattedFeed.global.elements;

                // if statement to assign to config or elements based on key type and value type
                if (!value) {
                    // firstly check for null/empty values and skip these, not needed in formatted feed
                    log("FEED", "Skipping global key with null value:", [key]);
                } else if (isConfigKey && checkForImageOrBgObject(value)) {
                    // handle config keys that are image or bg objects
                    globalConfigObject[cleanedGlobalKey] = value.Url;
                } else if (isConfigKey) {
                    // handle any remaining config keys, these are simple key value pairs
                    globalConfigObject[cleanedGlobalKey] = value;
                } else if (checkForImageOrBgObject(value)) {
                    // handle element file objects
                    globalElementsObject[cleanedGlobalKey] = value.Url;
                } else {
                    // handle other global element keys
                    globalElementsObject[cleanedGlobalKey] = value;
                }
                break;
            }

            // Handle frame keys and assign these to appropriate frame objects
            // e.g. "f1_copy1" is assigned to frame 1 elements with key "copy1" and value from feed
            case frameMatch !== null: {
                // destructure frameMatch array to get frame number and property
                const [, frameNumber, property] = frameMatch; // example ["f1_copy1", "1", "copy1"]

                // only create frame objects if frame is listed in frameOrder
                // create var to check if frameNumber is in allowedFrames
                const isFrameAllowed = allowedFrames.includes(frameNumber);

                // if not in frame order, skip
                if (!isFrameAllowed) {
                    log("FEED", "Frame number doesn't exist in frame order:", [
                        "Frame: " + frameNumber,
                    ]);
                    return; // skip to next iteration
                }

                // check if frame object already exists, var assigned true if so and false if not
                let frameObject = formattedFeed.frames[frameNumber];

                // Create frame object for permitted frames if it doesn't exist
                if (!frameObject) {
                    frameObject = {
                        config: {},
                        elements: {},
                    };
                }

                const frameConfigObject = frameObject.config;
                const frameElementsObject = frameObject.elements;

                // var to check if key is a config key
                const isFrameConfigKey = key.includes("config");

                // assign template keys to config object within frame otherwise assign to elements object
                if (isFrameConfigKey) {
                    // var to hold cleaned property name, removes "config_" from property
                    const cleanedPropertyName = property.replace("config_", "");
                    // assign property value to frame config, use property name (even if empty/null)
                    frameConfigObject[cleanedPropertyName] = value;
                } else if (checkForImageOrBgObject(value)) {
                    // handle element file objects, assign Url ONLY to elements object
                    frameElementsObject[property] = value.Url;
                } else {
                    // if not config, assign to elements object
                    frameElementsObject[property] = value;
                }

                // persist the frame object into the formatted feed so later processing can access it
                formattedFeed.frames[frameNumber] = frameObject;
                break;
            }
            // any left over keys are assigned to metadata
            // add another switch case to handle any other specific keys if needed
            default: {
                // assign the rest of the keys to metadata
                formattedFeed.metadata[key] = value;
                break;
            }
        }
    });

    return formattedFeed;
};
