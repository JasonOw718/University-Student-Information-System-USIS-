package com.usis.project.repositories;

import com.usis.project.entities.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, String> {
    @Query(value = "EXEC University.usp_FindLecturerByEmail @Email = :email", nativeQuery = true)
    Optional<Lecturer> findByEmail(@Param("email") String email);
}
