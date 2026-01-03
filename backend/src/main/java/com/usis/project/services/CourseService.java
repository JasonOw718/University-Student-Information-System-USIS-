package com.usis.project.services;

import com.usis.project.entities.Lecturer;
import com.usis.project.models.CourseResponse;
import com.usis.project.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<CourseResponse> getAvailableCourses() {
        return courseRepository.findAll().stream().map(course -> {
            CourseResponse res = new CourseResponse();
            res.setCourseId(course.getCourseId());
            res.setCourseName(course.getCourseName());
            res.setCreditHours(course.getCreditHours());
            Lecturer lecturer = course.getLecturer();
            if(lecturer != null) {
                res.setLecturerName(lecturer.getName());
                res.setLecturerEmail(lecturer.getEmail());
            }
            return res;
        }).collect(Collectors.toList());
    }
}
