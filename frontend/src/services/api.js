import axios from 'axios';

// Tạo instance axios với baseURL
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - tự động thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - xử lý lỗi và refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 (unauthorized) và chưa thử refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Gọi endpoint refresh token (cần implement ở backend sau)
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    // TODO: Implement refresh token logic khi backend có endpoint
                    // const response = await axios.post('/api/v1/auth/refresh', { refresh_token: refreshToken });
                    // localStorage.setItem('access_token', response.data.access_token);
                    // return api(originalRequest);
                }
            } catch (refreshError) {
                // Nếu refresh thất bại, clear storage và redirect đến login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Xử lý lỗi khác
        return Promise.reject(error);
    }
);

export default api;