

# Fix Team Section Video Background

## Problem
The Pixabay video URL (`cdn.pixabay.com/video/2020/07/30/45645-445039937_large.mp4`) is likely blocked, expired, or requires authentication — causing a silent load failure with no visible background.

## Solution
Replace with a reliable, publicly-hosted factory/warehouse video. Use multiple fallback sources and add a poster image so there's always a visible background even if video fails to load.

### File: `src/components/landing/TeamSection.tsx`

- Replace the Pixabay URL with a Pexels-hosted factory/industrial video (e.g., `https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4`)
- Add a `poster` attribute with a static factory image from Unsplash as fallback
- Add `onError` handler to hide the video element and show the poster/fallback background on the parent div
- Keep the dark overlay (`bg-black/50`) intact

