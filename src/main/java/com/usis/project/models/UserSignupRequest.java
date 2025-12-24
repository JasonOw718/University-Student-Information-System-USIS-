package com.usis.project.models;

import lombok.Data;

@Data
public class UserSignupRequest {
    private String name;
    private String icNumber;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
}
