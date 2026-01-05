package com.usis.project.repositories;

import com.usis.project.entities.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface LecturerRepository extends JpaRepository<Lecturer, String> {
    @Query(value = "EXEC University.usp_FindLecturerByEmail @Email = :email", nativeQuery = true)
    Optional<Lecturer> findByEmail(@Param("email") String email);
    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_RegisterLecturer " +
            "@LecturerId=:id, @Name=:name, @Email=:email, @Password=:pass", nativeQuery = true)
    void registerLecturerProcedure(
            @Param("id") String id,
            @Param("name") String name,
            @Param("email") String email,
            @Param("pass") String password
    );
}
