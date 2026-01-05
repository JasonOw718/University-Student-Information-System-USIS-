package com.usis.project.repositories;

import com.usis.project.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    @Query(value = "EXEC University.usp_FindStudentByEmail @Email = :email", nativeQuery = true)
    Optional<Student> findByEmail(String email);

    @Query(value = "EXEC University.usp_FindStudentById @StudentId = :studentId", nativeQuery = true)
    Optional<Student> findById(@Param("studentId") String studentId);}
