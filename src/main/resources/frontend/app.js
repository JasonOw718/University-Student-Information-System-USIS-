const app = document.getElementById("app");
const API_BASE = "";

const routes = {
  "/auth": { render: renderAuth, auth: false },
  "/student/dashboard": { render: renderStudentDashboard, auth: true, role: "STUDENT" },
  "/student/profile": { render: renderStudentProfile, auth: true, role: "STUDENT" },
  "/student/enrolled": { render: renderStudentRecords, auth: true, role: "STUDENT" },
  "/lecturer/dashboard": { render: renderLecturerDashboard, auth: true, role: "LECTURER" },
  "/lecturer/pending": { render: renderLecturerPending, auth: true, role: "LECTURER" },
};

function getToken() {
  return localStorage.getItem("usis_token") || "";
}

function getRole() {
  return localStorage.getItem("usis_role") || "";
}

function getUserId() {
  return localStorage.getItem("usis_id") || "";
}

function clearAuth() {
  localStorage.removeItem("usis_token");
  localStorage.removeItem("usis_role");
  localStorage.removeItem("usis_id");
}

function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

function setHash(path) {
  window.location.hash = path;
}

function renderShell(contentHtml, options = {}) {
  const role = getRole();
  const id = getUserId();
  const contentClass = options.centered ? "content centered" : "content";
  const nav = role
    ? `<nav class="nav">
        <div class="nav__left">
          <span class="nav__title">USIS</span>
          ${role === "STUDENT"
            ? `<a class="nav__link" href="#/student/dashboard">Dashboard</a>
               <a class="nav__link" href="#/student/profile">Profile</a>
               <a class="nav__link" href="#/student/enrolled">Records</a>`
            : ""}
          ${role === "LECTURER"
            ? `<a class="nav__link" href="#/lecturer/dashboard">Dashboard</a>
               <a class="nav__link" href="#/lecturer/pending">Pending</a>`
            : ""}
        </div>
        <div class="nav__right">
          <span class="pill">${role} ${id}</span>
          <button class="button secondary" data-action="logout" type="button">Logout</button>
        </div>
      </nav>`
    : "";
  return `<div class="shell">${nav}<main class="${contentClass}">${contentHtml}</main></div>`;
}

function renderAuth() {
  app.innerHTML = renderShell(
    `
    <section class="card">
      <header class="card__header">
        <p class="badge">USIS</p>
        <h1>Student Information System</h1>
        <p class="muted">Sign in or create an account to continue.</p>
      </header>

      <div class="tabs">
        <button class="tab is-active" data-tab="login" type="button">Login</button>
        <button class="tab" data-tab="register" type="button">Register</button>
      </div>

      <div class="role">
        <label class="role__label">Role</label>
        <div class="role__options">
          <label>
            <input type="radio" name="role" value="student" checked />
            Student
          </label>
          <label>
            <input type="radio" name="role" value="lecturer" />
            Lecturer
          </label>
        </div>
      </div>

      <form id="auth-form" class="form">
        <div class="field">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="name@example.com" required />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required />
        </div>

        <div id="register-fields" class="register-fields is-hidden">
          <div class="field">
            <label for="name">Full name</label>
            <input id="name" name="name" type="text" />
          </div>

          <div class="field student-only">
            <label for="icNumber">IC number</label>
            <input id="icNumber" name="icNumber" type="text" />
          </div>

          <div class="field student-only">
            <label for="phoneNumber">Phone number</label>
            <input id="phoneNumber" name="phoneNumber" type="tel" />
          </div>

          <div class="field student-only">
            <label for="address">Address</label>
            <input id="address" name="address" type="text" />
          </div>
        </div>

        <button id="submit-btn" class="button" type="submit">Login</button>
      </form>

      <div id="status" class="status" role="status" aria-live="polite"></div>
    </section>
  `,
    { centered: true }
  );

  const form = document.getElementById("auth-form");
  const tabs = document.querySelectorAll(".tab");
  const registerFields = document.getElementById("register-fields");
  const statusBox = document.getElementById("status");
  const submitBtn = document.getElementById("submit-btn");
  const roleInputs = document.querySelectorAll("input[name='role']");

  let mode = "login";
  let selectedRole = "student";

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.classList.remove("is-error", "is-success");
    if (type) {
      statusBox.classList.add(type);
    }
  };

  const toggleMode = (nextMode) => {
    mode = nextMode;
    tabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.tab === mode);
    });
    submitBtn.textContent = mode === "login" ? "Login" : "Register";
    registerFields.classList.toggle("is-hidden", mode === "login");
  };

  const getSelectedRole = () => {
    const checked = document.querySelector("input[name='role']:checked");
    return checked ? checked.value : "student";
  };

  const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Please wait..." : mode === "login" ? "Login" : "Register";
  };

  const collectFormData = () => {
    const data = {
      email: form.email.value.trim(),
      password: form.password.value,
    };

    if (mode === "register") {
      data.name = form.name.value.trim();
      if (selectedRole === "student") {
        data.icNumber = form.icNumber.value.trim();
        data.phoneNumber = form.phoneNumber.value.trim();
        data.address = form.address.value.trim();
      }
    }

    return data;
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => toggleMode(tab.dataset.tab));
  });

  roleInputs.forEach((input) => {
    input.addEventListener("change", () => {
      selectedRole = getSelectedRole();
      const studentFields = document.querySelectorAll(".student-only");
      studentFields.forEach((field) => {
        field.classList.toggle("is-hidden", selectedRole !== "student");
      });
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    selectedRole = getSelectedRole();
    setStatus("");
    setLoading(true);

    try {
      const data = collectFormData();
      const path =
        mode === "login"
          ? "/api/auth/login"
          : selectedRole === "student"
            ? "/api/auth/register/student"
            : "/api/auth/register/lecturer";

      const response = await apiFetch(path, { method: "POST", body: JSON.stringify(data) });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || result?.error || "Request failed");
    }

    if (mode === "login") {
      const expected = selectedRole.toUpperCase();
      if (result?.role && result.role !== expected) {
        throw new Error(`Role mismatch: expected ${expected}, got ${result.role}`);
      }
    }

    if (result?.token) {
      localStorage.setItem("usis_token", result.token);
      localStorage.setItem("usis_role", result.role);
      localStorage.setItem("usis_id", result.id);
    }

      setStatus(`Success. Role: ${result.role || "N/A"}, ID: ${result.id || "N/A"}`, "is-success");
      setTimeout(() => {
        if (result.role === "STUDENT") {
          setHash("/student/dashboard");
        } else if (result.role === "LECTURER") {
          setHash("/lecturer/dashboard");
        }
      }, 500);
    } catch (error) {
      setStatus(error.message, "is-error");
    } finally {
      setLoading(false);
    }
  });

  toggleMode("login");
}

async function renderStudentDashboard() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">CGPA Summary</h2>
        <p class="muted">Current cumulative GPA based on approved courses.</p>
        <div id="cgpa-status" class="status" role="status"></div>
      </section>
      <section class="section-card">
        <h2 class="section-title">Available Courses</h2>
        <p class="muted">Register for a course to start your enrollment.</p>
        <div id="courses-status" class="status" role="status"></div>
        <div id="courses-table"></div>
      </section>
    </div>
  `);

  const cgpaStatus = document.getElementById("cgpa-status");
  const statusBox = document.getElementById("courses-status");
  const tableHost = document.getElementById("courses-table");

  const setCgpaStatus = (message, type) => {
    cgpaStatus.textContent = message;
    cgpaStatus.classList.remove("is-error", "is-success");
    if (type) {
      cgpaStatus.classList.add(type);
    }
  };

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.classList.remove("is-error", "is-success");
    if (type) {
      statusBox.classList.add(type);
    }
  };

  setCgpaStatus("Loading CGPA...");
  setStatus("Loading courses...");
  try {
    const studentId = getUserId();
    if (studentId) {
      const cgpaResponse = await apiFetch(`/api/student/${studentId}/cgpa`);
      const cgpaBody = await cgpaResponse.json();
      if (!cgpaResponse.ok) {
        throw new Error(cgpaBody?.message || "Failed to load CGPA");
      }
      setCgpaStatus(`Current CGPA: ${cgpaBody.cgpa ?? "-"}`, "is-success");
    } else {
      setCgpaStatus("Missing student ID.", "is-error");
    }

    const response = await apiFetch("/api/courses/available");
    const courses = await response.json();
    if (!response.ok) {
      throw new Error(courses?.message || "Failed to load courses");
    }

    if (!Array.isArray(courses) || courses.length === 0) {
      tableHost.innerHTML = `<p class="empty">No courses available.</p>`;
      setStatus("");
      return;
    }

    tableHost.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Credit Hours</th>
            <th>Lecturer</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${courses
            .map(
              (course) => `
              <tr>
                <td>${course.courseId} - ${course.courseName}</td>
                <td>${course.creditHours ?? "-"}</td>
                <td>${course.lecturerName ?? "TBA"}</td>
                <td><button class="button link" data-action="register" data-course="${course.courseId}">Register</button></td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    setStatus("");
  } catch (error) {
    if (!cgpaStatus.textContent || cgpaStatus.textContent === "Loading CGPA...") {
      setCgpaStatus(error.message, "is-error");
    }
    setStatus(error.message, "is-error");
  }
}

async function renderStudentProfile() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">My Profile</h2>
        <p class="muted">View your registered profile details.</p>
        <div id="profile-status" class="status" role="status"></div>
        <div id="profile-details"></div>
      </section>
      <section class="section-card">
        <h2 class="section-title">Update Contact</h2>
        <form id="profile-form" class="form">
          <div class="field">
            <label for="address">Address</label>
            <input id="address" name="address" type="text" placeholder="New address" />
          </div>
          <div class="field">
            <label for="phoneNumber">Phone number</label>
            <input id="phoneNumber" name="phoneNumber" type="tel" placeholder="New phone number" />
          </div>
          <button class="button" type="submit">Update Profile</button>
        </form>
      </section>
    </div>
  `);

  const statusBox = document.getElementById("profile-status");
  const detailsHost = document.getElementById("profile-details");
  const form = document.getElementById("profile-form");

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.classList.remove("is-error", "is-success");
    if (type) {
      statusBox.classList.add(type);
    }
  };

  setStatus("Loading profile...");
  try {
    const response = await apiFetch("/api/student/profile");
    const profile = await response.json();
    if (!response.ok) {
      throw new Error(profile?.message || "Failed to load profile");
    }

    detailsHost.innerHTML = `
      <table class="table">
        <tbody>
          <tr><th>Student ID</th><td>${profile.studentId ?? "-"}</td></tr>
          <tr><th>Name</th><td>${profile.name ?? "-"}</td></tr>
          <tr><th>IC Number</th><td>${profile.icNumber ?? "-"}</td></tr>
          <tr><th>Email</th><td>${profile.email ?? "-"}</td></tr>
          <tr><th>Address</th><td>${profile.address ?? "-"}</td></tr>
          <tr><th>Phone</th><td>${profile.phoneNumber ?? "-"}</td></tr>
        </tbody>
      </table>
    `;
    setStatus("Profile loaded.", "is-success");
  } catch (error) {
    setStatus(error.message, "is-error");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Updating profile...");
    const payload = {
      address: form.address.value.trim() || null,
      phoneNumber: form.phoneNumber.value.trim() || null,
    };

    try {
      const response = await apiFetch("/api/student/profile", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Update failed");
      }
      setStatus("Profile updated.", "is-success");
      renderStudentProfile();
    } catch (error) {
      setStatus(error.message, "is-error");
    }
  });
}

async function renderStudentRecords() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">My Records</h2>
        <p class="muted">View registrations, status, and GPA.</p>
        <div id="records-status" class="status" role="status"></div>
        <div id="records-table"></div>
      </section>
    </div>
  `);

  const statusBox = document.getElementById("records-status");
  const tableHost = document.getElementById("records-table");

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.classList.remove("is-error", "is-success");
    if (type) {
      statusBox.classList.add(type);
    }
  };

  setStatus("Loading records...");
  try {
    const response = await apiFetch("/api/student/records");
    const records = await response.json();
    if (!response.ok) {
      throw new Error(records?.message || "Failed to load records");
    }

    if (!Array.isArray(records) || records.length === 0) {
      tableHost.innerHTML = `<p class="empty">No records found.</p>`;
      setStatus("");
      return;
    }

    tableHost.innerHTML = `
      <table class="table">
        <thead>
          <tr>
            <th>Course</th>
            <th>Status</th>
            <th>GPA</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record) => `
              <tr>
                <td>${record.courseCode} - ${record.courseName}</td>
                <td>${record.status ?? "-"}</td>
                <td>${record.gpa ?? "-"}</td>
                <td>
                  ${
                    record.status === "Pending"
                      ? `<button class="button link" data-action="drop" data-registration="${record.registrationId}">Drop</button>`
                      : ""
                  }
                </td>
              </tr>
            `
            )
            .join("")}
        </tbody>
      </table>
    `;

    setStatus("");
  } catch (error) {
    setStatus(error.message, "is-error");
  }
}

function renderLecturerDashboard() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">Lecturer Dashboard</h2>
        <p class="muted">Manage courses you create.</p>
        <div id="course-status" class="status" role="status"></div>
        <form id="course-form" class="form">
          <div class="field">
            <label for="courseId">Course ID</label>
            <input id="courseId" name="courseId" type="text" required />
          </div>
          <div class="field">
            <label for="courseName">Course name</label>
            <input id="courseName" name="courseName" type="text" required />
          </div>
          <div class="field">
            <label for="creditHours">Credit hours</label>
            <input id="creditHours" name="creditHours" type="number" min="1" required />
          </div>
          <button class="button" type="submit">Add Course</button>
        </form>
      </section>

      <section class="section-card">
        <h2 class="section-title">Available Courses</h2>
        <p class="muted">Only delete courses you own and that have no approved registrations.</p>
        <div id="courses-status" class="status" role="status"></div>
        <div id="courses-table"></div>
      </section>
    </div>
  `);

  const statusBox = document.getElementById("course-status");
  const coursesStatus = document.getElementById("courses-status");
  const courseForm = document.getElementById("course-form");
  const tableHost = document.getElementById("courses-table");

  const setStatus = (target, message, type) => {
    target.textContent = message;
    target.classList.remove("is-error", "is-success");
    if (type) {
      target.classList.add(type);
    }
  };

  const loadCourses = async () => {
    setStatus(coursesStatus, "Loading courses...");
    try {
      const response = await apiFetch("/api/courses/available");
      const courses = await response.json();
      if (!response.ok) {
        throw new Error(courses?.message || "Failed to load courses");
      }

      if (!Array.isArray(courses) || courses.length === 0) {
        tableHost.innerHTML = `<p class="empty">No courses available.</p>`;
        setStatus(coursesStatus, "");
        return;
      }

      tableHost.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Credit Hours</th>
              <th>Lecturer</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${courses
              .map(
                (course) => `
                <tr>
                  <td>${course.courseId} - ${course.courseName}</td>
                  <td>${course.creditHours ?? "-"}</td>
                  <td>${course.lecturerName ?? "TBA"}</td>
                  <td><button class="button link" data-action="delete-course" data-course="${course.courseId}">Delete</button></td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `;
      setStatus(coursesStatus, "");
    } catch (error) {
      setStatus(coursesStatus, error.message, "is-error");
    }
  };

  courseForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(statusBox, "Adding course...");
    const payload = {
      courseId: courseForm.courseId.value.trim(),
      courseName: courseForm.courseName.value.trim(),
      creditHours: Number(courseForm.creditHours.value),
    };

    try {
      const response = await apiFetch("/api/admin/courses", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Add course failed");
      }
      setStatus(statusBox, "Course added.", "is-success");
      courseForm.reset();
      loadCourses();
    } catch (error) {
      setStatus(statusBox, error.message, "is-error");
    }
  });

  loadCourses();
}

async function renderLecturerPending() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">Pending Registrations</h2>
        <p class="muted">Approve or drop student registrations.</p>
        <div id="pending-status" class="status" role="status"></div>
        <div id="pending-table"></div>
      </section>

      <section class="section-card">
        <h2 class="section-title">Update GPA</h2>
        <p class="muted">Provide the registration ID and GPA value.</p>
        <div id="grade-status" class="status" role="status"></div>
        <form id="grade-form" class="form">
          <div class="field">
            <label for="registrationId">Registration ID</label>
            <input id="registrationId" name="registrationId" type="text" required />
          </div>
          <div class="field">
            <label for="gpa">GPA</label>
            <input id="gpa" name="gpa" type="number" min="0" max="4" step="0.01" required />
          </div>
          <button class="button" type="submit">Update GPA</button>
        </form>
      </section>
    </div>
  `);

  const statusBox = document.getElementById("pending-status");
  const tableHost = document.getElementById("pending-table");
  const gradeStatus = document.getElementById("grade-status");
  const gradeForm = document.getElementById("grade-form");

  const setStatus = (target, message, type) => {
    target.textContent = message;
    target.classList.remove("is-error", "is-success");
    if (type) {
      target.classList.add(type);
    }
  };

  const loadPending = async () => {
    setStatus(statusBox, "Loading pending registrations...");
    try {
      const response = await apiFetch("/api/admin/registrations/pending");
      const pending = await response.json();
      if (!response.ok) {
        throw new Error(pending?.message || "Failed to load pending registrations");
      }

      if (!Array.isArray(pending) || pending.length === 0) {
        tableHost.innerHTML = `<p class="empty">No pending registrations.</p>`;
        setStatus(statusBox, "");
        return;
      }

      tableHost.innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Registration</th>
              <th>Student</th>
              <th>Course</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${pending
              .map(
                (item) => `
                <tr>
                  <td>${item.registrationId}</td>
                  <td>${item.studentName} (${item.studentId})</td>
                  <td>${item.courseName} (${item.courseId})</td>
                  <td>
                    <button class="button link" data-action="approve" data-registration="${item.registrationId}">Approve</button>
                    <button class="button link" data-action="drop-request" data-registration="${item.registrationId}">Drop</button>
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      `;
      setStatus(statusBox, "");
    } catch (error) {
      setStatus(statusBox, error.message, "is-error");
    }
  };

  gradeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(gradeStatus, "Updating grade...");
    const payload = {
      registrationId: gradeForm.registrationId.value.trim(),
      gpa: Number(gradeForm.gpa.value),
    };
    try {
      const response = await apiFetch("/api/admin/grades", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Update grade failed");
      }
      setStatus(gradeStatus, "Grade updated.", "is-success");
      gradeForm.reset();
    } catch (error) {
      setStatus(gradeStatus, error.message, "is-error");
    }
  });

  loadPending();
}

function handleGlobalClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.matches("[data-action='logout']")) {
    clearAuth();
    setHash("/auth");
    return;
  }

  if (target.matches("[data-action='register']")) {
    const courseId = target.getAttribute("data-course");
    if (!courseId) return;
    registerCourse(courseId, target);
  }

  if (target.matches("[data-action='drop']")) {
    const registrationId = target.getAttribute("data-registration");
    if (!registrationId) return;
    dropCourse(registrationId, target);
  }

  if (target.matches("[data-action='delete-course']")) {
    const courseId = target.getAttribute("data-course");
    if (!courseId) return;
    deleteCourse(courseId, target);
  }

  if (target.matches("[data-action='approve']")) {
    const registrationId = target.getAttribute("data-registration");
    if (!registrationId) return;
    updateRegistrationStatus(registrationId, "Approved", target);
  }

  if (target.matches("[data-action='drop-request']")) {
    const registrationId = target.getAttribute("data-registration");
    if (!registrationId) return;
    updateRegistrationStatus(registrationId, "Dropped", target);
  }
}

async function registerCourse(courseId, button) {
  button.disabled = true;
  try {
    const response = await apiFetch("/api/courses/register", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Registration failed");
    }
    alert(`Registered: ${result.courseName || courseId} (${result.status})`);
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

async function dropCourse(registrationId, button) {
  button.disabled = true;
  try {
    const response = await apiFetch(`/api/courses/register/${registrationId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Drop failed");
    }
    alert(result?.message || "Course dropped");
    renderStudentRecords();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

async function deleteCourse(courseId, button) {
  button.disabled = true;
  try {
    const response = await apiFetch(`/api/admin/courses/${courseId}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Delete failed");
    }
    alert(result?.message || "Course deleted");
    renderLecturerDashboard();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

async function updateRegistrationStatus(registrationId, status, button) {
  button.disabled = true;
  try {
    const response = await apiFetch("/api/admin/registration/status", {
      method: "PUT",
      body: JSON.stringify({ registrationId, status }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Update failed");
    }
    alert(result?.message || "Status updated");
    renderLecturerPending();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

function guardAndRender(path) {
  const route = routes[path] || routes["/auth"];
  if (route.auth) {
    const token = getToken();
    const role = getRole();
    if (!token) {
      setHash("/auth");
      return;
    }
    if (route.role && route.role !== role) {
      setHash(role === "LECTURER" ? "/lecturer/dashboard" : "/student/dashboard");
      return;
    }
  }
  route.render();
}

function getPath() {
  const hash = window.location.hash || "#/auth";
  return hash.replace("#", "");
}

function router() {
  guardAndRender(getPath());
}

window.addEventListener("hashchange", router);
document.addEventListener("click", handleGlobalClick);

if (!window.location.hash) {
  window.location.hash = "/auth";
}
router();
