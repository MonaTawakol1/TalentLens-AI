import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_URL = API_ENDPOINTS.auth;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            let token = sessionStorage.getItem('access_token');

            // If no token, try to refresh
            if (!token) {
                try {
                    // Try to refresh token (uses httpOnly cookie)
                    const refreshResponse = await fetch(`${API_URL}/refresh`, {
                        method: 'POST',
                    });

                    if (refreshResponse.ok) {
                        const data = await refreshResponse.json();
                        token = data.access_token;
                        sessionStorage.setItem('access_token', token);
                    }
                } catch (err) {
                    // Silent fail on refresh
                    console.log("No active session found");
                }
            }

            if (token) {
                try {
                    // Verify token and get user details
                    const response = await fetch(`${API_URL}/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        // Add derived properties for UI compatibility
                        const uiUser = {
                            ...userData,
                            name: userData.fullName,
                            title: userData.title || "Aspiring Professional",
                            location: userData.location || "Unknown",
                            plan: "Free",
                            avatar: userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U',
                            joined: new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        };
                        setUser(uiUser);
                    } else {
                        // Token invalid/expired and refresh failed/not tried in this block (but we could retry refresh here too if we wanted robust interceptors)
                        // For now, simpler logic: if ME call fails, clear everything
                        logout();
                    }
                } catch (error) {
                    console.error("Auth check failed:", error);
                    logout();
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await response.json();
            // Save token
            sessionStorage.setItem('access_token', data.access_token);

            // Get User Profile immediately to populate state
            await fetchUserProfile(data.access_token);

            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (fullName, email, password) => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            // Auto login after register (if backend returns token, which it does)
            if (data.access_token) {
                sessionStorage.setItem('access_token', data.access_token);
                await fetchUserProfile(data.access_token);
            }

            return true;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    // Helper to fetch user profile
    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const userData = await response.json();
                // Add derived properties for UI compatibility
                const uiUser = {
                    ...userData,
                    name: userData.fullName, // Map fullName to name for existing UI components
                    title: userData.title || "Aspiring Professional",
                    location: userData.location || "Unknown",
                    plan: "Free", // Default plan
                    avatar: userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U',
                    joined: new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                };
                setUser(uiUser);
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    }

    const logout = async () => {
        try {
            // Optional: Call backend to clear httpOnly cookie
            const token = sessionStorage.getItem('access_token');
            await fetch(`${API_URL}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.warn("Logout endpoint error", err);
        } finally {
            setUser(null);
            sessionStorage.removeItem('access_token');
        }
    };

    const updateUser = async (updates) => {
        try {
            const token = sessionStorage.getItem('access_token');
            const apiUpdates = {};

            // Map UI fields to Backend fields
            if (updates.name) apiUpdates.fullName = updates.name;
            if (updates.email) apiUpdates.email = updates.email;
            if (updates.title) apiUpdates.title = updates.title;
            if (updates.location) apiUpdates.location = updates.location;

            const response = await fetch(`${API_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiUpdates)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }

            const updatedData = await response.json();

            // Merge response back into UI state, maintaining mappings
            const uiUser = {
                ...user,
                ...updatedData,
                name: updatedData.fullName || user.name, // Ensure name is synced
                title: updatedData.title || user.title,
                location: updatedData.location || user.location
            };
            setUser(uiUser);
            return true;
        } catch (error) {
            console.error("Update profile error:", error);
            throw error;
        }
    };

    const value = {
        user,
        login,
        register,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
