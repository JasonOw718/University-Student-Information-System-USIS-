package com.usis.project.services;

import com.usis.project.entities.CourseRegistration;
import com.usis.project.entities.Student;
import com.usis.project.models.*;
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
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getPhoneNumber() != null) {
            student.setPhoneNumber(request.getPhoneNumber());
        }
        studentRepository.save(student);
    }

    public List<StudentRecordResponse> getStudentRecords(String studentId) {
        List<CourseRegistration> registrations = registrationRepository.findByStudent_StudentId(studentId);
        return registrations.stream().map(reg -> {
            StudentRecordResponse res = new StudentRecordResponse();
            res.setRegistrationId(reg.getRegistrationId());
            res.setCourseCode(reg.getCourse().getCourseId());
            res.setCourseName(reg.getCourse().getCourseName());
            res.setGpa(reg.getSubjectGpa());
            res.setStatus(reg.getRegistrationStatus());
            return res;
        }).collect(Collectors.toList());
    }

    public CGPAResponse calculateCGPA(String studentId) {
        List<CourseRegistration> registrations = registrationRepository
                .findByStudent_StudentIdAndRegistrationStatus(studentId, "Approved");

        BigDecimal totalPoints = BigDecimal.ZERO;
        int totalCredits = 0;

        for (CourseRegistration reg : registrations) {
            if (reg.getSubjectGpa() != null) {
                totalPoints = totalPoints
                        .add(reg.getSubjectGpa().multiply(BigDecimal.valueOf(reg.getCourse().getCreditHours())));
                totalCredits += reg.getCourse().getCreditHours();
            }
        }

        BigDecimal cgpa = BigDecimal.ZERO;
        if (totalCredits > 0) {
            cgpa = totalPoints.divide(BigDecimal.valueOf(totalCredits), 2, RoundingMode.HALF_UP);
        }

        CGPAResponse response = new CGPAResponse();
        response.setStudentId(studentId);
        response.setCgpa(cgpa);
        return response;
    }
}
