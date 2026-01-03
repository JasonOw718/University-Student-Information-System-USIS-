package com.usis.project.models;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
    private String id;
}
