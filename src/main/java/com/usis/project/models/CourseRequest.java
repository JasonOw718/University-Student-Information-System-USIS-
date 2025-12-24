package com.usis.project.models;

import lombok.Data;

@Data
public class CourseRequest {
    private String courseId;
    private String courseName;
    private Integer creditHours;
}
