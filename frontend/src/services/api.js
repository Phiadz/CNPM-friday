import axios from 'axios';
import { mockSubjects, mockClasses, mockUsers, mockProjects } from './mockData';

// 1. Định nghĩa Base URL
const BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

// 2. Thêm token vào header 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 1. Định nghĩa Base URL

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper for pagination & search
const mockFetch = async (data, params) => {
  await delay(500); // Simulate 500ms latency
  let result = [...data];

  // Search
  if (params?.search) {
    const s = params.search.toLowerCase();
    result = result.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(s)
      )
    );
  }

  // Pagination
  const skip = params?.skip || 0;
  const limit = params?.limit || 10;

  return {
    data: result.slice(skip, skip + limit),
    total: result.length
  };
};

// 3. User Service 
export const userService = {
  updateProfile: async (data) => { await delay(500); return { data: { ...mockUsers[0], ...data } }; },
  changePassword: async (data) => { await delay(500); return { data: { success: true } }; },
  uploadAvatar: async (file) => { await delay(500); return { data: { url: 'https://i.pravatar.cc/150' } }; },

  // Admin only
  getAll: (params) => mockFetch(mockUsers, params),
  create: async (data) => { await delay(500); mockUsers.push({ ...data, user_id: `u${Date.now()}` }); return { data }; },
};

// 4. Subject Service 
export const subjectService = {
  getAll: (params) => mockFetch(mockSubjects, params),
  create: async (data) => { await delay(500); mockSubjects.push({ ...data, subject_id: Date.now() }); return { data }; },
  update: async (id, data) => {
    await delay(500);
    const idx = mockSubjects.findIndex(s => s.subject_id === id);
    if (idx > -1) mockSubjects[idx] = { ...mockSubjects[idx], ...data };
    return { data };
  },
  delete: async (id) => {
    await delay(500);
    const idx = mockSubjects.findIndex(s => s.subject_id === id);
    if (idx > -1) mockSubjects.splice(idx, 1);
    return { data: { success: true } };
  }
};

// 5. Class Service
export const classService = {
  getAll: (params) => mockFetch(mockClasses, params),
  create: async (data) => { await delay(500); mockClasses.push({ ...data, class_id: Date.now() }); return { data }; },
  update: async (id, data) => {
    await delay(500);
    const idx = mockClasses.findIndex(c => c.class_id === id);
    if (idx > -1) mockClasses[idx] = { ...mockClasses[idx], ...data };
    return { data };
  },
  delete: async (id) => {
    await delay(500);
    const idx = mockClasses.findIndex(c => c.class_id === id);
    if (idx > -1) mockClasses.splice(idx, 1);
    return { data: { success: true } };
  }
};

// 6. Project Service (For Student View)
export const projectService = {
  getAll: (params) => mockFetch(mockProjects, params),
};