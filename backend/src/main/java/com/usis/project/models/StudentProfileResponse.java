package com.usis.project.models;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class StudentProfileResponse {
    private String studentId;
    private String name;
    private String icNumber;
    private String email;
    private String address;
    private String phoneNumber;
    private String registrationId;
    private BigDecimal gpa;
}
