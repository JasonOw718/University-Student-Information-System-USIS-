package com.usis.project.services;

import com.usis.project.entities.CourseRegistration;
import com.usis.project.entities.Student;
import com.usis.project.models.*;
import com.usis.project.models.projection.StudentRecordView;
import com.usis.project.models.projection.StudentRegistrationView;
import com.usis.project.repositories.CourseRegistrationRepository;
import com.usis.project.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;
    private final CourseRegistrationRepository registrationRepository;

    public StudentProfileResponse getProfile(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        StudentProfileResponse response = new StudentProfileResponse();
        response.setStudentId(student.getStudentId());
        response.setName(student.getName());
        response.setIcNumber(student.getIcNumber());
        response.setEmail(student.getEmail());
        response.setAddress(student.getAddress());
        response.setPhoneNumber(student.getPhoneNumber());
        return response;
    }

    public void updateProfile(String studentId, UpdateProfileRequest request) {
        try {
            studentRepository.updateProfileProcedure(
                    studentId,
                    request.getAddress(),
                    request.getPhoneNumber()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile");
        }
    }
    public List<StudentRecordResponse> getStudentRecords(String studentId) {
        List<StudentRecordView> registrations = registrationRepository.findByStudent_StudentId(studentId);

        return registrations.stream().map(view -> {
            StudentRecordResponse res = new StudentRecordResponse();

            res.setRegistrationId(view.getRegistrationId());
            res.setCourseCode(view.getCourseId());
            res.setCourseName(view.getCourseName());
            res.setGpa(view.getSubjectGpa());
            res.setStatus(view.getRegistrationStatus());

            return res;
        }).collect(Collectors.toList());
    }

    public CGPAResponse calculateCGPA(String studentId) {
        List<StudentRegistrationView> registrations = registrationRepository
                .findByStudent_StudentIdAndRegistrationStatus(studentId, "Approved");

        BigDecimal totalPoints = BigDecimal.ZERO;
        int totalCredits = 0;

        for (StudentRegistrationView reg : registrations) {
            if (reg.getSubjectGpa() != null && reg.getCreditHours() != null) {
                BigDecimal points = reg.getSubjectGpa().multiply(BigDecimal.valueOf(reg.getCreditHours()));
                totalPoints = totalPoints.add(points);
                totalCredits += reg.getCreditHours();
            }
        }

        BigDecimal cgpa = (totalCredits > 0)
                ? totalPoints.divide(BigDecimal.valueOf(totalCredits), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        CGPAResponse response = new CGPAResponse();
        response.setStudentId(studentId);
        response.setCgpa(cgpa);
        return response;
    }
}
