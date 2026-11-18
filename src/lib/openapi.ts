const errorResponse = {
  type: "object",
  properties: {
    success: { type: "boolean", example: false },
    message: { type: "string" },
    errors: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } },
  },
  required: ["success", "message"],
};

const participant = {
  type: "object",
  properties: {
    id: { type: "string" }, name: { type: "string" }, email: { type: "string", format: "email" },
    college: { type: "string" }, department: { type: "string" }, year: { type: "integer" },
  },
};

const eventInput = {
  type: "object",
  required: ["name", "slug", "category", "description"],
  properties: {
    name: { type: "string", minLength: 2, maxLength: 120 },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    category: { type: "string", minLength: 2, maxLength: 80 },
    description: { type: "string", minLength: 1, maxLength: 10000 },
    shortDescription: { type: "string", maxLength: 300 },
    rules: { type: "array", items: { type: "string", maxLength: 2000 } },
    teamSize: { type: "object", properties: { min: { type: "integer", minimum: 1, maximum: 100 }, max: { type: "integer", minimum: 1, maximum: 100 } } },
    venue: { type: "string", maxLength: 200 }, date: { type: "string", format: "date-time" },
    startTime: { type: "string", maxLength: 20 }, endTime: { type: "string", maxLength: 20 },
    registrationOpen: { type: "boolean" }, maxParticipants: { type: "integer", minimum: 1 },
    status: { type: "string", enum: ["draft", "published", "archived"] }, image: { type: "string", format: "uri" }, displayOrder: { type: "integer" },
  },
};

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "DATAVERSE API",
    version: "1.0.0",
    description: "Participant authentication, event browsing, registrations, teams, and administrator event management. Cookie sessions are created by login/signup and sent automatically by same-origin browsers.",
  },
  servers: [{ url: "/api", description: "This DATAVERSE deployment" }],
  tags: [
    { name: "Authentication" }, { name: "Events" }, { name: "Registrations" }, { name: "Teams" }, { name: "Admin · Events" },
  ],
  paths: {
    "/auth/register": {
      post: {
        tags: ["Authentication"], summary: "Create a participant account", operationId: "registerParticipant",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password", "college", "department", "year"], properties: { name: { type: "string", minLength: 2, maxLength: 100 }, email: { type: "string", format: "email", maxLength: 254 }, password: { type: "string", minLength: 8, maxLength: 128, format: "password" }, phone: { type: "string", maxLength: 20 }, college: { type: "string", minLength: 2, maxLength: 150 }, department: { type: "string", minLength: 2, maxLength: 100 }, year: { type: "integer", minimum: 1, maximum: 6 } } } } } },
        responses: { "201": { description: "Account created and session cookie set" }, "400": { description: "Invalid body", content: { "application/json": { schema: errorResponse } } }, "409": { description: "Email already registered" }, "500": { description: "Server error" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Authentication"], summary: "Log in a participant", operationId: "loginParticipant",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } } } } } },
        responses: { "200": { description: "Authenticated; session cookie set" }, "400": { description: "Invalid body" }, "401": { description: "Invalid credentials" }, "403": { description: "Account inactive" } },
      },
    },
    "/auth/admin/login": {
      post: {
        tags: ["Authentication"], summary: "Log in an administrator", operationId: "loginAdmin",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } } } } } },
        responses: { "200": { description: "Authenticated; session cookie set" }, "400": { description: "Invalid body" }, "401": { description: "Invalid credentials or inactive account" } },
      },
    },
    "/auth/me": {
      get: { tags: ["Authentication"], summary: "Get the signed-in account", operationId: "getCurrentAccount", security: [{ sessionCookie: [] }], responses: { "200": { description: "Current account" }, "401": { description: "Not authenticated" } } },
    },
    "/auth/logout": {
      post: { tags: ["Authentication"], summary: "Revoke the current session", operationId: "logout", security: [{ sessionCookie: [] }], responses: { "200": { description: "Session revoked and cookie cleared" }, "500": { description: "Server error" } } },
    },
    "/events": {
      get: { tags: ["Events"], summary: "List published events", operationId: "listEvents", responses: { "200": { description: "Published event catalogue" }, "500": { description: "Server error" } } },
    },
    "/registrations": {
      get: { tags: ["Registrations"], summary: "List the current participant's registrations", operationId: "listMyRegistrations", security: [{ sessionCookie: [] }], responses: { "200": { description: "Registration list with selected event details" }, "401": { description: "Participant authentication required" } } },
      post: {
        tags: ["Registrations"], summary: "Register for an individual event", operationId: "createRegistration", security: [{ sessionCookie: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["eventId"], properties: { eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" } } } } } },
        responses: { "201": { description: "Registration created" }, "400": { description: "Invalid event ID" }, "401": { description: "Participant authentication required" }, "404": { description: "Event not found" }, "409": { description: "Registration closed, duplicate, full, or event requires a team" } },
      },
    },
    "/registrations/{id}": {
      delete: { tags: ["Registrations"], summary: "Cancel an owned registration", operationId: "cancelRegistration", security: [{ sessionCookie: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" } }], responses: { "200": { description: "Registration cancelled" }, "400": { description: "Invalid registration ID" }, "401": { description: "Participant authentication required" }, "404": { description: "Registration not found" }, "500": { description: "Server error" } } },
    },
    "/teams": {
      post: {
        tags: ["Teams"], summary: "Create a team and register its leader", operationId: "createTeam", security: [{ sessionCookie: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["eventId", "name"], properties: { eventId: { type: "string", pattern: "^[a-fA-F0-9]{24}$" }, name: { type: "string", minLength: 2, maxLength: 60 } } } } } },
        responses: { "201": { description: "Team created; invite code returned" }, "400": { description: "Invalid body" }, "401": { description: "Participant authentication required" }, "404": { description: "Event not found" }, "409": { description: "Registration closed, event does not support teams, duplicate, or event full" } },
      },
    },
    "/teams/join": {
      post: {
        tags: ["Teams"], summary: "Join a team with an invite code", operationId: "joinTeam", security: [{ sessionCookie: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["inviteCode"], properties: { inviteCode: { type: "string", minLength: 6, maxLength: 32 } } } } } },
        responses: { "201": { description: "Joined team and registered" }, "400": { description: "Invalid invite code" }, "401": { description: "Participant authentication required" }, "404": { description: "Team or event not found" }, "409": { description: "Registration closed, duplicate, team full, or event full" } },
      },
    },
    "/admin/events": {
      post: { tags: ["Admin · Events"], summary: "Create an event", operationId: "createEvent", security: [{ sessionCookie: [] }], requestBody: { required: true, content: { "application/json": { schema: eventInput } } }, responses: { "201": { description: "Event created" }, "400": { description: "Invalid body" }, "401": { description: "Admin authentication required" }, "403": { description: "Missing events:manage permission" }, "409": { description: "Slug already exists" } } },
    },
    "/admin/events/{id}": {
      patch: { tags: ["Admin · Events"], summary: "Update an event", operationId: "updateEvent", security: [{ sessionCookie: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" } }], requestBody: { required: true, content: { "application/json": { schema: { ...eventInput, required: [] } } } }, responses: { "200": { description: "Event updated" }, "400": { description: "Invalid body or ID" }, "401": { description: "Admin authentication required" }, "403": { description: "Missing events:manage permission" }, "404": { description: "Event not found" }, "409": { description: "Slug already exists" } } },
      delete: { tags: ["Admin · Events"], summary: "Archive an event", operationId: "archiveEvent", security: [{ sessionCookie: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", pattern: "^[a-fA-F0-9]{24}$" } }], responses: { "200": { description: "Event archived and registration closed" }, "400": { description: "Invalid event ID" }, "401": { description: "Admin authentication required" }, "403": { description: "Missing events:manage permission" }, "404": { description: "Event not found" } } },
    },
  },
  components: {
    securitySchemes: { sessionCookie: { type: "apiKey", in: "cookie", name: "dataverse_session", description: "HttpOnly session cookie set by signup or login. Authenticate in this docs UI by using a login endpoint first." } },
    schemas: { Error: errorResponse, Participant: participant, EventInput: eventInput },
  },
} as const;
