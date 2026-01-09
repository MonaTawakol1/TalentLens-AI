const API_BASE_URL = 'https://api.talentlens.ai/v1'; // Mock URL for now

/**
 * Generic API handler
 * @param {string} endpoint 
 * @param {object} options 
 */
export const apiRequest = async (endpoint, options = {}) => {
    // In a real app, this would fetch from the backend
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    // return response.json();

    console.log(`[Mock API] Request to ${endpoint}`, options);
    return null;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
