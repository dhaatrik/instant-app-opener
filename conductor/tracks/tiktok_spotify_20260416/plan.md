# Implementation Plan: Add support for TikTok and Spotify deep links

## Phase 1: Setup and Research [checkpoint: d8d1ede]
- [x] Task: Research TikTok and Spotify deep link URI schemes 03:15
    - [x] Write unit tests for basic URL detection (Red Phase)
    - [x] Document discovered schemes in `tech-stack.md` if necessary
- [x] Task: Conductor - User Manual Verification 'Phase 1: Setup and Research' (Protocol in workflow.md) d8d1ede

## Phase 2: TikTok Deep Link Support
- [~] Task: Implement TikTok URL parsing
    - [x] Write tests for TikTok URL parser covering various URL formats (Red Phase) 03:17
    - [x] Implement parser logic to extract video/user IDs and construct `snssdk1233://` links (Green Phase) 03:18
- [x] Update UI for TikTok support
    - [x] Write component tests for TikTok preview card rendering (Red Phase) 03:18
    - [x] Implement UI updates to recognize and display TikTok links (Green Phase) 03:19
- [~] Task: Conductor - User Manual Verification 'Phase 2: TikTok Deep Link Support' (Protocol in workflow.md)

## Phase 3: Spotify Deep Link Support
- [ ] Task: Implement Spotify URL parsing
    - [ ] Write tests for Spotify URL parser covering track, album, and playlist URLs (Red Phase)
    - [ ] Implement parser logic to construct `spotify://` links (Green Phase)
- [ ] Task: Update UI for Spotify support
    - [ ] Write component tests for Spotify preview card rendering (Red Phase)
    - [ ] Implement UI updates to recognize and display Spotify links (Green Phase)
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Spotify Deep Link Support' (Protocol in workflow.md)

## Phase 4: Integration and Review
- [ ] Task: Final integration testing
    - [ ] Run full test suite and verify >80% coverage
    - [ ] Perform manual end-to-end testing of the complete flow
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Integration and Review' (Protocol in workflow.md)