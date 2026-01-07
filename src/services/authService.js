import { sleep } from './api';

export const authService = {
    login: async (email, password) => {
        await sleep(800); // Simulate network delay
        if (email && password) {
            return {
                name: "Alex Johnson",
                email: email,
                plan: "Free",
                avatar: "A"
            };
        }
        throw new Error("Invalid credentials");
    },

    register: async (name, email, password) => {
        await sleep(800);
        return {
            name: name,
            email: email,
            plan: "Free",
            avatar: name.charAt(0).toUpperCase()
        };
    }
};
