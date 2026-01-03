import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Lock, Mail, User, Phone, MapPin, CreditCard, Eye, EyeOff } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { authService } from '../../services/auth.service';

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<'student' | 'lecturer'>('student');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [icNumber, setIcNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                await authService.login({ email, password });
                const currentUser = authService.getCurrentUser();

                // Navigate based on role (or returned role from backend if available)
                // For now, trust the login response logic or fallback to user selection if backend doesn't return role clearly in login response structure used here
                if (currentUser?.role === 'lecturer') { // Normalized to lowercase in auth service
                    navigate('/lecturer/dashboard');
                } else { // Default to student dashboard
                    navigate('/student/dashboard');
                }

            } else {
                if (role === 'student') {
                    await authService.registerStudent({
                        name: fullName,
                        email,
                        password,
                        icNumber,
                        phoneNumber,
                        address,
                        role: 'student'
                    });
                    // Auto login or ask to login? Let's switch to login view for safety
                    setIsLogin(true);
                    alert("Registration successful! Please login.");

                } else {
                    await authService.registerLecturer({
                        name: fullName,
                        email,
                        password
                    });
                    setIsLogin(true);
                    alert("Lecturer registration successful! Please login.");
                }
            }
        } catch (err: any) {
            console.error(err);
            // Basic error handling
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials or try again.');
        } finally {
            setLoading(false);
        }
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

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        leftIcon={<Mail size={18} />}
                        required
                    />
                    <Input
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                leftIcon={<User size={18} />}
                                required
                            />

                            {role === 'student' && (
                                <>
                                    <Input
                                        placeholder="IC Number"
                                        type="text"
                                        value={icNumber}
                                        onChange={(e) => setIcNumber(e.target.value)}
                                        leftIcon={<CreditCard size={18} />}
                                        required
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        type="tel"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        leftIcon={<Phone size={18} />}
                                        required
                                    />
                                    <Input
                                        placeholder="Address"
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
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
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError(null);
                        }}
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
