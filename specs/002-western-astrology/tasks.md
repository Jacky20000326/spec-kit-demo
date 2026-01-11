# Implementation Tasks: Western Astrology Analysis System

**Feature**: Western Astrology Analysis System
**Branch**: `002-western-astrology`
**Created**: 2026-01-11
**Status**: Ready for Implementation

---

## Overview

This document breaks down all implementation work into actionable tasks organized by user story and priority. Each task is independently executable and includes clear file paths and acceptance criteria.

**User Stories**:
- **US1** (P1): Generate Personal Natal Chart
- **US2** (P2): View Detailed Chart Information
- **US3** (P2): AI-Powered Life Analysis
- **US4** (P3): Save and Manage Charts

**Task Organization**:
- Phase 1: Setup & Infrastructure
- Phase 2: Foundational Services & Database
- Phase 3: User Story 1 (Core Chart Generation)
- Phase 4: User Story 2 (Chart Details)
- Phase 5: User Story 3 (AI Analysis)
- Phase 6: User Story 4 (Data Persistence)
- Phase 7: Polish & Cross-Cutting Concerns

---

## Phase 1: Setup & Project Initialization

### Goal
Initialize project structure, tooling, and development environment for both backend and frontend.

### Phase 1 Tasks

- [ ] T001 Setup backend project structure with Express + TypeScript
  - Location: `backend/`
  - Create: `backend/package.json`, `backend/tsconfig.json`, `backend/src/` directories
  - Install: express, typescript, ts-node, @types/node, @types/express, dotenv
  - File: `backend/src/app.ts`, `backend/src/server.ts`

- [ ] T002 Setup frontend project structure with React + TypeScript + Vite
  - Location: `frontend/`
  - Command: `npm create vite@latest . -- --template react-ts`
  - Install: react-router-dom, axios, @tanstack/react-query, tailwindcss
  - File: `frontend/src/App.tsx`, `frontend/src/main.tsx`

- [ ] T003 Initialize Git and create .gitignore for both projects
  - File: `.gitignore`, `backend/.gitignore`, `frontend/.gitignore`
  - Exclude: `node_modules/`, `.env`, `dist/`, `*.log`, `build/`

- [ ] T004 Setup environment configuration files
  - Backend: `backend/.env.example` with OPENAI_API_KEY, DATABASE_URL, PORT, NODE_ENV, CORS_ORIGIN
  - Frontend: `frontend/.env.example` with VITE_API_BASE_URL, VITE_APP_NAME
  - Location: Root of each project

- [ ] T005 [P] Setup PostgreSQL database and Prisma ORM
  - Install: `@prisma/client`, `prisma`
  - Init: `npx prisma init`
  - File: `backend/prisma/schema.prisma`
  - Config: Add DATABASE_URL to backend/.env

- [ ] T006 Configure TailwindCSS for frontend styling
  - Install: tailwindcss, postcss, autoprefixer
  - Generate: `tailwind.config.js`, `postcss.config.js`
  - File: `frontend/src/index.css` with Tailwind directives
  - Location: `frontend/`

- [ ] T007 [P] Setup ESLint and Prettier for code quality
  - Install: eslint, prettier, typescript-eslint
  - Files: `.eslintrc.json`, `.prettierrc.json` in both projects
  - Location: `backend/`, `frontend/`

- [ ] T008 [P] Create development startup scripts
  - Backend: `npm run dev` (ts-node with watch)
  - Frontend: `npm run dev` (Vite dev server)
  - File: `backend/package.json`, `frontend/package.json`
  - Both projects should start on different ports (3000, 5173)

---

## Phase 2: Foundational Services & Database Schema

### Goal
Establish core infrastructure including database models, API client setup, and shared services that all user stories depend on.

### Phase 2 Tasks

- [ ] T009 Create Prisma schema for User, NatalChart, LifeAnalysis models
  - File: `backend/prisma/schema.prisma`
  - Include: User model, NatalChart model, LifeAnalysis model with relationships
  - Fields: See data-model.md for complete field specification
  - Indexes: userId, createdAt, chartId indexes

- [ ] T010 Generate Prisma client and run initial migration
  - Command: `npx prisma migrate dev --name init`
  - Output: `node_modules/.prisma/client`
  - Verify: Database tables created

- [ ] T011 [P] Create TypeScript type definitions for astrology entities
  - File: `backend/src/types/astrology.ts`
  - Types: PlanetaryPlacement, NatalChartData, ZodiacSign, LifeArea enum
  - Reference: data-model.md for type definitions

- [ ] T012 [P] Create TypeScript type definitions for API contracts
  - File: `backend/src/types/api.ts`
  - Include: Request/Response types for all 7 endpoints
  - Reference: contracts.md for exact structures

- [ ] T013 [P] Setup ProKerala API client service
  - File: `backend/src/services/ProkeralaService.ts`
  - Methods: getNatalChart(birthDate, birthTime, location), geocodeLocation(cityName)
  - Error handling: Handle API errors gracefully
  - Caching: Implement 24h cache for chart data

- [ ] T014 [P] Setup OpenAI ChatGPT API client service
  - File: `backend/src/services/ChatGPTService.ts`
  - Methods: generateAnalysis(placements, lifeArea), buildPrompt(placements, lifeArea)
  - Model: Use gpt-3.5-turbo
  - Streaming: Support SSE for streaming responses
  - Error handling: Rate limit and timeout handling

- [ ] T015 [P] Create location validation and geocoding service
  - File: `backend/src/services/LocationService.ts`
  - Methods: validateLocation(input), geocodeCity(cityName)
  - Ambiguity handling: Return multiple options if ambiguous
  - Integration: Use Google Maps API or ProKerala geocoding

- [ ] T016 Setup Express app with middleware
  - File: `backend/src/app.ts`
  - Middleware: cors, express.json(), errorHandler, requestLogger
  - CORS config: Allow frontend origin from .env
  - Error handler: Catch and format all errors

- [ ] T017 Create Express error handling middleware
  - File: `backend/src/middleware/errorHandler.ts`
  - Features: Catch errors, format responses, log errors
  - Format: Consistent JSON error response with error code, message, details

- [ ] T018 [P] Create input validation middleware
  - File: `backend/src/middleware/validation.ts`
  - Use: Zod schema validation for request bodies
  - Schemas: Create reusable schemas for chart, analysis, location validation

- [ ] T019 Setup frontend API client with Axios
  - File: `frontend/src/services/api.ts`
  - Features: Base URL from .env, error handling, request/response interceptors
  - Authentication: Include credentials for session cookies

- [ ] T020 [P] Setup TanStack Query (React Query) configuration
  - File: `frontend/src/services/queryClient.ts`
  - Config: Default options for queries and mutations
  - Defaults: staleTime, cacheTime, retry logic
  - Devtools: Include ReactQueryDevtools for development

- [ ] T021 [P] Create reusable ErrorBoundary component
  - File: `frontend/src/components/common/ErrorBoundary.tsx`
  - Features: Catch React errors, display user-friendly messages
  - Integration: Wrap App component with ErrorBoundary

- [ ] T022 [P] Create LoadingSpinner component
  - File: `frontend/src/components/common/LoadingSpinner.tsx`
  - Features: Animated spinner with loading message
  - Styling: Use TailwindCSS
  - Reusable: Export for use in forms and panels

---

## Phase 3: User Story 1 - Generate Personal Natal Chart (P1)

### Goal
Enable users to generate their natal chart by providing birth information. This is the core feature and MVP scope.

### Independent Test Criteria
✅ User can enter birth date (YYYY-MM-DD), birth time (HH:MM), and birth location
✅ System retrieves complete natal chart from ProKerala API
✅ System displays all 11 planetary placements with zodiac signs, degrees, house placements
✅ System handles validation errors gracefully
✅ System handles API unavailability gracefully

### Phase 3 Tasks

- [ ] T023 [US1] Create input validation schemas for birth information
  - File: `backend/src/schemas/chartSchemas.ts`
  - Schemas: birthDate (past date only), birthTime (optional HH:MM), birthLocation (non-empty)
  - Library: Use Zod for runtime validation
  - Integration: Use in validation middleware

- [ ] T024 [US1] Implement ChartService business logic
  - File: `backend/src/services/ChartService.ts`
  - Methods: generateChart(birthDate, birthTime, location), validateChartInput()
  - Features: Orchestrate ProKerala + location services
  - Error handling: Handle validation, API, and location errors

- [ ] T025 [US1] Create POST /api/charts endpoint
  - File: `backend/src/routes/charts.ts`
  - Request: { birthDate, birthTime, birthLocation }
  - Response: { id, birthDate, birthTime, birthLocation, chartData, createdAt }
  - Error responses: 400 (validation), 503 (API unavailable)
  - Reference: contracts.md for full specification

- [ ] T026 [US1] Create chart response type definitions
  - File: `backend/src/types/responses.ts`
  - Types: ChartResponse, ValidationErrorResponse, APIErrorResponse
  - Fields: Include all required response fields from contracts.md

- [ ] T027 [P] [US1] Create BirthInfoForm component
  - File: `frontend/src/components/forms/BirthInfoForm.tsx`
  - Fields: Birth date (input[type=date]), birth time (input[type=time]), location (text input)
  - Features: Real-time validation, disable submit until valid
  - Styling: TailwindCSS form styles
  - Validation: Frontend validation before API call

- [ ] T028 [P] [US1] Create custom hook useChart for chart generation
  - File: `frontend/src/hooks/useChart.ts`
  - Mutation: useMutation for POST /api/charts
  - Features: Loading, error, and success states
  - Integration: Use TanStack Query mutation

- [ ] T029 [P] [US1] Create ChartDisplay component
  - File: `frontend/src/components/chart/ChartDisplay.tsx`
  - Display: Show all 11 planetary placements in readable format
  - Format: Could be table, cards, or visual wheel (use text format for MVP)
  - Data: Accept chartData prop and display all planetary info
  - Styling: TailwindCSS responsive layout

- [ ] T030 [P] [US1] Create GenerateChartPage
  - File: `frontend/src/pages/GenerateChartPage.tsx`
  - Layout: BirthInfoForm on left, ChartDisplay on right
  - State: Use useChart hook to manage chart generation
  - Loading: Show LoadingSpinner while generating
  - Error: Display user-friendly error messages
  - Success: Display generated chart

- [ ] T031 [P] [US1] Setup React Router with route for chart generation
  - File: `frontend/src/App.tsx`
  - Routes: "/" → GenerateChartPage
  - Layout: Add header with app title/navigation
  - Integration: Wrap App with QueryClientProvider

- [ ] T032 [US1] Create location geocoding integration test
  - File: `backend/tests/integration/locationService.test.ts`
  - Test: Geocode known cities (New York, London, Tokyo)
  - Verify: Returns correct coordinates
  - Edge cases: Ambiguous locations return multiple options

- [ ] T033 [US1] Create ProKerala API integration test
  - File: `backend/tests/integration/prokeralaService.test.ts`
  - Test: Generate chart for known birth date/time/location
  - Verify: Response includes all 11 planets
  - Error case: Invalid coordinates return error

- [ ] T034 [US1] Create full chart generation flow test
  - File: `backend/tests/integration/chartGeneration.e2e.ts`
  - Test: POST /api/charts with valid birth info
  - Verify: Returns 200 with chartData
  - Error: POST /api/charts with invalid date returns 400

---

## Phase 4: User Story 2 - View Detailed Chart Information (P2)

### Goal
Provide contextual information about planetary placements to help users understand their chart meaning.

### Independent Test Criteria
✅ User can click/tap on a planetary placement and see description
✅ Modal displays planetary description (what each planet/sign combination means)
✅ At least 5 major placements have descriptions
✅ Modal can be closed to return to full chart view

### Phase 4 Tasks

- [ ] T035 [US2] Create planetary description database/fixture
  - File: `backend/src/data/planetaryDescriptions.ts`
  - Content: Descriptions for 11 planets × 12 zodiac signs (basic descriptions for MVP)
  - Format: { planet, sign, description }
  - Scope: Simple text descriptions (1-2 sentences each)

- [ ] T036 [US2] Create endpoint to fetch planetary description
  - File: `backend/src/routes/descriptions.ts`
  - Endpoint: GET /api/descriptions/:planet/:sign
  - Response: { planet, sign, description }
  - Error: 404 if planet/sign combination not found

- [ ] T037 [P] [US2] Create custom hook useDescription
  - File: `frontend/src/hooks/useDescription.ts`
  - Query: useQuery for GET /api/descriptions/:planet/:sign
  - Caching: Cache descriptions indefinitely (immutable)
  - Integration: Use TanStack Query

- [ ] T038 [P] [US2] Create PlanetaryInfo modal component
  - File: `frontend/src/components/chart/PlanetaryInfo.tsx`
  - Display: Planet name, zodiac sign, degree, description
  - Features: Clickable items in ChartDisplay trigger modal
  - Styling: TailwindCSS modal with backdrop
  - Close: Button or click outside to close

- [ ] T039 [US2] Add click handlers to ChartDisplay component
  - File: `frontend/src/components/chart/ChartDisplay.tsx` (modify)
  - Feature: Make each planetary placement clickable
  - State: Track selected planet/sign, show PlanetaryInfo modal
  - Integration: Connect to useDescription hook

- [ ] T040 [US2] Create test for planetary descriptions
  - File: `backend/tests/unit/planetaryDescriptions.test.ts`
  - Test: All 11 planets have descriptions for all 12 signs
  - Verify: No missing descriptions

---

## Phase 5: User Story 3 - AI-Powered Life Analysis (P2)

### Goal
Generate personalized AI analysis of the user's chart for specific life areas (relationships, career, finances, personal growth).

### Independent Test Criteria
✅ User can request analysis for a life area (relationships, career, finances, personal_growth)
✅ System generates AI analysis that references user's actual planetary placements
✅ User sees loading indicator while analysis is being generated
✅ System handles ChatGPT API unavailability gracefully

### Phase 5 Tasks

- [ ] T041 [US3] Create analysis prompt template
  - File: `backend/src/prompts/analysisPrompt.ts`
  - Template: System prompt for astrology analysis
  - Variables: Planetary placements, life area, context
  - Personalization: Include actual user chart data in prompt
  - Reference: See research.md for prompt structure

- [ ] T042 [US3] Implement analysis prompt builder in ChatGPTService
  - File: `backend/src/services/ChatGPTService.ts` (modify)
  - Method: buildPrompt(placements, lifeArea) → returns formatted prompt
  - Validation: Ensure all placements included in prompt
  - Testing: Verify prompt structure and token count

- [ ] T043 [US3] Create POST /api/analyses endpoint
  - File: `backend/src/routes/analyses.ts`
  - Request: { chartId, lifeArea }
  - Response: { id, analysisText, tokensUsed, generatedAt }
  - Error responses: 404 (chart not found), 429 (rate limited), 503 (API unavailable)
  - Reference: contracts.md for specification
  - Validation: Verify lifeArea is valid enum

- [ ] T044 [US3] Create AnalysisService for analysis business logic
  - File: `backend/src/services/AnalysisService.ts`
  - Methods: generateAnalysis(chartId, lifeArea), validateAnalysisRequest()
  - Orchestration: Retrieve chart, call ChatGPT, save to DB
  - Caching: Implement analysis caching/deduplication (don't regenerate same analysis)
  - Error handling: Graceful degradation if ChatGPT unavailable

- [ ] T045 [US3] Add analysis storage to database
  - File: `backend/prisma/schema.prisma` (modify)
  - Model: LifeAnalysis (already defined but verify fields)
  - Fields: id, chartId, lifeArea, analysisText, tokensUsed, generatedAt
  - Constraint: Unique(chartId, lifeArea) to prevent duplicates

- [ ] T046 [P] [US3] Create custom hook useAnalysis
  - File: `frontend/src/hooks/useAnalysis.ts`
  - Mutation: useMutation for POST /api/analyses
  - Features: Loading, error, success states
  - Integration: Use TanStack Query mutation
  - Caching: Invalidate chart queries after analysis success

- [ ] T047 [P] [US3] Create AnalysisRequestForm component
  - File: `frontend/src/components/analysis/AnalysisRequestForm.tsx`
  - Fields: Dropdown to select life area (relationships, career, finances, personal_growth)
  - Features: Submit button disabled if chart not loaded
  - Styling: TailwindCSS form design
  - Integration: Call useAnalysis hook on submit

- [ ] T048 [P] [US3] Create AnalysisPanel component
  - File: `frontend/src/components/analysis/AnalysisPanel.tsx`
  - Display: Analysis text in readable format
  - Features: Display life area, generated timestamp
  - Styling: TailwindCSS card layout
  - Interaction: Allow requesting analysis for different life areas

- [ ] T049 [P] [US3] Create AnalysisLoader component
  - File: `frontend/src/components/analysis/AnalysisLoader.tsx`
  - Display: Loading indicator + "Generating analysis..." message
  - Features: Show which life area is being analyzed
  - Styling: TailwindCSS loader animation

- [ ] T050 [P] [US3] Integrate analysis into GenerateChartPage
  - File: `frontend/src/pages/GenerateChartPage.tsx` (modify)
  - Layout: Add analysis section below chart
  - Form: Add AnalysisRequestForm
  - Display: Show AnalysisPanel with results
  - Loading: Show AnalysisLoader while generating

- [ ] T051 [P] [US3] Create AnalysisPage route
  - File: `frontend/src/pages/AnalysisPage.tsx`
  - Purpose: Dedicated page to view/regenerate analyses
  - Layout: List of available analyses, ability to request new ones
  - Navigation: Route /analysis/:chartId
  - Integration: Use useAnalysis hook

- [ ] T052 [US3] Create rate limiting for analysis generation
  - File: `backend/src/middleware/rateLimiter.ts` (modify)
  - Limit: 5 analyses per user per 24 hours
  - Storage: Use Redis or in-memory store
  - Response: 429 with retryAfter header when exceeded

- [ ] T053 [US3] Create ChatGPT API error handling test
  - File: `backend/tests/unit/chatGPTService.test.ts`
  - Test: Mock ChatGPT timeout, rate limit, server error
  - Verify: Returns graceful error response
  - Testing: Use mocked API calls

---

## Phase 6: User Story 4 - Save and Manage Charts (P3)

### Goal
Enable users to save their charts and retrieve them later without re-entering birth information.

### Independent Test Criteria
✅ User can save a generated chart with optional name
✅ User can retrieve saved charts in a subsequent session
✅ System displays list of all saved charts with creation date
✅ User can delete a saved chart

### Phase 6 Tasks

- [ ] T054 [US4] Create session-based authentication setup
  - File: `backend/src/middleware/auth.ts`
  - Library: express-session
  - Config: .env variables for SESSION_SECRET, SESSION_STORE
  - Database: Configure PostgreSQL session store
  - Features: Create session on first request, include in response cookies

- [ ] T055 [US4] Create User model and endpoints for registration/login
  - File: `backend/src/routes/auth.ts`
  - Endpoints: POST /auth/register, POST /auth/login, POST /auth/logout
  - Features: Password hashing (bcrypt), session creation
  - Validation: Email format, password requirements
  - Error responses: 400 (invalid), 409 (already exists)

- [ ] T056 [US4] Implement POST /api/charts/:chartId/save endpoint
  - File: `backend/src/routes/charts.ts` (modify)
  - Request: { name? }
  - Response: { id, savedAt }
  - Features: Associate chart with authenticated user
  - Error: 401 if not authenticated, 404 if chart not found, 409 if already saved

- [ ] T057 [US4] Modify NatalChart model to support user association
  - File: `backend/prisma/schema.prisma` (modify)
  - Field: Add userId foreign key to NatalChart
  - Relationship: User has many NatalCharts
  - Migration: npx prisma migrate dev --name add_user_to_charts

- [ ] T058 [US4] Implement GET /api/users/me/charts endpoint
  - File: `backend/src/routes/users.ts`
  - Response: { charts: [{ id, birthDate, birthLocation, createdAt }], pagination }
  - Query params: limit, offset for pagination
  - Features: Return only user's own charts, sorted by createdAt DESC
  - Auth: Require authenticated session

- [ ] T059 [US4] Implement DELETE /api/charts/:chartId endpoint
  - File: `backend/src/routes/charts.ts` (modify)
  - Response: { message, deletedAt }
  - Features: Soft delete (set isMarkedForDeletion = true)
  - Auth: Only chart owner can delete
  - Cascade: Also delete associated analyses

- [ ] T060 [P] [US4] Create authentication context in frontend
  - File: `frontend/src/contexts/AuthContext.tsx`
  - Features: Track logged-in user, auth state, login/logout functions
  - State: User profile, isAuthenticated, loading
  - Integration: Provide to entire app via Context Provider

- [ ] T061 [P] [US4] Create useAuth custom hook
  - File: `frontend/src/hooks/useAuth.ts`
  - Methods: login(email, password), register(email, password), logout()
  - Integration: Use AuthContext
  - Validation: Handle validation errors from server

- [ ] T062 [P] [US4] Create SaveChartModal component
  - File: `frontend/src/components/chart/SaveChartModal.tsx`
  - Form: Optional name field, save button
  - Features: Call save endpoint, show success message
  - Auth: Prompt login if not authenticated
  - Integration: Use useAuth and mutation hook

- [ ] T063 [P] [US4] Add save button to ChartDisplay component
  - File: `frontend/src/components/chart/ChartDisplay.tsx` (modify)
  - Button: "Save Chart" at bottom of chart
  - Feature: Opens SaveChartModal on click
  - State: Disable if chart not loaded

- [ ] T064 [P] [US4] Create SavedChartsPage component
  - File: `frontend/src/pages/SavedChartsPage.tsx`
  - Display: Table/list of all saved charts
  - Columns: Birth date, birth location, creation date, actions
  - Actions: View details, delete
  - Features: Pagination, sorting
  - Query: Use TanStack Query to fetch from GET /api/users/me/charts

- [ ] T065 [US4] Create custom hook useSavedCharts
  - File: `frontend/src/hooks/useSavedCharts.ts`
  - Query: useQuery for GET /api/users/me/charts
  - Features: Pagination, refetch on mutation success
  - Integration: Automatically invalidate on save/delete

- [ ] T066 [P] [US4] Create navigation header with auth state
  - File: `frontend/src/components/Header.tsx`
  - Display: App logo, nav links
  - Auth section: Login button (if logged out) or username + logout (if logged in)
  - Navigation: Links to GenerateChartPage, SavedChartsPage
  - Integration: Use useAuth hook

- [ ] T067 [US4] Add SavedChartsPage route to App
  - File: `frontend/src/App.tsx` (modify)
  - Route: /saved-charts → SavedChartsPage
  - Auth: Require authentication for access
  - Integration: Add Header component

- [ ] T068 [US4] Create data retention cleanup task
  - File: `backend/src/jobs/cleanupDeletedCharts.ts`
  - Purpose: Hard delete charts marked for deletion after 30 days
  - Schedule: Run daily at midnight
  - Safety: Only delete soft-deleted records

---

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Add final touches, improve UX/performance, and handle edge cases across all features.

### Phase 7 Tasks

- [ ] T069 [P] Create comprehensive error boundary for unhandled API errors
  - File: `frontend/src/middleware/apiErrorHandler.ts`
  - Features: Log errors, show retry button for transient errors
  - Pattern: "Unexpected error occurred. Please try again."
  - Reference: contracts.md error patterns

- [ ] T070 [P] Implement API request retry logic with exponential backoff
  - File: `backend/src/utils/retryUtil.ts`
  - Features: Retry failed requests up to 3 times
  - Backoff: 1s, 2s, 4s delays
  - Use cases: ProKerala API calls, ChatGPT API calls

- [ ] T071 [P] Create loading states and skeletons for better UX
  - Files: Multiple skeleton components (ChartSkeleton, AnalysisSkeleton, etc.)
  - Location: `frontend/src/components/skeletons/`
  - Integration: Use during data loading

- [ ] T072 Add comprehensive logging to backend
  - File: `backend/src/utils/logger.ts`
  - Features: Debug, info, warn, error levels
  - Output: Console (dev), file (prod)
  - Integration: Use in all services and routes

- [ ] T073 [P] Create testing utilities and test fixtures
  - File: `backend/tests/fixtures/` and `frontend/tests/fixtures/`
  - Content: Mock data, factory functions for test objects
  - Use: Consistent test data across all test files

- [ ] T074 Implement database connection pooling
  - File: `backend/src/database/connection.ts`
  - Config: pool_size in connection string
  - Optimization: Prevent connection exhaustion

- [ ] T075 [P] Create frontend form validation with Zod
  - File: `frontend/src/schemas/`
  - Schemas: BirthInfoSchema, AnalysisRequestSchema
  - Integration: Use in forms before API calls
  - Validation: Real-time field validation

- [ ] T076 Create comprehensive README documentation
  - File: `README.md` in root
  - Sections: Setup, architecture, API docs, testing, deployment
  - Reference: Point to quickstart.md for detailed setup

- [ ] T077 [P] Create build and deployment configuration
  - Backend: `backend/Dockerfile`, `backend/docker-compose.yml`
  - Frontend: `frontend/nginx.conf` for production build
  - Scripts: Build scripts in package.json for both projects

- [ ] T078 Implement monitoring and error tracking
  - Service: Sentry integration (optional for MVP)
  - File: `backend/src/config/sentry.ts`
  - Features: Capture unhandled errors, track performance

- [ ] T079 Add analytics tracking (optional)
  - File: `frontend/src/analytics.ts`
  - Events: Chart generated, analysis requested, chart saved
  - Service: Google Analytics or Mixpanel (configurable)

- [ ] T080 Create user feedback/suggestion form
  - Component: `frontend/src/components/FeedbackForm.tsx`
  - Features: Allow users to submit feedback from UI
  - Endpoint: POST /api/feedback (optional backend)

- [ ] T081 [P] Implement caching strategy documentation
  - File: `CACHING.md`
  - Explain: What's cached (24h for charts), why, how to invalidate
  - Reference: Performance targets from spec

- [ ] T082 Create deployment and migration guides
  - Files: `DEPLOYMENT.md`, `MIGRATION.md`
  - Content: Step-by-step instructions for deploying to production
  - Database: Migration strategy and rollback procedures

---

## Task Dependencies & Parallel Execution

### Dependency Graph

```
Phase 1: Setup
  ↓
Phase 2: Foundational (Services, DB, Types)
  ├── T009-T010 (Prisma DB) must complete before T024-T026 (Chart endpoints)
  ├── T013-T015 (Services) must complete before T024 (ChartService)
  └── T016-T022 (Express/React setup) independent, can run in parallel
  ↓
Phase 3: US1 (Chart Generation) - CRITICAL PATH, must complete first
  ├── All foundational tasks must complete
  ├── T023-T026 (Backend endpoints)
  ├── T027-T034 (Frontend components & tests)
  └── Prerequisite for US2, US3, US4
  ↓
Phase 4: US2 (Chart Details)
  ├── Depends on US1 completion
  ├── Independent of US3, US4
  └── T035-T040
  ↓
Phase 5: US3 (AI Analysis)
  ├── Depends on US1 completion
  ├── Independent of US2, US4
  └── T041-T053
  ↓
Phase 6: US4 (Data Persistence)
  ├── Depends on US1 completion
  ├── Can run in parallel with US2/US3
  └── T054-T068
  ↓
Phase 7: Polish
  └── Depends on all features complete

```

### Parallel Execution Examples

**Parallel in Phase 2** (Foundation):
- T011, T012 (TypeScript types) can run in parallel with T013-T015 (Services)
- T006, T007, T008 (Frontend tooling) can run in parallel with T009-T010 (Database)

**Parallel in Phase 3** (US1):
- T027, T029, T031 (Frontend components) can run in parallel with T023-T026 (Backend)
- T032-T034 (Backend tests) can run in parallel with T027-T031 (Frontend)

**Parallel in Phases 4-6**:
- Phase 4 (US2), Phase 5 (US3), Phase 6 (US4) can start once Phase 3 completes
- Within each phase, frontend tasks can run in parallel with backend tasks

---

## Task Statistics

- **Total Tasks**: 82
- **Setup Phase**: 8 tasks
- **Foundational Phase**: 14 tasks
- **US1 (P1) Phase**: 12 tasks
- **US2 (P2) Phase**: 6 tasks
- **US3 (P2) Phase**: 12 tasks
- **US4 (P3) Phase**: 15 tasks
- **Polish Phase**: 15 tasks

### By Component
- **Backend Tasks**: 45
- **Frontend Tasks**: 25
- **Full-Stack Tasks**: 10
- **Infrastructure/DevOps**: 2

### By Parallelization
- **[P] (Parallelizable)**: 28 tasks (34%)
- **Sequential**: 54 tasks (66%)

---

## MVP Scope Recommendation

**Minimum Viable Product** includes only **User Story 1**:

**Core Tasks** (12 tasks in Phase 3):
- T023: Input validation
- T024: ChartService
- T025: POST /api/charts endpoint
- T026: Response types
- T027: BirthInfoForm component
- T028: useChart hook
- T029: ChartDisplay component
- T030: GenerateChartPage
- T031: React Router setup
- T032: Location integration test
- T033: ProKerala integration test
- T034: Full flow E2E test

**Estimated Timeline**: 1-2 weeks
**Deliverable**: Users can generate and view their natal chart

**Phase 2 & Phase 3 together enable**:
- Basic chart generation
- Data display
- Error handling
- API integration testing

**Add to MVP** (Optional, if time permits):
- Phase 4: Planetary descriptions (adds educational value, small effort)

**Post-MVP** (Phases 5-6):
- AI analysis (separate development, business logic heavy)
- Data persistence (requires auth, more complex UX)

---

## Test Strategy

**Tests by Priority**:
1. Integration tests for API endpoints (T032-T034, T052)
2. Unit tests for services (T053)
3. Component tests for React components (T040)
4. E2E tests for user journeys

**Testing Framework**:
- Backend: Jest + Supertest for HTTP testing
- Frontend: Vitest + React Testing Library
- E2E: Playwright or Cypress

---

## Implementation Notes

1. **Start with T001-T008**: Setup and initialization complete in ~2 hours
2. **Then Phase 2 (T009-T022)**: Foundation work in parallel, ~4-6 hours
3. **Then Phase 3 (T023-T034)**: Core feature, ~10-15 hours
4. **Each subsequent phase**: ~8-12 hours depending on complexity

**Total Estimated Effort**: 40-50 hours for full implementation (all 82 tasks)
**MVP Timeline**: 10-15 hours for core chart generation (Phase 1-3)

---

## Next Actions

1. ✅ Review this task list
2. ✅ Assign tasks to developers
3. ⏭️ Start with Phase 1 (Setup)
4. ⏭️ Follow dependency graph for task ordering
5. ⏭️ Use [P] markers to identify parallelizable work
6. ⏭️ Track progress using checklist format

---

**Ready to begin implementation! Start with T001 and follow the dependency graph.**
