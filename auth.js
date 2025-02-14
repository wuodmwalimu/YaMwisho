document.addEventListener("DOMContentLoaded", function() {
  const dbName = "PamojaDokitaDB";
  const dbVersion = 2;
  let db;

  // Open IndexedDB
  const request = indexedDB.open(dbName, dbVersion);

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains("sysuser3")) {
      const store = db.createObjectStore("sysuser3", { keyPath: "recordid" });
      store.createIndex("email", "email", { unique: true });
      store.createIndex("role", "role", { unique: false });
    }
  };

  request.onsuccess = function(event) {
    db = event.target.result;
  };

  request.onerror = function(event) {
    console.error("❌ Database error:", event.target.error);
  };

  // Form Elements
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const signupCountry = document.getElementById("signupCountry");
  const signupRegion = document.getElementById("signupRegion");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");
  const signupEmailField = document.getElementById("signupEmail");

  // Load Regions from JSON
  const regionsData = JSON.parse(document.getElementById("regionsData").textContent);

  // Populate Regions Dropdown
  signupCountry.addEventListener("change", function() {
    const selectedCountry = signupCountry.value;
    signupRegion.innerHTML = '<option value="">Select Region</option>';
    if (selectedCountry && regionsData[selectedCountry]) {
      regionsData[selectedCountry].forEach((region) => {
        const option = document.createElement("option");
        option.value = region;
        option.textContent = region;
        signupRegion.appendChild(option);
      });
    }
  });

  // Auto-generate email
  function generateEmail(firstName, lastName) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pamoja.com`;
  }

  // Update email field dynamically
  document.getElementById("signupFirstName").addEventListener("input", updateEmail);
  document.getElementById("signupLastName").addEventListener("input", updateEmail);

  function updateEmail() {
    const firstName = document.getElementById("signupFirstName").value.trim();
    const lastName = document.getElementById("signupLastName").value.trim();
    signupEmailField.value = firstName && lastName ? generateEmail(firstName, lastName) : "";
  }

  // Toggle Between Forms
  showLoginBtn.addEventListener("click", function(e) {
    e.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });

  showSignupBtn.addEventListener("click", function(e) {
    e.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  });

  // **Signup Form Submission**
  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const prefix = document.getElementById("signupPrefix").value;
    const firstName = document.getElementById("signupFirstName").value.trim();
    const lastName = document.getElementById("signupLastName").value.trim();
    const email = generateEmail(firstName, lastName);
    const country = signupCountry.value;
    const region = signupRegion.value;
    const hospital = document.getElementById("signupHospital").value.trim();
    const role = document.getElementById("signupRole").value;
    const password = document.getElementById("signupPassword").value.trim();

    if (!firstName || !lastName || !email || !country || !region || !hospital || !role || !password) {
      showMessage("⚠️ Please fill in all fields!", "warning");
      return;
    }

    const newUser = {
      recordid: Date.now(),
      prefix,
      firstName,
      lastName,
      email,
      country,
      region,
      hospital,
      role,
      password,
    };

    const transaction = db.transaction("sysuser3", "readwrite");
    const store = transaction.objectStore("sysuser3");

    // Check if email exists before adding
    const emailIndex = store.index("email");
    const checkEmailRequest = emailIndex.get(email);

    checkEmailRequest.onsuccess = function() {
      if (checkEmailRequest.result) {
        showMessage("❌ Email already exists! Try logging in.", "error");
      } else {
        const request = store.add(newUser);
        request.onsuccess = function() {
          signupForm.reset();
          showMessage("✅ Signup successful! You can now login.", "success");
          signupForm.classList.add("hidden");
          loginForm.classList.remove("hidden");
        };
        request.onerror = function() {
          showMessage("❌ Error saving data!", "error");
        };
      }
    };
  });

  // **Login Form Submission**
  loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
      showMessage("⚠️ Enter email and password!", "warning");
      return;
    }

    const transaction = db.transaction("sysuser3", "readonly");
    const store = transaction.objectStore("sysuser3");
    const emailIndex = store.index("email");
    const request = emailIndex.get(email);

    request.onsuccess = function() {
      const user = request.result;
      if (user && user.password === password) {
        showMessage(`🎉 Welcome, ${user.firstName} ${user.lastName}!`, "success");
        localStorage.setItem("loggedInUser", JSON.stringify(user)); // ✅ Changed key to "loggedInUser"
        setTimeout(() => window.location.href = "karibu.html", 1500);
      } else {
        showMessage("❌ Incorrect email or password!", "error");
      }
    };

    request.onerror = function() {
      showMessage("❌ User not found!", "error");
    };
  });

  // **Show Message Function**
  function showMessage(message, type) {
    const messageBox = document.createElement("div");
    messageBox.className = `message ${type}`;
    messageBox.innerHTML = message;
    document.body.appendChild(messageBox);

    setTimeout(() => {
      messageBox.remove();
    }, 3000);
  }
});