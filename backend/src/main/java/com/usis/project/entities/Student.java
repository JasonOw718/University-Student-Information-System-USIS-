package com.usis.project.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "STUDENT", schema = "University")
@Data
public class Student {
    @Id
    @Column(name = "StudentID", length = 50)
    private String studentId;

    @Column(name = "Name", length = 100, nullable = false)
    private String name;

    @Column(name = "ICNumber", length = 20, nullable = false)
    private String icNumber;

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "Address", length = 255)
    private String address;

    @Column(name = "PhoneNumber", length = 20)
    private String phoneNumber;

    @Column(name = "Password", length = 255, nullable = false)
    private String password;
}
