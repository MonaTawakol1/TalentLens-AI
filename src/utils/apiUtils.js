import { API_ENDPOINTS } from '../config/api';

/**
 * A wrapper around fetch that handles authentication headers and auto-refresh logic.
 * 
 * @param {string} url - The URL to fetch
 * @param {Object} options - Standard fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
    // 1. Get current token
    let token = sessionStorage.getItem('access_token');

    // 2. Add Authorization header
    const headers = {
        ...options.headers,
    };

    // Only set Content-Type to application/json if not sending FormData
    // FormData requires the browser to set the Content-Type with boundary
    if (!(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // 3. First attempt
    let response = await fetch(url, {
        ...options,
        headers
    });

    // 4. Handle 401 Unauthorized (Token Expired)
    if (response.status === 401) {
        // Try to refresh token
        try {
            const refreshResponse = await fetch(`${API_ENDPOINTS.auth}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Credentials include cookies (where refresh token lives)
                credentials: 'include'
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();

                // Update session storage
                sessionStorage.setItem('access_token', data.access_token);
                token = data.access_token;

                // Retry original request with new token
                const newHeaders = {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`
                };

                // Set content type only if not FormData
                if (!(options.body instanceof FormData)) {
                    newHeaders['Content-Type'] = 'application/json';
                }

                response = await fetch(url, {
                    ...options,
                    headers: newHeaders
                });
            } else {
                // Refresh failed - User must login again
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('user');
                window.location.href = '/login';
                throw new Error('Session expired');
            }
        } catch (error) {
            // Network error or other issue during refresh
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
            throw error;
        }
    }

    return response;
};
