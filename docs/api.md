# DATAVERSE API

Base URL: `http://localhost:3000/api` in development. All request and response bodies use JSON.

Interactive Swagger UI: open `/docs`. Machine-readable OpenAPI 3.1 JSON: `/api/openapi`. The OpenAPI document can be imported into Postman, Insomnia, Swagger Editor, or used to generate clients for JavaScript, Python, and other languages.

## Authentication and session cookies

Authentication uses the `dataverse_session` cookie. The server sets it as `HttpOnly`, `SameSite=Strict`, and `Secure` in production. Browsers should call the API on the same origin; if using a separate frontend origin, configure the client to include credentials and configure an explicit CORS policy before deployment. Do not store the session token in frontend JavaScript or local storage.

Successful signup/login responses set the cookie. Send `credentials: "include"` in `fetch` when frontend and API origins differ. `POST /auth/logout` revokes the current server-side session and clears the cookie.

Standard error body: `{ "success": false, "message": "..." }`. Validation errors may also include `errors` keyed by field. Protected routes return `401` when unauthenticated; admin routes return `403` when the account lacks the required permission.

## Routes

### Auth

| Method | Path | Access | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/auth/register` | Public | `{ name, email, password, phone?, college, department, year }` | `201`, creates participant and session; returns a safe user profile. `year` is integer 1–6; password is 8–128 chars. |
| POST | `/auth/login` | Public | `{ email, password }` | `200`, participant profile and session cookie; invalid credentials return `401`. |
| POST | `/auth/admin/login` | Public | `{ email, password }` | `200`, admin profile and session cookie; invalid credentials return `401`. |
| GET | `/auth/me` | Signed in | — | `200`, `{ success, accountType, account: { id, name, email } }`; otherwise `401`. |
| POST | `/auth/logout` | Signed in or public | — | `200`, revokes current session and clears cookie. |

### Events

| Method | Path | Access | Body | Result |
| --- | --- | --- | --- | --- |
| GET | `/events` | Public | — | `200`, published events ordered by display order and date. |
| POST | `/admin/events` | Admin `events:manage` | Event fields below | `201`, creates event. Slug conflict returns `409`. |
| PATCH | `/admin/events/:id` | Admin `events:manage` | Any event fields below | `200`, updates event. |
| DELETE | `/admin/events/:id` | Admin `events:manage` | — | `200`, archives event and closes registration (soft delete). |

Event fields: `name` (2–120 chars), `slug` (lowercase URL slug), `category` (2–80 chars), `description` (1–10000 chars), optional `shortDescription`, `rules` (string array), `teamSize: { min, max }` (integers, 1–100, min ≤ max), `venue`, ISO `date`, `startTime`, `endTime`, `registrationOpen`, positive integer `maxParticipants`, `status` (`draft|published|archived`), URL `image`, and integer `displayOrder`.

### Registrations

| Method | Path | Access | Body | Result |
| --- | --- | --- | --- | --- |
| GET | `/registrations` | Participant | — | `200`, current participant's registrations with selected event details. |
| POST | `/registrations` | Participant | `{ eventId }` | `201`, creates an individual registration. Team events return `409`. |
| DELETE | `/registrations/:id` | Owner participant | — | `200`, cancels registration. Cancelling a team leader disbands the team and cancels its active registrations. |

Registration requires a published event with `registrationOpen: true`, global Settings `registrationEnabled: true`, maintenance mode off, and an unexpired optional registration deadline. Duplicate registration and full events return `409`.

### Teams

| Method | Path | Access | Body | Result |
| --- | --- | --- | --- | --- |
| POST | `/teams` | Participant | `{ eventId, name }` | `201`, creates a team, registers its leader, and returns its invite code. Team size max must be ≥2. |
| POST | `/teams/join` | Participant | `{ inviteCode }` | `201`, joins an open team and registers the participant. |

An invite code is case-insensitive. A participant already registered for the event cannot join another team. Event registration conditions and participant capacity apply to both operations.

## Example calls

```js
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ email, password }),
});
const result = await response.json();
```

```js
const response = await fetch("/api/registrations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ eventId }),
});
```

## Current scope and setup notes

- Registration settings are read from the first Settings document. The seed script initializes these to disabled; an administrator must enable them in MongoDB before participants can register.
- `src/seed/event.ts` is currently empty, so no events appear until the finalized event catalogue is added and seeded.
- This API currently has no settings-management route, announcement routes, team roster endpoint, or admin registration-management endpoint.
