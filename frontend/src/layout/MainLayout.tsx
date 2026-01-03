import React from 'react';
import { Navbar } from '../components/common/Navbar';

interface MainLayoutProps {
    children: React.ReactNode;
    role: 'student' | 'lecturer';
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, role }) => {
    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <Navbar role={role} />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-1 w-full">
                <div className="px-4 sm:px-0">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[var(--primary)] text-white py-6 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm opacity-80">
                    <p>University Student Information System, Persiaran Multimedia, 63100 Cyberjaya, Selangor, Malaysia</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <span>USIS Website</span>
                        <span>USIS Portal</span>
                        <span>CLIC</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
