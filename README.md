# GatherLink

A web application for collecting and organizing resources discovered online. Each resource tracks the resource itself (link + title) and where it was found (source link).

## Tech Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS
- **Backend**: Bun HTTP server
- **Language**: TypeScript throughout

## Project Structure

```
GatherLink/
├── api/           # Backend API server (Bun)
├── frontend/      # React frontend (Vite)
├── ui_plan.md     # UI specification and design tokens
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Install Dependencies

```bash
# Install API dependencies
cd api && bun install

# Install frontend dependencies
cd frontend && bun install
```

### Run the Application

```bash
# Terminal 1: Start the API server
cd api && bun run index.ts
# API runs at http://localhost:3000

# Terminal 2: Start the frontend dev server
cd frontend && bun run dev
# Frontend runs at http://localhost:5173
```

### Build for Production

```bash
cd frontend && bun run build
```

## Features

- Add resources with title, URL, and source URL
- View all collected resources in a card-based list
- Open resources and sources in new tabs
- Copy URLs to clipboard
- Delete resources with confirmation
- Search/filter resources
- Responsive design

## API Endpoints

| Method | Endpoint               | Description          |
|--------|------------------------|----------------------|
| GET    | `/api/resources`       | List all resources   |
| POST   | `/api/resources`       | Create a resource    |
| DELETE | `/api/resources/:id`   | Delete a resource    |

### Resource Object

```json
{
  "id": "string",
  "title": "string",
  "resourceUrl": "string",
  "sourceUrl": "string",
  "sourceImage": "string (optional)",
  "createdAt": "ISO timestamp"
}
```

## Development

```bash
# Lint the frontend
cd frontend && bun run lint

# Type check the frontend
cd frontend && bun run build
```
