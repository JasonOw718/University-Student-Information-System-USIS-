package com.usis.project.models;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateGradeRequest {
    private String registrationId;
    private BigDecimal gpa;
}
