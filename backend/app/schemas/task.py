"""
Pydantic schemas for Task Board (Kanban-style) and Sprint management.
"""
from __future__ import annotations
from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


# ==========================================
# SPRINT SCHEMAS
# ==========================================

class SprintBase(BaseModel):
    """Base schema for Sprint."""
    title: Optional[str] = Field(None, max_length=255)
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class SprintCreate(SprintBase):
    """Schema for creating a Sprint."""
    team_id: int


class SprintUpdate(BaseModel):
    """Schema for updating Sprint."""
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = Field(None, description="planned, active, completed")


class SprintResponse(SprintBase):
    """Schema for Sprint response."""
    sprint_id: int
    team_id: int
    status: Optional[str]
    task_count: int = 0

    class Config:
        from_attributes = True


# ==========================================
# TASK SCHEMAS
# ==========================================

class TaskBase(BaseModel):
    """Base schema for Task."""
    sprint_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: Optional[str] = None
    status: Optional[str] = "todo"
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    """Schema for creating a Task."""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating Task."""
    sprint_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[datetime] = None


class TaskStatusUpdate(BaseModel):
    """Schema for quick status update (drag & drop)."""
    status: str = Field(..., description="todo, doing, done")


class TaskResponse(TaskBase):
    """Schema for Task response."""
    task_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TaskBoardResponse(BaseModel):
    """Schema for Task Board grouped by status (Kanban view)."""
    todo: list[TaskResponse] = []
    doing: list[TaskResponse] = []
    done: list[TaskResponse] = []
    backlog: list[TaskResponse] = []  # Tasks without sprint


class TaskStatistics(BaseModel):
    """Schema for Task statistics."""
    total_tasks: int
    todo_count: int
    doing_count: int
    done_count: int
    completion_rate: float = Field(0.0, description="Percentage of done tasks")