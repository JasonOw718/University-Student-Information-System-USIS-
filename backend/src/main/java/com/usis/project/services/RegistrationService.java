package com.usis.project.services;

import com.usis.project.models.CourseRegistrationRequest;
import com.usis.project.models.CourseRegistrationResponse;
import com.usis.project.models.projection.RegistrationResultView;
import com.usis.project.repositories.CourseRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final CourseRegistrationRepository registrationRepository;

    public CourseRegistrationResponse registerCourse(String studentId, CourseRegistrationRequest request) {
        String newId = "R" + UUID.randomUUID().toString().substring(0, 8);

        try {
            RegistrationResultView result = registrationRepository.registerCourseProcedure(
                    studentId,
                    request.getCourseId(),
                    newId
            );

            CourseRegistrationResponse response = new CourseRegistrationResponse();
            response.setRegistrationId(result.getRegistrationId());
            response.setStudentId(result.getStudentId());
            response.setStudentName(result.getStudentName());
            response.setCourseId(result.getCourseId());
            response.setCourseName(result.getCourseName());
            response.setStatus(result.getRegistrationStatus());

            return response;

        } catch (Exception e) {
            throw new RuntimeException("The course registration failed");
        }
    }

    public void dropCourse(String registrationId, String studentId) {
        try {
            registrationRepository.dropCourseProcedure(registrationId, studentId);
        } catch (Exception e) {
            throw new RuntimeException("Course registration dropped failed");
        }
    }
}
