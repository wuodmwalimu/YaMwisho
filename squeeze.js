document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  let db;
  let maliziaRequests = [];

  // Open the database
  const openDB = () => {
    const request = indexedDB.open(dbName, 9); // Incremented version

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains('malizia')) {
        db.createObjectStore('malizia', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully!");
      loadMaliziaRequests(); // Load malizia requests on successful DB open
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load malizia requests
  const loadMaliziaRequests = () => {
    const transaction = db.transaction('malizia', 'readonly');
    const store = transaction.objectStore('malizia');
    const request = store.getAll();

    request.onsuccess = (event) => {
      maliziaRequests = event.target.result;
      displayRequests(maliziaRequests); // Display all malizia requests
    };
  };

  // Display malizia requests in the table
  const displayRequests = (requests) => {
    const tbody = document.getElementById('maliziaList');
    tbody.innerHTML = '';

    requests.forEach((req) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${req.recipientName}</td>
        <td>${req.status}</td>
        <td>${req.bloodType}</td>
        <td>${req.units}</td>
        <td>${req.completedBy || 'N/A'}</td> <!-- Display completedBy -->
        <td>${req.completedAt ? new Date(req.completedAt).toLocaleString() : 'N/A'}</td> <!-- Display completedAt -->
      `;
      tbody.appendChild(row);
    });
  };

  // Initialize the database and load data
  openDB();
});