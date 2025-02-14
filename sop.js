// Helper function to get data from localStorage
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Helper function to set data in localStorage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Display welcome message based on user details
function displayWelcomeMessage() {
  const loggedInUser = getFromLocalStorage('loggedInUser');

  if (loggedInUser) {
    const { hospital = "your hospital", region = "your region", country = "your country", name = "User" } = loggedInUser;
    const welcomeMessage = `Welcome to ${hospital} in ${region}, ${country}! We're glad to have you, ${name}! 🌟`;
    document.getElementById('welcomeMessage').textContent = welcomeMessage;
  }
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const loginData = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value,
  };

  const users = getFromLocalStorage('users') || [];
  const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

  if (user) {
    saveToLocalStorage('loggedInUser', user); // Store logged-in user
    alert('✅ Login successful! 🎉 Welcome back!');
    window.location.href = 'karibu.html'; // Redirect to karibu.html
  } else {
    document.getElementById('loginMessage').innerHTML = '❌ Invalid email or password. Please try again.';
  }
});

// Handle signup
document.getElementById('signupForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const signupData = {
    prefix: document.getElementById('signupPrefix').value,
    name: document.getElementById('signupName').value,
    email: document.getElementById('signupEmail').value,
    password: document.getElementById('signupPassword').value,
    confirmPassword: document.getElementById('signupConfirmPassword').value,
    country: document.getElementById('signupCountry').value,
    region: document.getElementById('signupRegion').value,
    hospital: document.getElementById('signupHospital').value,
    role: document.getElementById('signupRole').value,
  };

  // Check if passwords match
  if (signupData.password !== signupData.confirmPassword) {
    alert('❌ Passwords do not match. Please try again.');
    return;
  }

  // Check if email already exists
  const users = getFromLocalStorage('users') || [];
  if (users.some(u => u.email === signupData.email)) {
    alert('❌ Email already exists. Please use a different email.');
    return;
  }

  // Save new user to localStorage
  users.push(signupData);
  saveToLocalStorage('users', users);

  alert('✅ Account created successfully! 🎉 Please log in to continue.');
  document.getElementById('showLogin').click(); // Show login form after successful signup
});

// Toggle between login and signup forms
document.getElementById('showSignup').addEventListener('click', function() {
  document.getElementById('loginBox').classList.add('hidden');
  document.getElementById('signupBox').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function() {
  document.getElementById('signupBox').classList.add('hidden');
  document.getElementById('loginBox').classList.remove('hidden');
});

// Run displayWelcomeMessage() on all pages where applicable
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("welcomeMessage")) {
    displayWelcomeMessage();
  }
});