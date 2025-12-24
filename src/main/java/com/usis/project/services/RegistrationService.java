package com.usis.project.services;

import com.usis.project.entities.Course;
import com.usis.project.entities.CourseRegistration;
import com.usis.project.entities.Student;
import com.usis.project.models.CourseRegistrationRequest;
import com.usis.project.models.CourseRegistrationResponse;
import com.usis.project.repositories.CourseRegistrationRepository;
import com.usis.project.repositories.CourseRepository;
import com.usis.project.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final CourseRegistrationRepository registrationRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public CourseRegistrationResponse registerCourse(String studentId, CourseRegistrationRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        CourseRegistration courseRegistration = registrationRepository.findByStudentIdAndCourseId(student.getStudentId(),course.getCourseId());
        if (courseRegistration == null) {
            courseRegistration = new CourseRegistration();
            courseRegistration.setRegistrationId("R" + UUID.randomUUID().toString().substring(0, 8));
        }else{
            if("Pending".equals(courseRegistration.getRegistrationStatus())){
                throw new RuntimeException("Course registration already exists");
            }
        }
        courseRegistration.setStudent(student);
        courseRegistration.setCourse(course);
        courseRegistration.setRegistrationStatus("Pending");

        registrationRepository.save(courseRegistration);

        CourseRegistrationResponse response = new CourseRegistrationResponse();
        response.setRegistrationId(courseRegistration.getRegistrationId());
        response.setCourseId(course.getCourseId());
        response.setStudentId(student.getStudentId());
        response.setStudentName(student.getName());
        response.setCourseName(course.getCourseName());
        response.setRegistrationId(courseRegistration.getRegistrationId());
        response.setStatus("Pending");
        return response;
    }

    public void dropCourse(String registrationId, String studentId) {
        CourseRegistration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!registration.getStudent().getStudentId().equals(studentId)) {
            throw new RuntimeException("Unauthorized to drop this course");
        }

        if (!ObjectUtils.isEmpty(registration.getSubjectGpa())) {
            throw new RuntimeException("This course already has been graded, please contact admin to remove your record");
        }

        registration.setRegistrationStatus("Dropped");
        registrationRepository.save(registration);
    }
}
