const app = document.getElementById("app");
const API_BASE = "";

const routes = {
  "/auth": { render: renderAuth, auth: false },
  "/student/dashboard": { render: renderStudentDashboard, auth: true, role: "STUDENT" },
  "/lecturer/dashboard": { render: renderLecturerDashboard, auth: true, role: "LECTURER" },
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
          ${role === "STUDENT" ? `<a class="nav__link" href="#/student/dashboard">Dashboard</a>` : ""}
          ${role === "LECTURER" ? `<a class="nav__link" href="#/lecturer/dashboard">Dashboard</a>` : ""}
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
        <h2 class="section-title">Available Courses</h2>
        <p class="muted">Register for a course to start your enrollment.</p>
        <div id="courses-status" class="status" role="status"></div>
        <div id="courses-table"></div>
      </section>
    </div>
  `);

  const statusBox = document.getElementById("courses-status");
  const tableHost = document.getElementById("courses-table");

  const setStatus = (message, type) => {
    statusBox.textContent = message;
    statusBox.classList.remove("is-error", "is-success");
    if (type) {
      statusBox.classList.add(type);
    }
  };

  setStatus("Loading courses...");
  try {
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
    setStatus(error.message, "is-error");
  }
}

function renderLecturerDashboard() {
  app.innerHTML = renderShell(`
    <div class="container">
      <section class="section-card">
        <h2 class="section-title">Lecturer Dashboard</h2>
        <p class="muted">Course management and approvals will be added in the next stage.</p>
      </section>
    </div>
  `);
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
