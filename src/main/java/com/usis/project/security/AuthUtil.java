package com.usis.project.security;

import com.usis.project.entities.Student;
import com.usis.project.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthUtil {

    private final StudentRepository studentRepository;

    public String getAuthenticatedStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String email = authentication.getName();
            return studentRepository.findByEmail(email)
                    .map(Student::getStudentId)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in Student records"));
        }
        throw new RuntimeException("User not authenticated");
    }
}
