package com.usis.project.models;

import lombok.Data;

@Data
public class LecturerSignUpRequest {
    private String name;
    private String email;
    private String password;
}
