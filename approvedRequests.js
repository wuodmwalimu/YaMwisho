document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  let db;
  let currentPage = 1;
  const itemsPerPage = 5;

  // Get the logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // Open the database
  const openDB = () => {
    const request = indexedDB.open(dbName, 9);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('deniedRequests')) {
        db.createObjectStore('deniedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('approvedRequests')) {
        db.createObjectStore('approvedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('clearedRequests')) {
        db.createObjectStore('clearedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('sumup')) {
        db.createObjectStore('sumup', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('malizia')) {
        db.createObjectStore('malizia', { keyPath: 'id', autoIncrement: true }); // New object store
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully!");
      loadApprovedRequests();
      loadClearedRequests();
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load approved requests and paginate
  const loadApprovedRequests = () => {
    const transaction = db.transaction('approvedRequests', 'readonly');
    const store = transaction.objectStore('approvedRequests');
    const request = store.getAll();

    request.onsuccess = (event) => {
      const requests = event.target.result;
      const tbody = document.getElementById('approvedRequestsList');
      const pageInfo = document.getElementById('pageInfo');

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedRequests = requests.slice(start, end);

      tbody.innerHTML = '';
      paginatedRequests.forEach((req) => {
        const row = document.createElement('tr');
        const status = req.status || '💰 ❌'; // Default status if not set
        const approvedBy = req.approvedBy || 'Unknown'; // Approved by
        const timestamp = req.timestamp || 'N/A'; // Timestamp
        row.innerHTML = `
          <td>${req.recipientName}</td>
          <td>${status}</td>
          <td>${req.bloodType}</td>
          <td>${req.units}</td>
          <td>${approvedBy}</td>
          <td>${timestamp}</td>
          <td>
            <button class="view-btn" data-id="${req.id}"><i class="fa fa-eye"></i> View</button>
            <button class="revert-btn" data-id="${req.id}"><i class="fa fa-undo"></i> Revert</button>
            <button class="complete-btn" data-id="${req.id}"><i class="fa fa-check"></i> ☑ Check</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(requests.length / itemsPerPage)}`;

      document.querySelectorAll('.revert-btn').forEach((btn) =>
        btn.addEventListener('click', revertToPending)
      );

      document.querySelectorAll('.complete-btn').forEach((btn) =>
        btn.addEventListener('click', markAsCompleted)
      );

      updatePaginationControls(requests.length);
    };
  };

  // Load cleared requests
  const loadClearedRequests = () => {
    const transaction = db.transaction('clearedRequests', 'readonly');
    const store = transaction.objectStore('clearedRequests');
    const request = store.getAll();

    request.onsuccess = (event) => {
      const requests = event.target.result;
      const tbody = document.getElementById('clearedRequestsList');

      tbody.innerHTML = '';
      requests.forEach((req) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${req.recipientName}</td>
          <td>${req.status}</td>
          <td>${req.bloodType}</td>
          <td>${req.units}</td>
        `;
        tbody.appendChild(row);
      });
    };
  };

  // Handle reverting a request to "Pending"
  const revertToPending = (event) => {
    const id = Number(event.target.dataset.id);
    const transaction = db.transaction(['approvedRequests', 'requests'], 'readwrite');
    const approvedStore = transaction.objectStore('approvedRequests');
    const pendingStore = transaction.objectStore('requests');

    const getRequest = approvedStore.get(id);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;
      pendingStore.add(data);
      approvedStore.delete(id);
      loadApprovedRequests();
    };
  };

  // Handle marking a request as "Completed" and recording the user and time
  const markAsCompleted = (event) => {
  const id = Number(event.target.dataset.id);
  const transaction = db.transaction(['approvedRequests', 'clearedRequests'], 'readwrite');
  const approvedStore = transaction.objectStore('approvedRequests');
  const clearedStore = transaction.objectStore('clearedRequests');

  const getRequest = approvedStore.get(id);

  getRequest.onsuccess = (event) => {
    const data = event.target.result;

    // Update the status before moving to clearedRequests
    const completedData = {
      ...data,
      status: '💰 ✅', // Change status to "💰 ✅"
      completedBy: loggedInUser.username, // User who completed it
      completedAt: new Date().toISOString() // Add completion timestamp
    };

    clearedStore.add(completedData); // Move to clearedRequests
    approvedStore.delete(id); // Remove from approvedRequests

    loadApprovedRequests(); // Reload approved requests
    loadClearedRequests(); // Reload cleared requests
  };
};

      
  

  // Update pagination controls
  const updatePaginationControls = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    prevButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        loadApprovedRequests();
      }
    };

    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadApprovedRequests();
      }
    };
  };

  // Initialize the database and load data
  openDB();
});
