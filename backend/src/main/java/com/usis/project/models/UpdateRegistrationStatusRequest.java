package com.usis.project.models;

import lombok.Data;

@Data
public class UpdateRegistrationStatusRequest {
    private String registrationId;
    private String status;
}
