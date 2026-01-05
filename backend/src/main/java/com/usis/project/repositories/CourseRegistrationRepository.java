package com.usis.project.repositories;

import com.usis.project.entities.CourseRegistration;
import com.usis.project.models.projection.*;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, String> {

    @Query(value = "EXEC University.usp_RegisterOrUpdateCourse @StudentId = :sId, @CourseId = :cId, @NewRegistrationId = :rId", nativeQuery = true)
    RegistrationResultView registerCourseProcedure(
            @Param("sId") String studentId,
            @Param("cId") String courseId,
            @Param("rId") String registrationId
    );

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_UpdateRegistrationStatus @RegistrationId = :id, @NewStatus = :status", nativeQuery = true)
    void updateRegistrationStatusProcedure(@Param("id") String registrationId, @Param("status") String status);

    @Query(value = "EXEC University.usp_FindRegistrationsByStudentId @StudentId = :studentId", nativeQuery = true)
    List<StudentRecordView> findByStudent_StudentId(@Param("studentId") String studentId);

    @Query(value = "EXEC University.usp_FindRegistrationsByStudentIdAndStatus @StudentId = :studentId, @Status = :status", nativeQuery = true)
    List<StudentRegistrationView> findByStudent_StudentIdAndRegistrationStatus(
            @Param("studentId") String studentId,
            @Param("status") String status
    );

    @Query(value = "EXEC University.usp_FindRegistrationsByStatus @Status = :status", nativeQuery = true)
    List<RegistrationView> findByRegistrationStatus(@Param("status") String status);

    @Query(value = "EXEC University.usp_GetApprovedStudentsByCourse @CourseId = :courseId", nativeQuery = true)
    List<StudentProfileView> findApprovedStudentsByCourse(@Param("courseId") String courseId);

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_DropCourse @RegistrationId=:regId, @StudentId=:sId", nativeQuery = true)
    void dropCourseProcedure(@Param("regId") String regId, @Param("sId") String sId);

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_UpdateStudentGrade @RegistrationId = :regId, @GPA = :gpa", nativeQuery = true)
    void updateGradeProcedure(@Param("regId") String registrationId, @Param("gpa") BigDecimal gpa);
}