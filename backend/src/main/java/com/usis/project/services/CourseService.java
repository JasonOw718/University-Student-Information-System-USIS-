package com.usis.project.services;

import com.usis.project.models.CourseResponse;
import com.usis.project.models.projection.CourseWithLecturerView;
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
        List<CourseWithLecturerView> courses = courseRepository.findAllCoursesWithLecturers();

        return courses.stream().map(view -> {
            CourseResponse res = new CourseResponse();
            res.setCourseId(view.getCourseId());
            res.setCourseName(view.getCourseName());
            res.setCreditHours(view.getCreditHours());
            res.setLecturerName(view.getLecturerName());
            res.setLecturerEmail(view.getLecturerEmail());
            return res;
        }).collect(Collectors.toList());
    }
}
