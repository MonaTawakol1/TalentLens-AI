// API Configuration
// In development, uses localhost. In production, uses the deployed backend URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    auth: `${API_BASE_URL}/auth`,
    analysis: `${API_BASE_URL}/analysis`,
};
