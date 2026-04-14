import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { log } from "../utilities/logStyles.js";

export const convertAnimation = (formattedFeed) => {
    gsap.registerPlugin(SplitText);

    const { frameOrder, frameDwellTime = 3 } = formattedFeed.metadata;
    const { loopCount = 1 } = formattedFeed.global.config;

    log("ANIMATE", [
        "Starting Convert Animation with frame order:",
        frameOrder,
        "| frame dwell time:",
        `${frameDwellTime}s | loop count:`,
        loopCount,
    ]);

    // frameOrder is a CSV string (e.g. "1,2,3"); convert to array
    const frameOrderArray = frameOrder.split(","); // ["1","2","3"]

    // first and last frame numbers in the sequence
    const firstFrame = frameOrderArray[0];
    const lastFrame = frameOrderArray[frameOrderArray.length - 1];

    // how many full sequence loops have completed so far
    let currentLoop = 0;

    const playAnimation = () => {
        // true when there is only one frame in the feed;
        // in that case we keep the image on screen and only
        // loop the copy animation.
        const isSingleFrame = frameOrderArray.length === 1;

        // timeline for a single pass through all frames
        const tl = gsap.timeline({
            defaults: { ease: "power1.out", duration: 0.5 },
            onComplete: () => {
                // one full pass of all frames has finished
                currentLoop++;

                // if we still have loops left, just start another pass;
                // all image/copy transitions (including last->first) are
                // handled inside this function so loop handoff has no
                // extra animation phase.
                if (currentLoop < loopCount) {
                    playAnimation();
                }
            },
        });

        // flags so we can treat the very first loop / final loop differently if needed
        const isFirstLoop = currentLoop === 0;
        const isLastLoop = currentLoop === loopCount - 1;

        // on the very first loop, fade in the global chrome
        if (isFirstLoop) {
            tl.to(".global", { autoAlpha: 1, duration: 0.5 }, "+=0.5");
            // bring in the first frame image under the global elements
            tl.to(`#frame-${firstFrame}__image`, { autoAlpha: 1 }, "<");
        }

        // for each frame in the order provided by the feed
        frameOrderArray.forEach((frameNumber, index) => {
            // is this frame the last in the sequence?
            const isLastFrame = frameNumber === lastFrame;

            // previous frame number (used for image handover). for the
            // first frame in the order, "previous" wraps to the last frame.
            const previousFrameIndex =
                index === 0 ? frameOrderArray.length - 1 : index - 1;
            const previousFrame = frameOrderArray[previousFrameIndex];

            // reset copy state for this frame:
            // - lines start off-screen to the left
            // - copy container and frame CTA start hidden
            tl.set(`#frame-${frameNumber} .frame__copy-line`, {
                xPercent: -100,
            });
            tl.set(`#frame-${frameNumber}__copy-container`, { autoAlpha: 0 });
            tl.set(`#frame-${frameNumber}__cta`, { autoAlpha: 0 });

            // first / middle frames (anything that is not the last frame)
            if (!isLastFrame) {
                log("ANIMATE", "Animating frame:", [
                    frameNumber,
                    "(first/middle)",
                ]);

                // multi-frame: snap this frame's image on, then fade the
                // previous image out under the copy so the background
                // never shows. single-frame: keep the image on and just
                // loop the copy.
                if (!isSingleFrame) {
                    // ensure new frame image is fully visible
                    tl.set(`#frame-${frameNumber}__image`, { autoAlpha: 1 });

                    // bring copy + CTA in and hide previous image at the same time
                    tl.to(
                        `#frame-${frameNumber}__copy-container`,
                        { autoAlpha: 1 },
                        "<"
                    );
                    tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 1 }, "<");
                    tl.to(
                        `#frame-${frameNumber} .frame__copy-line`,
                        { xPercent: 0, stagger: 0.25 },
                        "<"
                    );
                    tl.to(
                        `#frame-${previousFrame}__image`,
                        { autoAlpha: 0 },
                        "<"
                    );
                } else {
                    tl.set(`#frame-${frameNumber}__image`, { autoAlpha: 1 });
                    tl.to(
                        `#frame-${frameNumber}__copy-container`,
                        { autoAlpha: 1 },
                        "<"
                    );
                    tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 1 }, "<");
                    tl.to(
                        `#frame-${frameNumber} .frame__copy-line`,
                        { xPercent: 0, stagger: 0.25 },
                        "<"
                    );
                }
                tl.to(
                    `#frame-${frameNumber}__copy-container`,
                    { autoAlpha: 0 },
                    `+=${frameDwellTime}`
                );
                tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 0 }, "<");
            }

            // last frame in the sequence
            if (isLastFrame) {
                log("ANIMATE", "Animating frame:", [
                    frameNumber,
                    "(last/only)",
                ]);

                // same idea as above for the last frame: snap its image on,
                // and as copy appears, fade the previous image out so the
                // last->first transition feels like any middle-frame step.
                if (!isSingleFrame) {
                    tl.set(`#frame-${frameNumber}__image`, { autoAlpha: 1 });

                    tl.to(
                        `#frame-${frameNumber}__copy-container`,
                        { autoAlpha: 1 },
                        "<"
                    );
                    tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 1 }, "<");
                    tl.to(
                        `#frame-${frameNumber} .frame__copy-line`,
                        { xPercent: 0, stagger: 0.25 },
                        "<"
                    );
                    tl.to(
                        `#frame-${previousFrame}__image`,
                        { autoAlpha: 0 },
                        "<"
                    );
                } else {
                    tl.set(`#frame-${frameNumber}__image`, { autoAlpha: 1 });
                    tl.to(
                        `#frame-${frameNumber}__copy-container`,
                        { autoAlpha: 1 },
                        "<"
                    );
                    tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 1 }, "<");
                    tl.to(
                        `#frame-${frameNumber} .frame__copy-line`,
                        { xPercent: 0, stagger: 0.25 },
                        "<"
                    );
                }

                // if last frame but not the last loop, hide copy after dwell.
                // for multi-frame sequences we also cross-fade the last frame
                // image back to the first frame image; for a single-frame
                // creative we leave the image on-screen and only loop copy.
                if (!isLastLoop) {
                    // finish this last frame's copy
                    tl.to(
                        `#frame-${frameNumber}__copy-container`,
                        { autoAlpha: 0 },
                        `+=${frameDwellTime}`
                    );
                    tl.to(`#frame-${frameNumber}__cta`, { autoAlpha: 0 }, "<");

                    // only cross-fade images when there is more than one frame
                    if (!isSingleFrame) {
                        tl.to(
                            `#frame-${firstFrame}__image`,
                            { autoAlpha: 1 },
                            "<"
                        );
                        tl.to(
                            `#frame-${frameNumber}__image`,
                            { autoAlpha: 0 },
                            "<"
                        );
                    }
                }
            }
        });
    };

    if (Number(loopCount) > 0) {
        playAnimation();
    }
};
