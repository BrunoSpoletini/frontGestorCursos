import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_IP || 'http://localhost:8000';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/api/token/', { username, password }),
  
  register: (userData: {
    username: string;
    password: string;
    role: 'admin' | 'student' | 'instructor';
  }) => api.post('/api/register/', userData),
};

// Course API calls
export const courseAPI = {
  getCourses: (page?: number) => 
    api.get('/api/courses/', { params: { page } }),

  getCourse: (id: number) => 
    api.get(`/api/courses/${id}/`),
  
  createCourse: (courseData: {
    name: string;
    description: string;
  }) => api.post('/api/courses/', courseData),
};

// Enrollment API calls
export const enrollmentAPI = {
  enroll: (courseId: number) => 
    api.post('/api/enroll/', { course: courseId }),
  
  getMyEnrollments: (page?: number) => 
    api.get('/api/my-enrollments/', { params: { page } }),

  getInstructorEnrollments: (page?: number) =>
    api.get('/api/my-courses-enrollments/', { params: { page } }),
  
};

// Grade API calls
export const gradeAPI = {
  createGrade: (gradeData: {
    enrollment: number;
    score: string;
    comment?: string;
  }) => api.post('/api/grades/', gradeData),
  
  getCourseGrades: (courseId: number, page?: number) => 
    api.get(`/api/grades/course/${courseId}/`, { params: { page } }),
  
  getMyGrades: (page?: number) => 
    api.get('/api/my-grades/', { params: { page } }),
  
};

// User API calls
export const userAPI = {
  getMyUser: () => 
    api.get('/api/my-user/'),
  
  getUsers: (page?: number) => 
    api.get('/api/users/', { params: { page } }),
};

export default api; 