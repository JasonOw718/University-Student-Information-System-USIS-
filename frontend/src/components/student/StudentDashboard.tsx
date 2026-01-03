import React, { useState } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { CourseCard } from '../common/CourseCard';

export const StudentDashboard: React.FC = () => {
    // Mock Data
    const [courses] = useState([
        { id: 1, code: 'UGRD-FCI-2530', title: 'CCS6344-DATABASE AND CLOUD SECURITY', gradient: 'from-emerald-400 to-teal-500', creditHours: 3, lecturerName: "Dr. Sarah Lee" },
        { id: 2, code: 'UGRD-FCI-2530', title: 'CDS6314-DATA MINING', gradient: 'from-blue-500 to-blue-600', creditHours: 4, lecturerName: "Prof. Alan Turing" },
        { id: 3, code: 'UGRD-FCI-2530', title: 'CPT6314-FINAL YEAR PROJECT 1', gradient: 'from-blue-400 to-cyan-500', creditHours: 6, lecturerName: "Mr. John Doe" },
        { id: 4, code: 'UGRD-FCI-2530', title: 'CSE6314-SOFTWARE RELIABILITY & QA', gradient: 'from-indigo-400 to-purple-500', creditHours: 3, lecturerName: "Ms. Emily Chen" },
        { id: 5, code: 'UGRD-FCI-2530', title: 'CSE6344-THEORY OF COMPUTATION', gradient: 'from-teal-300 to-cyan-400', creditHours: 3, lecturerName: "Dr. Brown" },
    ]);

    // Mock previously enrolled courses (IDs)
    const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([1, 4]);

    const handleRegister = (courseId: number, courseTitle: string) => {
        if (!enrolledCourseIds.includes(courseId)) {
            setEnrolledCourseIds([...enrolledCourseIds, courseId]);
            console.log(`Registered for ${courseTitle}`);
        }
    };

    const handleDrop = (courseId: number, courseTitle: string) => {
        if (enrolledCourseIds.includes(courseId)) {
            setEnrolledCourseIds(enrolledCourseIds.filter(id => id !== courseId));
            console.log(`Dropped ${courseTitle}`);
        }
    };

    return (
        <MainLayout role="student">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Hi, Student! 👋</h1>
                <p className="text-[var(--text-secondary)]">Welcome back to your course overview.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold">Course overview</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.includes(course.id);
                        return (
                            <CourseCard
                                key={course.id}
                                code={course.code}
                                title={course.title}
                                creditHours={course.creditHours}
                                lecturerName={course.lecturerName}
                                gradient={course.gradient}
                                role="student"
                                menuItems={[
                                    {
                                        label: "Register Course",
                                        onClick: () => handleRegister(course.id, course.title),
                                        className: "text-[var(--primary)]",
                                        disabled: isEnrolled
                                    },
                                    {
                                        label: "Drop Course",
                                        onClick: () => handleDrop(course.id, course.title),
                                        className: "text-[var(--danger)]",
                                        disabled: !isEnrolled
                                    }
                                ]}
                            />
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
};
