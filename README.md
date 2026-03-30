# DevOps Dashboard V2 - Teaching Application

A production-ready teaching application used in the BSC-DWM-406 DevOps course.

## Technology Stack

- Node.js 18+ (Express.js)
- PostgreSQL 15+
- Docker & Docker Compose
- Jest Testing Framework

## Quick Start

```bash
npm install
npm start
docker-compose up
```

## Project Structure

```
src/
├── server.js           - Express server
└── routes/
    └── incidents.js    - API routes

public/
├── index.html         - Dashboard UI
└── css/
    └── style.css      - Styling

tests/                 - Test suite
docker-compose.yml     - Multi-container setup
```
