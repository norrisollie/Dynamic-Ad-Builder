import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { log } from "../utilities/logStyles.js";
import { createElement } from "../utilities/utilities.ts";

// Placeholder attract animation: keeps loop structure only.
// All element-level tweens have been intentionally removed so
// they can be reimplemented later.
export const attractAnimation = (formattedFeed) => {
    // register SplitText plugin
    gsap.registerPlugin(SplitText);

    const { frameOrder, frameDwellTime = 3 } = formattedFeed.metadata;
    const { loopCount = 1 } = formattedFeed.global.config;

    log("ANIMATE", [
        "Starting attract Animation with frame order:",
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

    // log if frame 1 is included in frame order
    const includesFrame1 = frameOrderArray.includes("1");

    let splitTextF1 = null;

    if (includesFrame1) {
        log(
            "ANIMATE",
            "Attract animation includes frame 1, preparing SplitText for f1 copy"
        );
        // split text for f1 animation.
        splitTextF1 = SplitText.create(".frame-1__copy1-text", {
            type: "lines,chars",
            charsClass: "frame__split-chars",
            linesClass: "frame__split-lines",
            aria: false,
            onSplit: () => {
                log("ANIMATE", "SplitText complete for f1 copy", []);
                // hiding init state - has to be set to visibility hidden here, as SplitText sets to inline-block by default, cannot be set in CSS as overridden by inline styles
                gsap.set(".frame-1__copy1-text .frame__split-chars", {
                    display: "none",
                    scale: 0,
                });

                // create a cursor element
                const cursor = createElement(
                    "div",
                    "frame__copy-cursor",
                    "frame-1__copy1-cursor",
                    null
                );

                // store array of line elements
                const lines = document.querySelectorAll(
                    ".frame-1__copy1-text .frame__split-lines"
                );

                // append cursor to each line and hide them initially
                lines.forEach((line) => {
                    // append a clone of the cursor to each line
                    const cursorClone = cursor.cloneNode();
                    line.appendChild(cursorClone);
                    gsap.set(cursorClone, { opacity: 0 });
                });
            },
        });
    }

    // how many full sequence loops have completed so far
    let currentLoop = 0;

    const playAnimation = () => {
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

        // for each frame in the order provided by the feed
        frameOrderArray.forEach((frameNumber, index) => {
            // Placeholder: per-frame animation for attract template goes here.
            log("ANIMATE", "[attract] Animate frame placeholder", [
                frameNumber,
                index,
            ]);

            // if frame 1 (not first frame in sequence)
            if (frameNumber === "1") {
                // Placeholder: frame 1 specific animation goes here.
                log("ANIMATE", "[attract] Frame 1 specific animation", [
                    frameNumber,
                    index,
                ]);
                // expand search bar
                tl.to(".frame-1__searchbar", {
                    opacity: 1,
                    scaleX: 1,
                    scaleY: 1,
                });

                // Show icon wrapper after search bar finishes
                tl.to(".frame__copy-icon-wrapper", { opacity: 1 }, ">");

                // Animate each line's characters sequentially
                const copyLines = document.querySelectorAll(
                    ".frame-1__copy1-text .frame__split-lines"
                );

                copyLines.forEach((line, lineIndex) => {
                    const lineChars = line.querySelectorAll(
                        ".frame__split-chars"
                    );
                    const lineCursor = line.querySelector(
                        ".frame__copy-cursor"
                    );
                    const isLastLine = lineIndex === copyLines.length - 1;

                    const timelinePosition = ">";

                    tl.to(
                        lineChars,
                        {
                            display: "inline-block",
                            scale: 1,
                            stagger: 0.1,
                            duration: 0,
                            onStart: () => {
                                console.log(
                                    `Starting line ${lineIndex} animation`
                                );
                                // Show cursor and start blinking animation
                                gsap.set(lineCursor, { opacity: 1 });
                                gsap.fromTo(
                                    lineCursor,
                                    { opacity: 1 },
                                    {
                                        opacity: 0,
                                        duration: 0.5,
                                        repeat: -1,
                                        yoyo: true,
                                    }
                                );
                            },
                            onComplete: () => {
                                // Hide cursor only if not the last line
                                if (!isLastLine) {
                                    gsap.killTweensOf(lineCursor);
                                    gsap.set(lineCursor, { opacity: 0 });
                                }
                            },
                        },
                        timelinePosition
                    );
                });
                tl.to(".frame-1", {
                    yPercent: -100,
                    delay: 2.75,
                });
            } else if (
                frameNumber !== firstFrame &&
                frameNumber !== lastFrame
            ) {
                // slide in middle frames
                tl.to(`.frame-${frameNumber}`, { yPercent: -100 }, "<");

                // dwell time on this frame
                tl.to(
                    `.frame-${frameNumber}`,
                    { yPercent: -200 },
                    "+=" + frameDwellTime
                );
            } else if (frameNumber === lastFrame) {
                // last frame to first frame transition
                tl.to(`.frame-${frameNumber}`, { yPercent: -100 }, "<");
            }
        });
    };

    if (Number(loopCount) > 0) {
        playAnimation();
    }
};
