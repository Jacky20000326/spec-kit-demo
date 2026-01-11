# Feature Specification: Western Astrology Analysis System

**Feature Branch**: `002-western-astrology`
**Created**: 2026-01-11
**Status**: Draft
**Input**: User description: "Focus on Western astrology only (excluding Indian astrology). No user login required - guest access only. Retrieve Western astrology data through ProKerala API. Display data on UI and analyze through ChatGPT. Limit users to 2 AI-generated results per month. Store state in browser localStorage."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generate Personal Natal Chart (Priority: P1)

A user wants to generate their personal Western astrology natal chart by providing their birth details. They enter their birth date, time, and location, and the system retrieves their complete natal chart including zodiac placements for major celestial bodies (Sun, Moon, Ascendant, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto) and house placements.

**Why this priority**: This is the foundational feature that all other analysis depends on. Without accurate natal chart data, no further analysis is possible. This is the core value proposition of the system.

**Independent Test**: A user can input birth details, retrieve a complete natal chart, and see all major planetary placements and houses displayed. This delivers immediate tangible astrological data.

**Acceptance Scenarios**:

1. **Given** a user has not yet generated their chart, **When** they enter birth date (YYYY-MM-DD), birth time (HH:MM), and birth location (city/coordinates), **Then** the system retrieves and displays their natal chart with all planetary positions and house placements.
2. **Given** a user enters incomplete birth information, **When** they attempt to generate a chart, **Then** the system shows a clear validation message indicating which required fields are missing.
3. **Given** birth data has been retrieved, **When** the user views their chart, **Then** the interface clearly displays the zodiac sign and degree for each major planet and house.

---

### User Story 2 - View Detailed Chart Information (Priority: P2)

A user wants to understand the meaning and implications of their natal chart by viewing detailed information about each planetary placement. They can tap or hover on chart elements to see descriptions of what each planet in each sign means for their personality and life path.

**Why this priority**: This helps users understand the astrological significance of their chart. While the chart data itself is P1, the contextual information that makes the data meaningful is P2 - it enhances understanding but doesn't block core functionality.

**Independent Test**: A user can view their natal chart and access detailed explanations for at least 5 major placements (e.g., Sun sign description, Moon sign description, Ascendant description). This provides educational value independently.

**Acceptance Scenarios**:

1. **Given** a natal chart is displayed, **When** the user selects a planetary placement, **Then** they see a brief description of what that placement represents.
2. **Given** detailed information is displayed, **When** the user closes the information panel, **Then** the full chart view returns.

---

### User Story 3 - AI-Powered Life Analysis (Priority: P2)

A user wants to receive personalized insights about specific life areas based on their natal chart. They can request AI analysis of their relationships, career, finances, or personal growth, and the system uses ChatGPT to generate detailed interpretations based on their specific planetary placements.

**Why this priority**: This differentiates the service by providing personalized, in-depth analysis. While the raw chart data is essential (P1), the AI analysis adds significant value but can function as an enhancement. Users get value from the chart alone but gain much more from the analysis.

**Independent Test**: A user can generate an AI analysis for one life area (e.g., relationships or career) based on their natal chart data. The analysis references their actual chart placements and provides specific, personalized insights.

**Acceptance Scenarios**:

1. **Given** a user has a complete natal chart, **When** they request analysis of a specific life area (relationships, career, finances, personal growth), **Then** the system generates a detailed AI analysis that references their chart placements.
2. **Given** an analysis is generated, **When** the user reads the analysis, **Then** it includes specific references to their planetary placements and explains how they influence the requested life area.
3. **Given** analysis generation is in progress, **When** the user views the screen, **Then** they see a loading indicator or progress message.

---

### User Story 4 - Local Chart History & Monthly Quota Management (Priority: P3)

A user wants their generated charts and analysis history to persist across browser sessions without requiring login. The system uses browser localStorage to automatically save chart data and tracks monthly AI analysis usage to enforce a 2-analysis-per-month limit.

**Why this priority**: This enables repeat usage without friction (no login) while ensuring sustainable AI costs through usage limits. Users can casually return to their charts, but the monthly limit prevents overuse of paid API resources.

**Independent Test**: A user can generate a chart, close the browser, return later and access their chart from localStorage. The system tracks and enforces the 2-analysis-per-month limit, preventing additional analyses once limit is reached.

**Acceptance Scenarios**:

1. **Given** a user has generated a natal chart, **When** the chart is created, **Then** the system automatically saves it to localStorage with timestamp and retrieval is possible in future sessions.
2. **Given** a user has used their 2 monthly analyses, **When** they attempt to request a third analysis, **Then** the system shows a message "You have reached your monthly limit. Try again next month." and prevents the request.
3. **Given** a browser session ends, **When** the user returns and opens the application, **Then** they can view a list of previously generated charts stored in localStorage.

---

### Edge Cases

- What happens when the ProKerala API is temporarily unavailable? System should show a user-friendly error message and allow retry.
- How does the system handle ambiguous birth locations (e.g., "Springfield")? System should show multiple location options or request more specificity.
- What if a user enters a future birth date? System should validate that birth dates are in the past and show an error.
- What if birth time is unknown? System should allow users to generate a chart using sunrise as default time and note this limitation in the chart.
- What happens if ChatGPT API is temporarily unavailable for analysis requests? System should show a message that AI analysis is temporarily unavailable but the chart data is still accessible.
- What if a user clears browser localStorage? Previously generated charts are permanently lost (expected behavior for guest-only system).
- How is the monthly limit tracked? System tracks calendar months (e.g., Jan 1-31, Feb 1-28/29). Analysis count resets on the first day of each calendar month.
- What if a user accesses the app from different browsers? Each browser has its own localStorage, so quota is tracked per browser/device.
- What happens at month boundaries? If a user reaches their 2-analysis limit on Jan 30, they can generate 2 more analyses starting Feb 1.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST integrate with ProKerala API to retrieve Western astrology natal chart data for users based on birth date, time, and location.
- **FR-002**: System MUST display at minimum the following planetary placements: Ascendant, Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto with their zodiac signs, degrees, and house placements.
- **FR-003**: System MUST validate user birth date input to ensure date is in the past and in valid format (YYYY-MM-DD).
- **FR-004**: System MUST validate user birth time input to ensure time is in valid format (HH:MM, 24-hour or 12-hour with AM/PM) or allow users to indicate time is unknown.
- **FR-005**: System MUST validate user birth location input to support both city names and geographic coordinates, and handle ambiguous locations by offering options or requesting clarification.
- **FR-006**: System MUST display the natal chart data in a clear, readable format (visual chart representation or detailed text listing showing zodiac signs, degrees, and house placements).
- **FR-007**: System MUST integrate with ChatGPT API to generate personalized life analysis based on user's natal chart data.
- **FR-008**: System MUST allow users to request AI analysis for specific life areas: relationships, career, finances, and personal growth.
- **FR-009**: System MUST include the user's actual planetary placements in the prompt sent to ChatGPT to ensure personalized analysis.
- **FR-010**: System MUST display AI-generated analysis to users in a readable format and indicate when analysis is being generated.
- **FR-011**: System MUST handle API errors gracefully by showing user-friendly error messages without exposing technical details.
- **FR-012**: System MUST persist generated natal charts to browser localStorage automatically (no login required) to enable retrieval across sessions.
- **FR-013**: System MUST track monthly AI analysis usage and enforce a 2-analysis-per-calendar-month limit per browser/device.
- **FR-014**: System MUST display remaining monthly analysis quota to users (e.g., "1 analysis remaining this month") before they exceed the limit.
- **FR-015**: System MUST store analysis tracking data (usage count, reset date) in localStorage alongside chart data.
- **FR-016**: System MUST be restricted to Western astrology only and exclude all Indian (Vedic) astrology features or interpretations.
- **FR-017**: System MUST NOT require user login or authentication; all features must be accessible to guest users immediately.

### Key Entities

- **Natal Chart**: Represents a complete astrological profile based on birth date, time, and location. Contains planetary placements (Sun, Moon, Ascendant, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto), house placements, timestamp, and localStorage ID.
- **Planetary Placement**: Represents a single celestial body's position in the zodiac at the moment of birth, including zodiac sign, degree, and house placement.
- **Life Analysis**: Represents an AI-generated interpretation of how a natal chart influences a specific life area (relationships, career, finances, or personal growth). Linked to its parent Natal Chart.
- **Usage Quota**: Tracks monthly analysis usage per browser (analysis count, month start date, reset date). Stored in localStorage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can generate a complete natal chart within 2 minutes from entering birth information, including ProKerala API retrieval.
- **SC-002**: Natal chart display shows all 11 major planetary placements with 100% accuracy compared to ProKerala API data.
- **SC-003**: Users can receive AI analysis for a requested life area within 1 minute of requesting analysis (from ChatGPT generation).
- **SC-004**: At least 90% of generated AI analyses are rated as relevant and personalized by test users (referencing specific chart placements).
- **SC-005**: System handles API errors (ProKerala or ChatGPT unavailable) without crashing, with 100% of errors shown as user-friendly messages.
- **SC-006**: Charts persist in localStorage across browser sessions and can be retrieved without re-entry of birth information.
- **SC-007**: System correctly identifies and prevents generation of charts for invalid birth information (future dates, invalid times, etc.) with clear validation messages.
- **SC-008**: System supports birth information entry for any geographic location worldwide accessible through ProKerala API.
- **SC-009**: Monthly analysis quota is accurately tracked and enforced - users can generate exactly 2 analyses per calendar month.
- **SC-010**: Remaining monthly quota is displayed to users with clear messaging (e.g., "2 of 2 analyses used this month").
- **SC-011**: System prevents unauthorized analysis requests when quota is exceeded, with user-friendly message explaining the limit and reset date.
- **SC-012**: localStorage data persists across page refreshes and browser restarts (unless user clears browser data).

## Assumptions

- **API Availability**: ProKerala API will be available and maintained for the duration of the feature deployment.
- **Time Zone Handling**: ProKerala API handles time zone conversion for birth location automatically; no manual time zone conversion is required by the system.
- **Chart Calculation Accuracy**: ProKerala API provides astronomically accurate planetary calculations; system trusts this data without additional validation.
- **Birth Time Precision**: For charts with unknown birth time, using sunrise is an acceptable workaround that will be noted to users.
- **ChatGPT Availability**: ChatGPT API will be available for generating analysis; temporary unavailability is handled with user-friendly fallback messages.
- **localStorage Support**: All target browsers support HTML5 localStorage API with adequate storage capacity (typically 5-10MB per domain).
- **Monthly Quota Tracking**: System uses browser's system clock for month tracking; users must have accurate system time for quota reset to work correctly.
- **Guest-Only Access**: No user authentication is implemented; all data is tied to browser/device localStorage only.
- **Data Impermanence**: Users understand that clearing browser data/cache will permanently delete their stored charts and analyses (no server backup).
- **Western Astrology Only**: The scope explicitly excludes all Vedic/Indian astrology interpretations, aspects, or features.

## Out of Scope

- Vedic/Indian astrology features
- Astrological transits or predictive analysis
- Compatibility/synastry charts comparing multiple users
- Astrological event calendars or daily horoscopes
- Educational astrology courses or detailed astrology interpretations
- Community features like sharing charts with other users
- User authentication and login/registration system
- Server-side data persistence (all data stored client-side in localStorage)
- Cross-device synchronization (each browser/device has independent localStorage)
- Advanced quota management (per-user IP restrictions, account-based quotas)
