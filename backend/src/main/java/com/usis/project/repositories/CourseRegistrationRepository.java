package com.usis.project.repositories;

import com.usis.project.entities.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, String> {
        List<CourseRegistration> findByStudent_StudentId(String studentId);

        List<CourseRegistration> findByStudent_StudentIdAndRegistrationStatus(String studentId, String status);

        List<CourseRegistration> findByRegistrationStatus(String status);

        @Query(value = "SELECT * FROM University.COURSE_REGISTRATION WHERE StudentID = :studentId AND CourseID = :courseId", nativeQuery = true)
        CourseRegistration findByStudentIdAndCourseId(@Param("studentId") String studentId,
                        @Param("courseId") String courseId);

        @Query(value = "SELECT * FROM University.COURSE_REGISTRATION WHERE CourseID = :courseId", nativeQuery = true)
        List<CourseRegistration> findAllByCourseId(@Param("courseId") String courseId);

        @Query(value = "SELECT * FROM University.COURSE_REGISTRATION WHERE CourseID = :courseId AND RegistrationStatus = :status", nativeQuery = true)
        List<CourseRegistration> findByCourse_CourseIdAndRegistrationStatus(@Param("courseId") String courseId,@Param("status") String status);
}
