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
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (lecturerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Student student = new Student();
        student.setStudentId("S" + UUID.randomUUID().toString().substring(0, 8));
        student.setName(request.getName());
        student.setIcNumber(request.getIcNumber());
        student.setEmail(request.getEmail());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setAddress(request.getAddress());
        student.setPhoneNumber(request.getPhoneNumber());

        studentRepository.save(student);

        UserDetails userDetails = userDetailsService.loadUserByUsername(student.getEmail());
        String token = jwtUtil.generateToken(userDetails, "STUDENT", student.getStudentId());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setRole("STUDENT");
        response.setId(student.getStudentId());

        return response;
    }

    public AuthResponse registerLecturer(LecturerSignUpRequest request) {
        if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (lecturerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Lecturer lecturer = new Lecturer();
        lecturer.setLecturerId("L" + UUID.randomUUID().toString().substring(0, 8));
        lecturer.setName(request.getName());
        lecturer.setEmail(request.getEmail());
        lecturer.setPassword(passwordEncoder.encode(request.getPassword()));

        lecturerRepository.save(lecturer);

        UserDetails userDetails = userDetailsService.loadUserByUsername(lecturer.getEmail());
        String token = jwtUtil.generateToken(userDetails, "LECTURER", lecturer.getLecturerId());

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setRole("LECTURER");
        response.setId(lecturer.getLecturerId());

        return response;
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
