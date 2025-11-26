// Get runtime environment variables (for production) or build-time (for dev)
const getEnvVar = (key: string, defaultValue: string) => {
  // Check runtime config first (production)
  if (typeof window !== 'undefined' && (window as any)._env_) {
    return (window as any)._env_[key] || defaultValue;
  }
  // Fall back to build-time env (development)
  return import.meta.env[key] || defaultValue;
};

export const API_CONFIG = {
  baseURL: getEnvVar('VITE_API_URL', 'http://127.0.0.1:8000/api'),
  timeout: parseInt(getEnvVar('VITE_API_TIMEOUT', '30000')),
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
  resumeDownload: '/resume/download',
} as const;
