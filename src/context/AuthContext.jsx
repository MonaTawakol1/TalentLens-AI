import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = () => {
            // Check for saved user in sessionStorage (more secure than localStorage for this context)
            const savedUser = sessionStorage.getItem('talentlens_user');
            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch (error) {
                    console.error("Failed to parse user data:", error);
                    sessionStorage.removeItem('talentlens_user');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = (email, password) => {
        // Mock Login Logic
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const mockUser = {
                        name: "Alex Johnson",
                        email: email,
                        plan: "Free",
                        avatar: "A"
                    };
                    setUser(mockUser);
                    sessionStorage.setItem('talentlens_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject("Invalid credentials");
                }
            }, 800);
        });
    };

    const register = (name, email, password) => {
        // Mock Register Logic
        return new Promise((resolve) => {
            setTimeout(() => {
                const newUser = {
                    name: name,
                    email: email,
                    plan: "Free",
                    avatar: name.charAt(0).toUpperCase()
                };
                setUser(newUser);
                sessionStorage.setItem('talentlens_user', JSON.stringify(newUser));
                resolve(newUser);
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('talentlens_user');
    };

    const updateUser = (updates) => {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        sessionStorage.setItem('talentlens_user', JSON.stringify(updatedUser));
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
