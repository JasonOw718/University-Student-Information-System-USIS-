package com.usis.project.services;

import com.usis.project.entities.Course;
import com.usis.project.entities.CourseRegistration;
import com.usis.project.entities.Student;
import com.usis.project.models.*;
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
        CourseRegistration registration = registrationRepository.findById(request.getRegistrationId())
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if ("Dropped".equals(registration.getRegistrationStatus())) {
            throw new RuntimeException("Registration has been dropped");
        }

        if ("Pending".equals(registration.getRegistrationStatus())) {
            throw new RuntimeException("Registration is not approved yet");
        }

        registration.setSubjectGpa(request.getGpa());
        registrationRepository.save(registration);
    }

    public void updateRegistrationStatus(UpdateRegistrationStatusRequest request) {
        CourseRegistration registration = registrationRepository.findById(request.getRegistrationId())
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if ("Pending".equals(registration.getRegistrationStatus())) {
            if (!("Approved".equals(request.getStatus()) || "Dropped".equals(request.getStatus()))) {
                throw new RuntimeException("Invalid registration status");
            }
        }else{
            throw new RuntimeException("Registration has already been approved or rejected");

        }

        registration.setRegistrationStatus(request.getStatus());
        registrationRepository.save(registration);
    }

    public void addCourse(CourseRequest request) {
        if (courseRepository.existsById(request.getCourseId())) {
            throw new RuntimeException("Course ID already exists");
        }
        Course course = new Course();
        course.setCourseId(request.getCourseId());
        course.setCourseName(request.getCourseName());
        course.setCreditHours(request.getCreditHours());
        courseRepository.save(course);
    }

    public void deleteCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new RuntimeException("Course not found");
        }
        List<CourseRegistration> courseRegistrationList = registrationRepository.findAllByCourseId(courseId);
        if (courseRegistrationList.isEmpty()) {
            courseRepository.deleteById(courseId);
        } else {
            throw new RuntimeException("Course has registration already, delete couldnt be performed.");
        }
    }

    public List<CourseRegistrationResponse> getPendingRegistrations() {
        return registrationRepository.findByRegistrationStatus("Pending").stream()
                .map(reg -> {
                    CourseRegistrationResponse res = new CourseRegistrationResponse();
                    res.setRegistrationId(reg.getRegistrationId());
                    res.setStudentId(res.getStudentId());
                    res.setStudentName(res.getStudentName());
                    res.setCourseId(res.getCourseId());
                    res.setCourseName(res.getCourseName());
                    res.setStatus(reg.getRegistrationStatus());
                    return res;
                })
                .toList();
    }

    public List<StudentProfileResponse> getStudentsByCourseId(String courseId) {
        return registrationRepository.findByCourse_CourseIdAndRegistrationStatus(courseId, "Approved").stream()
                .map(reg -> {
                    Student student = reg.getStudent();
                    StudentProfileResponse res = new StudentProfileResponse();
                    res.setStudentId(student.getStudentId());
                    res.setName(student.getName());
                    res.setEmail(student.getEmail());
                    res.setIcNumber(student.getIcNumber());
                    res.setAddress(student.getAddress());
                    res.setPhoneNumber(student.getPhoneNumber());
                    res.setRegistrationId(reg.getRegistrationId());
                    return res;
                })
                .toList();
    }
}
