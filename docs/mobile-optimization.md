# Android and iOS optimization

The invitation keeps its existing typefaces, text colors and ceremony copy placement.

- Eleven ceremony backgrounds are now WebP: 24.71 MB of PNG sources becomes 2.24 MB served (91% smaller). Originals remain in `public/assets`; served files are `ceremony-<function>-v1.webp`.
- Decorative ceremony images load lazily with asynchronous decoding and explicit dimensions.
- Intro video loads metadata initially. Guests can skip it; unavailable playback offers immediate entry. A stalled start recovers after eight seconds. Reduced-motion preference bypasses the video when opening.
- Navigation and controls account for phone safe areas, landscape orientation and dynamic browser toolbars. Touch controls have at least 48px target height.
- The scratch card grows to fit the full names and venue. Pixel readback is throttled; resize work runs in an animation frame to prevent a WebKit ResizeObserver loop.
- The family crest uses the current couple's initials.

## Verification

Headless Edge/Chromium and WebKit passed at 320x740, 360x800, 390x844, 430x932, 844x390 and 1280x900. Verified navigation with touch input, date reveal, all eleven image loads, ceremony text containment, directions URLs and no horizontal page overflow. Both engines also passed the unavailable-video fallback and pointer scratching checks. A rendered WebKit Haldi card was visually inspected.

Type checking, production build and all 22 existing tests passed. Temporary browser and image tooling did not change project dependencies or lockfiles.

These checks use browser engines and phone emulation on Windows. Physical Android/iOS hardware, native sharing handoff and device-specific audio policies have not been tested.
