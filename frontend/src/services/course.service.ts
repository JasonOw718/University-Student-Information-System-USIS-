import api from './api';

export interface CourseResponse {
    id: string;
    courseName: string;
    courseId: string; 
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
