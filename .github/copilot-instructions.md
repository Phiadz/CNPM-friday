# CollabSphere AI Coding Instructions

## Project Overview
CollabSphere is a comprehensive **Project-Based Learning Management System** built with FastAPI (backend) and React/Vite (frontend). It manages academic projects with team collaboration, agile methodologies, and AI-powered mentoring.

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with SQLAlchemy 2.0
- **Database**: PostgreSQL with complex relational models
- **Cache**: Redis for session management
- **Auth**: JWT tokens with role-based access (Admin, Staff, Head_Dept, Lecturer, Student)
- **AI**: Google Gemini integration for mentoring suggestions
- **Real-time**: Socket.IO for chat and notifications

### Frontend (React)
- **Framework**: React 18 with Vite
- **UI**: Ant Design components
- **Routing**: React Router
- **Real-time**: Socket.IO client + PeerJS for video calls
- **API**: Axios for REST communication

### Data Model Clusters
1. **System Identity**: Users, Roles, Departments, System Settings, Audit Logs
2. **Academic Management**: Semesters, Subjects, Classes, Enrollments
3. **Project Formation**: Topics, Projects, Teams, Team Members
4. **Agile Collaboration**: Sprints, Tasks, Meetings, Channels, Messages
5. **Milestones & Submissions**: Milestones, Checkpoints, Submissions
6. **Evaluation & Resources**: Criteria, Evaluations, Peer Reviews, Mentoring, Resources

## Key Patterns & Conventions

### Database Relationships
- Use **cascade deletes** for dependent entities (e.g., `ondelete="CASCADE"`)
- **Foreign key naming**: `{table}_{column}` (e.g., `user_id`, `team_id`)
- **UUID primary keys** for users, **integer autoincrement** for entities
- **Timezone-aware datetimes**: `DateTime(timezone=True)`

### API Structure
- **Versioned endpoints**: `/api/v1/`
- **Dependency injection**: Use `deps.py` for auth dependencies
- **Pydantic schemas**: Separate input/output models in `schemas/`
- **Service layer**: Business logic in `services/` - services can directly query database using SQLAlchemy

### Pragmatic Service-Layered Architecture
- **Endpoints**: Handle HTTP requests/responses, auth checks, call service functions
- **Services**: Contain business logic (e.g., "assign student to team", "calculate grade") - can execute DB queries directly
- **Models**: SQLAlchemy tables (complete)
- **Schemas**: Pydantic models (complete)
- **No Repository Layer**: Services query database directly for simplicity and development speed
- **Velocity First**: Prioritize getting features working over architectural purity

### Authentication Flow
- **JWT tokens** with 30-minute expiration
- **Role-based access** via `role_id` foreign key
- **CORS configured** for frontend origins (localhost:3000, localhost:5173)

### Development Workflow
- **Docker Compose** for local development (`docker-compose up`)
- **Hot reload** enabled for both backend (uvicorn) and frontend (vite)
- **Health checks** for database and Redis dependencies
- **PowerShell testing** via `test-endpoints.ps1`

### Docker Setup & Troubleshooting
- **Start Docker**: Run `docker desktop start` on Windows before using docker-compose
- **Restart services**: Use `docker-compose restart <service_name>` (e.g., `docker-compose restart backend`)
- **View logs**: Use `docker-compose logs <service_name>` to debug issues
- **Clean restart**: Run `docker-compose down && docker-compose up --build` for fresh start
- **Database persistence**: PostgreSQL and Redis data persist in named volumes

### File Organization
```
backend/app/
├── main.py              # FastAPI app instance + CORS
├── core/config.py       # Pydantic settings from .env
├── core/security.py     # JWT utilities (empty - implement)
├── db/base.py           # SQLAlchemy DeclarativeBase
├── db/session.py        # Database session management (empty - implement)
├── models/all_models.py # Complete SQLAlchemy 2.0 models
├── schemas/             # Pydantic request/response models (partially implemented)
├── api/v1/              # API endpoints (auth partially implemented)
└── services/            # Business logic (empty - implement)
```

## Critical Implementation Notes

### Database Setup
- Models are fully defined in `all_models.py` - **do not modify existing relationships**
- Implement `session.py` with async SQLAlchemy engine ✅ **Done**
- Use Alembic for migrations (not yet configured)
- **Environment variables** in `.env` override defaults in `config.py`
- **Supabase Support**: Can migrate to Supabase PostgreSQL using `supabase_migration.py` script
  - Connection format: `postgresql://postgres.[PROJECT-ID]:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`
  - Use asyncpg driver: `postgresql+asyncpg://...`
  - See [SUPABASE_MIGRATION.md](../SUPABASE_MIGRATION.md) for full instructions

### API Development
- Start with **auth endpoints** (login, register, token refresh)
- Use **dependency injection** for current user (`deps.py`)
- **Role checking** in endpoints (e.g., lecturers only for class management)
- **Pagination** for list endpoints (teams, tasks, messages)

### Frontend Integration
- **API base URL** from `VITE_API_URL` environment variable
- **Auth tokens** in localStorage with axios interceptors
- **Real-time updates** via Socket.IO for chat and notifications
- **Role-based UI** rendering (different views for students vs lecturers)

### AI Features
- **Google Gemini API** for mentoring suggestions in `MentoringLog.ai_suggestions`
- **Context-aware prompts** using team progress, evaluations, and peer reviews
- **Rate limiting** and error handling for API calls

### Testing & Deployment
- **PowerShell scripts** for endpoint testing
- **Container health checks** ensure service dependencies
- **Volume mounts** for hot reload during development
- **Production secrets** via environment variables (no hardcoded keys)

## Common Tasks
- **User registration**: Create user with role, department, generate UUID
- **Team formation**: Students join via `join_code`, auto-assign to projects
- **Sprint management**: Create tasks under sprints, assign to team members
- **Evaluation workflow**: Lecturers evaluate submissions against criteria
- **Peer reviews**: Team members review each other anonymously
- **Mentoring sessions**: Log meetings with AI-generated suggestions

## Gotchas
- **Cascade deletes** are critical - deleting a team removes all related data
- **Foreign key constraints** prevent orphaned records
- **Timezone handling** - all datetimes should be UTC with timezone info
- **UUID vs Integer keys** - users use UUIDs, most entities use integers
- **Role permissions** - implement checks in API endpoints, not just UI</content>
<parameter name="filePath">d:\Python_Project\WEB TEAMWORK\web app\CollabSphere\CNPM-friday\.github\copilot-instructions.md