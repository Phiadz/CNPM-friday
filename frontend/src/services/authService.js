import api from './api';

export const authService = {
    // Login
    login: async (email, password) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post('/api/v1/auth/login', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            // Lưu thêm user info nếu có
            localStorage.setItem('user_email', email);
        }

        return response.data;
    },

    // Register
    register: async (userData) => {
        const response = await api.post('/api/v1/auth/register', userData);
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        window.location.href = '/login';
    },

    // Get current user từ token
    getCurrentUser: () => {
        // TODO: Gọi endpoint /me khi backend implement
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        // Parse JWT token để lấy thông tin user (tạm thời)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                user_id: payload.sub,
                email: localStorage.getItem('user_email'),
            };
        } catch (error) {
            return null;
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    }
};