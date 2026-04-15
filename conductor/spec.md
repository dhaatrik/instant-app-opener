# Specification: Add support for TikTok and Spotify deep links

## Objective
Enhance the Instant App Opener by adding URL parsing and deep link generation support for two new platforms: TikTok and Spotify.

## Requirements
1. **TikTok Links:**
   - Detect standard web URLs (e.g., `https://www.tiktok.com/@user/video/123`, `https://vm.tiktok.com/123/`).
   - Parse the URL and generate the corresponding `snssdk1233://` or appropriate deep link scheme.
   - Extract metadata (if applicable) for the preview card.
2. **Spotify Links:**
   - Detect standard web URLs (e.g., `https://open.spotify.com/track/123`, `https://open.spotify.com/playlist/123`).
   - Parse the URL and generate the corresponding `spotify://` scheme.
   - Extract metadata for the preview card.
3. **UI/UX:**
   - Ensure the new platforms are integrated seamlessly into the existing glassmorphic UI.
   - Verify that animations and feedback mechanisms work correctly for these new links.
4. **Testing:**
   - Add unit tests for the new URL parsers.
   - Add component tests for the UI integrations.