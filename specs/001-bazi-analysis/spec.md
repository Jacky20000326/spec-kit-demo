# Feature Specification: Bazi Analysis & Profile Generation

**Feature Branch**: `001-bazi-analysis`
**Created**: 2026-01-06
**Status**: Draft
**Input**: User description: "本應用為命理分析 App，使用者需輸入出生年、月、日（可選填出生時辰）。系統依據傳統八字排盤規則，自動計算天干地支，生成使用者專屬八字星盤。應用將根據五行分佈、十神配置與格局判斷，分析使用者在性格特質、事業發展、財運走勢、感情關係與近期運勢等面向的狀況。分析結果以結構化文字呈現，內容需清楚、易理解，避免過度專業術語，並支援後續擴充如年度流年分析與個人化建議模組。"

## Clarifications

### Session 2026-01-06

- Q: Bazi calculation engine - build from scratch or use existing library? → A: Use existing Bazi library (JavaScript/TypeScript) to reduce risk and ensure accuracy compliance
- Q: Analysis text generation strategy? → A: Rule-based templates approach - define analysis rules based on Five Elements/Ten Gods/pillar combinations, combine with templates for readable text output
- Q: Testing strategy for independent user stories? → A: Test fixtures approach - pre-calculate sample Bazi charts as test fixtures; each story tests independently using fixtures (enables parallel testing per constitution)
- Q: Calendar conversion edge cases & accuracy boundaries? → A: Explicit accuracy boundaries - support 1900-2100 with 100% accuracy claim; dates outside show "calculated with estimated accuracy" warning
- Q: 用戶配置檔案儲存與管理策略? → A: 單一配置檔案模式 - 一次僅存一個配置；保存新的會覆蓋舊的；最簡化 MVP 範圍

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Birth Profile Input (Priority: P1)

A user opens the app and wants to learn about their personal Bazi profile. They enter their birth date (year, month, day) and optionally their birth hour. The system validates the input and confirms it's ready for analysis.

**Why this priority**: Data collection is the foundational step - no analysis can occur without accurate birth information. This is the MVP entry point.

**Independent Test**: The input form can be tested independently - verify that valid dates are accepted, invalid dates are rejected with clear feedback, and the optional time field works correctly.

**Acceptance Scenarios**:

1. **Given** user opens the app, **When** they provide valid birth date (e.g., 1990-05-15) without time, **Then** the system confirms input and enables analysis
2. **Given** user provides birth date and time (e.g., 1990-05-15, 14:30), **When** they submit, **Then** both values are accepted and ready for calculation
3. **Given** user enters invalid date (e.g., February 30), **When** they submit, **Then** system shows clear error message in plain language (not technical jargon) and allows correction
4. **Given** user enters future date, **When** they submit, **Then** system prevents submission with explanation that birth dates cannot be in the future

---

### User Story 2 - Bazi Chart Generation (Priority: P1)

After providing their birth information, the user receives their personalized Bazi chart showing the Four Pillars (年柱, 月柱, 日柱, 時柱) with their corresponding Heavenly Stems (天干) and Earthly Branches (地支).

**Why this priority**: Core feature that differentiates the app. Users expect to see their chart immediately after input.

**Independent Test**: Can be tested with a fixed birth date - verify chart calculations are accurate according to traditional Bazi rules and display is clear and readable.

**Acceptance Scenarios**:

1. **Given** user has provided valid birth date, **When** system calculates the chart, **Then** Four Pillars are displayed with clear labels (Year, Month, Day, Hour)
2. **Given** birth information is missing hour, **When** system generates chart, **Then** Hour Pillar shows as optional/unknown with clear indication
3. **Given** user views their chart, **When** they examine each pillar, **Then** they can understand what Heavenly Stem and Earthly Branch represent without needing external help (brief tooltips provided)
4. **Given** user refreshes or returns to their profile, **When** they view the chart, **Then** calculations remain consistent and accurate

---

### User Story 3 - Personal Profile Analysis (Priority: P1)

Based on the calculated Bazi chart, the system analyzes and displays the user's profile across multiple dimensions: personality traits, career prospects, wealth/fortune trends, romantic relationships, and near-term outlook. Information is presented in plain language with minimal specialized terminology.

**Why this priority**: Core value delivery - users want meaningful insights, not just technical calculations.

**Independent Test**: Can be tested independently with a known Bazi configuration - verify analysis covers all five dimensions, uses accessible language, and insights are coherent.

**Acceptance Scenarios**:

1. **Given** user views their analysis, **When** they read the personality section, **Then** they understand key character traits without needing to look up Bazi terminology
2. **Given** user reviews career section, **When** they read it, **Then** they receive actionable insights about career direction and potential strengths
3. **Given** user checks wealth/fortune section, **When** they read it, **Then** insights are balanced (not overly optimistic or pessimistic) and avoid false promises
4. **Given** user examines romantic/relationship section, **When** they read it, **Then** insights are respectful and focus on personality compatibility rather than deterministic predictions
5. **Given** user views near-term outlook, **When** they see it, **Then** guidance is practical and reflects patterns from their chart

---

### User Story 4 - Result Sharing & Storage (Priority: P2)

Users can save their analysis result locally and share it with others through text copy.

**Why this priority**: Enables result preservation and sharing. Secondary priority since core analysis (P1 stories) must work first.

**Independent Test**: Can verify save and share functionality independently - ensure data persists correctly and share formats are readable.

**Acceptance Scenarios**:

1. **Given** user completes their analysis, **When** they tap save profile, **Then** the analysis is saved to LocalStorage and can be retrieved after page reload
2. **Given** user wants to share results, **When** they select share/copy option, **Then** formatted analysis text is copied to clipboard for sharing via messaging or email
3. **Given** user saves a new analysis, **When** they save it, **Then** the new analysis replaces the previously saved profile (single profile mode)
4. **Given** user saves an analysis, **When** they refresh the browser, **Then** the saved analysis is restored from LocalStorage

---

### User Story 5 - Extensibility Foundation (Priority: P3)

The architecture supports future expansion with annual Bazi forecast (Luck Cycles/大運), personalized recommendations module, and additional analysis dimensions.

**Why this priority**: Nice-to-have technical foundation. Doesn't block MVP but good to establish while building core features.

**Independent Test**: Can verify architecture supports plugin/module loading pattern independently.

**Acceptance Scenarios**:

1. **Given** core features are complete, **When** developer reviews codebase, **Then** analysis modules are cleanly separated and new analysis types can be added without modifying core chart generation
2. **Given** user views their profile, **When** future modules are added, **Then** new analysis sections integrate seamlessly without disrupting existing functionality

---

### Edge Cases

- What happens when user provides only year and month (no day)? → System requires at least year-month-day; day is mandatory
- How does system handle leap year dates or traditionally ambiguous calendar conversions? → Uses standard Gregorian-to-Lunar conversion. For dates 1900–2100: full 100% accuracy. For dates before 1900 or after 2100: displays "calculated with estimated accuracy" warning to user
- What if user enters birth time but it's outside valid range (e.g., 25:00)? → System shows time validation error with format examples (valid range: 00:00–23:59)
- Can user update their birth information after initial entry? → Yes, regenerating chart with new calculation; previous version discarded
- Does system work offline? → Analysis engine should be fully offline-capable; data syncing is future consideration (not in MVP)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept birth date input (year, month, day) in a clear, user-friendly format
- **FR-002**: System MUST accept optional birth time input (hour and minute) with validation
- **FR-003**: System MUST validate all date/time inputs against Gregorian calendar rules and show user-friendly error messages
- **FR-004**: System MUST calculate Bazi chart according to traditional Eight Characters system rules:
  - Determine Heavenly Stems and Earthly Branches for Year, Month, Day, and Hour Pillars
  - Correctly map lunar calendar dates to Bazi stems/branches
  - Handle leap months and calendar edge cases consistently
- **FR-005**: System MUST display the Four Pillars chart with clear labels and visual hierarchy
- **FR-006**: System MUST calculate and display Five Elements (五行) distribution and interactions for the chart
- **FR-007**: System MUST determine Ten Gods (十神) configuration based on Day Master and all other stems/branches
- **FR-008**: System MUST analyze personality traits (性格特質) based on Five Elements, Ten Gods, and overall chart structure
- **FR-009**: System MUST provide career/professional development analysis (事業發展) based on strengths and chart indicators
- **FR-010**: System MUST provide wealth and financial fortune analysis (財運走勢) based on chart configuration
- **FR-011**: System MUST provide romantic and relationship analysis (感情關係) based on chart indicators and Ten Gods
- **FR-012**: System MUST provide near-term outlook and current period guidance (近期運勢) with practical suggestions
- **FR-013**: System MUST present all analysis results in structured text format using clear, accessible language via rule-based template engine that generates text based on chart indicators
- **FR-014**: System MUST minimize use of specialized Bazi terminology; where necessary, brief explanations must be included. Analysis rules MUST map Bazi concepts (Five Elements, Ten Gods, pillar strengths) to accessible personality/career/financial language
- **FR-015**: System MUST allow users to save their analysis to LocalStorage (single profile mode: new saves overwrite previous profile). Profile must persist across browser sessions
- **FR-016**: System MUST support copying analysis results to clipboard in readable text format for sharing via messaging, email, or other applications

### Key Entities

- **User Profile**: Represents a person's birth information
  - Birth Date (year, month, day)
  - Birth Time (hour, minute) - optional
  - Generated Timestamp
  - Chart Calculation Result (cached)

- **Bazi Chart**: The calculated Four Pillars reading
  - Year Pillar (Heavenly Stem + Earthly Branch)
  - Month Pillar (Heavenly Stem + Earthly Branch)
  - Day Pillar (Heavenly Stem + Earthly Branch)
  - Hour Pillar (Heavenly Stem + Earthly Branch)
  - Five Elements Distribution (木火土金水)
  - Ten Gods Configuration

- **Analysis Result**: Multi-dimensional insight report
  - Personality Profile (text)
  - Career Analysis (text)
  - Wealth/Fortune Analysis (text)
  - Relationship Analysis (text)
  - Current Period Outlook (text)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can input their birth information and receive a Bazi chart within 2 seconds of submission
- **SC-002**: Analysis text for all five dimensions (personality, career, wealth, relationships, outlook) must be readable and understandable by users without Bazi knowledge (test: 90% of first-time users complete reading without needing to look up terminology)
- **SC-003**: Bazi chart calculations for birth dates between 1900–2100 must be verified as accurate against traditional Eight Characters system (100% accuracy against verified reference data). For dates outside this range, system displays "calculated with estimated accuracy" warning
- **SC-004**: Users can save and retrieve their profile without losing any information (100% data persistence)
- **SC-005**: System must work reliably for birth dates spanning 1900–2100 without calculation errors; dates outside this range show appropriate accuracy warnings
- **SC-006**: Application must remain responsive even when processing complex chart calculations (no UI freezing, calculations complete in under 2 seconds)
- **SC-007**: Users should feel the analysis provides genuine personal insight (target: 85% user satisfaction rating on profile relevance and accuracy)

---

## Assumptions

1. **Calendar System**: The app uses Gregorian calendar for input but converts internally to Lunar calendar for Bazi calculation. Users understand entering their Gregorian birth date.

2. **Time Zone & Location**: Birth time is assumed to be local solar time. System does not require timezone input (simplification for MVP); future versions can add timezone adjustment.

3. **Accuracy Limitations**: Traditional Bazi requires precise birth time; without hour data, Hour Pillar analysis is limited. System clearly indicates this limitation when time is not provided. Calendar conversion accuracy: system guarantees 100% accuracy for births 1900–2100; dates outside this range show "estimated accuracy" warning to users.

4. **Data Privacy**: User birth profiles are stored locally on device; no cloud sync in MVP. Future versions can add optional cloud backup.

5. **Language & Cultural Context**: Analysis text is written in accessible Traditional Chinese (繁體中文). Avoids overly mystical framing; balances traditional wisdom with practical insight. Target audience includes Taiwan, Hong Kong, and Singapore users.

6. **Analysis Scope**: System provides personality and tendency analysis, not absolute prediction or life guarantee. Wording makes clear that Bazi provides perspective, not determinism.

---

## Technical Context *(for planning phase)*

**Language/Version**: Web app (to be implemented in React, Vue, or similar framework)

**Primary Dependencies**: Established Bazi calculation library (JavaScript/TypeScript); Date/Calendar library for Gregorian-to-Lunar conversion (if not included in Bazi library)

**Storage**: Browser LocalStorage for saving single user profile and chart results. Single profile mode: new profile saves automatically overwrite previous saved data

**Testing**:
- Unit tests for chart calculation and input validation
- Rule engine tests for analysis text generation (verify rule mappings against fixture charts)
- Test fixtures: Pre-calculated Bazi charts stored for independent story testing (enables parallel test execution per Principle 2)
- Integration tests for full user flows (combining all stories)
- Manual testing for analysis quality, terminology accessibility, and user satisfaction

**Target Platform**: Web browser (desktop and mobile responsive)

**Performance Goals**: Chart calculation <2 seconds, page load <3 seconds, analysis text generation <1 second

**Constraints**: Offline-capable (no internet requirement), minimal dependencies for calculations, accessible UI for reading-heavy analysis

**Scale/Scope**: MVP supports single user per device/session; future versions can add user accounts and social features

---

## Future Expansion Modules *(listed for context, NOT in MVP scope)*

These features are explicitly OUT OF SCOPE for this feature but should inform architecture:

1. **Annual Bazi Forecast (大運 & 流年)**: Yearly and 10-year cycle analysis
2. **Personalized Recommendations**: Actionable life advice based on chart weaknesses
3. **Compatibility Matching**: Compare two Bazi charts for romantic or partnership compatibility
4. **Historical & Celebrity Profiles**: Pre-loaded famous person Bazi for learning
5. **User Accounts & Social**: Multi-device sync, sharing profiles, community features

---
