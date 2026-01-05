package com.usis.project.repositories;

import com.usis.project.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    @Query(value = "EXEC University.usp_FindStudentByEmail @Email = :email", nativeQuery = true)
    Optional<Student> findByEmail(String email);

    @Query(value = "EXEC University.usp_FindStudentById @StudentId = :studentId", nativeQuery = true)
    Optional<Student> findById(@Param("studentId") String studentId);

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_UpdateStudentProfile @StudentId = :id, @Address = :addr, @PhoneNumber = :phone", nativeQuery = true)
    void updateProfileProcedure(
            @Param("id") String id,
            @Param("addr") String address,
            @Param("phone") String phoneNumber
    );

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_RegisterStudent " +
            "@StudentId=:id, @Name=:name, @Email=:email, @Password=:pass, " +
            "@IcNumber=:ic, @Address=:addr, @PhoneNumber=:phone", nativeQuery = true)
    void registerStudentProcedure(
            @Param("id") String id,
            @Param("name") String name,
            @Param("email") String email,
            @Param("pass") String password,
            @Param("ic") String icNumber,
            @Param("addr") String address,
            @Param("phone") String phoneNumber
    );
}
