package com.usis.project.models;

import lombok.Data;

@Data
public class CourseRegistrationResponse {
    private String registrationId;
    private String status;
    private String studentId;
    private String studentName;
    private String courseId;
    private String courseName;
}
