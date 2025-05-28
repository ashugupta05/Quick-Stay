import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login/login';
import Register from './login/register';
import Properties from './propertys/Properties';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to properties page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login and Register routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Properties route */}
        <Route path="/properties" element={<Properties />} />
      </Routes>
    </Router>
  );
}

export default App;
