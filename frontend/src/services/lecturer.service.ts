import api from './api';

export interface CourseRequest {
    courseName: string;
    courseId: string;
    creditHours: number;
}

export interface UpdateGradeRequest {
    registrationId: string;
    gpa: string;
}

export interface UpdateRegistrationStatusRequest {
    registrationId: string;
    status: string; // "APPROVED", "REJECTED"
}

export const lecturerService = {
    addCourse: async (data: CourseRequest) => {
        const response = await api.post('/admin/courses', data);
        return response.data;
    },

    deleteCourse: async (courseId: string) => {
        const response = await api.delete(`/admin/courses/${courseId}`);
        return response.data;
    },

    getPendingRegistrations: async () => {
        const response = await api.get('/admin/registrations/pending');
        return response.data;
    },

    updateRegistrationStatus: async (data: UpdateRegistrationStatusRequest) => {
        const response = await api.put('/admin/registration/status', data);
        return response.data;
    },

    updateGrade: async (data: UpdateGradeRequest) => {
        const response = await api.put('/admin/grades', data);
        return response.data;
    },

    getStudentsByCourse: async (courseId: string) => {
        const response = await api.get(`/admin/courses/${courseId}/students`);
        return response.data;
    }
};
