import { getDynamicDataDev as getDev } from "./environments/getDynamicDataDev.js";
import { getDynamicDataExample as getExample } from "./environments/getDynamicDataExample.js";
import { getDynamicDataLive as getLive } from "./environments/getDynamicDataLive.js";
import { log } from "./utilities/logStyles.js";

const env =
    process.env.CREATIVE_ENV ||
    (process.env.npm_lifecycle_event
        ? process.env.npm_lifecycle_event.split(":").pop()
        : undefined) ||
    process.env.BUILD_ENV ||
    process.env.NODE_ENV;

let getDynamicContent;

// uses tree shaking to only include the necessary environment handler, it will remove the unused imports during the build process. e.g if env is 'live' only getLive will be included in the final build.

if (env === "development") {
    // if env === "development" -> include `getDev`
    log(
        "FEED",
        "Development environment detected. Using development dynamic content handler."
    );
    getDynamicContent = getDev;
} else if (env === "example") {
    // if env === "example" -> include `getExample`
    log(
        "FEED",
        "Example environment detected. Using example dynamic content handler."
    );
    getDynamicContent = getExample;
} else if (env === "live") {
    // if env === "live" -> include `getLive`
    log(
        "FEED",
        "Live environment detected. Using live dynamic content handler."
    );
    getDynamicContent = getLive;
} else {
    log("FEED", `Unknown env='${env}' - defaulting to development handler`);
    getDynamicContent = getDev;
}

export { getDynamicContent };
