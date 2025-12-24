package com.usis.project.controllers;

import com.usis.project.models.CourseRegistrationRequest;
import com.usis.project.models.CourseResponse;
import com.usis.project.models.CourseRegistrationResponse;
import com.usis.project.models.MessageResponse;
import com.usis.project.security.AuthUtil;
import com.usis.project.services.CourseService;
import com.usis.project.services.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;
    private final RegistrationService registrationService;
    private final AuthUtil authUtil;

    @GetMapping("/available")
    public ResponseEntity<List<CourseResponse>> getAvailableCourses() {
        return ResponseEntity.ok(courseService.getAvailableCourses());
    }

    @PostMapping("/register")
    public ResponseEntity<CourseRegistrationResponse> registerCourse(@RequestBody CourseRegistrationRequest request) {
        String studentId = authUtil.getAuthenticatedStudentId();
        return ResponseEntity.ok(registrationService.registerCourse(studentId, request));
    }

    @DeleteMapping("/register/{registrationId}")
    public ResponseEntity<MessageResponse> dropCourse(@PathVariable String registrationId) {
        String studentId = authUtil.getAuthenticatedStudentId();
        registrationService.dropCourse(registrationId, studentId);
        return ResponseEntity.ok(new MessageResponse("Course dropped successfully"));
    }
}
