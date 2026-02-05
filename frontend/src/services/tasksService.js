import apiClient from './apiClient';

export const tasksService = {
    // Sprint endpoints - note: mounted at /tasks so full path is /tasks/sprints
    createSprint: (payload) => apiClient.post('/tasks/sprints', null, { params: payload }),
    getSprint: (sprintId) => apiClient.get(`/tasks/sprints/${sprintId}`),
    listSprints: (teamId) => apiClient.get('/tasks/sprints', { params: { team_id: teamId } }),

    // Create new task
    createTask: (payload) => apiClient.post('/tasks', payload),

    // List tasks (can filter by sprint_id via params)
    listTasks: (params) => apiClient.get('/tasks', { params }),

    // Update task (status, etc.)
    updateTask: (taskId, payload) => apiClient.put(`/tasks/${taskId}`, payload),

    // Delete task
    deleteTask: (taskId) => apiClient.delete(`/tasks/${taskId}`),

    // Get all tasks (convenience wrapper)
    getAllTasks: () => apiClient.get('/tasks'),

    // Get tasks by sprint (convenience wrapper)
    getSprintTasks: (sprintId) => apiClient.get(`/tasks/sprints/${sprintId}/tasks`),

    // Change status (convenience wrapper) - uses PATCH endpoint with validation
    changeStatus: (taskId, status) => apiClient.patch(`/tasks/${taskId}/status`, null, { params: { new_status: status } }),

    // Assign task 
    assignTask: (taskId, userId) => apiClient.patch(`/tasks/${taskId}/assign`, null, { params: { user_id: userId } }),
};

export default tasksService;
