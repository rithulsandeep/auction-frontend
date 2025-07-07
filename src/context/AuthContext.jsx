import { createContext, useContext, useState } from 'react';
import React from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const [user, setUser] = useState(() => {
        try {
            return storedUser && storedUser !== "undefined"
                ? JSON.parse(storedUser)
                : null;
        } catch (error) {
            console.error("Error parsing user from localStorage", error);
            return null;
        }
    });

    const login = (userData) => {
        // userData should contain _id, username, email, token
        const user = {
            _id: userData._id,
            username: userData.username,
            email: userData.email,
        };
        console.log('Login response:', userData);

        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', userData.token);
        console.log('Stored token:', localStorage.getItem('token'));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);