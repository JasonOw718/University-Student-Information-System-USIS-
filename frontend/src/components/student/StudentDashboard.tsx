import React, { useState, useEffect } from 'react';
import { MainLayout } from '../../layout/MainLayout';
import { CourseCard } from '../common/CourseCard';
import { courseService } from '../../services/course.service';
import { studentService } from '../../services/student.service'; 

export const StudentDashboard: React.FC = () => {
    const [courses, setCourses] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const availableCoursesResponse = await courseService.getAvailableCourses();

            // Add gradients to courses (round-robin or random)
            const gradients = [
                'from-emerald-400 to-teal-500',
                'from-blue-500 to-blue-600',
                'from-blue-400 to-cyan-500',
                'from-indigo-400 to-purple-500',
                'from-teal-300 to-cyan-400'
            ];

            const mappedCourses = availableCoursesResponse.map((course, index) => ({
                ...course,
                title: course.courseName,
                code: course.courseId,
                gradient: gradients[index % gradients.length]
            }));

            setCourses(mappedCourses);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleRegister = async (courseId: string, courseTitle: string) => {
        try {
            await studentService.registerCourse(courseId);
            alert(`Successfully registered for ${courseTitle}`);
            fetchData(); 
        } catch (error: any) {
            console.error("Registration failed", error);
            const errorMessage = error.response?.data?.message || "Failed to register for course.";
            alert(errorMessage);
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
                    <h2 className="text-lg font-semibold">All Courses</h2>
                    {loading && <span className="text-sm text-gray-500">Loading courses...</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && courses.map((course) => {
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
                                        onClick: () => handleRegister(course.code, course.title), // Using courseId (code) for registration
                                        className: "text-[var(--primary)]"
                                    }
                                ]}
                            />
                        );
                    })}
                    {!loading && courses.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No courses available.</div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};
