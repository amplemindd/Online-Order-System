# API Contract

This file is the agreement between the backend team and the web, Android and iOS teams.
**Backend:** change an endpoint only after updating this file and telling the frontend teams.
**Frontend:** build only what is written here.

Base URL while practising: `http://localhost:3000`
All requests and responses use JSON.

---

## GET /api/health
Check that the backend is running.

**Response 200**
```json
{ "status": "ok", "message": "Backend is running", "time": "2026-10-26T10:00:00.000Z" }
```

## GET /api/students
Get the team list.

**Response 200**
```json
{ "students": [ { "id": 1, "name": "Aarav", "role": "Web (React)" } ] }
```

## GET /api/messages
Get all messages.

**Response 200**
```json
{ "messages": [ { "id": 1, "name": "Aarav", "text": "Hello", "createdAt": "2026-10-26T10:00:00.000Z" } ] }
```

## POST /api/messages
Add a message.

**Request body**
```json
{ "name": "Aarav", "text": "Hello team" }
```

**Response 201**
```json
{ "message": { "id": 1, "name": "Aarav", "text": "Hello team", "createdAt": "2026-10-26T10:00:00.000Z" } }
```

**Response 400** (name or text missing)
```json
{ "error": "Both name and text are required" }
```
