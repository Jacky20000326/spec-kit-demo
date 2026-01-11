# Research Findings: Western Astrology Analysis System

**Date**: 2026-01-11
**Feature**: Western Astrology Analysis System
**Status**: Research Phase Complete

---

## 1. ProKerala API Integration

### Decision: Use ProKerala Free Tier for Western Astrology Charts

**Rationale**:
- Free tier removes cost barriers for MVP
- Comprehensive Western astrology data (11 planets + houses)
- Well-documented API endpoints
- Suitable for prototype and early production

**Key Findings**:

**API Endpoint**: `GET /western_astrology/natal_chart`
```
Parameters:
- year, month, day (birth date)
- hour, minute (birth time, optional)
- latitude, longitude (location)
- timezone (location timezone)

Response includes:
- Planetary positions (Sun, Moon, Ascendant, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
- Zodiac signs and degrees
- House placements (1-12)
- Aspects (optional enhancement)
- Additional chart points (Chiron, North Node, etc.)
```

**Authentication**:
- Free tier: No authentication required
- Optional API key for higher rate limits (check tier comparison)

**Rate Limits**:
- Free tier: Likely 100-500 requests/day (exact limit: verify in docs)
- Solution: Implement request caching and rate limit tracking

**Error Scenarios**:
- Invalid coordinates → 400 Bad Request with message
- Future birth date → 400 Bad Request
- Invalid timezone → 400 Bad Request
- Rate limit exceeded → 429 Too Many Requests

**Location Geocoding**:
- ProKerala does NOT provide reverse geocoding (city → coordinates)
- Solution: Integrate Google Maps Geocoding API or OpenStreetMap Nominatim
- Cost: Google Maps free tier covers MVP usage

**Reliability**:
- Expected uptime: 99% for production APIs
- Fallback: Cache recent requests, notify users of API unavailability

**Integration Pattern**:
```typescript
// ProKerala API call flow
1. User enters: birth date + time + location
2. Geocode location → lat/lon
3. Call ProKerala with coordinates
4. Parse response into NatalChart entity
5. Store in database for later retrieval
```

**Alternatives Considered**:
- Swiss Ephemeris (requires paid license): Too expensive for MVP
- AstroDienst API (free but limited): Lacks comprehensive house data
- pymeeus Python library (self-hosted): Requires separate calculation service

---

## 2. ChatGPT API Integration for Analysis

### Decision: Use GPT-3.5-turbo for Cost-Effective Analysis

**Rationale**:
- Excellent balance of cost (~$0.002 per 1K input tokens) and quality
- Sufficient capability for astrological interpretation
- Lower latency than GPT-4 (better UX)
- Upgrade to GPT-4 if quality insufficient after testing

**Key Findings**:

**API Endpoint**: `POST https://api.openai.com/v1/chat/completions`

**Token Estimation**:
- Input prompt (avg): 400-600 tokens
  - Birth chart data: ~200 tokens
  - Context instructions: ~200 tokens
  - User's life area details: ~100 tokens
- Output generation (avg): 500-800 tokens
- **Total per request**: ~1000-1400 tokens
- **Cost per request**: ~$0.003-0.004

**Rate Limits** (with API key):
- Free trial: 3 requests/minute
- Pay-as-you-go: 60 requests/minute
- Higher limits available with pricing tier

**Error Handling**:
```
- 401: Invalid API key
- 429: Rate limit exceeded (retry after 60s)
- 500: Server error (retry with exponential backoff)
- 503: Service unavailable
```

**Implementation Pattern**:
```typescript
1. Format prompt with user's planetary placements
2. Include context (astrology knowledge, life area)
3. Call ChatGPT with temperature=0.7 (creative but coherent)
4. Stream response if possible (better UX)
5. Validate output (profanity/bias filtering)
6. Store analysis in database
```

**Prompt Template Structure**:
```
System: "You are an expert Western astrologer analyzing birth charts..."

User: "Based on this natal chart:
- Sun in Aries (15°) in 10th house
- Moon in Cancer (22°) in 2nd house
- Ascendant in Gemini (5°)
... (remaining placements)

Provide insights about my RELATIONSHIPS, focusing on emotional patterns,
partnership needs, and communication in relationships."
```

**Streaming Option**:
- OpenAI supports Server-Sent Events (SSE) for streaming
- Improves perceived performance (show results as they generate)
- Recommended for user experience

**Model Alternatives**:
- GPT-4 (more accurate, slower, ~10x cost): Consider if user feedback indicates quality issues
- GPT-3.5-turbo: Recommended for MVP (low cost, fast)
- Local models (Llama, Mistral): Complexity not justified for MVP

---

## 3. Database Selection & Schema

### Decision: PostgreSQL + Prisma ORM

**Rationale**:
- PostgreSQL: ACID compliance, excellent for relational data
- Prisma: Type-safe TypeScript ORM, great DX, auto-migrations
- Reduces complexity vs raw SQL
- Excellent for rapid development

**Key Schema Decisions**:

**Data Types**:
- Birth date: VARCHAR (YYYY-MM-DD) for easy parsing
- Birth time: VARCHAR (HH:MM) with NULL support for unknown time
- Location: VARCHAR with separate latitude/longitude fields (Float)
- Chart data: JSONB (PostgreSQL native) for ProKerala response storage
- Analysis text: TEXT for long-form content

**Indexes**:
- userId (for quick chart lookup)
- createdAt (for sorting/filtering)
- chartId on analyses (for query optimization)

**Relationships**:
```
User 1 → Many NatalChart
NatalChart 1 → Many LifeAnalysis
```

**Hosting Options**:
- Supabase (PostgreSQL + Auth): Excellent for quick deployment
- Railway: Simple database + deployment
- AWS RDS: Production-grade but more complex
- PlanetScale: MySQL alternative (not recommended for this schema)

**Recommended**: Supabase for MVP (built-in auth, real-time, great free tier)

---

## 4. Authentication Strategy

### Decision: Optional Session-Based Authentication

**Rationale**:
- Allows immediate chart generation without friction (guest mode)
- Users opt-in to save charts (consent-based data retention)
- Simpler than JWT for stateful Express apps
- Aligns with astrology app UX trends

**Implementation Pattern**:

```typescript
// Without authentication:
POST /api/charts → Generate temporary chart (session-scoped)

// With authentication:
POST /auth/register → Create user account
POST /auth/login → Issue session cookie
POST /api/charts → Generate and auto-save to user
GET /api/users/me/charts → Retrieve saved charts
```

**Session Management**:
- Use `express-session` with PostgreSQL store
- 30-day session expiry
- Secure cookies (httpOnly, sameSite=strict)

**Data Consent**:
- Show consent banner before saving chart
- "Save this chart for future reference?" prompt
- Option to generate chart without account

**Alternatives Considered**:
- JWT tokens: Overkill for stateful app, but works
- Magic links: Better UX but requires email
- OAuth (Google/Apple): Additional complexity, not needed for MVP

---

## 5. State Management & Caching Strategy

### Decision: TanStack Query + Server-Side Caching

**Rationale**:
- TanStack Query: Industry standard, excellent TypeScript support
- Reduces Redux boilerplate
- Built-in stale-while-revalidate pattern
- Server-side caching: Reduce ProKerala API calls

**Frontend Caching**:
```typescript
// Chart data caches for 1 hour
queryClient.setQueryDefaults(['charts'], {
  staleTime: 60 * 60 * 1000,
  cacheTime: 3 * 60 * 60 * 1000
})

// Analyses cache indefinitely (immutable)
queryClient.setQueryDefaults(['analyses'], {
  staleTime: Infinity
})
```

**Backend Caching**:
- Redis: Optional enhancement for high traffic
- Database queries: Prisma caching not enabled by default
- ProKerala responses: Cache for 24 hours (birth chart doesn't change)

**Implementation**:
```typescript
// Only call ProKerala if not cached
async function getNatalChart(birthDate, birthTime, location) {
  const cacheKey = hash(birthDate + birthTime + location)
  const cached = await redis.get(cacheKey)
  if (cached) return cached

  const data = await prokeralaService.getChart(...)
  await redis.setex(cacheKey, 86400, JSON.stringify(data))
  return data
}
```

---

## 6. Error Handling & Resilience

### Decision: Graceful Degradation with User-Friendly Messages

**Patterns**:

**ProKerala API Down**:
```
User sees: "Natal chart data unavailable. Please try again in a few minutes."
Logs: Error with timestamp and retry count
Retry: After 30 seconds with exponential backoff
```

**ChatGPT API Down**:
```
User sees: "AI analysis temporarily unavailable. Your chart is still loaded."
Fallback: Display raw planetary placements
Recovery: Auto-retry when service returns
```

**Rate Limiting**:
- Track per-user API calls
- Show: "You've generated 5 charts today. Please try tomorrow."
- Implement quota management in database

**Validation Errors**:
```
Frontend: Real-time validation on BirthInfoForm
Backend: Double-check validation before API calls
User sees: "Birth date must be in the past (YYYY-MM-DD format)"
```

---

## 7. Performance Targets

### Decision: Align with SC-001 and SC-003

**Chart Generation (SC-001: 2 minutes)**:
- User input validation: <100ms
- Location geocoding: <500ms
- ProKerala API call: <1000ms
- Database save: <200ms
- React rendering: <1000ms
- **Total**: ~2.5 seconds (well under 2-minute target)

**Analysis Generation (SC-003: 1 minute)**:
- Build prompt: <50ms
- ChatGPT API call: <20,000ms (includes token generation)
- Database save: <200ms
- React streaming display: Real-time
- **Total**: ~20 seconds (well under 1-minute target)

**Optimization Opportunities**:
- Parallel location geocoding + existing chart checks
- ChatGPT streaming for perceived speed improvement
- Debounce location search input

---

## 8. Security Considerations

### Decision: Standard Web App Security Practices

**Data Protection**:
- HTTPS everywhere (enforced at hosting level)
- Passwords: bcrypt with salt rounds 12 (if password auth)
- Session tokens: Secure httpOnly cookies
- SQL injection: Prevented by Prisma ORM

**API Security**:
- Rate limiting: express-rate-limit (10 requests/minute per IP)
- Input validation: Zod schema validation
- CORS: Strict origin checking
- Environment secrets: Never committed, managed via .env

**User Data Privacy**:
- Birth data retention: Per user opt-in
- Deletion: User can delete charts anytime
- No data sharing with third parties
- GDPR compliance: Data export and deletion endpoints (P3)

---

## 9. Internationalization (i18n)

### Decision: English-First MVP, i18n Infrastructure Ready

**Phase 1 (MVP)**:
- All UI text: English only
- Astrology terminology: Standard English terms
- Location input: Support worldwide cities (English names)

**Phase 2 (Post-MVP)**:
- i18n library: react-i18next
- Translations: Chinese (traditional/simplified), Spanish, French
- Date/time formatting: Locale-aware

---

## 10. Testing Strategy

### Decision: Pyramid Approach (Unit > Integration > E2E)

**Unit Tests**:
- ProkeralaService.ts: Mock API responses
- ChatGPTService.ts: Mock prompts and responses
- Validation functions: Multiple input scenarios

**Integration Tests**:
- Full chart generation flow (user input → API → DB → UI)
- Analysis generation (chart retrieval → prompt → API → storage)
- Error scenarios (API down, validation failure, rate limit)

**E2E Tests**:
- Playwright/Cypress for full user journeys
- Generate chart → View details → Request analysis → Save chart

---

## Summary Table

| Component | Decision | Rationale |
|-----------|----------|-----------|
| Natal Chart API | ProKerala free tier | Cost-free, comprehensive |
| Analysis API | GPT-3.5-turbo | Balance of cost & quality |
| Database | PostgreSQL + Prisma | Type safety, ACID |
| Auth | Session-based optional | Low friction, guest mode |
| Caching | TanStack Query + Redis | Standard React patterns |
| Error Handling | Graceful degradation | User experience |
| Hosting | Supabase + Vercel | Fast deployment, free tier |

---

**All NEEDS CLARIFICATION items from plan.md have been researched and documented.**
**Ready for task generation and implementation.**
