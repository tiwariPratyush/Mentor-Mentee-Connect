# MentorMenteeConnect

A full‑stack web application that connects mentors and mentees for discovery, messaging, scheduling, and notifications. The project is organized as a simple JS monorepo with separate `backend` (Node.js/Express + MongoDB) and `frontend` (React) apps.

## Features

- Authentication (signup/login)
- Role‑based dashboards for mentors and mentees
- Real‑time chat between users
- Mentor/mentee discovery and connections
- Notifications for both mentors and mentees
- Scheduling and upcoming classes
- Protected routes and session handling on the client

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, Socket.io (chat)
- Frontend: React (CRA), Context API, React Router

## Project Structure

```
MentorMenteeConnect-main/
  backend/               # Node.js/Express API server
    controllers/         # Route handlers
    middleware/          # Auth middleware
    models/              # Mongoose models
    routes/              # Express routers
    server.js            # App entrypoint
    package.json
  frontend/              # React client
    src/
      components/        # UI components
      context/           # Auth & Socket contexts
      pages/             # Routed pages
      services/          # API client helpers
      styles/            # CSS and modules
    public/
    package.json
```

## Prerequisites

- Node.js LTS (18+ recommended)
- npm (comes with Node) or Yarn
- MongoDB (local or a hosted connection string)

## Local Development

Run the backend and frontend separately. Start the backend first, then the frontend.

### 1) Backend Setup

1) Install dependencies:

```bash
cd backend
npm install
```

2) Create a `.env` file in `backend/` with values like:

```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/mentee_mentor_connect
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:3000
```

3) Start the server:

```bash
# production run
npm start

# or with auto-reload during development
npm run dev
```

The API should be available at `http://localhost:5000` by default.

### 2) Frontend Setup

1) Install dependencies:

```bash
cd frontend
npm install
```

2) Optionally create `frontend/.env` to configure the API base URL:

```bash
REACT_APP_API_URL=http://localhost:5000
```

3) Start the React app:

```bash
npm start
```

The app should open at `http://localhost:3000`.

## Scripts Reference

- Backend (`backend/package.json`)
  - `npm start` — start the Express server
  - `npm run dev` — start with Nodemon for live reload
- Frontend (`frontend/package.json`)
  - `npm start` — start the React dev server (hosts on 0.0.0.0)
  - `npm run build` — build production assets
  - `npm test` — run tests

## API Overview (high level)

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`
- Profiles: mentee/mentor profile endpoints
- Connections: connect mentors and mentees
- Chat: REST endpoints plus Socket.io for realtime messages
- Notifications: mentee and mentor notification feeds

Refer to `backend/routes/` for the complete list and request/response shapes.

## Environment Variables

Backend (`backend/.env`):
- `PORT` — API server port (e.g., 5000)
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `CLIENT_URL` — allowed origin for CORS (e.g., `http://localhost:3000`)

Frontend (`frontend/.env`):
- `REACT_APP_API_URL` — API base URL consumed by the client

## Development Notes

- Start the backend before the frontend so the client can reach the API.
- Ensure MongoDB is running and `MONGO_URI` is correct.
- If CORS errors occur, confirm `CLIENT_URL` matches your frontend URL.

## Production

- Build the frontend: `cd frontend && npm run build`.
- Deploy the backend and database; set env vars for secrets and URLs.
- Configure the frontend to point to the deployed backend via `REACT_APP_API_URL`.

## License

This project is provided as-is without a specific license. Add a license if you intend to distribute or open-source.
