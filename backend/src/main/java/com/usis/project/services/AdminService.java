package com.usis.project.services;

import com.usis.project.models.*;
import com.usis.project.models.projection.RegistrationView;
import com.usis.project.models.projection.StudentProfileView;
import com.usis.project.repositories.CourseRegistrationRepository;
import com.usis.project.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final CourseRegistrationRepository registrationRepository;
    private final CourseRepository courseRepository;

    public void updateGrade(UpdateGradeRequest request) {
        try {
            registrationRepository.updateGradeProcedure(
                    request.getRegistrationId(),
                    request.getGpa()
            );
        } catch (Exception e) {
            throw new RuntimeException("Error updating grade procedure");
        }
    }

    public void updateRegistrationStatus(UpdateRegistrationStatusRequest request) {
        try {
            registrationRepository.updateRegistrationStatusProcedure(
                    request.getRegistrationId(),
                    request.getStatus()
            );
        } catch (Exception e) {
            throw new RuntimeException("Registration Status update failed");
        }
    }
    public void addCourse(CourseRequest request, String lecturerId) {
        try {
            courseRepository.addCourseProcedure(
                    request.getCourseId(),
                    request.getCourseName(),
                    request.getCreditHours(),
                    lecturerId
            );
        } catch (Exception e) {
            throw new RuntimeException("Add course failed");
        }
    }

    public void deleteCourse(String courseId, String lecturerId) {
        try {
            courseRepository.deleteCourseProcedure(courseId, lecturerId);
        } catch (Exception e) {
            throw new RuntimeException("Delete course failed");
        }
    }

    public List<CourseRegistrationResponse> getPendingRegistrations() {
        List<RegistrationView> registrations = registrationRepository.findByRegistrationStatus("Pending");

        return registrations.stream()
                .map(view -> {
                    CourseRegistrationResponse res = new CourseRegistrationResponse();

                    res.setRegistrationId(view.getRegistrationId());
                    res.setStudentId(view.getStudentId());
                    res.setCourseId(view.getCourseId());
                    res.setStudentName(view.getName());
                    res.setStatus(view.getRegistrationStatus());

                    return res;
                })
                .toList();
    }

    public List<StudentProfileResponse> getStudentsByCourseId(String courseId) {
        List<StudentProfileView> results = registrationRepository.findApprovedStudentsByCourse(courseId);

        return results.stream()
                .map(view -> {
                    StudentProfileResponse res = new StudentProfileResponse();
                    res.setRegistrationId(view.getRegistrationId());
                    res.setGpa(view.getSubjectGpa());
                    res.setStudentId(view.getStudentId());
                    res.setName(view.getName());
                    res.setEmail(view.getEmail());
                    res.setIcNumber(view.getIcNumber());
                    res.setAddress(view.getAddress());
                    res.setPhoneNumber(view.getPhoneNumber());
                    return res;
                })
                .toList();
    }
}
