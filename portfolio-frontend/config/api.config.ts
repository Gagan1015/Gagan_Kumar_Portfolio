export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

export const API_ENDPOINTS = {
  profile: '/profile',
  experiences: '/experiences',
  education: '/education',
  projects: '/projects',
  skills: '/skills',
  settings: '/settings',
} as const;
