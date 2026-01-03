package com.usis.project.services;

import com.usis.project.entities.Lecturer;
import com.usis.project.entities.Student;
import com.usis.project.repositories.LecturerRepository;
import com.usis.project.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final StudentRepository studentRepository;
    private final LecturerRepository lecturerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isPresent()) {
            return User.builder()
                    .username(student.get().getEmail())
                    .password(student.get().getPassword())
                    .roles("STUDENT")
                    .build();
        }

        Optional<Lecturer> lecturer = lecturerRepository.findByEmail(email);
        if (lecturer.isPresent()) {
            return User.builder()
                    .username(lecturer.get().getEmail())
                    .password(lecturer.get().getPassword())
                    .roles("LECTURER")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
