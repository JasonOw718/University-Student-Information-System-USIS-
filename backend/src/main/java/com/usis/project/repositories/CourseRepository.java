package com.usis.project.repositories;

import com.usis.project.entities.Course;
import com.usis.project.models.projection.CourseWithLecturerView;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    @Query(value = "EXEC University.usp_FindAllCoursesWithLecturers", nativeQuery = true)
    List<CourseWithLecturerView> findAllCoursesWithLecturers();

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_AddCourse @CourseId = :id, @CourseName = :name, @CreditHours = :credits, @LecturerId = :lId", nativeQuery = true)
    void addCourseProcedure(
            @Param("id") String id,
            @Param("name") String name,
            @Param("credits") Integer credits,
            @Param("lId") String lId
    );

    @Modifying
    @Transactional
    @Query(value = "EXEC University.usp_DeleteCourse @CourseId = :cId, @LecturerId = :lId", nativeQuery = true)
    void deleteCourseProcedure(@Param("cId") String courseId, @Param("lId") String lecturerId);
}
