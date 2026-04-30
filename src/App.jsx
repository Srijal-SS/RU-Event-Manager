import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { useStore } from './store/useStore';
import Auth from './pages/Auth';

const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
