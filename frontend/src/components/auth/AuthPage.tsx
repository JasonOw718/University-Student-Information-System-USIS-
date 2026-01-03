import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Lock, Mail, User, Phone, MapPin, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<'student' | 'lecturer'>('student');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network request
        setTimeout(() => {
            setLoading(false);
            if (role === 'student') {
                navigate('/student/dashboard');
            } else {
                navigate('/lecturer/dashboard');
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[var(--primary)] via-[var(--secondary)] to-[var(--accent)]">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--primary-light)] mb-4 text-[var(--primary)]">
                        <GraduationCap size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)]">USIS</h1>
                    <p className="text-[var(--text-secondary)] mt-2">University Student Information System</p>
                </div>

                {/* Role Toggle */}
                <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
                    <button
                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${role === 'student'
                            ? 'bg-white text-[var(--primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        onClick={() => setRole('student')}
                        type="button"
                    >
                        <User size={16} className="mr-2" /> Student
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-all ${role === 'lecturer'
                            ? 'bg-white text-[var(--primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        onClick={() => setRole('lecturer')}
                        type="button"
                    >
                        <BookOpen size={16} className="mr-2" /> Lecturer
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Email Address"
                        type="email"
                        leftIcon={<Mail size={18} />}
                        required
                    />
                    <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        leftIcon={<Lock size={18} />}
                        rightIcon={showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        required
                    />

                    {!isLogin && (
                        <>
                            <Input
                                placeholder="Full Name"
                                type="text"
                                leftIcon={<User size={18} />}
                                required
                            />

                            {role === 'student' && (
                                <>
                                    <Input
                                        placeholder="IC Number"
                                        type="text"
                                        leftIcon={<CreditCard size={18} />}
                                        required
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        type="tel"
                                        leftIcon={<Phone size={18} />}
                                        required
                                    />
                                    <Input
                                        placeholder="Address"
                                        type="text"
                                        leftIcon={<MapPin size={18} />}
                                        required
                                    />
                                </>
                            )}
                        </>
                    )}

                    <Button
                        type="submit"
                        className="w-full mt-2"
                        size="lg"
                        isLoading={loading}
                    >
                        {isLogin ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>

                {/* Footer Toggle */}
                <div className="mt-6 text-center text-sm">
                    <span className="text-[var(--text-secondary)]">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-medium text-[var(--primary)] hover:underline"
                        type="button"
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>

            </div>
        </div>
    );
};
