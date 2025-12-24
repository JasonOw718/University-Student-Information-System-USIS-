package com.usis.project.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "COURSE", schema = "University")
@Data
public class Course {
    @Id
    @Column(name = "CourseID", length = 20)
    private String courseId;

    @Column(name = "CourseName", length = 100, nullable = false)
    private String courseName;

    @Column(name = "CreditHours", nullable = false)
    private Integer creditHours;
}
