package com.usis.project.repositories;

import com.usis.project.entities.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, String> {
    Optional<Lecturer> findByEmail(String email);
}
