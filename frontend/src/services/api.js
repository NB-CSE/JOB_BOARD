import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle responses and expired auth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear stored auth if not already on login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  uploadResume: (formData) =>
    api.post('/auth/upload-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Jobs endpoints
export const jobService = {
  getJobs: (params) => api.get('/jobs', { params }),
  getFeaturedJobs: () => api.get('/jobs/featured'),
  getCategories: () => api.get('/jobs/categories'),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getEmployerJobs: () => api.get('/jobs/employer/my-jobs'),
};

// Application endpoints
export const applicationService = {
  applyForJob: (jobId, formData) =>
    api.post(`/applications/${jobId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyApplications: () => api.get('/applications/my-applications'),
  withdrawApplication: (id) => api.put(`/applications/${id}/withdraw`),
  getEmployerApplicants: (params) =>
    api.get('/applications/employer/applicants', { params }),
  updateApplicationStatus: (id, statusData) =>
    api.put(`/applications/${id}/status`, statusData),
  getResumeUrl: (filename) => `/api/applications/resume/${filename}`,
};

// Saved jobs and company endpoints
export const userService = {
  getSavedJobs: () => api.get('/users/saved-jobs'),
  saveJob: (jobId) => api.post(`/users/saved-jobs/${jobId}`),
  unsaveJob: (jobId) => api.delete(`/users/saved-jobs/${jobId}`),
  getCompanies: () => api.get('/users/companies'),
};

// Salary & Skills Market Insights endpoints
export const insightService = {
  getSalaryBenchmarks: () => api.get('/insights/salary-benchmarks'),
  getLocations: () => api.get('/insights/locations'),
  getSkills: () => api.get('/insights/skills'),
  calculateProjection: (data) => api.post('/insights/calculate', data),
};

export default api;
