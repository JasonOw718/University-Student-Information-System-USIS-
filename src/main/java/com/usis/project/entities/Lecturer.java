package com.usis.project.entities;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "LECTURER", schema = "University")
@Data
public class Lecturer {
    @Id
    @Column(name = "LecturerID", length = 50)
    private String lecturerId;

    @Column(name = "Name", length = 100, nullable = false)
    private String name;

    @Column(name = "Email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "Password", length = 255, nullable = false)
    private String password;

}
