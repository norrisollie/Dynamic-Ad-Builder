import { buildFrameElements } from "./buildFrameElements.js";
import { buildFrames } from "./buildFrames.js";
import { buildGlobalElements } from "./buildGlobalElements.js";
import { formatFeed } from "./formatFeed.js";
import { handleAnimation } from "./handleAnimation.js";
import { getDynamicContent } from "./handleEnvironment.js";
import { log } from "./utilities/logStyles.js";

const adContainer = document.getElementById("ad");

// takes in the metadata from the feed
// and builds the ad based on the frame order and frame data
const buildAd = () => {
    // variable to store formatted feed data
    const formattedFeed = formatFeed(getDynamicContent());

    log("FEED", "Formatted feed data:", [formattedFeed]);

    // destructure metadata, global settings, and frames from formattedFeed
    const {
        metadata: { template, frameOrder, frameDwellTime, exit_url },
    } = formattedFeed;

    // build global frame and elements
    buildGlobalElements(formattedFeed);
    // build frames
    buildFrames(formattedFeed);
    // build frame elements
    buildFrameElements(formattedFeed);
    // var to store exit url from feed
    const exitUrl = formattedFeed.metadata.exit_url.Url;
    // init click handler
    initClickHandler(exitUrl);
    // add extra_css from feed to style tag in head
    const extraCSS = formattedFeed.metadata.extra_css;
    if (extraCSS) {
        const styleTag = document.body.querySelector("style");
        styleTag.innerHTML = extraCSS;
        log("BUILD", "Added extra CSS to style tag:", [extraCSS]);
    }

    // slight delay to ensure all elements are rendered before text resize and animation start
    setTimeout(() => {
        log("BUILD", "Ad build complete - starting animation");

        // start animation based on template
        handleAnimation(formattedFeed);
    }, 50);
};

// checks if Enabler is visible and runs buildAd if it is
// otherwise adds an event listener for when it becomes visible
const init = () => {
    log("INIT", "Enabler initialised - checking visibility");

    if (Enabler.isVisible()) {
        log("INIT", "Ad is visible - building ad");
        buildAd();
    } else {
        log("INIT", "Ad not visible - waiting for visibility event");
        Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, () => {
            log("INIT", "Ad now visible - building ad");
            buildAd();
        });
    }
};

// checks if Enabler is initialised and runs if it has been
const preInit = () => {
    log("INIT", "Starting ad initialisation");

    if (Enabler.isInitialized()) {
        log("INIT", "Enabler already initialised");
        init();
    } else {
        log("INIT", "Waiting for Enabler initialisation");
        Enabler.addEventListener(studio.events.StudioEvent.INIT, init);
    }
};

const initClickHandler = (exitUrl) => {
    log("CLICK", "Setting up click handler for ad container");
    adContainer.addEventListener("click", () => {
        log("CLICK", "Ad clicked - triggering exit", [exitUrl]);
        Enabler.exitOverride("Default Exit", exitUrl);
    });
};

// On window load, run preInit to check if Enabler is initialised
window.addEventListener("load", preInit);
