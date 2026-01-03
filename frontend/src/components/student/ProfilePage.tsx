import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { User, Mail, Phone, Camera } from 'lucide-react';
import { studentService } from '../../services/student.service';

export const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>({
        name: "",
        studentId: "",
        email: "",
        phone: "",
        address: "",
        icNumber: "",
        cgpa: "0.00",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await studentService.getProfile();
                let cgpa = "0.00";
                if (profileData && profileData.studentId) {
                    try {
                        const cgpaResponse = await studentService.getCGPA(profileData.studentId);
                        if (cgpaResponse && typeof cgpaResponse.cgpa === 'number') {
                            cgpa = cgpaResponse.cgpa.toFixed(2);
                        }
                    } catch (e) {
                        console.error("Failed to fetch CGPA", e);
                    }
                }

                setProfile({
                    name: profileData.name,
                    studentId: profileData.studentId,
                    email: profileData.email,
                    phone: profileData.phoneNumber,
                    address: profileData.address,
                    icNumber: profileData.icNumber,
                    cgpa: cgpa
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await studentService.updateProfile({
                phoneNumber: profile.phone,
                address: profile.address
            });
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const errorMessage = error.response?.data?.message || "Failed to update profile.";
            alert(errorMessage);
        }
    };

    if (loading) {
        return (
            <MainLayout role="student">
                <div className="flex justify-center items-center h-64">
                    <div className="text-gray-500">Loading profile...</div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout role="student">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] relative">
                        <div className="absolute -bottom-16 left-8">
                            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center relative group cursor-pointer overflow-hidden">
                                {/* Placeholder Avatar */}
                                <User size={64} className="text-gray-400" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-8 pb-8">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                                <p className="text-gray-500">{profile.studentId} • CGPA: {profile.cgpa}</p>
                            </div>
                            <Button
                                variant={isEditing ? 'ghost' : 'primary'}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </Button>
                        </div>

                        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Name"
                                value={profile.name}
                                disabled
                                leftIcon={<User size={18} />}
                            />
                            <Input
                                label="Student ID"
                                value={profile.studentId}
                                disabled
                                className="bg-gray-50"
                            />
                            <Input
                                label="Email Address"
                                value={profile.email}
                                disabled
                                leftIcon={<Mail size={18} />}
                            />
                            <Input
                                label="Phone Number"
                                value={profile.phone}
                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                disabled={!isEditing}
                                leftIcon={<Phone size={18} />}
                            />
                            <Input
                                label="IC Number"
                                value={profile.icNumber}
                                disabled
                                className={!isEditing ? "bg-gray-50" : ""}
                            />
                            <Input
                                label="Address"
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                disabled={!isEditing}
                                className="md:col-span-2"
                            />

                            {isEditing && (
                                <div className="md:col-span-2 flex justify-end mt-4">
                                    <Button type="submit">Save Changes</Button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};
