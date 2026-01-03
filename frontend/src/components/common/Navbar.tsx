import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Menu, X, LogOut } from 'lucide-react';
import { Button } from './Button';

import { authService } from '../../services/auth.service';

interface NavbarProps {
    role: 'student' | 'lecturer';
}

export const Navbar: React.FC<NavbarProps> = ({ role }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
    };

    const links = role === 'student'
        ? [
            { name: 'All Courses', path: '/student/dashboard' },
            { name: 'Enrolled Classes', path: '/student/enrolled' },
            { name: 'Profile', path: '/student/profile' },
        ]
        : [
            { name: 'All Courses', path: '/lecturer/dashboard' },
            { name: 'Pending Registrations', path: '/lecturer/pending' },
        ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
                                USIS
                            </span>
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            {links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${isActive
                                            ? 'border-[var(--primary)] text-[var(--text-primary)]'
                                            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-gray-300'
                                        }`
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Icons */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        {/* Icons removed as per request for both roles (or specifically added removal for lecturer imply none) */}
                        {/* {role !== 'student' && ( ... )} - Removed */}

                        {/* Profile Dropdown (Simplified) */}
                        <div className="ml-3 relative flex items-center space-x-2">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                <User size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden lg:block">Hi, User!</span>
                        </div>
                        <NavLink to="/" className="ml-4" onClick={handleLogout}>
                            <Button variant="ghost" size="sm" className="text-gray-500">
                                <LogOut size={18} />
                            </Button>
                        </NavLink>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary)]"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200">
                    <div className="pt-2 pb-3 space-y-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className={({ isActive }) =>
                                    `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                                        ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]'
                                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        <NavLink
                            to="/"
                            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                handleLogout();
                            }}
                        >
                            Logout
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};
