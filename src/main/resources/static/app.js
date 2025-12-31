const form = document.getElementById("auth-form");
const tabs = document.querySelectorAll(".tab");
const registerFields = document.getElementById("register-fields");
const statusBox = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");
const roleInputs = document.querySelectorAll("input[name='role']");

let mode = "login"; // "login" | "register"
let role = "student"; // "student" | "lecturer"

const API_BASE = "";

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

const getRole = () => {
  const checked = document.querySelector("input[name='role']:checked");
  return checked ? checked.value : "student";
};

const setLoading = (isLoading) => {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading
    ? "Please wait..."
    : mode === "login"
    ? "Login"
    : "Register";
};

const collectFormData = () => {
  const data = {
    email: form.email.value.trim(),
    password: form.password.value,
  };

  if (mode === "register") {
    data.name = form.name.value.trim();
    if (role === "student") {
      data.icNumber = form.icNumber.value.trim();
      data.phoneNumber = form.phoneNumber.value.trim();
      data.address = form.address.value.trim();
    }
  }

  return data;
};

const sendRequest = async (path, payload) => {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let body = null;
  try {
    body = await response.json();
  } catch (error) {
    body = null;
  }

  if (!response.ok) {
    const message = body?.message || body?.error || "Request failed";
    throw new Error(message);
  }

  return body;
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => toggleMode(tab.dataset.tab));
});

roleInputs.forEach((input) => {
  input.addEventListener("change", () => {
    role = getRole();
    const studentFields = document.querySelectorAll(".student-only");
    studentFields.forEach((field) => {
      field.classList.toggle("is-hidden", role !== "student");
    });
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  role = getRole();
  setStatus("");
  setLoading(true);

  try {
    const data = collectFormData();
    const path =
      mode === "login"
        ? "/api/auth/login"
        : role === "student"
        ? "/api/auth/register/student"
        : "/api/auth/register/lecturer";

    const result = await sendRequest(path, data);
    if (result?.token) {
      localStorage.setItem("usis_token", result.token);
      localStorage.setItem("usis_role", result.role);
      localStorage.setItem("usis_id", result.id);
    }

    setStatus(
      `Success. Role: ${result.role || "N/A"}, ID: ${result.id || "N/A"}`,
      "is-success"
    );
  } catch (error) {
    setStatus(error.message, "is-error");
  } finally {
    setLoading(false);
  }
});

toggleMode("login");
