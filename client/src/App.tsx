import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Group from './pages/Group';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/group/:groupCode" element={<Group />} />
        </Routes>
    );
}