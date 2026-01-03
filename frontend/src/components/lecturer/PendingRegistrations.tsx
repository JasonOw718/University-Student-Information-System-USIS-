import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { Button } from '../common/Button';
import { Check, X, Clock } from 'lucide-react';
import { lecturerService } from '../../services/lecturer.service';

export const PendingRegistrations: React.FC = () => {
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRegistrations = async () => {
        try {
            const response = await lecturerService.getPendingRegistrations();
            setRegistrations(response);
        } catch (error) {
            console.error("Failed to fetch pending registrations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        const status = action === 'approve' ? 'Approved' : 'Rejected'; 
        try {
            const response = await lecturerService.updateRegistrationStatus({
                registrationId: id,
                status: status
            });
            
            setRegistrations(registrations.filter(r => r.registrationId !== id));
            alert(response.message || `Registration ${action}ed successfully`);
        } catch (error: any) {
            console.error(`Failed to ${action} registration`, error);
            const errorMessage = error.response?.data?.message || `Failed to ${action} registration`;
            alert(errorMessage);
        }
    };

    return (
        <MainLayout role="lecturer">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pending Registrations</h1>
                <p className="text-[var(--text-secondary)]">Review and approve student course enrollments.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                                        Loading pending registrations...
                                    </td>
                                </tr>
                            )}
                            {!loading && registrations.map((reg) => (
                                <tr key={reg.registrationId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reg.registrationId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-0">
                                                <div className="text-sm font-medium text-gray-900">{reg.studentName || 'Unknown Student'}</div>
                                                <div className="text-sm text-gray-500">{reg.studentId || '-'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {reg.courseId}
                                        </span>
                                        <div className="text-sm text-gray-500 mt-1">{reg.courseName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${reg.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            <Clock size={12} className="mr-1 mt-0.5" /> {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => handleAction(reg.registrationId, 'approve')}
                                        >
                                            <Check size={16} className="mr-1" /> Approve
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleAction(reg.registrationId, 'reject')}
                                        >
                                            <X size={16} className="mr-1" /> Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}

                            {!loading && registrations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No pending registrations found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};
