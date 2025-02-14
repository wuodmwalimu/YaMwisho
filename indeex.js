<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pamoja Dokita® 2025 - Blood Bank System</title>
  <link rel="stylesheet" href="sop.css">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="info-section">
      <img src="pamoja.jpg" alt="Pamoja Dokita Logo" class="logo">
      <h1>Pamoja Dokita® 2025</h1>
      <p class="description">
        <strong>Pamoja Dokita Transfusion Systems</strong> support quality patient care and drive efficiency...
      </p>
      <p class="description">
        Together, we ensure <span class="highlight">smarter</span> and <span class="highlight">safer</span> blood management...
      </p>
      <a href="#" id="showSignup" class="alt-link">Don't have an account? Sign up</a>
    </div>

    <div class="form-section" id="loginBox">
      <h2>Log In</h2>
      <form id="loginForm">
        <!-- Fields for Login (Email and Password only) -->
        <div class="input-group">
          <label for="loginEmail"><i class="fas fa-envelope"></i> Email</label>
          <input type="email" id="loginEmail" name="email" required>
        </div>

        <div class="input-group">
          <label for="loginPassword"><i class="fas fa-lock"></i> Password</label>
          <input type="password" id="loginPassword" name="password" required>
        </div>

        <div class="input-group">
          <label for="loginRole"><i class="fas fa-user-md"></i> Role</label>
          <select id="loginRole" name="role" required>
            <option value="" disabled selected>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Nurse">Nurse</option>
            <option value="Blood Bank Technician">Blood Bank Technician</option>
            <option value="Lab Manager (Doctor)">Lab Manager (Doctor)</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>

        <button type="submit" class="btn-primary">Log In</button>
      </form>
      <p id="loginMessage" class="form-message"></p>
    </div>

    <div class="form-section hidden" id="signupBox">
      <h2>Sign Up</h2>
      <form id="signupForm">
        <!-- Fields for Sign Up (All fields) -->
        <div class="input-group">
          <label for="signupPrefix"><i class="fas fa-user"></i> Prefix</label>
          <select id="signupPrefix" name="prefix" required>
            <option value="" disabled selected>Select Prefix</option>
            <option value="Mr.">Mr.</option>
            <option value="Ms.">Ms.</option>
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
          </select>
        </div>

        <div class="input-group">
          <label for="signupName"><i class="fas fa-user"></i> Name</label>
          <input type="text" id="signupName" name="name" required>
        </div>

        <div class="input-group">
          <label for="signupEmail"><i class="fas fa-envelope"></i> Email</label>
          <input type="email" id="signupEmail" name="email" required>
        </div>

        <div class="input-group">
          <label for="signupPassword"><i class="fas fa-lock"></i> Password</label>
          <input type="password" id="signupPassword" name="password" required>
        </div>

        <div class="input-group">
          <label for="signupConfirmPassword"><i class="fas fa-lock"></i> Confirm Password</label>
          <input type="password" id="signupConfirmPassword" name="confirmPassword" required>
        </div>

        <div class="input-group">
          <label for="signupCountry"><i class="fas fa-map-marker-alt"></i> Country</label>
          <select id="signupCountry" name="country" required>
            <option value="" disabled selected>Select Country</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Kenya">Kenya</option>
          </select>
        </div>

        <div class="input-group">
          <label for="signupRegion"><i class="fas fa-map-marker-alt"></i> Region</label>
          <input type="text" id="signupRegion" name="region" required>
        </div>

        <div class="input-group">
          <label for="signupHospital"><i class="fas fa-hospital"></i> Hospital</label>
          <input type="text" id="signupHospital" name="hospital" required>
        </div>

        <div class="input-group">
          <label for="signupRole"><i class="fas fa-user-md"></i> Role</label>
          <select id="signupRole" name="role" required>
            <option value="" disabled selected>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Receptionist">Receptionist</option>
            <option value="Nurse">Nurse</option>
            <option value="Blood Bank Technician">Blood Bank Technician</option>
            <option value="Lab Manager (Doctor)">Lab Manager (Doctor)</option>
            <option value="Cashier">Cashier</option>
          </select>
        </div>

        <button type="submit" class="btn-primary">Sign Up</button>
      </form>
      <p class="form-message">Already have an account? <a href="#" id="showLogin">Log in</a></p>
    </div>
  </div>

  <script src="sop.js"></script>
</body>
</html>