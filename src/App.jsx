import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust this path to wherever your Navbar is
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* This will show the Auth page when you go to localhost:5173/login */}
          <Route path="/login" element={<Auth />} />
          
          {/* Add your other routes like home here later */}
          <Route path="/" element={<h1 className="text-center mt-10">Home Page</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
