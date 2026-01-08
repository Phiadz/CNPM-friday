"""Main API router for version 1 endpoints."""

from fastapi import APIRouter
from app.api.v1 import (
    departments, 
    subjects,
    semesters,
    academic_classes,
    class_enrollments,
    syllabuses
    )
# Create the main API router
api_router = APIRouter()

# Include endpoint routers as they become available
# For now, we'll start with a basic structure
# TODO: Add more endpoint routers as they are implemented

# Auth 
from app.api.v1.auth import router as auth_router
api_router.include_router(auth_router, prefix="/auth", tags=["authentication"])
api_router.include_router(departments.router, prefix="/departments", tags=["departments"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
api_router.include_router(semesters.router, prefix="/semesters", tags=["semesters"])
api_router.include_router(academic_classes.router, prefix="/academic_classes", tags=["academic_classes"])
api_router.include_router(class_enrollments.router, prefix="/class_enrollments", tags=["class_enrollments"])
api_router.include_router(syllabuses.router, prefix="/syllabuses", tags=["syllabuses"])


# Test endpoint
@api_router.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint works"}

# Example structure for future endpoints:
# from app.api.v1 import users, projects
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(projects.router, prefix="/projects", tags=["projects"])