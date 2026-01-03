import React, { useState } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { User, Mail, Phone, Camera } from 'lucide-react';

export const ProfilePage: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);

    // Mock State
    const [profile] = useState({
        name: "Ka Sheng",
        studentId: "Sbdc3e4f9",
        email: "test@gmail.com",
        phone: "+60123456789",
        address: "123 Main Street, City",
        icNumber: "123456-78-9012",
        registrationId: null,
        cgpa: "3.85", // Mock CGPA
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // Logic to save would go here
    };

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
                                defaultValue={profile.name}
                                disabled={!isEditing}
                                leftIcon={<User size={18} />}
                            />
                            <Input
                                label="Student ID"
                                defaultValue={profile.studentId}
                                disabled
                                className="bg-gray-50"
                            />
                            <Input
                                label="Email Address"
                                defaultValue={profile.email}
                                disabled={!isEditing}
                                leftIcon={<Mail size={18} />}
                            />
                            <Input
                                label="Phone Number"
                                defaultValue={profile.phone}
                                disabled={!isEditing}
                                leftIcon={<Phone size={18} />}
                            />
                            <Input
                                label="IC Number"
                                defaultValue={profile.icNumber}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-gray-50" : ""}
                            />
                            <Input
                                label="Address"
                                defaultValue={profile.address}
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
