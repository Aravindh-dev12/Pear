# Atomic transition fix

- [x] Reproduce the visible blank/glitch frame while scrubbing through the exact scene boundaries.
- [x] Identify whether the exposed frame comes from an unready adjacent image, canvas clear, opacity state, or scene unmount.
- [x] Keep the last fully rendered frame as an immutable fallback and never expose a cleared canvas.
- [x] Gate scene changes on a decoded first frame, then atomically replace the active scene without an empty crossfade.
- [x] Stress-test fast forward/backward scroll on desktop and mobile, run checks, and save a checkpoint.

## Transition reproduction

The blank/glitch state was reproduced on a fresh load: the hero video reported `readyState: 0` and opacity `0` while the poster remained present, which previously exposed only the blue stage. After the fix, the poster visibly carries the full hero composition until the video becomes ready. A rapid 15-position scroll test showed one opaque canvas at every scrubbed scene and a poster-backed hero at the final return to top, with no empty transition state observed.
