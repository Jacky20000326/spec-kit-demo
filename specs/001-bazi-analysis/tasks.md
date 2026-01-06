---

description: "Task list for Bazi analysis web app implementation"

---

# Tasks: Bazi Analysis & Profile Generation

**Input**: Design documents from `/specs/001-bazi-analysis/`
**Prerequisites**: plan.md (required), spec.md (required), data-model.md, contracts/, quickstart.md

**Status**: Ready for implementation

**Notes**: Tasks organized by user story for independent implementation and testing. Each story can be developed, tested, and deployed independently.

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Path Conventions

- **Frontend**: `frontend/src/`, `frontend/tests/`
- Paths shown below assume single React frontend application

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create React + TypeScript project using Vite per quickstart.md
- [ ] T002 Install core dependencies (React, TypeScript, TanStack Query, Tailwind CSS, Vitest)
- [ ] T003 [P] Configure Vite (vite.config.ts) with React plugin and TypeScript support
- [ ] T004 [P] Configure Tailwind CSS (tailwind.config.js) with responsive breakpoints and color scheme
- [ ] T005 [P] Configure TypeScript (tsconfig.json) with strict mode and path aliases
- [ ] T006 [P] Configure Vitest (vitest.config.ts) with jsdom environment and test setup
- [ ] T007 [P] Configure ESLint (.eslintrc.json) and Prettier (.prettierrc) for code quality
- [ ] T008 Create project structure: src/{components,pages,services,hooks,types,constants,context,utils}
- [ ] T009 [P] Create base types files: src/types/{bazi,analysis,api,storage}.types.ts (empty interfaces, will fill per story)
- [ ] T010 [P] Create base constants file: src/constants/messages.ts with Traditional Chinese UI messages
- [ ] T011 Set up Git configuration and initial commit for project scaffold

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T012 [P] Install bazi npm package and create wrapper service: frontend/src/services/baziCalculation.ts
- [ ] T013 [P] Install openai npm package and create ChatGPT integration service: frontend/src/services/chatgptAnalysis.ts
- [ ] T014 [P] Implement input validation utility: frontend/src/utils/validation.ts (date/time validation functions)
- [ ] T015 [P] Implement date conversion utility: frontend/src/utils/dateConversion.ts (Gregorian-to-Lunar helpers)
- [ ] T016 [P] Implement LocalStorage service: frontend/src/services/storage.ts with save/load/clear methods
- [ ] T017 [P] Create ApiKeyContext for ChatGPT API key management: frontend/src/context/ApiKeyContext.tsx
- [ ] T018 [P] Create AppContext for global app state: frontend/src/context/AppContext.tsx
- [ ] T019 Set up TanStack Query provider and queryClient: frontend/src/queryClient.ts
- [ ] T020 [P] Create common components: frontend/src/components/Common/{LoadingSpinner,ErrorBoundary,Toast,Header}.tsx
- [ ] T021 [P] Create base layout component: frontend/src/components/Layout/AppLayout.tsx
- [ ] T022 Create test fixtures for Bazi charts: frontend/tests/fixtures/baziCharts.fixture.ts (20+ test charts)
- [ ] T023 [P] Create test fixtures for test data: frontend/tests/fixtures/testData.ts (valid/invalid birth profiles)
- [ ] T024 Set up test utilities and helpers: frontend/tests/setup.ts
- [ ] T025 Create analysis rule definitions: frontend/src/constants/analysisRuleDefinitions.ts (personality, career, wealth, relationship, outlook rules)
- [ ] T026 Implement rule engine service: frontend/src/services/analysisRules.ts (matches chart to rules)
- [ ] T027 Create Bazi mappings (Five Elements, Ten Gods, Stems/Branches): frontend/src/constants/baziMappings.ts
- [ ] T028 Create app config with placeholders: frontend/src/config.ts (API endpoints, constants)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Birth Profile Input (Priority: P1) 🎯 MVP Entry Point

**Goal**: Users can input birth date and time with validation, ready for chart calculation

**Independent Test**: Form input can be tested independently without other stories - verify validation, error messages, date/time acceptance

### Tests for User Story 1 (Unit Tests)

- [ ] T029 [P] [US1] Unit test for date validation: frontend/tests/unit/validation.test.ts (test all date edge cases)
- [ ] T030 [P] [US1] Unit test for time validation: frontend/tests/unit/validation.test.ts (valid hours 0-23, minutes 0-59)
- [ ] T031 [US1] Unit test for date conversion helpers: frontend/tests/unit/dateConversion.test.ts (Gregorian conversion)

### Implementation for User Story 1

- [ ] T032 [P] [US1] Create BirthDateForm component: frontend/src/components/Input/BirthDateForm.tsx (year, month, day, hour, minute inputs)
- [ ] T033 [US1] Implement form submission handler with validation: frontend/src/components/Input/BirthDateForm.tsx
- [ ] T034 [P] [US1] Create error message component: frontend/src/components/Input/BirthDateForm.tsx (display validation errors in plain Chinese)
- [ ] T035 [US1] Add date boundary checking (1900-2100 range check with accuracy warning): frontend/src/utils/validation.ts
- [ ] T036 [US1] Implement future date prevention: frontend/src/utils/validation.ts
- [ ] T037 [P] [US1] Create custom hook for form state: frontend/src/hooks/useBirthProfileInput.ts
- [ ] T038 [US1] Integrate BirthDateForm into HomePage: frontend/src/pages/HomePage.tsx

### Integration for User Story 1

- [ ] T039 [P] [US1] Create integration test: frontend/tests/integration/inputValidation.test.ts (full form flow with validation)
- [ ] T040 [US1] Test story 1 end-to-end: input date → validation → ready for next step

**Checkpoint**: User Story 1 complete and independently testable. Users can input birth date with proper validation.

---

## Phase 4: User Story 2 - Bazi Chart Generation (Priority: P1)

**Goal**: Calculate and display Bazi chart (Four Pillars) from birth profile

**Independent Test**: Chart generation can be tested with fixture birth dates - verify calculations match expected output, display is clear

### Tests for User Story 2 (Unit + Integration Tests)

- [ ] T041 [P] [US2] Unit test for Bazi calculation wrapper: frontend/tests/unit/baziCalculation.test.ts (test library integration)
- [ ] T042 [P] [US2] Unit test for Five Elements calculation: frontend/tests/unit/baziCalculation.test.ts (wood, fire, earth, metal, water counts)
- [ ] T043 [P] [US2] Unit test for Ten Gods configuration: frontend/tests/unit/baziCalculation.test.ts (ten god mappings)
- [ ] T044 [US2] Integration test for full chart calculation: frontend/tests/integration/baziCalculation.test.ts (input → chart calculation → validation)

### Implementation for User Story 2

- [ ] T045 [P] [US2] Complete BaziChart type definitions: frontend/src/types/bazi.types.ts (Pillar, FiveElementsDistribution, TenGodsConfig interfaces)
- [ ] T046 [P] [US2] Implement Bazi calculation service wrapper: frontend/src/services/baziCalculation.ts (call bazi library, map output to our types)
- [ ] T047 [P] [US2] Create custom hook for Bazi calculation: frontend/src/hooks/useBaziCalculation.ts (TanStack Query wrapper)
- [ ] T048 [P] [US2] Create Pillar component: frontend/src/components/Chart/PillarDisplay.tsx (display single pillar with stem/branch/element)
- [ ] T049 [US2] Create BaziChart display component: frontend/src/components/Chart/BaziChart.tsx (display all 4 pillars)
- [ ] T050 [P] [US2] Create Five Elements visualization: frontend/src/components/Chart/ElementsVisualization.tsx (show wood, fire, earth, metal, water distribution)
- [ ] T051 [US2] Add tooltips to pillars (explain Heavenly Stems, Earthly Branches): frontend/src/components/Chart/PillarDisplay.tsx
- [ ] T052 [P] [US2] Handle missing hour pillar (show as "Unknown" with clear indication): frontend/src/components/Chart/BaziChart.tsx
- [ ] T053 [US2] Add accuracy warning for dates outside 1900-2100 range: frontend/src/components/Chart/BaziChart.tsx
- [ ] T054 [US2] Integrate BaziChart into HomePage flow: frontend/src/pages/HomePage.tsx

### Integration for User Story 2

- [ ] T055 [P] [US2] Integration test for chart calculation + display: frontend/tests/integration/chartDisplay.test.ts
- [ ] T056 [US2] Test story 1 + story 2 together: input date → calculate chart → display pillars

**Checkpoint**: User Story 2 complete. Users can see their Bazi chart with all pillars, elements, and tooltips.

---

## Phase 5: User Story 3 - Personal Profile Analysis (Priority: P1)

**Goal**: Generate multi-dimensional analysis (personality, career, wealth, relationship, outlook) from Bazi chart

**Independent Test**: Analysis generation can be tested with fixture charts - verify all 5 dimensions present, language accessible, ChatGPT integration works

### Tests for User Story 3 (Unit + Integration Tests)

- [ ] T057 [P] [US3] Unit test for rule engine: frontend/tests/unit/analysisRules.test.ts (rules match correctly to fixture charts)
- [ ] T058 [P] [US3] Unit test for personality rules: frontend/tests/unit/analysisRules.test.ts (personality rule matching)
- [ ] T059 [P] [US3] Unit test for career rules: frontend/tests/unit/analysisRules.test.ts (career strengths detection)
- [ ] T060 [P] [US3] Unit test for wealth/fortune rules: frontend/tests/unit/analysisRules.test.ts (wealth indicators)
- [ ] T061 [P] [US3] Unit test for relationship/compatibility rules: frontend/tests/unit/analysisRules.test.ts
- [ ] T062 [US3] Integration test for ChatGPT API with MOCKED responses: frontend/tests/integration/apiIntegration.test.ts (verify API key handling, prompt building, response parsing using mocked ChatGPT responses to ensure test reliability per Constitution Principle 2 - no flaky tests)
- [ ] T063 [US3] Integration test for full analysis generation: frontend/tests/integration/analysisGeneration.test.ts (chart → rules → mocked ChatGPT → result, verify all 5 analysis dimensions present)

### Implementation for User Story 3

- [ ] T064 [P] [US3] Complete AnalysisResult types: frontend/src/types/analysis.types.ts (all analysis dimensions)
- [ ] T065 [P] [US3] Complete ChatGPT API types: frontend/src/types/api.types.ts (request/response schemas)
- [ ] T066 [P] [US3] Complete analysis rule definitions: frontend/src/constants/analysisRuleDefinitions.ts (all personality, career, wealth, relationship, outlook rules)
- [ ] T067 [US3] Implement rule engine service (complete): frontend/src/services/analysisRules.ts (full matching logic, confidence scoring)
- [ ] T068 [P] [US3] Implement ChatGPT service (complete): frontend/src/services/chatgptAnalysis.ts (prompt building, API calls, response parsing, error handling)
- [ ] T069 [US3] Implement prompt engineering for Traditional Chinese analysis: frontend/src/services/chatgptAnalysis.ts (build clear prompts in Chinese)
- [ ] T070 [P] [US3] Create custom hook for analysis generation: frontend/src/hooks/useAnalysisGeneration.ts (TanStack Query useMutation wrapper)
- [ ] T071 [P] [US3] Create analysis display components: frontend/src/components/Analysis/{PersonalitySection,CareerSection,WealthSection,RelationshipSection,OutlookSection}.tsx
- [ ] T072 [US3] Create AnalysisPanel container: frontend/src/components/Analysis/AnalysisPanel.tsx (combines all 5 sections)
- [ ] T073 [US3] Add loading state for ChatGPT API calls: frontend/src/components/Analysis/AnalysisPanel.tsx (show spinner while generating)
- [ ] T074 [US3] Add error handling for ChatGPT API failures: frontend/src/components/Analysis/AnalysisPanel.tsx (API quota, network errors)
- [ ] T075 [US3] Integrate AnalysisPanel into HomePage flow: frontend/src/pages/HomePage.tsx
- [ ] T076 [P] [US3] Create text formatter for analysis: frontend/src/services/formatter.ts (format analysis text for display/sharing)
- [ ] T077 [US3] Add terminology glossary tooltips (explain specialized terms): frontend/src/components/Analysis/AnalysisPanel.tsx

### Integration for User Story 3

- [ ] T078 [P] [US3] Integration test for full user journey (Stories 1+2+3): frontend/tests/integration/fullFlow.test.ts
- [ ] T079 [US3] Test with fixture chart + ChatGPT mock: input → chart → analysis generation → display

**Checkpoint**: User Story 3 complete. All 5 analysis dimensions generated and displayed with ChatGPT integration working.

---

## Phase 6: User Story 4 - Result Sharing & Storage (Priority: P2)

**Goal**: Save profile to LocalStorage and share analysis text

**Independent Test**: Storage operations can be tested independently - verify save/load/clear work, data persists across sessions, sharing format is readable

### Tests for User Story 4 (Unit + Integration Tests)

- [ ] T080 [P] [US4] Unit test for LocalStorage service: frontend/tests/unit/storage.test.ts (save, load, clear, exists methods)
- [ ] T081 [P] [US4] Unit test for custom hook (useLocalStorage): frontend/tests/unit/useLocalStorage.test.ts
- [ ] T082 [US4] Integration test for save/load flow: frontend/tests/integration/storage.test.ts (save → page reload → load)
- [ ] T083 [US4] Test single profile mode: new save overwrites old profile

### Implementation for User Story 4

- [ ] T084 [P] [US4] Complete storage types: frontend/src/types/storage.types.ts (SavedProfile, StorageOperations)
- [ ] T085 [P] [US4] Implement LocalStorage service (complete): frontend/src/services/storage.ts (full save/load/clear/exists implementation)
- [ ] T086 [P] [US4] Create custom hook for LocalStorage: frontend/src/hooks/useLocalStorage.ts
- [ ] T087 [P] [US4] Create SaveButton component: frontend/src/components/Storage/SaveButton.tsx (trigger save action)
- [ ] T088 [US4] Implement save handler: frontend/src/components/Storage/SaveButton.tsx (save profile + chart + analysis to LocalStorage)
- [ ] T089 [US4] Add success/error toast notifications: frontend/src/components/Storage/SaveButton.tsx (use Toast component)
- [ ] T090 [P] [US4] Create ShareButton component: frontend/src/components/Storage/ShareButton.tsx (copy analysis to clipboard)
- [ ] T091 [US4] Implement share handler with formatting: frontend/src/components/Storage/ShareButton.tsx (format analysis for readable sharing)
- [ ] T092 [P] [US4] Create LoadProfile component: frontend/src/components/Storage/LoadProfile.tsx (load and restore saved profile)
- [ ] T093 [US4] Implement auto-load on app startup: frontend/src/App.tsx (check for saved profile, restore if exists)
- [ ] T094 [US4] Add "overwrite previous profile" confirmation dialog: frontend/src/components/Storage/SaveButton.tsx
- [ ] T095 [US4] Test single profile mode logic: saving new profile should replace old one
- [ ] T096 [US4] Integrate storage components into HomePage: frontend/src/pages/HomePage.tsx

### Integration for User Story 4

- [ ] T097 [P] [US4] Integration test for complete flow with storage: frontend/tests/integration/storageFlow.test.ts
- [ ] T098 [US4] Test: input → analysis → save → reload page → load previous profile

**Checkpoint**: User Story 4 complete. Users can save and share their analysis results.

---

## Phase 7: User Story 5 - Extensibility Foundation (Priority: P3)

**Goal**: Establish modular architecture supporting future expansion (annual forecast, recommendations, etc.)

**Independent Test**: Architecture review by developer - verify clean separation, easy to add new analysis modules

### Implementation for User Story 5

- [ ] T099 Create analysis module pattern documentation: frontend/docs/ANALYSIS_MODULES.md (guide for adding new analysis)
- [ ] T100 [P] Refactor analysis service into modular structure: frontend/src/services/analysisModules/ (separate personality, career, wealth modules)
- [ ] T101 [P] Create analysis module registry/loader: frontend/src/services/analysisModules/registry.ts (enable plugin-style loading)
- [ ] T102 Create migration path documentation for adding: annual forecast, recommendations, compatibility
- [ ] T103 Ensure all analysis rules are in separate configuration file for easy updates: frontend/src/constants/analysisRuleDefinitions.ts

### Integration for User Story 5

- [ ] T104 Code review: verify modular structure supports future expansion without modification to core chart generation

**Checkpoint**: Architecture ready for future modules. Development infrastructure complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements affecting multiple user stories

- [ ] T105 [P] Add comprehensive error handling across all components: frontend/src/components/Common/ErrorBoundary.tsx (all error cases)
- [ ] T106 [P] Add loading states for all async operations: use LoadingSpinner in relevant components
- [ ] T107 [P] Implement responsive design validation: test on mobile (sm), tablet (md), desktop (lg/xl)
- [ ] T108 [P] Add Traditional Chinese i18n for all UI text: frontend/src/constants/messages.ts (complete all strings)
- [ ] T109 [P] Add accessibility features: keyboard navigation, aria labels, color contrast (WCAG AA minimum)
- [ ] T110 [P] Write unit test utilities and helpers: frontend/tests/helpers.ts (render functions, mocks)
- [ ] T111 [P] Complete unit test suite: frontend/tests/unit/ (aim for 80%+ coverage of core logic)
- [ ] T112 [P] Complete integration test suite: frontend/tests/integration/ (all user story flows)
- [ ] T113 [P] Add E2E tests (optional): frontend/tests/e2e/ (Playwright or Cypress)
- [ ] T114 Performance profiling: use Lighthouse, React DevTools Profiler to identify bottlenecks
- [ ] T115 Bundle size analysis: `npm run build`, target <5MB gzipped
- [ ] T116 Optimize images and assets: ensure all images are optimized
- [ ] T117 [P] Add proper console logging and error reporting: frontend/src/utils/logger.ts
- [ ] T118 Run linting and fix all issues: `npm run lint:fix`
- [ ] T119 Run Prettier formatting: `npm run format`
- [ ] T120 Create comprehensive README.md: frontend/README.md (setup, running, architecture overview)
- [ ] T121 Create DEVELOPMENT.md: frontend/docs/DEVELOPMENT.md (development guide)
- [ ] T122 Create API INTEGRATION.md: frontend/docs/API_INTEGRATION.md (ChatGPT API key setup)
- [ ] T123 Test complete flow end-to-end: input → chart → analysis → save → load → share
- [ ] T124 Manual testing with REAL ChatGPT API (after T062 mocked tests pass): frontend/tests/manual/ verify analysis quality, terminology accessibility, and user satisfaction with actual API responses (final acceptance testing only, not part of automated test suite per Constitution Principle 2)
- [ ] T125 Verify all success criteria (SC-001 through SC-007) are met: performance, accuracy, satisfaction
- [ ] T126 Final commit and merge to main branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS** all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Stories 1-4 can proceed in parallel (if staffed) or sequentially
  - Story 5 (P3) depends on Stories 1-4 completion for extensibility validation
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Input)**: Can start after Foundational - No dependencies on other stories
- **User Story 2 (P1 - Chart)**: Can start after Foundational - Can run parallel with US1, but ideally after US1 (uses US1 output)
- **User Story 3 (P1 - Analysis)**: Can start after Foundational - Can run parallel with US1/US2, but ideally after US2 (uses US2 output)
- **User Story 4 (P2 - Storage)**: Can start after Foundational - Can run parallel with US1-3 (independent of chart/analysis)
- **User Story 5 (P3 - Architecture)**: Depends on US1-4 completion - Validates overall structure

### Within Each User Story

- Tests (unit) MUST be written and FAIL before implementation
- Models/Types before Services
- Services before Components/Hooks
- Components before Integration
- Unit tests before Integration tests
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (T001-T011)**:
- T003-T007, T009-T010 can run in parallel (independent config files)

**Foundational Phase (T012-T028)**:
- T012-T018, T020-T021, T023-T027 can run in parallel (independent services/components)

**User Stories (Phase 3-7)**:
- Stories 1, 2, 3, 4 can be developed in parallel by different developers
- Within US1: T029, T032, T034 can run in parallel
- Within US2: T041, T042, T043, T045-T053 can run in parallel (different components/tests)
- Within US3: T057-T062, T064-T077 can run in parallel (different rules, components)
- Within US4: T080, T081, T084-T092 can run in parallel (different components)

**Polish Phase**:
- T105-T120 can run in parallel (different concerns)

---

## Parallel Example: User Story 1 Full Parallel Execution

```
Parallel Block 1 (Foundation must complete first):
  Task: T029 - Write date validation tests
  Task: T030 - Write time validation tests
  Task: T032 - Create BirthDateForm component
  Task: T034 - Create error message component
  Task: T037 - Create form state hook

Sequential Dependencies:
  T033 (form submission) depends on T032
  T035, T036 (validation) depend on T014 (validation utility)
  T038 (integrate into HomePage) depends on T037, T032

Result: US1 complete and independently testable
```

---

## Parallel Example: User Stories 1-4 Parallel Development

```
Team Structure (4 developers):

Developer A:
  - Phase 2: Foundational infrastructure
  - Then: User Story 1 (input + validation)

Developer B:
  - Phase 2: Foundational infrastructure
  - Then: User Story 2 (chart generation) [parallel with A's US1]

Developer C:
  - Phase 2: Foundational infrastructure
  - Then: User Story 3 (analysis generation) [parallel with A's US1 and B's US2]

Developer D:
  - Phase 2: Foundational infrastructure
  - Then: User Story 4 (storage/sharing) [parallel with all other stories]

Timeline:
  Day 1-2: All developers work on Phase 2 (Foundational) together
  Day 3-5: Developers split and work on US1, US2, US3, US4 in parallel
  Day 6: Integration testing and dependencies
  Day 7-8: Polish and final testing
```

---

## Recommended Development Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup (T001-T011) ✓ Project ready
2. Complete Phase 2: Foundational (T012-T028) ✓ Infrastructure ready
3. Complete Phase 3: User Story 1 (T029-T040) ✓ Input form working
4. Complete Phase 4: User Story 2 (T041-T056) ✓ Chart generation working
5. Complete Phase 5: User Story 3 (T057-T079) ✓ Analysis generation working
6. **STOP and VALIDATE**: Run full flow test (T078-T079)
7. Deploy MVP with core 3 stories to users for feedback

**MVP Deployment Ready**: After T079, you have a working MVP

### Incremental Delivery (Add Features Gradually)

1. Complete MVP (US1-3 above)
2. Add User Story 4 (T080-T098): Save & Share
3. Add User Story 5 (T099-T104): Extensibility
4. Complete Polish & Testing (T105-T126)

### Parallel Team Strategy (Maximum Velocity)

With 4+ developers:
1. All developers: Phase 1 & 2 together (T001-T028)
2. Split into US teams: Each handles one story in parallel
3. Developer E: Polish phase work (tests, docs, optimization)
4. Day 6: Integration and dependency testing across all stories
5. Final days: Optimization and launch preparation

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Write and run tests BEFORE implementation for each story
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Story 1-3 form MVP scope
- Story 4 adds value without breaking previous stories
- Story 5 enables future expansion

---

## Testing Checkpoints

1. **After US1 (T040)**: Input validation works, form accepts/rejects dates properly
2. **After US2 (T056)**: Chart calculation works, displays 4 pillars correctly
3. **After US3 (T079)**: Analysis generation works, all 5 dimensions displayed
4. **After US4 (T098)**: Save/load/share functionality works, data persists
5. **After US5 (T104)**: Architecture review confirms extensibility
6. **After Polish (T126)**: All SC criteria met, ready for production

---

## File Checklist After Completion

**Frontend Structure**:
- ✓ frontend/src/components/ - All UI components
- ✓ frontend/src/pages/ - HomePage, ProfilePage
- ✓ frontend/src/services/ - baziCalculation, chatgptAnalysis, analysisRules, storage, formatter
- ✓ frontend/src/hooks/ - useBaziCalculation, useAnalysisGeneration, useLocalStorage, useApiKey, useBirthProfileInput
- ✓ frontend/src/types/ - bazi, analysis, api, storage types
- ✓ frontend/src/constants/ - messages, baziMappings, analysisRuleDefinitions, config
- ✓ frontend/src/context/ - ApiKeyContext, AppContext
- ✓ frontend/src/utils/ - validation, dateConversion, logger
- ✓ frontend/tests/ - unit, integration, e2e, fixtures

**Configuration**:
- ✓ vite.config.ts, vitest.config.ts, tsconfig.json, tailwind.config.js
- ✓ .eslintrc.json, .prettierrc, .gitignore

**Documentation**:
- ✓ README.md, DEVELOPMENT.md, API_INTEGRATION.md, ANALYSIS_MODULES.md

---
