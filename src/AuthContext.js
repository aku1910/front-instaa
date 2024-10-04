import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AuthContext = createContext();

// Context provider component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || '');
    const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

    useEffect(() => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userId', userId);
    }, [authToken, userId]);

    const login = (token, id) => {
        setAuthToken(token);
        setUserId(id);
    };

    const logout = () => {
        setAuthToken('');
        setUserId('');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ authToken, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
