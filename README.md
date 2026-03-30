# DevOps Dashboard V2 - Teaching Application

A production-ready teaching application used in the BSC-DWM-406 DevOps course, demonstrating realistic team development workflow.

## Technology Stack

- Node.js 18+ (Express.js)
- PostgreSQL 15+
- Docker & Docker Compose with health checks
- Jest Testing Framework
- Bootstrap 5 CSS Framework

## Quick Start

### Local Development (without Docker)
```bash
npm install
npm run dev
npm test
```

### Docker Deployment
```bash
# Production deployment
docker-compose up

# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Access the Application
- Dashboard: http://localhost:3000
- API Health Check: http://localhost:3000/health
- PostgreSQL: localhost:5432 (dashboard_user)

## Project Structure

```
src/
├── server.js           - Express server with routing
└── routes/
    └── incidents.js    - Incidents CRUD API endpoints

public/
├── index.html         - Responsive dashboard UI
└── css/
    └── style.css      - Bootstrap 5 + custom styling

tests/
├── server.test.js     - API endpoint tests
└── dashboard.test.js  - UI component tests

docker-compose.yml              - Production environment setup
docker-compose.override.yml     - Development overrides
Dockerfile                      - Node.js Alpine containerization
```

## Git Workflow - Learning Focus

This repository demonstrates **realistic team development** with parallel branches:

### Branch Structure
```
master (initial commit)
  ├─→ feature/api-incidents (5 commits) → Incidents CRUD API implementation
  ├─→ feature/dashboard-ui (5 commits) → Dashboard UI with Bootstrap styling
  ├─→ feature/testing (4 commits) → Comprehensive test suite
  └─→ feature/docker (4 commits) → Docker containerization with health checks
        ↓
    develop (merged from all 4 features)
        ↓
    main (release v0.1.0)
```

### Viewing the Git History
```bash
# View parallel branch development
git log --all --oneline --graph

# View specific feature branch commits
git log feature/api-incidents --oneline
git log feature/dashboard-ui --oneline
git log feature/testing --oneline
git log feature/docker --oneline

# Check release tag
git tag -l
git show v0.1.0
```

## Key Educational Points

### 1. **Parallel Development** (4 Teams, 1 Product)
- 4 independent feature branches developing simultaneously
- Shows realistic team coordination
- Demonstrates Git Flow branching model

### 2. **Incremental Commits** (Real Progression)
- Feature/API-Incidents: Routes setup → GET endpoint → POST endpoint → GET by ID → Server integration
- Feature/Dashboard-UI: HTML structure → Bootstrap → Cards → Table → Styling enhancements
- Feature/Testing: Jest config → API tests → UI tests → Validation tests
- Feature/Docker: Dockerfile → docker-compose → Health checks → Dev overrides

### 3. **Merge Convergence** (Team Integration)
- 4 feature branches merge into `develop` with explicit merge commits
- `develop` → `main` for release (main is production-ready)
- Tag `v0.1.0` marks stable release

### 4. **DevOps Practices Demonstrated**
- **Containerization**: Dockerfile with Alpine Linux (small footprint)
- **Health Checks**: Container readiness monitoring
- **Multi-Service Orchestration**: App + Database via Docker Compose
- **Environment Separation**: Production vs Development configs
- **Automated Testing**: Jest with coverage reporting
- **Code Standards**: Clean structure, meaningful commit messages

## API Endpoints

### GET /api/incidents
List all incidents.
```json
Response: [{ "id": 1, "title": "String", "severity": "low|medium|high" }]
```

### POST /api/incidents
Create a new incident.
```json
Body: { "title": "String (required)", "severity": "String (required)" }
Response: { "id": 1, "title": "...", "severity": "..." }
```

### GET /api/incidents/:id
Get specific incident by ID.
```json
Response: { "id": 1, "title": "...", "severity": "..." }
Error: 404 if not found
```

## Testing

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Check test coverage
npm test -- --coverage
```

**Test Coverage:**
- ✅ API endpoints (CRUD operations, validation, error cases)
- ✅ Dashboard HTML structure and styling
- ✅ Input validation and edge cases
- ✅ Error response handling

## Docker Deployment Notes

### Health Checks
- **App Service**: HTTP check to `/health` endpoint (30s interval)
- **Database Service**: PostgreSQL readiness check (10s interval)
- Both services verify operational status before marking as healthy

### Volume Persistence
- `postgres_data`: Production PostgreSQL data persistence
- `logs/`: Application logs directory (development)

### Network Configuration
- `devops-net`: Internal Docker network for service communication
- Services communicate via service names (app → postgres)

## Development Guidelines

### Running Locally
```bash
npm install
npm run dev         # Start with auto-reload (npm script)
npm test            # Run test suite
```

### Running with Docker (Development)
```bash
# Uses docker-compose.override.yml for development settings
docker-compose up

# Debugging: Check container logs
docker-compose logs -f dashboard
docker-compose logs -f postgres

# Access database
docker exec -it devops-dashboard-db psql -U dashboard_user -d devops_dashboard
```

## Lessons for Students

This application teaches:
1. **Git Flow**: Real team branching strategy
2. **Docker**: Application containerization and orchestration
3. **Testing**: Automated test suite structure
4. **API Design**: RESTful endpoint conventions
5. **DevOps**: Health checks, monitoring readiness, multi-service setup
6. **Code Organization**: Clear separation of concerns (routes, server, tests)
7. **Team Workflow**: Parallel development → Code review → Merge → Release

---

**Version**: 0.1.0  
**Build Status**: ✅ Production Ready  
**Last Updated**: 2026-03-29  
**Learning Scope**: BSC-DWM-406 Initiation DevOps
