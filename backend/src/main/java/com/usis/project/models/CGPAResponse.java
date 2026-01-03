package com.usis.project.models;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CGPAResponse {
    private String studentId;
    private BigDecimal cgpa;
}
