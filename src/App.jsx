import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { useStore } from './store/useStore';
import Auth from './pages/Auth';
import CreateEvent from './pages/CreateEvent';
import Profile from './pages/Profile';
import MyEvents from './pages/MyEvents';


const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (user === undefined) return null; 
  if (user === null) return <Navigate to="/login" replace />; 
  return children;
};

const AdminRoute = ({ children }) => {
  const user = useStore((state) => state.user);
  if (user === undefined) return null;
  if (user === null) return <Navigate to="/login" replace />;   
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const initAuth = useStore((state) => state.initAuth);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initAuth();
    setAuthReady(true);
  }, []);

  if (!authReady) return null;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 md:pb-8">
          <Routes>
            <Route path="/login" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/create-event" element={<AdminRoute><CreateEvent /></AdminRoute>} />
            <Route path="/my-event" element={<ProtectedRoute><MyEvents /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
