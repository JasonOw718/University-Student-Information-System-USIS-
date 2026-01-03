package com.usis.project.models;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class StudentRecordResponse {
    private String registrationId;
    private String courseCode;
    private String courseName;
    private BigDecimal gpa;
    private String status;
}
