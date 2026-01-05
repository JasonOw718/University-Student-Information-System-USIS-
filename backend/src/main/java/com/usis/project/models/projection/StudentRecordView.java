package com.usis.project.models.projection;

import java.math.BigDecimal;

public interface StudentRecordView {
    String getRegistrationId();
    String getCourseId();
    String getCourseName();
    BigDecimal getSubjectGpa();
    String getRegistrationStatus();
}