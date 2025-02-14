document.addEventListener("DOMContentLoaded", function() {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    console.warn("⚠️ No logged-in user found.");
    return;
  }

  // Dynamic Time-Based Welcome Message
  const hours = new Date().getHours();
  let timeGreeting;
  if (hours < 12) {
    timeGreeting = "Good morning ☀️";
  } else if (hours < 18) {
    timeGreeting = "Good afternoon 🌞";
  } else {
    timeGreeting = "Good evening 🌙";
  }

  const welcomeMessage = `${timeGreeting}, ${loggedInUser.firstName}! Welcome to CHARLES DREW - DOKITA® Blood Bank at ${loggedInUser.hospital}, ${loggedInUser.region}, ${loggedInUser.country}. 💉 Your role as ${loggedInUser.role} is vital in saving lives. ❤️`;

  // Check if an element with ID 'dynamicMessage' exists before inserting content
  const messageElement = document.getElementById("dynamicMessage");
  if (messageElement) {
    messageElement.textContent = welcomeMessage;
  } else {
    console.warn("⚠️ No element with ID 'dynamicMessage' found on this page.");
  }
});