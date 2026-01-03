package com.usis.project.controllers;

import com.usis.project.models.*;
import com.usis.project.security.AuthUtil;
import com.usis.project.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final AuthUtil authUtil;

    @PutMapping("/grades")
    public ResponseEntity<MessageResponse> updateGrade(@RequestBody UpdateGradeRequest request) {
        adminService.updateGrade(request);
        return ResponseEntity.ok(new MessageResponse("Grade updated"));
    }

    @PutMapping("/registration/status")
    public ResponseEntity<MessageResponse> updateRegistrationStatus(
            @RequestBody UpdateRegistrationStatusRequest request) {
        adminService.updateRegistrationStatus(request);
        return ResponseEntity.ok(new MessageResponse("Status updated"));
    }

    @PostMapping("/courses")
    public ResponseEntity<MessageResponse> addCourse(@RequestBody CourseRequest request) {
        String lecturerId =  authUtil.getAuthenticatedLecturerId();
        adminService.addCourse(request,lecturerId);
        return ResponseEntity.ok(new MessageResponse("Course added successfully"));
    }

    @DeleteMapping("/courses/{courseId}")
    public ResponseEntity<MessageResponse> deleteCourse(@PathVariable String courseId) {
        String lecturerId =  authUtil.getAuthenticatedLecturerId();
        adminService.deleteCourse(courseId,lecturerId);
        return ResponseEntity.ok(new MessageResponse("Course deleted successfully"));
    }

    @GetMapping("/registrations/pending")
    public ResponseEntity<List<CourseRegistrationResponse>> getPendingRegistrations() {
        return ResponseEntity.ok(adminService.getPendingRegistrations());
    }

    @GetMapping("/courses/{courseId}/students")
    public ResponseEntity<List<StudentProfileResponse>> getStudentsByCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(adminService.getStudentsByCourseId(courseId));
    }
}
