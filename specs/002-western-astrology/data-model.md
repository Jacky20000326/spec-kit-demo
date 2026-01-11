# Data Model: Western Astrology Analysis System

**Feature**: Western Astrology Analysis System
**Date**: 2026-01-11
**Architecture**: PostgreSQL + Prisma ORM

---

## Entity Relationships

```
┌─────────────────┐
│  User Profile   │
│                 │
│ • id (PK)       │
│ • email         │
│ • username      │
└────────┬────────┘
         │ 1:N
         │
    ┌────▼─────────────────┐
    │  Natal Chart          │
    │                       │
    │ • id (PK)             │
    │ • userId (FK)         │
    │ • birthDate           │
    │ • birthTime           │
    │ • birthLocation       │
    │ • chartData (JSON)    │
    └────┬──────────────────┘
         │ 1:N
         │
    ┌────▼──────────────────┐
    │  Life Analysis        │
    │                       │
    │ • id (PK)             │
    │ • chartId (FK)        │
    │ • lifeArea            │
    │ • analysisText        │
    └───────────────────────┘
```

---

## Detailed Entity Definitions

### 1. User Profile

**Purpose**: Represents a user in the system with optional authentication.

**Table Name**: `users`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT(uuid()) | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NULL | User email (optional for guest) |
| username | VARCHAR(100) | NULL | Display name (optional) |
| passwordHash | VARCHAR(255) | NULL | Bcrypt hash (only if password auth) |
| isGuest | BOOLEAN | DEFAULT(false) | True if not authenticated |
| createdAt | TIMESTAMP | DEFAULT(now()) | Account creation time |
| updatedAt | TIMESTAMP | DEFAULT(now()), ON UPDATE | Last profile update |
| deletedAt | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes**:
- `UNIQUE(email)` - For login and account lookup
- `idx_createdAt` - For user analytics

**Example Record**:
```json
{
  "id": "c7d8e9f0-1234-5678-90ab-cdef12345678",
  "email": "alice@example.com",
  "username": "Alice Chen",
  "passwordHash": "$2b$12$...",
  "isGuest": false,
  "createdAt": "2026-01-11T10:00:00Z",
  "updatedAt": "2026-01-11T10:00:00Z",
  "deletedAt": null
}
```

---

### 2. Natal Chart

**Purpose**: Stores a user's complete astrological profile based on birth information. The `chartData` field contains the full ProKerala API response, preserving all data for future enhancements.

**Table Name**: `natalCharts`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique chart identifier |
| userId | UUID | FOREIGN KEY(users) | Chart owner |
| birthDate | VARCHAR(10) | NOT NULL | Birth date in YYYY-MM-DD format |
| birthTime | VARCHAR(5) | NULL | Birth time in HH:MM format (null if unknown) |
| birthLocation | VARCHAR(255) | NOT NULL | City name or "lat,lon" format |
| latitude | DECIMAL(10,8) | NOT NULL | Geographic latitude |
| longitude | DECIMAL(11,8) | NOT NULL | Geographic longitude |
| timeZone | VARCHAR(50) | NOT NULL | IANA timezone (e.g., "America/New_York") |
| chartData | JSONB | NOT NULL | Complete ProKerala API response |
| isMarkedForDeletion | BOOLEAN | DEFAULT(false) | User requested deletion |
| createdAt | TIMESTAMP | DEFAULT(now()) | Chart generation time |
| retrievedAt | TIMESTAMP | DEFAULT(now()) | Last API fetch time |
| updatedAt | TIMESTAMP | DEFAULT(now()), ON UPDATE | Last update time |

**Indexes**:
- `idx_userId_createdAt` - Quick lookup of user's charts with sorting
- `idx_birthDate_birthLocation` - Find duplicate/similar charts (dedup logic)
- `idx_chartData->>'sun'` - Query charts by planetary placement (optional, advanced)

**JSON Structure of chartData**:
```json
{
  "sun": {
    "sign": "Aries",
    "degree": 15.5,
    "house": 10,
    "longitude": 15.5,
    "retrograde": false
  },
  "moon": {
    "sign": "Cancer",
    "degree": 22.3,
    "house": 2,
    "longitude": 112.3,
    "retrograde": false
  },
  "ascendant": {
    "sign": "Gemini",
    "degree": 5.1,
    "house": 1,
    "longitude": 65.1
  },
  "mercury": { ... },
  "venus": { ... },
  "mars": { ... },
  "jupiter": { ... },
  "saturn": { ... },
  "uranus": { ... },
  "neptune": { ... },
  "pluto": { ... },
  "houses": [
    { "number": 1, "sign": "Gemini", "degree": 5.1 },
    { "number": 2, "sign": "Cancer", "degree": 15.0 },
    ...
  ],
  "aspects": [
    { "planet1": "sun", "planet2": "moon", "type": "conjunction", "angle": 7.2 }
  ]
}
```

**Validation Rules**:
- `birthDate`: Must be in past (validated both frontend and backend)
- `birthTime`: Optional; if null, system defaults to sunrise
- `birthLocation`: Non-empty string, validated against geocoding service
- `latitude`: Range [-90, 90]
- `longitude`: Range [-180, 180]
- `timeZone`: Must be valid IANA timezone string

**Example Record**:
```json
{
  "id": "d8e9f0a1-2345-6789-0abc-def123456789",
  "userId": "c7d8e9f0-1234-5678-90ab-cdef12345678",
  "birthDate": "1995-03-15",
  "birthTime": "14:30",
  "birthLocation": "New York, USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timeZone": "America/New_York",
  "chartData": { ... (full ProKerala response) ... },
  "isMarkedForDeletion": false,
  "createdAt": "2026-01-11T14:25:30Z",
  "retrievedAt": "2026-01-11T14:25:30Z",
  "updatedAt": "2026-01-11T14:25:30Z"
}
```

---

### 3. Planetary Placement (Embedded in chartData)

**Purpose**: Represents a single celestial body's position in the zodiac. These are stored as part of the `chartData` JSON in the Natal Chart, not as separate records.

**Type Definition** (TypeScript):
```typescript
interface PlanetaryPlacement {
  sign: ZodiacSign // Aries | Taurus | ... | Pisces
  degree: number // 0.0-29.999...
  house: number // 1-12
  longitude: number // Ecliptic longitude (ProKerala format)
  retrograde?: boolean // Only for outer planets
}

type ZodiacSign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces"

type Planet =
  | "sun" | "moon" | "ascendant" | "mercury" | "venus" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto"
```

**Example (as nested in chartData)**:
```json
{
  "sun": {
    "sign": "Aries",
    "degree": 15.5,
    "house": 10,
    "longitude": 15.5,
    "retrograde": false
  },
  "moon": {
    "sign": "Cancer",
    "degree": 22.3,
    "house": 2,
    "longitude": 112.3,
    "retrograde": false
  }
}
```

---

### 4. Life Analysis

**Purpose**: Stores AI-generated analysis for a specific life area based on a natal chart. Immutable once created.

**Table Name**: `lifeAnalyses`

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-----------|-------------|
| id | UUID | PRIMARY KEY | Unique analysis identifier |
| chartId | UUID | FOREIGN KEY(natalCharts) | Associated chart |
| lifeArea | VARCHAR(50) | NOT NULL | relationships, career, finances, or personal_growth |
| analysisText | TEXT | NOT NULL | AI-generated analysis content |
| tokensUsed | INTEGER | NOT NULL | OpenAI tokens consumed (for cost tracking) |
| model | VARCHAR(50) | DEFAULT('gpt-3.5-turbo') | OpenAI model used |
| temperature | DECIMAL(2,2) | DEFAULT(0.7) | Model temperature parameter |
| promptVersion | INTEGER | DEFAULT(1) | Prompt template version |
| generatedAt | TIMESTAMP | DEFAULT(now()) | Analysis generation time |
| expiresAt | TIMESTAMP | NULL | Optional cache expiry time |

**Indexes**:
- `idx_chartId_lifeArea` - Find analysis for specific chart + area
- `idx_generatedAt` - Analytics and cleanup queries

**Enum: Life Area**
```typescript
enum LifeArea {
  RELATIONSHIPS = "relationships",
  CAREER = "career",
  FINANCES = "finances",
  PERSONAL_GROWTH = "personal_growth"
}
```

**Validation Rules**:
- `lifeArea`: Must match enum values
- `analysisText`: Non-empty, max 5000 characters
- `tokensUsed`: Must be positive integer
- `chartId`: Must reference existing NatalChart
- One analysis per chart per lifeArea (business rule enforced in application)

**Example Record**:
```json
{
  "id": "e9f0a1b2-3456-7890-1bcd-ef1234567890",
  "chartId": "d8e9f0a1-2345-6789-0abc-def123456789",
  "lifeArea": "relationships",
  "analysisText": "Based on your birth chart, your emotional nature (Cancer Moon) tends to prioritize deep connections and security in relationships. Your Gemini Ascendant, however, presents a more light and communicative public persona...",
  "tokensUsed": 723,
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "promptVersion": 1,
  "generatedAt": "2026-01-11T14:30:45Z",
  "expiresAt": null
}
```

---

## Derived Views (Optional)

For advanced queries, consider creating database views:

### View: User Chart Summary
```sql
CREATE VIEW user_chart_summary AS
SELECT
  u.id as user_id,
  u.email,
  COUNT(nc.id) as total_charts,
  MAX(nc.createdAt) as latest_chart_date,
  COUNT(la.id) as total_analyses
FROM users u
LEFT JOIN natalCharts nc ON u.id = nc.userId
LEFT JOIN lifeAnalyses la ON nc.id = la.chartId
GROUP BY u.id, u.email
```

### View: Chart with Analysis Count
```sql
CREATE VIEW chart_analysis_count AS
SELECT
  nc.id,
  nc.userId,
  nc.birthDate,
  COUNT(la.id) as analysis_count,
  MAX(la.generatedAt) as latest_analysis
FROM natalCharts nc
LEFT JOIN lifeAnalyses la ON nc.id = la.chartId
GROUP BY nc.id, nc.userId, nc.birthDate
```

---

## State Transitions

### Natal Chart Lifecycle
```
GENERATED → VIEWED → SAVED → (optional) MARKED_FOR_DELETION → DELETED

- GENERATED: Chart created from birth info, not yet explicitly saved
- VIEWED: User has viewed the chart details
- SAVED: User clicked "Save Chart", associated with user account
- MARKED_FOR_DELETION: User requested deletion (soft delete)
- DELETED: Removed from database (hard delete after retention period)
```

### Life Analysis Lifecycle
```
REQUESTED → GENERATING → COMPLETED → (optional) REFRESHED → ARCHIVED

- REQUESTED: User initiated analysis request
- GENERATING: OpenAI API call in progress
- COMPLETED: Analysis received and stored
- REFRESHED: User requested updated analysis (creates new record)
- ARCHIVED: Old version moved to archive (optional retention)
```

---

## Data Retention & Privacy

### Retention Policy

| Data | Retention | Reason |
|------|-----------|--------|
| User Account | Until deletion request | Account ownership |
| Saved Charts | User discretion | User explicitly saved |
| Generated Analyses | 6 months after chart deletion | Compliance/recovery |
| Guest Charts | 30 days | No explicit save intent |
| API Request Logs | 90 days | Debugging/security |

### User Data Rights

- **Export**: User can export their charts and analyses (JSON)
- **Deletion**: User can delete charts individually or full account
- **Privacy**: No data shared with third parties except ProKerala/OpenAI APIs
- **GDPR Compliance**: Supports data subject access and erasure requests

---

## Migration Strategy

### Initial Schema (MVP)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String?  @unique
  username  String?
  charts    NatalChart[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model NatalChart {
  id       String   @id @default(cuid())
  userId   String
  user     User     @relation(fields: [userId], references: [id])
  birthDate String
  birthTime String?
  birthLocation String
  latitude Float
  longitude Float
  timeZone String
  chartData Json
  analyses LifeAnalysis[]
  createdAt DateTime @default(now())
  retrievedAt DateTime @updatedAt

  @@index([userId])
  @@index([createdAt])
}

model LifeAnalysis {
  id       String   @id @default(cuid())
  chartId  String
  chart    NatalChart @relation(fields: [chartId], references: [id])
  lifeArea String
  analysisText String @db.Text
  tokensUsed Int
  model    String   @default("gpt-3.5-turbo")
  temperature Float @default(0.7)
  generatedAt DateTime @default(now())

  @@unique([chartId, lifeArea])
  @@index([chartId])
}
```

### Future Enhancements

- Add password auth support (passwordHash field)
- Add chart tagging/categorization
- Add user preferences (theme, language)
- Add analysis caching strategy (expiresAt)
- Add audit log for data access

---

## Performance Considerations

### Query Patterns

**Frequent Queries**:
1. Get all charts for user: `SELECT * FROM natalCharts WHERE userId = ? ORDER BY createdAt DESC`
2. Get chart by ID: `SELECT * FROM natalCharts WHERE id = ?`
3. Get analysis for chart: `SELECT * FROM lifeAnalyses WHERE chartId = ?`

**Indexes Optimize**:
- `idx_userId_createdAt` → Query 1 (most common)
- `PRIMARY KEY (id)` → Query 2
- `idx_chartId` → Query 3

### Expected Scale

- **Phase 1 (MVP)**: <1000 users, <5000 charts
- **Phase 2 (Growth)**: 10k-100k users, 50k-500k charts
- **Scaling Strategy**: Partition chartData table by userId or createdAt month

---

**Data model complete and ready for implementation.**
