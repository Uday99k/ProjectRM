import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Syllabus API
export const syllabus = {
  upload: async (file: File, data: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(data));
    const response = await api.post('/syllabi', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/syllabi');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/syllabi/${id}`);
    return response.data;
  },
};

// Chat API
export const chat = {
  askQuestion: async (syllabusId: number, question: string) => {
    const response = await api.post('/chat/question', {
      syllabus_id: syllabusId,
      question,
    });
    return response.data;
  },
  
  getContext: async (syllabusId: number, query: string) => {
    const response = await api.get(`/syllabi/${syllabusId}/context`, {
      params: { query },
    });
    return response.data;
  },
};

// Admin API
export const admin = {
  getTeachers: async () => {
    const response = await api.get('/admin/teachers');
    return response.data;
  },
  
  approveTeacher: async (teacherId: number) => {
    const response = await api.put(`/admin/teachers/${teacherId}/approve`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default api;