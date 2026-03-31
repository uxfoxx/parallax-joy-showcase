

# Add Uploaded Video to Team Section Background

## Change
Copy the user's uploaded video (`4292299-uhd_3840_2160_25fps.mp4`) to `public/videos/team-bg.mp4` and update `TeamSection.tsx` to use it as the background video source, replacing the external Pexels URLs that weren't loading.

## Steps

1. **Copy video to public directory**: `user-uploads://4292299-uhd_3840_2160_25fps.mp4` → `public/videos/team-bg.mp4`

2. **Update `src/components/landing/TeamSection.tsx`** (lines 22-33):
   - Replace the two `<source>` elements pointing to Pexels URLs with a single `<source src="/videos/team-bg.mp4" type="video/mp4" />`
   - Keep the poster image, `onError` handler, and dark overlay as-is

| File | Change |
|------|--------|
| `public/videos/team-bg.mp4` | New — copied from upload |
| `src/components/landing/TeamSection.tsx` | Video source → `/videos/team-bg.mp4` |

