import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import { useAuth } from './context/AuthContext';
import React from 'react';
import AuctionDetail from './pages/AuctionDetail';
import CreateAuction from './pages/CreateAuction';
import './index.css';

const App = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auction/:id" element={<AuctionDetail />} />
            <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
                path="/register"
                element={!user ? <Register /> : <Navigate to="/" />}
            />
            <Route
                path="/create"
                element={user ? <CreateAuction /> : <Navigate to="/login" />}
            />
        </Routes>
    );
};

export default App;
