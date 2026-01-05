package com.usis.project.services;

import com.usis.project.entities.Lecturer;
import com.usis.project.entities.Student;
import com.usis.project.models.AuthRequest;
import com.usis.project.models.AuthResponse;
import com.usis.project.models.LecturerSignUpRequest;
import com.usis.project.models.UserSignupRequest;
import com.usis.project.repositories.LecturerRepository;
import com.usis.project.repositories.StudentRepository;
import com.usis.project.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final LecturerRepository lecturerRepository;

    public AuthResponse registerStudent(UserSignupRequest request) {
        String studentId = "S" + UUID.randomUUID().toString().substring(0, 8);
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        try {
            studentRepository.registerStudentProcedure(
                    studentId,
                    request.getName(),
                    request.getEmail(),
                    encodedPassword,
                    request.getIcNumber(),
                    request.getAddress(),
                    request.getPhoneNumber()
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails, "STUDENT", studentId);

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setRole("STUDENT");
            response.setId(studentId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Sign up as student failed");
        }
    }

    public AuthResponse registerLecturer(LecturerSignUpRequest request) {
        String lecturerId = "L" + UUID.randomUUID().toString().substring(0, 8);
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        try {
            lecturerRepository.registerLecturerProcedure(
                    lecturerId,
                    request.getName(),
                    request.getEmail(),
                    encodedPassword
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String token = jwtUtil.generateToken(userDetails, "LECTURER", lecturerId);

            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setRole("LECTURER");
            response.setId(lecturerId);

            return response;

        } catch (Exception e) {
            throw new RuntimeException("Sign up as lecturer failed");
        }
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());

        String role = userDetails.getAuthorities().stream().findFirst().get().getAuthority().replace("ROLE_", "");
        String id = "";

        if (role.equals("STUDENT")) {
            id = studentRepository.findByEmail(request.getEmail()).get().getStudentId();
        } else {
            id = lecturerRepository.findByEmail(request.getEmail()).get().getLecturerId();
        }

        String token = jwtUtil.generateToken(userDetails, role, id);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setRole(role);
        response.setId(id);

        return response;
    }
}
