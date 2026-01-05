package com.usis.project.models.projection;

import java.math.BigDecimal;

public interface StudentRegistrationView {
    String getRegistrationId();
    BigDecimal getSubjectGpa();
    Integer getCreditHours();
    String getRegistrationStatus();
}