package com.usis.project.controllers;

import com.usis.project.models.AuthRequest;
import com.usis.project.models.AuthResponse;
import com.usis.project.models.LecturerSignUpRequest;
import com.usis.project.models.UserSignupRequest;
import com.usis.project.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<AuthResponse> registerStudent(@RequestBody UserSignupRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/register/lecturer")
    public ResponseEntity<AuthResponse> registerLecturer(@RequestBody LecturerSignUpRequest request) {
        return ResponseEntity.ok(authService.registerLecturer(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
