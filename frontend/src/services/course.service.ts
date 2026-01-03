import api from './api';

export interface CourseResponse {
    id: string; // The backend might use MongoDB ID strings
    courseName: string;
    courseId: string; // The code like "CS101"
    creditHours: number;
    lecturerId: string;
    lecturerName: string;
}

export const courseService = {
    getAvailableCourses: async () => {
        const response = await api.get<CourseResponse[]>('/courses/available');
        return response.data;
    }
};
