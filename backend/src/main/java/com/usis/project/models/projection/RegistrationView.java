package com.usis.project.models.projection;

import java.math.BigDecimal;

public interface RegistrationView {
    String getRegistrationId();
    BigDecimal getSubjectGpa();
    String getRegistrationStatus();
    String getStudentId();
    String getCourseId();
}