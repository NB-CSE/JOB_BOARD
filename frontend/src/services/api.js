import axios from 'axios';
import {
  mockJobs,
  mockSalaryBenchmarks,
  mockLocations,
  mockSkills,
  mockCompanies,
  mockUsers,
  calculateMockSalary,
} from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 4000,
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
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

// Safe helper that attempts backend API call and falls back seamlessly to mock data
const safeCall = async (apiPromise, fallbackFn) => {
  try {
    const response = await apiPromise;
    return response;
  } catch (err) {
    // If backend is offline, 404, network error, or hosted on static GitHub Pages
    console.info('Elevate Careers: using client-side offline mock store fallback.');
    const fallbackData = await fallbackFn();
    return { data: fallbackData, status: 200, statusText: 'OK (Mock Fallback)' };
  }
};

// Local storage helper for mock mutable data
const getLocalData = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalData = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(e);
  }
};

// Auth endpoints
export const authService = {
  login: (credentials) =>
    safeCall(
      api.post('/auth/login', credentials),
      () => {
        const email = credentials.email.toLowerCase().trim();
        const isEmployer = email.includes('employer') || email.includes('recruiter') || email.includes('razorpay');
        const user = isEmployer ? mockUsers[0] : mockUsers[1];
        const token = 'mock-jwt-token-elevate-careers-2026';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return {
          success: true,
          message: 'Login successful (Offline Demo Mode)',
          token,
          user,
        };
      }
    ),

  register: (userData) =>
    safeCall(
      api.post('/auth/register', userData),
      () => {
        const newUser = {
          _id: 'user_' + Date.now(),
          name: userData.name,
          email: userData.email,
          role: userData.role || 'candidate',
          profile: userData.role === 'employer' ? { companyName: userData.companyName || 'My Startup' } : { skills: [] },
          createdAt: new Date().toISOString(),
        };
        const token = 'mock-jwt-token-elevate-careers-2026';
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        return {
          success: true,
          message: 'Registration successful (Offline Demo Mode)',
          token,
          user: newUser,
        };
      }
    ),

  getMe: () =>
    safeCall(
      api.get('/auth/me'),
      () => {
        const stored = getLocalData('user', mockUsers[1]);
        return { success: true, user: stored };
      }
    ),

  updateProfile: (profileData) =>
    safeCall(
      api.put('/auth/profile', profileData),
      () => {
        const current = getLocalData('user', mockUsers[1]);
        const updated = {
          ...current,
          ...profileData,
          profile: { ...(current.profile || {}), ...(profileData.profile || {}) },
        };
        setLocalData('user', updated);
        return { success: true, message: 'Profile updated successfully', user: updated };
      }
    ),

  uploadResume: (formData) =>
    safeCall(
      api.post('/auth/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      () => {
        return {
          success: true,
          message: 'Resume uploaded successfully (Demo)',
          resumeUrl: '/sample-resume.pdf',
          resumeOriginalName: 'Updated_Resume.pdf',
        };
      }
    ),
};

// Jobs endpoints
export const jobService = {
  getFeaturedJobs: () =>
    safeCall(
      api.get('/jobs/featured'),
      () => {
        const customJobs = getLocalData('elevate_custom_jobs', []);
        const all = [...customJobs, ...mockJobs];
        return { success: true, count: all.filter((j) => j.isFeatured).length, jobs: all.filter((j) => j.isFeatured) };
      }
    ),

  getJobs: (params = {}) =>
    safeCall(
      api.get('/jobs', { params }),
      () => {
        const customJobs = getLocalData('elevate_custom_jobs', []);
        let list = [...customJobs, ...mockJobs];

        if (params.keyword) {
          const kw = params.keyword.toLowerCase();
          list = list.filter(
            (j) =>
              j.title.toLowerCase().includes(kw) ||
              j.company.toLowerCase().includes(kw) ||
              (j.skills && j.skills.some((s) => s.toLowerCase().includes(kw))) ||
              (j.description && j.description.toLowerCase().includes(kw))
          );
        }

        if (params.location && params.location !== 'All Locations') {
          list = list.filter((j) => j.location.toLowerCase().includes(params.location.toLowerCase()));
        }

        if (params.category && params.category !== 'All Categories') {
          list = list.filter((j) => j.category.toLowerCase() === params.category.toLowerCase());
        }

        if (params.workplaceMode && params.workplaceMode !== 'All Modes') {
          list = list.filter((j) => j.workplaceMode.toLowerCase() === params.workplaceMode.toLowerCase());
        }

        if (params.experienceLevel && params.experienceLevel !== 'All Levels') {
          list = list.filter((j) => j.experienceLevel.toLowerCase() === params.experienceLevel.toLowerCase());
        }

        if (params.minSalary) {
          const min = Number(params.minSalary);
          list = list.filter((j) => (j.salary ? j.salary.max >= min : true));
        }

        if (params.featured === 'true' || params.featured === true) {
          list = list.filter((j) => j.isFeatured);
        }

        const page = parseInt(params.page || '1', 10);
        const limit = parseInt(params.limit || '10', 10);
        const total = list.length;
        const totalPages = Math.ceil(total / limit) || 1;
        const start = (page - 1) * limit;
        const paged = list.slice(start, start + limit);

        return {
          success: true,
          count: paged.length,
          total,
          totalPages,
          page,
          jobs: paged,
        };
      }
    ),

  getCategories: () =>
    safeCall(
      api.get('/jobs/categories'),
      () => {
        return {
          success: true,
          categories: ['Software Development', 'Data & AI', 'Design', 'DevOps & Cloud', 'Business', 'Marketing'],
        };
      }
    ),

  getJobById: (id) =>
    safeCall(
      api.get(`/jobs/${id}`),
      () => {
        const customJobs = getLocalData('elevate_custom_jobs', []);
        const all = [...customJobs, ...mockJobs];
        const job = all.find((j) => j._id === id) || all[0];
        const similar = all.filter((j) => j._id !== job._id && j.category === job.category).slice(0, 3);
        return {
          success: true,
          job,
          similarJobs: similar,
        };
      }
    ),

  createJob: (jobData) =>
    safeCall(
      api.post('/jobs', jobData),
      () => {
        const newJob = {
          _id: 'job_' + Date.now(),
          ...jobData,
          employerId: '664500000000000000000001',
          isVerified: true,
          isDemo: false,
          applicantCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const custom = getLocalData('elevate_custom_jobs', []);
        custom.unshift(newJob);
        setLocalData('elevate_custom_jobs', custom);
        return { success: true, message: 'Job posted successfully!', job: newJob };
      }
    ),

  updateJob: (id, jobData) =>
    safeCall(
      api.put(`/jobs/${id}`, jobData),
      () => {
        const custom = getLocalData('elevate_custom_jobs', []);
        const idx = custom.findIndex((j) => j._id === id);
        if (idx !== -1) {
          custom[idx] = { ...custom[idx], ...jobData, updatedAt: new Date().toISOString() };
          setLocalData('elevate_custom_jobs', custom);
          return { success: true, message: 'Job updated', job: custom[idx] };
        }
        return { success: true, message: 'Job updated' };
      }
    ),

  deleteJob: (id) =>
    safeCall(
      api.delete(`/jobs/${id}`),
      () => {
        let custom = getLocalData('elevate_custom_jobs', []);
        custom = custom.filter((j) => j._id !== id);
        setLocalData('elevate_custom_jobs', custom);
        return { success: true, message: 'Job removed' };
      }
    ),

  getEmployerJobs: () =>
    safeCall(
      api.get('/jobs/employer/my-jobs'),
      () => {
        const custom = getLocalData('elevate_custom_jobs', []);
        const demoEmployerJobs = mockJobs.slice(0, 3);
        const all = [...custom, ...demoEmployerJobs];
        return { success: true, count: all.length, jobs: all };
      }
    ),
};

// Application endpoints
export const applicationService = {
  applyForJob: (jobId, formData) =>
    safeCall(
      api.post(`/applications/${jobId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
      () => {
        const apps = getLocalData('elevate_my_applications', []);
        const job = mockJobs.find((j) => j._id === jobId) || mockJobs[0];
        const newApp = {
          _id: 'app_' + Date.now(),
          jobId: job,
          status: 'Applied',
          createdAt: new Date().toISOString(),
          coverLetter: formData.get ? formData.get('coverLetter') : '',
        };
        apps.unshift(newApp);
        setLocalData('elevate_my_applications', apps);
        return {
          success: true,
          message: 'Application submitted successfully! Confirmation email queued.',
          application: newApp,
        };
      }
    ),

  getMyApplications: () =>
    safeCall(
      api.get('/applications/my-applications'),
      () => {
        const apps = getLocalData('elevate_my_applications', [
          {
            _id: 'app_demo_1',
            jobId: mockJobs[0],
            status: 'Shortlisted',
            createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
          },
          {
            _id: 'app_demo_2',
            jobId: mockJobs[2],
            status: 'Under Review',
            createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
          },
        ]);
        return { success: true, count: apps.length, applications: apps };
      }
    ),

  withdrawApplication: (id) =>
    safeCall(
      api.put(`/applications/${id}/withdraw`),
      () => {
        let apps = getLocalData('elevate_my_applications', []);
        apps = apps.filter((a) => a._id !== id);
        setLocalData('elevate_my_applications', apps);
        return { success: true, message: 'Application withdrawn successfully' };
      }
    ),

  getEmployerApplicants: (params = {}) =>
    safeCall(
      api.get('/applications/employer/applicants', { params }),
      () => {
        return {
          success: true,
          count: 2,
          applicants: [
            {
              _id: 'app_cand_1',
              candidateId: mockUsers[1],
              jobId: mockJobs[0],
              status: 'Under Review',
              createdAt: new Date().toISOString(),
              coverLetter: 'Passionate about high-throughput microservices and distributed transaction architectures.',
            },
          ],
        };
      }
    ),

  updateApplicationStatus: (id, statusData) =>
    safeCall(
      api.put(`/applications/${id}/status`, statusData),
      () => {
        return { success: true, message: 'Application status updated to ' + statusData.status };
      }
    ),

  getResumeUrl: (filename) => `/sample-resume.pdf`,
};

// Saved jobs and company endpoints
export const userService = {
  getSavedJobs: () =>
    safeCall(
      api.get('/users/saved-jobs'),
      () => {
        const savedIds = getLocalData('elevate_saved_job_ids', [mockJobs[0]._id, mockJobs[1]._id]);
        const jobs = mockJobs.filter((j) => savedIds.includes(j._id));
        return { success: true, count: jobs.length, savedJobs: jobs.map((job) => ({ _id: 'saved_' + job._id, jobId: job })) };
      }
    ),

  saveJob: (jobId) =>
    safeCall(
      api.post(`/users/saved-jobs/${jobId}`),
      () => {
        const savedIds = getLocalData('elevate_saved_job_ids', []);
        if (!savedIds.includes(jobId)) savedIds.push(jobId);
        setLocalData('elevate_saved_job_ids', savedIds);
        return { success: true, message: 'Job saved to your bookmarks' };
      }
    ),

  unsaveJob: (jobId) =>
    safeCall(
      api.delete(`/users/saved-jobs/${jobId}`),
      () => {
        let savedIds = getLocalData('elevate_saved_job_ids', []);
        savedIds = savedIds.filter((id) => id !== jobId);
        setLocalData('elevate_saved_job_ids', savedIds);
        return { success: true, message: 'Job removed from bookmarks' };
      }
    ),

  getCompanies: () =>
    safeCall(
      api.get('/users/companies'),
      () => {
        return { success: true, count: mockCompanies.length, companies: mockCompanies };
      }
    ),
};

// Salary & Skills Market Insights endpoints
export const insightService = {
  getSalaryBenchmarks: () =>
    safeCall(
      api.get('/insights/salary-benchmarks'),
      () => {
        return { success: true, count: mockSalaryBenchmarks.length, benchmarks: mockSalaryBenchmarks };
      }
    ),

  getLocations: () =>
    safeCall(
      api.get('/insights/locations'),
      () => {
        return { success: true, count: mockLocations.length, locations: mockLocations };
      }
    ),

  getSkills: () =>
    safeCall(
      api.get('/insights/skills'),
      () => {
        return { success: true, count: mockSkills.length, skills: mockSkills };
      }
    ),

  calculateProjection: (data) =>
    safeCall(
      api.post('/insights/calculate', data),
      () => {
        return {
          success: true,
          projection: calculateMockSalary(data),
        };
      }
    ),
};

export default api;
