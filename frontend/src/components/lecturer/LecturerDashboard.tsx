import React, { useState } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { CourseCard } from '../common/CourseCard';
import { Button } from '../common/Button';
import { Plus } from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
    const [courses, setCourses] = useState([
        { id: 1, code: 'UGRD-FCI-2530', title: 'CCS6344-DATABASE AND CLOUD SECURITY', gradient: 'from-emerald-400 to-teal-500', creditHours: 3, lecturerName: "Me", lecturerEmail: "me@example.com" },
        { id: 2, code: 'UGRD-FCI-2530', title: 'CDS6314-DATA MINING', gradient: 'from-blue-500 to-blue-600', creditHours: 4, lecturerName: "Me", lecturerEmail: "me@example.com" },
        { id: 3, code: 'UGRD-FCI-2530', title: 'CPT6314-FINAL YEAR PROJECT 1', gradient: 'from-blue-400 to-cyan-500', creditHours: 6, lecturerName: "Me", lecturerEmail: "me@example.com" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourse, setNewCourse] = useState({
        courseId: 'CS102',
        courseName: 'Introduction to Computer Science 2',
        creditHours: 3
    });

    const handleAddCourse = () => {
        const newId = courses.length + 1;
        setCourses([...courses, {
            id: newId,
            code: newCourse.courseId,
            title: newCourse.courseName,
            gradient: 'from-purple-500 to-pink-500',
            creditHours: newCourse.creditHours,
            lecturerName: "Me",
            lecturerEmail: "me@example.com"
        }]);
        setIsModalOpen(false);
        setNewCourse({
            courseId: '',
            courseName: '',
            creditHours: 3
        });
    };

    const handleDeleteCourse = (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    // Mock students for the selected course view
    const students = [
        {
            address: "123 Main Street, City",
            email: "test@gmail.com",
            icNumber: "123456-78-9012",
            name: "Ka Sheng",
            phoneNumber: "+60123456789",
            registrationId: "Re8e69a37",
            studentId: "Sbdc3e4f9",
            grade: null
        },
        // Can add more mock data here
    ];

    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [assignGradeModal, setAssignGradeModal] = useState<{ isOpen: boolean; studentId: string | null; studentName: string | null }>({ isOpen: false, studentId: null, studentName: null });
    const [grade, setGrade] = useState('');

    const handleAssignGrade = () => {
        // Logic to save grade
        console.log(`Assigned Grade ${grade} to ${assignGradeModal.studentName}`);
        setAssignGradeModal({ isOpen: false, studentId: null, studentName: null });
        setGrade('');
    };

    if (selectedCourse) {
        return (
            <MainLayout role="lecturer">
                <div className="mb-6 flex flex-col">
                    <button onClick={() => setSelectedCourse(null)} className="mr-auto mb-4 text-gray-500 hover:text-gray-700 font-medium flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Courses
                    </button>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{selectedCourse.title}</h1>
                </div>

                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold">Registered Students</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GPA</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.studentId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-xs text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.studentId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{student.phoneNumber}</div>
                                            <div className="text-xs text-gray-400">{student.address}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.registrationId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.grade ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {student.grade}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 italic">Not assigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Button
                                                size="sm"
                                                onClick={() => setAssignGradeModal({ isOpen: true, studentId: student.studentId, studentName: student.name })}
                                            >
                                                Assign Grade
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirm Grade Modal */}
                {assignGradeModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="p-6">
                                <h3 className="text-lg font-bold mb-4">Assign Grade for {assignGradeModal.studentName}</h3>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Grade / GPA</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                        placeholder="e.g. 4.0"
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <Button variant="ghost" onClick={() => setAssignGradeModal({ isOpen: false, studentId: null, studentName: null })}>Cancel</Button>
                                    <Button onClick={handleAssignGrade}>Save Grade</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </MainLayout>
        );
    }

    return (
        <MainLayout role="lecturer">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Courses</h1>
                    <p className="text-[var(--text-secondary)]">Overview of all active courses.</p>
                </div>

                <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus size={20} />}>
                    Add Course
                </Button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Course overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="relative group">
                            <CourseCard
                                code={course.code}
                                title={course.title}
                                creditHours={course.creditHours}
                                lecturerName={course.lecturerName}
                                gradient={course.gradient}
                                role="lecturer"
                                onClick={() => setSelectedCourse(course)}
                                menuItems={[
                                    {
                                        label: "Delete",
                                        onClick: () => handleDeleteCourse(course.id),
                                        className: "text-[var(--danger)]"
                                    }
                                ]}
                            />
                        </div>
                    ))}
                </div>

                {courses.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No courses available. Click "Add Course" to create one.
                    </div>
                )}
            </div>

            {/* Add Course Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Add New Course</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Course ID
                                </label>
                                <input
                                    type="text"
                                    id="courseId"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="e.g. CS102"
                                    value={newCourse.courseId}
                                    onChange={(e) => setNewCourse({ ...newCourse, courseId: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Name
                                </label>
                                <input
                                    type="text"
                                    id="courseName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="e.g. Introduction to Computer Science 2"
                                    value={newCourse.courseName}
                                    onChange={(e) => setNewCourse({ ...newCourse, courseName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700 mb-1">
                                    Credit Hours
                                </label>
                                <input
                                    type="number"
                                    id="creditHours"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                    placeholder="e.g. 3"
                                    value={newCourse.creditHours}
                                    onChange={(e) => setNewCourse({ ...newCourse, creditHours: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddCourse}>Add Course</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};
