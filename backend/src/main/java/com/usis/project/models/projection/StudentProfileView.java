package com.usis.project.models.projection;

import java.math.BigDecimal;

public interface StudentProfileView {
    String getRegistrationId();
    BigDecimal getSubjectGpa();
    String getStudentId();
    String getName();
    String getEmail();
    String getIcNumber();
    String getAddress();
    String getPhoneNumber();
}