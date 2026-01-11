# Implementation Plan: Western Astrology Analysis System

**Feature Branch**: `002-western-astrology`
**Created**: 2026-01-11
**Status**: Planning Phase
**Feature Spec**: [Western Astrology Analysis System](./spec.md)

---

## Technical Context

### Technology Stack (User-Specified)

**Frontend**:
- React 18+ with TypeScript
- Vite as build tool
- TanStack Query (React Query) for server state management
- TailwindCSS for styling
- React Router for navigation

**Backend**:
- Express.js with TypeScript
- Node.js runtime
- Database: PostgreSQL (recommended for relational data consistency)
- ORM: Prisma (TypeScript-first, excellent type safety)

**External APIs**:
- ProKerala API (Free tier for Western astrology calculations)
- OpenAI ChatGPT API (for analysis generation)

**Deployment & Infrastructure**:
- Vercel or Railway for hosting (user preference TBD)
- Environment management: dotenv for secrets

---

## Phase 0: Research & Technical Decisions

### Research Topics

1. **ProKerala API Integration Pattern**
   - Endpoint: GET /western_astrology/natal_chart
   - Authentication: Free tier (no auth required or API key)
   - Rate limits: Check documentation for daily limits
   - Response format: JSON with planetary positions, houses, zodiac placements
   - Error scenarios: Invalid location, future dates, missing parameters

2. **OpenAI ChatGPT API Integration**
   - Model: gpt-3.5-turbo (cost-effective) or gpt-4 (more accurate analysis)
   - Token estimation: ~500-1000 tokens per analysis
   - Streaming: Supported for better UX
   - Rate limits: 60 requests/minute on free tier
   - Error handling: Retry logic for rate limits and timeouts

3. **Database Design**
   - PostgreSQL selected for data consistency and ACID compliance
   - Prisma ORM for type-safe queries
   - Schema: Users, NatalCharts, LifeAnalyses tables
   - Relationships: One user → Many charts → Many analyses

4. **Authentication Strategy**
   - Session-based approach for simplicity
   - JWT tokens for stateless auth (alternative)
   - Optional guest mode for chart generation without auth
   - User consent mechanism for data persistence

5. **State Management & Caching**
   - TanStack Query for server state synchronization
   - Stale-while-revalidate pattern for chart data
   - Background refetch for location validation

---

## Phase 1: System Architecture

### Data Model & Database Schema

#### User Profile
```typescript
model User {
  id            String   @id @default(cuid())
  email         String?  @unique
  username      String?
  natalCharts   NatalChart[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### Natal Chart
```typescript
model NatalChart {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  birthDate     String   // YYYY-MM-DD
  birthTime     String?  // HH:MM or null if unknown
  birthLocation String   // city name or "lat,lon"
  latitude      Float?
  longitude     Float?
  timeZone      String?
  chartData     Json     // Full ProKerala API response
  analyses      LifeAnalysis[]
  createdAt     DateTime @default(now())
  retrievedAt   DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
}
```

#### Planetary Placement (nested in chartData JSON)
```typescript
{
  planet: "Sun" | "Moon" | "Ascendant" | "Mercury" | "Venus" | "Mars" |
          "Jupiter" | "Saturn" | "Uranus" | "Neptune" | "Pluto",
  sign: "Aries" | "Taurus" | ... | "Pisces",
  degree: 0.0-29.9,
  house: 1-12,
  retrograde?: boolean
}
```

#### Life Analysis
```typescript
model LifeAnalysis {
  id            String   @id @default(cuid())
  chartId       String
  chart         NatalChart @relation(fields: [chartId], references: [id])
  lifeArea      String   // "relationships" | "career" | "finances" | "personal_growth"
  analysisText  String   @db.Text
  tokensUsed    Int
  generatedAt   DateTime @default(now())
  expiresAt     DateTime? // For optional refresh

  @@index([chartId])
  @@index([lifeArea])
}
```

### API Contracts

#### REST Endpoints

**POST /api/charts** - Generate natal chart
```
Request:
{
  birthDate: "YYYY-MM-DD",
  birthTime: "HH:MM" | null,
  birthLocation: "City" | "lat,lon"
}

Response (Success 200):
{
  id: "uuid",
  birthDate: "YYYY-MM-DD",
  birthTime: "HH:MM",
  birthLocation: "City",
  chartData: { ... ProKerala response ... },
  createdAt: ISO8601
}

Errors:
- 400: Invalid input (date in future, invalid format)
- 404: Location not found (ambiguous)
- 503: ProKerala API unavailable
```

**GET /api/charts/:chartId** - Retrieve saved chart
```
Response (Success 200):
{
  id: "uuid",
  chartData: { ... },
  planetaryPlacements: [
    { planet: "Sun", sign: "Aries", degree: 15.5, house: 1 },
    ...
  ]
}

Errors:
- 404: Chart not found
- 403: Unauthorized (if user check enabled)
```

**GET /api/users/me/charts** - List user's saved charts
```
Query Params:
- limit: number (default 10)
- offset: number (default 0)

Response (Success 200):
{
  charts: [
    { id, birthDate, birthLocation, createdAt },
    ...
  ],
  total: number
}
```

**POST /api/analyses** - Generate AI analysis
```
Request:
{
  chartId: "uuid",
  lifeArea: "relationships" | "career" | "finances" | "personal_growth"
}

Response (Success 200):
{
  id: "uuid",
  analysisText: "...",
  generatedAt: ISO8601,
  tokensUsed: number
}

Errors:
- 400: Invalid lifeArea
- 404: Chart not found
- 429: Rate limited (too many requests)
- 503: ChatGPT API unavailable
```

**POST /api/charts/:chartId/save** - Save chart to user profile
```
Request:
{
  name?: "Custom Chart Name"
}

Response (Success 200):
{
  id: "uuid",
  savedAt: ISO8601
}

Errors:
- 404: Chart not found
- 409: Already saved
```

---

## Backend Architecture

### Directory Structure
```
backend/
├── src/
│   ├── types/
│   │   ├── astrology.ts      // Planetary, House types
│   │   ├── api.ts            // Request/Response types
│   │   └── index.ts
│   ├── services/
│   │   ├── ProkeralaService.ts   // Chart retrieval
│   │   ├── ChatGPTService.ts      // Analysis generation
│   │   ├── ChartService.ts        // Chart business logic
│   │   ├── LocationService.ts     // Location validation
│   │   └── index.ts
│   ├── routes/
│   │   ├── charts.ts         // POST /charts, GET /charts/:id
│   │   ├── analyses.ts       // POST /analyses
│   │   ├── users.ts          // GET /users/me/charts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts           // Session/JWT validation
│   │   ├── errorHandler.ts   // Global error catching
│   │   ├── validation.ts     // Input validation
│   │   └── index.ts
│   ├── database/
│   │   └── schema.prisma     // Prisma schema
│   ├── config/
│   │   └── env.ts            // Environment variables
│   ├── app.ts                // Express app setup
│   └── server.ts             // Entry point
├── prisma/
│   └── schema.prisma
├── .env.example
├── package.json
└── tsconfig.json
```

### Service Layer Patterns

**ProKerala Service**
```typescript
class ProkeralaService {
  async getNatalChart(
    birthDate: string,
    birthTime: string | null,
    location: { lat: number; lon: number; timeZone: string }
  ): Promise<NatalChartData>

  async geocodeLocation(location: string): Promise<Coordinates>
}
```

**ChatGPT Service**
```typescript
class ChatGPTService {
  async generateAnalysis(
    planetaryPlacements: PlanetaryPlacement[],
    lifeArea: LifeArea
  ): Promise<{ text: string; tokensUsed: number }>

  buildPrompt(placements: PlanetaryPlacement[], lifeArea: string): string
}
```

---

## Frontend Architecture

### Directory Structure
```
frontend/
├── src/
│   ├── types/
│   │   ├── astrology.ts      // Planetary types
│   │   ├── api.ts            // API response types
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useChart.ts       // TanStack Query hooks
│   │   ├── useAnalysis.ts
│   │   ├── useLocationSearch.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── forms/
│   │   │   └── BirthInfoForm.tsx
│   │   ├── chart/
│   │   │   ├── ChartDisplay.tsx
│   │   │   ├── PlanetaryInfo.tsx
│   │   │   └── HouseDisplay.tsx
│   │   ├── analysis/
│   │   │   ├── AnalysisPanel.tsx
│   │   │   └── AnalysisLoader.tsx
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── GenerateChartPage.tsx
│   │   ├── ChartDetailPage.tsx
│   │   ├── SavedChartsPage.tsx
│   │   └── AnalysisPage.tsx
│   ├── services/
│   │   ├── api.ts            // Axios client
│   │   └── queryClient.ts    // TanStack Query config
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

### Component Hierarchy
```
<App>
  <Router>
    <GenerateChartPage>
      <BirthInfoForm>
      <ChartDisplay>
        <PlanetaryInfo (modal)>
    <SavedChartsPage>
      <ChartsList>
    <AnalysisPage>
      <AnalysisPanel>
        <AnalysisLoader>
```

### TanStack Query Patterns
```typescript
// Custom hooks using useQuery/useMutation
const useGenerateChart = () =>
  useMutation({
    mutationFn: (birthInfo) => api.post('/charts', birthInfo)
  })

const useSavedCharts = () =>
  useQuery({
    queryKey: ['charts'],
    queryFn: () => api.get('/users/me/charts')
  })

const useAnalysis = (chartId: string) =>
  useMutation({
    mutationFn: (lifeArea) =>
      api.post('/analyses', { chartId, lifeArea })
  })
```

---

## Task Decomposition (High-Level)

### P1: Core Chart Generation
- [ ] Backend: Setup Express + TypeScript + Prisma
- [ ] Backend: Implement ProKerala API client
- [ ] Backend: Create /api/charts POST endpoint
- [ ] Backend: Input validation (date, time, location)
- [ ] Frontend: Create BirthInfoForm component
- [ ] Frontend: Setup TanStack Query + API client
- [ ] Frontend: Implement chart generation mutation
- [ ] Frontend: Build ChartDisplay component
- [ ] Testing: Integration tests for full flow

### P2: Enhanced Display & AI Analysis
- [ ] Frontend: Build PlanetaryInfo modal
- [ ] Backend: Implement ChatGPT service
- [ ] Backend: Create /api/analyses POST endpoint
- [ ] Frontend: Create AnalysisPanel component
- [ ] Frontend: Implement analysis mutation
- [ ] Testing: Prompt engineering validation

### P3: Data Persistence
- [ ] Backend: Setup user authentication (session-based)
- [ ] Backend: Create /api/users/me/charts endpoint
- [ ] Backend: Implement chart save logic
- [ ] Frontend: Build SavedChartsPage
- [ ] Frontend: Add chart list and retrieval
- [ ] Testing: Data persistence flows

---

## Success Criteria Mapping

| Criterion | Implementation Detail | Tech Component |
|-----------|----------------------|-----------------|
| SC-001: 2-min chart generation | ProKerala API call + Prisma save | Backend service + DB |
| SC-002: 100% accuracy | Direct API response passthrough | ProKerala integration |
| SC-003: 1-min AI analysis | ChatGPT streaming + optimized prompt | ChatGPT service |
| SC-004: 90% relevance | Prompt includes actual placements | Prompt engineering |
| SC-005: Graceful error handling | Try-catch + user-friendly messages | Error middleware |
| SC-006: Save/retrieve | User auth + chart queries | Prisma + session |
| SC-007: Input validation | Frontend + backend validation | Zod/Yup schemas |
| SC-008: Worldwide support | ProKerala geocoding | Location service |

---

## Dependencies & Integration Points

### External Services
- **ProKerala API**: Blocks chart generation (critical)
- **ChatGPT API**: Blocks analysis feature (important)
- **PostgreSQL**: Blocks data persistence (important)

### Open Questions Requiring Clarification
1. ProKerala rate limits and free tier details
2. ChatGPT model selection (3.5-turbo vs 4) and budget
3. User authentication requirement (session vs JWT vs optional)
4. Data retention policy for saved charts
5. Hosting platform preference (Vercel, Railway, etc.)

---

## Next Steps

1. **Research Phase Completion**: Gather ProKerala and ChatGPT API details
2. **Database Setup**: Initialize PostgreSQL + Prisma schema
3. **Backend Bootstrap**: Create Express server structure
4. **Frontend Bootstrap**: Setup Vite + React + TanStack Query
5. **API Contract Documentation**: Generate OpenAPI schema
6. **Task Generation**: Convert decomposition into actionable JIRA-style tasks

---

**Status**: Phase 1 Complete - Ready for Task Generation
**Estimated Development Timeline**: 3-4 weeks for full implementation
**Next Command**: `/speckit.tasks` to generate detailed task list
