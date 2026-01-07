"""Main API router for version 1 endpoints."""

from fastapi import APIRouter

# Create the main API router
api_router = APIRouter()

# ==========================================
# AUTH ENDPOINTS
# ==========================================
from app.api.v1 import auth
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# ==========================================
# TOPIC (PROJECT PROPOSAL) ENDPOINTS - BE-PROJ-01
# ==========================================
from app.api.v1.endpoints import topic
api_router.include_router(topic.router, prefix="/topics", tags=["Topics"])

# ==========================================
# PROJECT ENDPOINTS - BE-PROJ-01
# ==========================================
from app.api.v1.endpoints import project
api_router.include_router(project.router, prefix="/projects", tags=["Projects"])

# ==========================================
# TEAM ENDPOINTS - BE-TEAM-01
# ==========================================
from app.api.v1.endpoints import team
api_router.include_router(team.router, prefix="/teams", tags=["Teams"])

# ==========================================
# TASK BOARD ENDPOINTS - BE-TASK-01
# ==========================================
from app.api.v1.endpoints import tasks
api_router.include_router(tasks.router, prefix="/tasks", tags=["Task Board"])


# ==========================================
# TEST ENDPOINT
# ==========================================
@api_router.get("/test")
async def test_endpoint():
    return {"message": "API is working!"}