package com.usis.project.controllers;

import com.usis.project.models.*;
import com.usis.project.security.AuthUtil;
import com.usis.project.services.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;
    private final AuthUtil authUtil;

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileResponse> getProfile() {
        String studentId = authUtil.getAuthenticatedStudentId();
        return ResponseEntity.ok(studentService.getProfile(studentId));
    }

    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        String studentId = authUtil.getAuthenticatedStudentId();

        studentService.updateProfile(studentId, request);
        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }

    @GetMapping("/records")
    public ResponseEntity<?> getStudentRecords() {
        String studentId = authUtil.getAuthenticatedStudentId();
        return ResponseEntity.ok(studentService.getStudentRecords(studentId));
    }

    @GetMapping("/{studentId}/cgpa")
    public ResponseEntity<CGPAResponse> getCGPA(@PathVariable String studentId) {
        return ResponseEntity.ok(studentService.calculateCGPA(studentId));
    }
}
