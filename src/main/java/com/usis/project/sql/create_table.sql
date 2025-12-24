CREATE SCHEMA University;
GO

CREATE TABLE University.STUDENT
(
    StudentID   NVARCHAR(50) NOT NULL,
    Name        NVARCHAR(100) NOT NULL,
    ICNumber    NVARCHAR(20) NOT NULL,
    Email       NVARCHAR(100) NOT NULL,
    Address     NVARCHAR(255),
    PhoneNumber NVARCHAR(20),
    Password    NVARCHAR(255) NOT NULL,

    CONSTRAINT PK_Student PRIMARY KEY (StudentID),
    CONSTRAINT UQ_Student_Email UNIQUE (Email)
);

CREATE TABLE University.COURSE
(
    CourseID    NVARCHAR(20) NOT NULL,
    CourseName  NVARCHAR(100) NOT NULL,
    CreditHours INT NOT NULL,

    CONSTRAINT PK_Course PRIMARY KEY (CourseID)
);

CREATE TABLE University.LECTURER
(
    LecturerID NVARCHAR(50) NOT NULL,
    Name       NVARCHAR(100) NOT NULL,
    Email      NVARCHAR(100) NOT NULL,
    Password   NVARCHAR(255) NOT NULL,

    CONSTRAINT PK_Lecturer PRIMARY KEY (LecturerID),
    CONSTRAINT UQ_Lecturer_Email UNIQUE (Email)
);

CREATE TABLE University.COURSE_REGISTRATION
(
    RegistrationID     NVARCHAR(50) NOT NULL,
    StudentID          NVARCHAR(50) NOT NULL,
    CourseID           NVARCHAR(20) NOT NULL,
    SubjectGPA         DECIMAL(3, 2),
    RegistrationStatus NVARCHAR(20),

    CONSTRAINT PK_CourseRegistration PRIMARY KEY (RegistrationID),
    CONSTRAINT FK_Reg_Student FOREIGN KEY (StudentID) REFERENCES University.STUDENT (StudentID),
    CONSTRAINT FK_Reg_Course FOREIGN KEY (CourseID) REFERENCES University.COURSE (CourseID)
);

CREATE TABLE University.TEACHING_ASSIGNMENT
(
    AssignmentID NVARCHAR(50) NOT NULL,
    LecturerID   NVARCHAR(50) NOT NULL,
    CourseID     NVARCHAR(20) NOT NULL,
    Semester     NVARCHAR(20) NOT NULL,

    CONSTRAINT PK_TeachingAssignment PRIMARY KEY (AssignmentID),
    CONSTRAINT FK_Assign_Lecturer FOREIGN KEY (LecturerID) REFERENCES University.LECTURER (LecturerID),
    CONSTRAINT FK_Assign_Course FOREIGN KEY (CourseID) REFERENCES University.COURSE (CourseID)
);