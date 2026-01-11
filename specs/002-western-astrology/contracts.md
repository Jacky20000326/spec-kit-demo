# API Contracts: Western Astrology Analysis System

**Feature**: Western Astrology Analysis System
**Date**: 2026-01-11
**Protocol**: REST (JSON)
**Base URL**: `http://localhost:3000/api` (development)

---

## API Overview

### Endpoints Summary

| Method | Endpoint | Priority | Purpose |
|--------|----------|----------|---------|
| POST | `/charts` | P1 | Generate natal chart |
| GET | `/charts/:chartId` | P1 | Retrieve chart details |
| GET | `/users/me/charts` | P3 | List user's saved charts |
| POST | `/charts/:chartId/save` | P3 | Save chart to user profile |
| POST | `/analyses` | P2 | Generate AI analysis |
| GET | `/analyses/:analysisId` | P2 | Retrieve analysis details |
| POST | `/charts/:chartId` | P3 | Delete chart |

---

## Authentication

**Status**: Optional session-based authentication

**Headers** (if authenticated):
```
Cookie: connect.sid=<session_id>
```

**Status Codes**:
- `200 OK` - Successful request
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - External API unavailable

---

## Chart Management

### 1. Generate Natal Chart

**Endpoint**: `POST /charts`

**Priority**: P1 (Core feature)

**Purpose**: Generate a natal chart from birth information

**Request**:
```json
{
  "birthDate": "YYYY-MM-DD",
  "birthTime": "HH:MM" | null,
  "birthLocation": "City, Country" | "latitude,longitude"
}
```

**Request Validation**:
- `birthDate`: Required, ISO 8601 format, must be in past
- `birthTime`: Optional (HH:MM 24-hour format), can be null
- `birthLocation`: Required, non-empty string

**Success Response (200 OK)**:
```json
{
  "id": "uuid",
  "birthDate": "1995-03-15",
  "birthTime": "14:30",
  "birthLocation": "New York, USA",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "timeZone": "America/New_York",
  "chartData": {
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
    ]
  },
  "createdAt": "2026-01-11T14:30:00Z"
}
```

**Error Responses**:

**400 Bad Request** (Validation Error):
```json
{
  "error": "Validation failed",
  "details": {
    "birthDate": "Must be a valid date in the past (YYYY-MM-DD)",
    "birthTime": "Invalid time format. Use HH:MM (24-hour)"
  }
}
```

**400 Bad Request** (Location Not Found):
```json
{
  "error": "Location not found",
  "message": "Ambiguous location: 'Springfield'. Did you mean: Springfield, Illinois or Springfield, Missouri?",
  "suggestions": [
    { "city": "Springfield", "state": "Illinois", "country": "USA" },
    { "city": "Springfield", "state": "Missouri", "country": "USA" }
  ]
}
```

**503 Service Unavailable** (ProKerala API Down):
```json
{
  "error": "External service unavailable",
  "message": "Unable to retrieve chart data. Please try again in a few moments.",
  "retryAfter": 30
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/charts \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1995-03-15",
    "birthTime": "14:30",
    "birthLocation": "New York, USA"
  }'
```

---

### 2. Retrieve Chart

**Endpoint**: `GET /charts/:chartId`

**Priority**: P1

**Purpose**: Retrieve previously generated chart details

**Path Parameters**:
- `chartId` (UUID): Chart identifier

**Query Parameters** (optional):
- `includeAnalyses=true` - Include associated analyses in response

**Success Response (200 OK)**:
```json
{
  "id": "uuid",
  "birthDate": "1995-03-15",
  "birthTime": "14:30",
  "birthLocation": "New York, USA",
  "chartData": { ... },
  "createdAt": "2026-01-11T14:30:00Z",
  "analyses": [
    {
      "id": "uuid",
      "lifeArea": "relationships",
      "analysisText": "...",
      "generatedAt": "2026-01-11T14:35:00Z"
    }
  ]
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "error": "Chart not found",
  "message": "No chart with ID 'xyz' found"
}
```

**Example cURL**:
```bash
curl http://localhost:3000/api/charts/550e8400-e29b-41d4-a716-446655440000
```

---

### 3. List User's Charts

**Endpoint**: `GET /users/me/charts`

**Priority**: P3

**Purpose**: Retrieve all saved charts for authenticated user

**Authentication**: Required (session cookie)

**Query Parameters**:
- `limit` (number, default: 10) - Results per page
- `offset` (number, default: 0) - Pagination offset
- `sortBy` (string, default: "createdAt") - Sort field

**Success Response (200 OK)**:
```json
{
  "charts": [
    {
      "id": "uuid",
      "birthDate": "1995-03-15",
      "birthLocation": "New York, USA",
      "createdAt": "2026-01-11T14:30:00Z"
    },
    {
      "id": "uuid2",
      "birthDate": "1992-07-22",
      "birthLocation": "London, UK",
      "createdAt": "2026-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "offset": 0
  }
}
```

**Error Responses**:

**401 Unauthorized**:
```json
{
  "error": "Authentication required",
  "message": "Please log in to view saved charts"
}
```

**Example cURL**:
```bash
curl http://localhost:3000/api/users/me/charts \
  -H "Cookie: connect.sid=<session_id>"
```

---

### 4. Save Chart to Profile

**Endpoint**: `POST /charts/:chartId/save`

**Priority**: P3

**Purpose**: Save a chart to user's profile for later retrieval

**Authentication**: Required (session cookie)

**Path Parameters**:
- `chartId` (UUID): Chart to save

**Request** (optional):
```json
{
  "name": "Birth Chart - Alice Chen"
}
```

**Success Response (200 OK)**:
```json
{
  "id": "uuid",
  "savedAt": "2026-01-11T14:35:00Z",
  "message": "Chart saved successfully"
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "error": "Chart not found"
}
```

**409 Conflict** (Already Saved):
```json
{
  "error": "Chart already saved",
  "message": "This chart is already in your saved collection"
}
```

---

## Analysis Management

### 5. Generate Analysis

**Endpoint**: `POST /analyses`

**Priority**: P2

**Purpose**: Generate AI analysis for specific life area based on natal chart

**Request**:
```json
{
  "chartId": "uuid",
  "lifeArea": "relationships" | "career" | "finances" | "personal_growth"
}
```

**Request Validation**:
- `chartId`: Required, must reference existing chart
- `lifeArea`: Required, must match enum values

**Success Response (200 OK)**:
```json
{
  "id": "uuid",
  "chartId": "uuid",
  "lifeArea": "relationships",
  "analysisText": "Based on your birth chart, your Cancer Moon indicates a deep need for emotional security and nurturing connections. Combined with your Gemini Ascendant's communicative nature, you likely form relationships that balance intellectual engagement with emotional depth...",
  "tokensUsed": 723,
  "generatedAt": "2026-01-11T14:32:00Z"
}
```

**Response Streaming** (optional):
Server can respond with Server-Sent Events (SSE) for streaming analysis:
```
data: {"chunk": "Based on your birth chart..."}
data: {"chunk": " your Cancer Moon..."}
```

**Error Responses**:

**400 Bad Request** (Invalid Life Area):
```json
{
  "error": "Invalid life area",
  "message": "lifeArea must be one of: relationships, career, finances, personal_growth"
}
```

**404 Not Found** (Chart Not Found):
```json
{
  "error": "Chart not found",
  "message": "No chart with ID 'xyz' found"
}
```

**429 Too Many Requests** (Rate Limited):
```json
{
  "error": "Rate limit exceeded",
  "message": "You have generated 5 analyses today. Please try again tomorrow.",
  "retryAfter": 86400
}
```

**503 Service Unavailable** (ChatGPT API Down):
```json
{
  "error": "Analysis service unavailable",
  "message": "AI analysis is temporarily unavailable. Your chart data is still accessible.",
  "retryAfter": 60
}
```

**Example cURL**:
```bash
curl -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d '{
    "chartId": "550e8400-e29b-41d4-a716-446655440000",
    "lifeArea": "relationships"
  }'
```

---

### 6. Retrieve Analysis

**Endpoint**: `GET /analyses/:analysisId`

**Priority**: P2

**Purpose**: Retrieve previously generated analysis

**Path Parameters**:
- `analysisId` (UUID): Analysis identifier

**Success Response (200 OK)**:
```json
{
  "id": "uuid",
  "chartId": "uuid",
  "lifeArea": "relationships",
  "analysisText": "...",
  "tokensUsed": 723,
  "generatedAt": "2026-01-11T14:32:00Z"
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "error": "Analysis not found"
}
```

---

## Chart Deletion

### 7. Delete Chart

**Endpoint**: `DELETE /charts/:chartId`

**Priority**: P3

**Purpose**: Delete a chart (soft delete with later hard deletion)

**Authentication**: Required (session cookie)

**Path Parameters**:
- `chartId` (UUID): Chart to delete

**Success Response (200 OK)**:
```json
{
  "message": "Chart deleted successfully",
  "deletedAt": "2026-01-11T14:40:00Z"
}
```

**Error Responses**:

**404 Not Found**:
```json
{
  "error": "Chart not found"
}
```

**403 Forbidden** (Not Owner):
```json
{
  "error": "Forbidden",
  "message": "You can only delete your own charts"
}
```

---

## Rate Limiting

**Global Rate Limit**: 100 requests per minute per IP

**Per-Endpoint Limits**:

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /charts | 10 requests | 1 hour |
| POST /analyses | 5 requests | 24 hours |
| POST /charts/:id/save | 20 requests | 1 hour |
| GET /users/me/charts | 30 requests | 1 hour |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673448000
```

---

## Error Handling

**Standard Error Format**:
```json
{
  "error": "Error type",
  "message": "Human-readable description",
  "code": "ERROR_CODE",
  "timestamp": "2026-01-11T14:30:00Z",
  "requestId": "req-12345678"
}
```

**Common HTTP Status Codes**:

| Code | Scenario |
|------|----------|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid input, validation failed |
| 401 | Authentication required |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g., already exists) |
| 429 | Rate limit exceeded |
| 500 | Server error |
| 503 | Service unavailable (external API down) |

---

## Response Headers

**All Responses**:
```
Content-Type: application/json
X-Request-ID: <unique_request_id>
X-Response-Time: <milliseconds>
Cache-Control: no-cache
```

**For Cacheable Resources**:
```
Cache-Control: public, max-age=3600
ETag: "<resource_hash>"
Last-Modified: <date>
```

---

## Pagination

**Applied to**:
- GET /users/me/charts

**Query Parameters**:
- `limit` (default: 10, max: 100)
- `offset` (default: 0)

**Response Format**:
```json
{
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Testing Examples

### Full User Journey (cURL)

```bash
# 1. Generate chart
CHART_ID=$(curl -s -X POST http://localhost:3000/api/charts \
  -H "Content-Type: application/json" \
  -d '{
    "birthDate": "1995-03-15",
    "birthTime": "14:30",
    "birthLocation": "New York, USA"
  }' | jq -r '.id')

# 2. View chart
curl http://localhost:3000/api/charts/$CHART_ID

# 3. Request analysis
ANALYSIS_ID=$(curl -s -X POST http://localhost:3000/api/analyses \
  -H "Content-Type: application/json" \
  -d "{
    \"chartId\": \"$CHART_ID\",
    \"lifeArea\": \"relationships\"
  }" | jq -r '.id')

# 4. View analysis
curl http://localhost:3000/api/analyses/$ANALYSIS_ID
```

---

**API contracts ready for implementation and testing.**
