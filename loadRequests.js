document.addEventListener("DOMContentLoaded", () => {
  const dbName = "BloodRequestDB";
  const dbVersion = 9;
  let requestsData = [];
  let db; // Global IndexedDB connection

  // --- Display Logged-In User ---
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const welcomeMessage = document.getElementById("welcomeMessage");
  const logoutButton = document.getElementById("logoutButton");

  if (loggedInUser) {
    welcomeMessage.textContent = `Welcome, ${loggedInUser.username || loggedInUser.email}`;
    logoutButton.style.display = "inline-block";
  } else {
    welcomeMessage.textContent = "Not Logged In";
    logoutButton.style.display = "none";
  }

  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html"; // Redirect to login
  });

  // --- Open IndexedDB ---
  const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const upgradeDB = event.target.result;
      const objectStores = [
        "requests",
        "deniedRequests",
        "approvedRequests",
        "clearedRequests",
        "sumup",
        "malizia"
      ];
      objectStores.forEach((storeName) => {
        if (!upgradeDB.objectStoreNames.contains(storeName)) {
          upgradeDB.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      fetchRequests();
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.errorCode);
    };
  };

  // --- Fetch Requests from IndexedDB ---
  const fetchRequests = () => {
    if (!db) return;
    const transaction = db.transaction("requests", "readonly");
    const store = transaction.objectStore("requests");
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = (event) => {
      requestsData = event.target.result;
      displayRequests();
    };

    getAllRequest.onerror = (event) => {
      console.error("Error fetching requests:", event.target.error);
    };
  };

  // --- Display Requests in the Table ---
  const displayRequests = () => {
    const tableBody = document.getElementById("requestsBody");
    tableBody.innerHTML = "";

    if (requestsData.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='17'>No requests found.</td></tr>";
      return;
    }

    requestsData.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.id || "N/A"}</td>
        <td>${item.recipientName}</td>
        <td>${item.dob}</td>
        <td>${item.age}</td>
        <td>${item.bloodType}</td>
        <td>${item.units}</td>
        <td>${item.gender}</td>
        <td>${item.hospital}</td>
        <td>${item.doctor}</td>
        <td>${item.contactHospital}</td>
        <td>${item.location}</td>
        <td>${item.urgency || ""}</td>
        <td>${item.reason || ""}</td>
        <td>${item.submittedBy}</td>
        <td>${item.userEmail}</td>
        <td>${new Date(item.timestamp).toLocaleString()}</td>
        <td>
          <button class="btn approve-btn" onclick="approveRequest(${item.id})">Approve</button>
          <button class="btn deny-btn" onclick="openDenialModal(${item.id})">Deny</button>
        </td>
      `;

      tableBody.appendChild(row);
    });
  };

  // Expose fetchRequests so that it can be called after transactions complete.
  window.fetchRequests = fetchRequests;

  // Open the database once DOM is loaded.
  openDB();
});

// --- Approve Request ---
// This function is attached to the window so that the inline onclick in the table works.
window.approveRequest = function(requestId) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const dbRequest = indexedDB.open("BloodRequestDB", 9);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["requests", "approvedRequests"], "readwrite");
    const requestsStore = transaction.objectStore("requests");
    const approvedStore = transaction.objectStore("approvedRequests");

    const getRequest = requestsStore.get(requestId);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.approvedBy = loggedInUser.username || loggedInUser.email;
        data.approvedAt = new Date().toISOString();
        // Remove id so that a new one is generated in the approved store.
        delete data.id;
        approvedStore.add(data);
        requestsStore.delete(requestId);
      }
    };

    transaction.oncomplete = () => {
      window.fetchRequests();
      showApprovalMessage();
    };

    transaction.onerror = (event) => {
      console.error("Error approving request:", event.target.error);
    };
  };

  dbRequest.onerror = (event) => {
    console.error("Error opening database for approval:", event.target.errorCode);
  };
};

// --- Open Denial Modal ---
// This function is attached to the window so that the inline onclick works.
window.openDenialModal = function(requestId) {
  const denialModal = document.getElementById("denialModal");
  const submitButton = document.getElementById("submitDenial");
  const cancelButton = document.getElementById("cancelDenial");
  const denialReasonSelect = document.getElementById("denialReasonSelect");
  const otherReasonInput = document.getElementById("otherDenialReason");

  denialModal.classList.remove("hidden");

  cancelButton.onclick = () => {
    denialModal.classList.add("hidden");
  };

  // Replace the submit button to remove any previously attached event listeners.
  const newSubmitButton = submitButton.cloneNode(true);
  submitButton.parentNode.replaceChild(newSubmitButton, submitButton);

  newSubmitButton.addEventListener("click", () => {
    const selectedReasons = Array.from(denialReasonSelect.selectedOptions).map(option => option.value);
    const otherReason = otherReasonInput.value.trim();

    if (otherReason) {
      selectedReasons.push(otherReason);
    }

    if (selectedReasons.length === 0) {
      alert("Please select or provide at least one reason for denial.");
      return;
    }

    confirmDenial(requestId, selectedReasons);
    denialModal.classList.add("hidden");
  });
};

// --- Deny Request ---
// This function is attached to the window so that it can be called from openDenialModal.
window.confirmDenial = function(requestId, denialReasons) {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const dbRequest = indexedDB.open("BloodRequestDB", 9);

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["requests", "deniedRequests"], "readwrite");
    const requestsStore = transaction.objectStore("requests");
    const deniedStore = transaction.objectStore("deniedRequests");

    const getRequest = requestsStore.get(requestId);
    getRequest.onsuccess = () => {
      const data = getRequest.result;
      if (data) {
        data.deniedBy = loggedInUser.username || loggedInUser.email;
        data.deniedAt = new Date().toISOString();
        data.denialReasons = denialReasons; // Array of reasons
        delete data.id;
        deniedStore.add(data);
        requestsStore.delete(requestId);
      }
    };

    transaction.oncomplete = () => {
      window.fetchRequests();
      showDenialMessage(denialReasons.join(", "));
    };

    transaction.onerror = (event) => {
      console.error("Error denying request:", event.target.error);
    };
  };

  dbRequest.onerror = (event) => {
    console.error("Error opening database for denial:", event.target.errorCode);
  };
};

// --- Show Approval Message ---
function showApprovalMessage() {
  const message = document.createElement("div");
  message.classList.add("message", "success");
  message.textContent = "Request approved successfully ✅";
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 5000);
}

// --- Show Denial Message ---
function showDenialMessage(denialReason) {
  const message = document.createElement("div");
  message.classList.add("message", "error");
  message.textContent = `Request denied. Reason: ${denialReason} ❌`;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 5000);
}
