import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Bell, PlusCircle, Calendar, User, LogOut } from 'lucide-react';
import clsx from 'clsx';
import rulogo from '../assets/rulogo.png';

export default function Navbar() {
  const { user, logout, notifications, markNotificationsRead } = useStore();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  const handleNotifClick = () => {
    setShowNotifs((prev) => !prev);
    if (unreadCount > 0) {
      markNotificationsRead();
    }
  };

    const navLinks = [
    { name: 'Events', path: '/', icon: Calendar },
    ...(user.isAdmin ? [{ name: 'Create', path: '/create-event', icon: PlusCircle }] : []),
    { name: 'Profile', path: '/profile', icon: User },
  ];

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    

                    <Link  to="/" className="flex items-center gap-2 group">
                        <div className="text-white p-1.5 rounded-lg transition-colors">
                            {rulogo ? (
                                <img src={rulogo} alt="RU Logo" className="h-8 w-auto" />
                            ) : (
                                <div className="bg-gray-300 h-8 w-8 rounded-full animate-pulse" />
                            )}
                        </div>

                        
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#CA4317] to-violet-600">
                            RU Events
                        </span>
                    </Link>

                    <nav className="hidden md:flex space-x-8">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;

                            return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={clsx(
                                    "flex items-center gap-2 text-sm font-medium transition-colors duration-300 px-2 py-2",
                                    isActive 
                                    ? "text-[#CA4317] bg-[#FFF1EB] rounded-2xl" 
                                    : "text-gray-500 border-transparent hover:text-gray-900 hover:border-gray-300"
                                )}>
                                
                                <Icon size={18} />
                                {link.name}
                            </Link>
                            )
                        })}
                    </nav>
            
                    <div className="flex items-center gap-4">
                        <div className="relative">
                        <button 
                            onClick={handleNotifClick}
                            className="p-2 text-gray-500 hover:text-[#CA4317] hover:bg-[#FFF1EB] rounded-full transition-colors relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                            )}
                        </button>

                        {/* Notifications Dropdown(popup menu when we click on notification icon) */}
                        {showNotifs && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2">
                            <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                            </div>
                            <div className="max-h-[60vh] overflow-y-auto">
                                {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className={clsx("px-4 py-3 border-b border-gray-50 text-sm", notif.read ? "text-gray-600" : "text-gray-900 bg-indigo-50/30 font-medium")}>
                                    {notif.message}
                                    </div>
                                ))
                                ) : (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications yet.</div>
                                )}
                            </div>
                            </div>
                        )}
                        </div>
                        
                        <div className="h-8 w-px bg-gray-200"></div>
                        
                        <button 
                        onClick={logout}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                        >
                        <LogOut size={18} />
                        <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}