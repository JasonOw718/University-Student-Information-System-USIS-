package com.usis.project.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "COURSE_REGISTRATION", schema = "University")
@Data
public class CourseRegistration {
    @Id
    @Column(name = "RegistrationID", length = 50)
    private String registrationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StudentID", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CourseID", nullable = false)
    private Course course;

    @Column(name = "SubjectGPA", precision = 3, scale = 2)
    private BigDecimal subjectGpa;

    @Column(name = "RegistrationStatus", length = 20)
    private String registrationStatus;
}
