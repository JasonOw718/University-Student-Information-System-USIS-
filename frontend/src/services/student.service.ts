import api from './api';

export interface StudentProfileResponse {
    studentId: string;
    name: string;
    email: string;
    icNumber: string;
    phoneNumber: string;
    address: string;
}

export interface MessageResponse {
    message: string;
}

export interface CourseRegistrationRequest {
    courseId: string;
}

export interface UpdateProfileRequest {
    phoneNumber: string;
    address: string;
}

export interface CGPAResponse {
    cgpa: number;
}

export const studentService = {
    getProfile: async () => {
        const response = await api.get<StudentProfileResponse>('/student/profile');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileRequest) => {
        const response = await api.put<MessageResponse>('/student/profile', data);
        return response.data;
    },

    getRecords: async () => {
        const response = await api.get('/student/records'); // Return type depends on backend DTO, likely list of enrollments
        return response.data;
    },

    registerCourse: async (courseId: string) => {
        const response = await api.post('/courses/register', { courseId });
        return response.data;
    },

    dropCourse: async (registrationId: string) => {
        const response = await api.delete<MessageResponse>(`/courses/register/${registrationId}`);
        return response.data;
    },

    getCGPA: async (studentId: string) => {
        const response = await api.get<CGPAResponse>(`/student/${studentId}/cgpa`);
        return response.data;
    }
};
