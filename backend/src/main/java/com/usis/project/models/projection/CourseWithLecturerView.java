package com.usis.project.models.projection;

public interface CourseWithLecturerView {
    String getCourseId();
    String getCourseName();
    Integer getCreditHours();
    String getLecturerName();
    String getLecturerEmail();
}