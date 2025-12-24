package com.usis.project.models;

import lombok.Data;

@Data
public class CourseResponse {
    private String courseId;
    private String courseName;
    private Integer creditHours;
}
