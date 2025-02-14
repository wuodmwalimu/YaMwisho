document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  const dbVersion = 9;
  let requestsData = [];

  // Display logged-in user
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

  // Open IndexedDB and fetch requests
  const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStores = ['requests', 'deniedRequests', 'approvedRequests', 'clearedRequests', 'sumup', 'malizia'];
      objectStores.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
        }
      });
    };

    request.onsuccess = (event) => {
      fetchRequests(event.target.result);
    };

    request.onerror = (event) => {
      console.error("Error opening database:", event.target.errorCode);
    };
  };

  // Fetch requests from IndexedDB
  const fetchRequests = (db) => {
    const transaction = db.transaction('requests', 'readonly');
    const store = transaction.objectStore('requests');
    const request = store.getAll();

    request.onsuccess = (event) => {
      requestsData = event.target.result;
      displayRequests();
    };

    request.onerror = (event) => {
      console.error("Error fetching requests:", event.target.error);
    };
  };

  // Display all requests (without action buttons)
  const displayRequests = () => {
    const tableBody = document.getElementById("requestsBody");
    tableBody.innerHTML = "";

    if (requestsData.length === 0) {
      tableBody.innerHTML = "<tr><td colspan='16'>No requests found.</td></tr>";
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
        <td>${item.urgency}</td>
        <td>${item.reason}</td>
        <td>${item.submittedBy}</td>
        <td>${item.userEmail}</td>
        <td>${new Date(item.timestamp).toLocaleString()}</td>
      `;

      tableBody.appendChild(row);
    });
  };

  openDB();
});