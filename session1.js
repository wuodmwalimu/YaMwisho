// Function to check if a user is logged in and redirect accordingly
function checkIfLoggedIn() {
  const loggedInUser = localStorage.getItem("loggedInUser");

  if (loggedInUser) {
    const currentPage = window.location.pathname;

    // Redirect only if the user is on the login or signup page
    if (currentPage.includes("index.html") || currentPage.includes("login.html")) {
      window.location.href = "karibu.html"; // Redirect to home/dashboard
    }
  }
}

// Function to log out the current user
function logoutUser() {
  localStorage.removeItem("loggedInUser"); // Remove user session data
  window.location.href = "index.html"; // Redirect to login page
}

// Function to save user data in localStorage after signup
function saveUserData(username, email, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Ensure the user does not already exist
  const userExists = users.some(user => user.username === username || user.email === email);
  if (userExists) {
    alert("User already exists. Please log in.");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));
}

// Function to validate login credentials
function validateLogin(usernameOrEmail, password) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  return users.find(user =>
    (user.username === usernameOrEmail || user.email === usernameOrEmail) &&
    user.password === password
  );
}

// Function to handle signup
function handleSignupForm(e) {
  e.preventDefault();

  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("signupConfirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  saveUserData(username, email, password);
  alert("Signup successful! Please log in.");
  window.location.href = "login.html"; // Redirect to login page after signup
}

// Function to handle login
function handleLoginForm(e) {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("loginUserOrEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const user = validateLogin(usernameOrEmail, password);

  if (user) {
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("Login successful! Redirecting...");
    window.location.href = "karibu.html"; // Redirect to home page
  } else {
    alert("Invalid username/email or password. Please try again.");
  }
}

// Function to restrict access to protected pages (except login and signup)
function protectPages() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const currentPage = window.location.pathname;

  if (!loggedInUser && !currentPage.includes("index.html") && !currentPage.includes("login.html") && !currentPage.includes("signup.html")) {
    alert("Access denied! Please log in first.");
    window.location.href = "index.html"; // Redirect to login page if not authenticated
  }
}

// Attach event listeners only if forms exist
document.addEventListener("DOMContentLoaded", () => {
  checkIfLoggedIn();
  protectPages();

  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const logoutButton = document.getElementById("logoutButton");

  if (loginForm) loginForm.addEventListener("submit", handleLoginForm);
  if (signupForm) signupForm.addEventListener("submit", handleSignupForm);
  if (logoutButton) logoutButton.addEventListener("click", logoutUser);
});