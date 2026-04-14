// src/dynamicData.js
// This module provides dynamic data for the ad builder
// It simulates part of the Enabler API to provide dynamic content for testing
// Paste the code snippet from Google Stuudio here
/* global dynamicContent */

import { log } from "../utilities/logStyles.js";
import { applyDevDefaults } from "./applyDevDefaults";

/* * This function creates and returns dynamic content for a dynamic ad.
 * {returns} {Object} - An object containing dynamic content for the ad
 */
export const getDynamicDataExample = () => {
    // Config object for example environment, to set profile ID and feed name accordingly

    const FEED_NAME = "Example__Royal_Navy__Dynamic_Feed_Feed";

    // set profile ID for Enabler (example)
    Enabler.setProfileId(10952250);

    // Create dynamic content object, will be populated from example data below
    const devDynamicContent = {
        [FEED_NAME]: [{}],
    };

    // variable to hold the dynamic feed, to be returned at end of function
    const feedName = devDynamicContent[FEED_NAME][0];

    console.log(feedName);
    // set default values for the example feed
    applyDevDefaults(feedName);

    // DEBUG log using project's logger
    log("FEED", "Dynamic Data:", [devDynamicContent]);

    // set default values for the example feed
    Enabler.setDevDynamicContent(devDynamicContent);

    return dynamicContent[FEED_NAME][0];
};
