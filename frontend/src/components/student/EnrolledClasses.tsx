import React from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { studentService } from '../../services/student.service';
import { Button } from '../common/Button';

export const EnrolledClasses: React.FC = () => {
    const [enrolledClasses, setEnrolledClasses] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    const fetchEnrolledClasses = async () => {
        setLoading(true);
        try {
            const response: any = await studentService.getRecords();
            // Assuming response is an array of records
            setEnrolledClasses(response);
        } catch (error) {
            console.error("Failed to fetch enrolled classes", error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchEnrolledClasses();
    }, []);

    const handleDrop = async (registrationId: string, courseCode: string) => {
        if (!confirm(`Are you sure you want to drop ${courseCode}?`)) return;

        try {
            await studentService.dropCourse(registrationId);
            alert(`Successfully dropped ${courseCode}`);
            fetchEnrolledClasses(); // Refresh list
        } catch (error: any) {
            console.error("Drop failed", error);
            const errorMessage = error.response?.data?.message || "Failed to drop course.";
            alert(errorMessage);
        }
    };

    return (
        <MainLayout role="student">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Enrolled Classes</h1>
                <p className="text-[var(--text-secondary)]">List of your currently enrolled subjects.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course Code
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Course Name
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registration ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    GPA
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                                        Loading enrolled classes...
                                    </td>
                                </tr>
                            )}
                            {!loading && enrolledClasses.map((course) => (
                                <tr key={course.registrationId}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {course.courseCode}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.courseName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.registrationId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${course.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                course.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.gpa || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                                            size="sm"
                                            onClick={() => handleDrop(course.registrationId, course.courseCode)}
                                            disabled={course.status === 'Dropped' || course.status === 'Rejected'}
                                        >
                                            Drop
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {!loading && enrolledClasses.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No enrolled classes found.
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
