# Developer Quickstart: Western Astrology Analysis System

**Feature**: Western Astrology Analysis System (002-western-astrology)
**Updated**: 2026-01-11
**Stack**: React + TypeScript + Vite | Express + TypeScript | PostgreSQL + Prisma

---

## Quick Navigation

- 📋 **[Feature Specification](./spec.md)** - Requirements and user stories
- 🏗️ **[Implementation Plan](./plan.md)** - Architecture and design decisions
- 🔬 **[Research Document](./research.md)** - Technology choices and rationale
- 📊 **[Data Model](./data-model.md)** - Database schema and entities
- 🔌 **[API Contracts](./contracts.md)** - REST endpoint specifications
- ✅ **[Quality Checklist](./checklists/requirements.md)** - Spec validation

---

## Development Environment Setup

### Prerequisites

- Node.js 18+ LTS
- npm or yarn
- PostgreSQL 14+ (local or cloud)
- Git
- Code editor (VSCode recommended)

### Project Structure

```
bazi-analysis/
├── backend/              # Express TypeScript server
│   ├── src/
│   │   ├── types/       # Type definitions
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Express middleware
│   │   └── app.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/             # React Vite app
│   ├── src/
│   │   ├── types/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── package.json
└── specs/
    └── 002-western-astrology/  # This feature
        ├── spec.md
        ├── plan.md
        ├── data-model.md
        └── ...
```

---

## Getting Started

### 1. Backend Setup

```bash
# Clone and navigate
cd backend
npm install

# Setup environment
cp .env.example .env
# Edit .env with your values:
# DATABASE_URL=postgresql://user:password@localhost:5432/western_astrology
# PROKERALA_API_KEY=<optional>
# OPENAI_API_KEY=sk-...
# NODE_ENV=development

# Setup database
npx prisma migrate dev --name init
npx prisma generate

# Start development server
npm run dev
# Server runs on http://localhost:3000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend
npm install

# Setup environment
cp .env.example .env
# Edit .env:
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_APP_NAME=Western Astrology

# Start development server
npm run dev
# App runs on http://localhost:5173
```

### 3. Database Setup

```bash
# Using PostgreSQL locally
createdb western_astrology
# Or use cloud database (Supabase, Railway, etc.)

# Apply migrations
npx prisma migrate deploy

# Seed sample data (optional)
npx prisma db seed
```

---

## Key Files to Understand First

### Backend

**`src/types/astrology.ts`** - Core type definitions
```typescript
interface PlanetaryPlacement {
  sign: ZodiacSign
  degree: number
  house: number
}

interface NatalChartData {
  sun: PlanetaryPlacement
  moon: PlanetaryPlacement
  // ... other planets
}
```

**`src/services/ProkeralaService.ts`** - ProKerala API integration
```typescript
class ProkeralaService {
  async getNatalChart(birthDate, birthTime, location)
  async geocodeLocation(cityName)
}
```

**`src/services/ChatGPTService.ts`** - OpenAI integration
```typescript
class ChatGPTService {
  async generateAnalysis(placements, lifeArea)
  buildPrompt(placements, lifeArea)
}
```

**`prisma/schema.prisma`** - Database schema
- User model
- NatalChart model
- LifeAnalysis model

### Frontend

**`src/hooks/useChart.ts`** - TanStack Query hooks for chart operations
```typescript
const useGenerateChart = () => useMutation(...)
const useSavedCharts = () => useQuery(...)
```

**`src/components/forms/BirthInfoForm.tsx`** - Birth info input form
```typescript
<BirthInfoForm onSubmit={handleGenerateChart} />
```

**`src/components/chart/ChartDisplay.tsx`** - Chart visualization
```typescript
<ChartDisplay chartData={data} onPlanetClick={handleShowInfo} />
```

---

## Common Development Tasks

### Running Tests

```bash
# Backend unit tests
cd backend
npm run test

# Backend integration tests
npm run test:integration

# Frontend component tests
cd frontend
npm run test

# E2E tests (after both servers running)
npm run test:e2e
```

### Database Operations

```bash
# Create new migration
npx prisma migrate dev --name feature_name

# View data in database UI
npx prisma studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Verify schema
npx prisma validate
```

### API Testing

```bash
# Using curl
curl -X POST http://localhost:3000/api/charts \
  -H "Content-Type: application/json" \
  -d '{"birthDate":"1995-03-15","birthTime":"14:30","birthLocation":"New York, USA"}'

# Using Postman: Import API contracts from contracts.md
# Using REST Client VSCode extension: Create requests in .rest files
```

### Debugging

**Backend**:
```bash
# Run with debugger
node --inspect-brk dist/server.js

# Use VSCode debugger with launch.json config
```

**Frontend**:
```bash
# React DevTools browser extension
# Chrome DevTools console

# TanStack Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
<ReactQueryDevtools initialIsOpen={false} />
```

---

## Feature Development Checklist

### P1: Chart Generation (Core Feature)

- [ ] Backend:
  - [ ] Setup Express + TypeScript boilerplate
  - [ ] Implement ProKerala service
  - [ ] Create POST /charts endpoint
  - [ ] Setup database models
  - [ ] Add input validation

- [ ] Frontend:
  - [ ] Create BirthInfoForm component
  - [ ] Setup TanStack Query client
  - [ ] Implement chart generation mutation
  - [ ] Build ChartDisplay component
  - [ ] Add error handling UI

- [ ] Testing:
  - [ ] Unit tests for validation
  - [ ] Integration tests for chart generation flow
  - [ ] E2E test for user journey

### P2: Enhanced Features

- [ ] PlanetaryInfo modal component
- [ ] ChatGPT analysis service
- [ ] Analysis generation endpoint
- [ ] AnalysisPanel display component
- [ ] Streaming response handling

### P3: Data Persistence

- [ ] User authentication setup
- [ ] Chart save endpoint
- [ ] SavedChartsPage component
- [ ] Chart listing and retrieval
- [ ] Data deletion flows

---

## Configuration Reference

### Backend (.env)

```
# Server
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/western_astrology

# APIs
PROKERALA_API_KEY=<optional>
OPENAI_API_KEY=sk-...

# Session
SESSION_SECRET=<random_string>

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```
# API
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000

# App
VITE_APP_NAME=Western Astrology
VITE_APP_VERSION=0.1.0

# Features
VITE_ENABLE_ANALYTICS=false
```

---

## Common Issues & Solutions

### Issue: Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
```bash
# Check PostgreSQL is running
psql --version

# Start PostgreSQL
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql
# Windows: Open Services and start PostgreSQL

# Verify connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/western_astrology
```

### Issue: ProKerala API 429 Rate Limit

**Error**: `Too Many Requests`

**Solution**:
- Implement request caching (research.md has pattern)
- Use Redis for distributed caching
- Reduce test API calls (mock in tests)
- Consider upgrading to paid tier if production scale

### Issue: TanStack Query Cache Not Updating

**Error**: Data stale after mutation

**Solution**:
```typescript
// Invalidate cache after mutation
const queryClient = useQueryClient()
const mutation = useMutation({
  mutationFn: generateChart,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['charts'] })
  }
})
```

### Issue: CORS Error When Calling API

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
```typescript
// Backend: Enable CORS for frontend origin
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

// Frontend: Include credentials in requests
const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  withCredentials: true
})
```

---

## Performance Optimization Tips

### Backend

1. **Add database indexes** (spec in data-model.md)
   ```bash
   npx prisma migrate dev --name add_indexes
   ```

2. **Implement request caching**
   - ProKerala responses: Cache for 24h (immutable)
   - Location geocoding: Cache for 7 days

3. **Use connection pooling**
   ```
   DATABASE_URL=postgresql://...?schema=public&pool_size=10
   ```

### Frontend

1. **Code splitting**
   ```typescript
   const AnalysisPage = lazy(() => import('./pages/AnalysisPage'))
   ```

2. **Image optimization**
   - Use WebP format for chart assets
   - Lazy load planetary detail images

3. **Bundle analysis**
   ```bash
   npm run build
   npm run analyze
   ```

---

## Deployment Checklist

### Before Going to Production

- [ ] All tests passing
- [ ] API rate limiting enabled
- [ ] Database backups configured
- [ ] HTTPS certificates installed
- [ ] Environment variables set correctly
- [ ] Error logging setup (Sentry, LogRocket)
- [ ] Database indexes created
- [ ] API documentation generated (OpenAPI)
- [ ] Load testing completed
- [ ] Security audit passed

### Hosting Recommendations

**Frontend**: Vercel
```bash
vercel deploy
```

**Backend**: Railway or Render
```bash
railway up
```

**Database**: Supabase or Railway PostgreSQL

---

## Resources

- **ProKerala API**: https://api.prokerala.com/docs
- **OpenAI API**: https://platform.openai.com/docs/api-reference
- **Prisma ORM**: https://www.prisma.io/docs
- **React Query**: https://tanstack.com/query/latest
- **Express**: https://expressjs.com/
- **Vite**: https://vitejs.dev/

---

## Support & Questions

- **Technical Questions**: Refer to feature spec and plan documents
- **API Issues**: Check contracts.md for endpoint details
- **Database Questions**: See data-model.md
- **Architecture Questions**: See research.md

---

**Ready to start implementing? Begin with `/speckit.tasks` to generate detailed task breakdown.**

Last updated: 2026-01-11
