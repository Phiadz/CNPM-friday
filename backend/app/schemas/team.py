"""
Pydantic schemas for Team and TeamMember management.
"""
from __future__ import annotations
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ==========================================
# TEAM SCHEMAS
# ==========================================

class UserMinimal(BaseModel):
    user_id: UUID
    email: Optional[str] = None
    full_name: Optional[str] = None

    class Config:
        from_attributes = True


class TeamBase(BaseModel):
    project_id: Optional[int] = None
    class_id: int
    team_name: Optional[str] = None


class TeamCreate(TeamBase):
    """Schema for creating a team. leader_id will be taken from JWT token."""
    pass


class TeamUpdate(BaseModel):
    project_id: Optional[int] = None
    team_name: Optional[str] = None


class TeamResponse(BaseModel):
    team_id: int
    project_id: Optional[int] = None
    leader_id: UUID
    class_id: int
    team_name: Optional[str] = None
    join_code: Optional[str] = None
    created_at: datetime
    members: List[UserMinimal] = []

    class Config:
        from_attributes = True


class TeamJoinRequest(BaseModel):
    """Schema for joining a team by code."""
    join_code: str = Field(..., min_length=6, max_length=20)


# ==========================================
# TEAM MEMBER SCHEMAS
# ==========================================

class TeamMemberBase(BaseModel):
    """Base schema for TeamMember."""
    role: Optional[str] = Field(None, max_length=100, description="e.g., Developer, Designer, QA")


class TeamMemberCreate(TeamMemberBase):
    """Schema for adding a member to team."""
    student_id: UUID


class TeamMemberUpdate(BaseModel):
    """Schema for updating team member."""
    role: Optional[str] = None
    is_active: Optional[bool] = None


class TeamMemberResponse(TeamMemberBase):
    """Schema for TeamMember response."""
    team_id: int
    student_id: UUID
    is_active: bool
    joined_at: datetime

    # Student info
    student_name: Optional[str] = None
    student_email: Optional[str] = None

    class Config:
        from_attributes = True


# ==========================================
# TEAM INVITATION SCHEMAS
# ==========================================

class TeamInviteRequest(BaseModel):
    """Schema for leader inviting student by email."""
    student_email: str = Field(..., description="Email of student to invite")
    role: Optional[str] = Field(None, description="Assigned role in team")


class TeamRemoveMemberRequest(BaseModel):
    """Schema for removing a team member."""
    student_id: UUID


# ==========================================
# LECTURER TEAM MANAGEMENT
# ==========================================

class TeamLockRequest(BaseModel):
    """Schema for lecturer to finalize/lock a team."""
    is_locked: bool = Field(..., description="True to lock, False to unlock")
    lock_reason: Optional[str] = Field(None, description="Reason for locking")


class TeamAssignProjectRequest(BaseModel):
    """Schema for lecturer to assign project to team."""
    project_id: int