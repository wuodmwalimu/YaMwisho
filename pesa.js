document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  let db;
  let currentPage = 1;
  const itemsPerPage = 5;
  let clearedRequests = [];

  // Open the database
  const openDB = () => {
    const request = indexedDB.open(dbName, 9); // Incremented version

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains('clearedRequests')) {
        db.createObjectStore('clearedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('malizia')) {
        db.createObjectStore('malizia', { keyPath: 'id', autoIncrement: true }); // New object store
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully!");
      loadClearedRequests(); // Load cleared requests on successful DB open
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load cleared requests and paginate
  const loadClearedRequests = () => {
    const transaction = db.transaction('clearedRequests', 'readonly');
    const store = transaction.objectStore('clearedRequests');
    const request = store.getAll();

    request.onsuccess = (event) => {
      clearedRequests = event.target.result;
      applyFiltersAndSort(); // Apply filters and sort
    };
  };

  // Apply filter, sort, and pagination to the requests
  const applyFiltersAndSort = () => {
    const filterUnits = document.getElementById('filterUnits').value.toLowerCase();
    const sortedRequests = [...clearedRequests]
      .filter(req => req.units.toString().toLowerCase().includes(filterUnits))
      .sort((a, b) => {
        const sortBy = document.querySelector('.sort.active')?.dataset.column || 'recipientName';
        if (sortBy === 'recipientName' || sortBy === 'bloodType') {
          return a[sortBy].localeCompare(b[sortBy]);
        }
        return 0;
      });

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedRequests = sortedRequests.slice(start, end);

    displayRequests(paginatedRequests);
    updatePaginationControls(sortedRequests.length);
  };

  // Display cleared requests in the table
  const displayRequests = (requests) => {
    const tbody = document.getElementById('clearedRequestsList');
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
        <td><button class="confirm-checkout" data-id="${req.id}">Confirm Checkout</button></td>
      `;
      tbody.appendChild(row);
    });

    // Add event listeners for the action buttons
    document.querySelectorAll('.confirm-checkout').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = Number(event.target.dataset.id);
        transferToMalizia(id);
      });
    });
  };

  // Transfer record to the 'malizia' object store
  const transferToMalizia = (id) => {
    const transaction = db.transaction(['clearedRequests', 'malizia'], 'readwrite');
    const clearedRequestsStore = transaction.objectStore('clearedRequests');
    const maliziaStore = transaction.objectStore('malizia');

    const getRequest = clearedRequestsStore.get(id);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;
      if (data) {
        maliziaStore.add(data); // Add record to 'malizia'
        clearedRequestsStore.delete(id); // Remove record from 'clearedRequests'

        // Refresh the table after transfer
        loadClearedRequests();
        console.log(`Record with ID ${id} successfully transferred to 'malizia'.`);
      }
    };

    getRequest.onerror = (event) => {
      console.error('Failed to transfer record:', event.target.error);
    };
  };

  // Update pagination controls
  const updatePaginationControls = (totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pageInfo = document.getElementById('pageInfo');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        applyFiltersAndSort(); // Reapply filters and sorting
      }
    };

    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        applyFiltersAndSort(); // Reapply filters and sorting
      }
    };
  };

  // Initialize sort listeners
  const initializeSortListeners = () => {
    document.querySelectorAll('.sort').forEach((btn) => {
      btn.addEventListener('click', handleSort);
    });
  };

  // Sort request handler
  const handleSort = (event) => {
    const column = event.target.dataset.column;
    const sortButton = event.target;
    const isActive = sortButton.classList.contains('active');

    // Remove active class from all sort buttons
    document.querySelectorAll('.sort').forEach((btn) => btn.classList.remove('active'));

    if (!isActive) {
      sortButton.classList.add('active');
    }

    applyFiltersAndSort(); // Reapply filters and sorting
  };

  // Initialize the database, sort listeners, and load data
  openDB();
  initializeSortListeners();

  // Initialize filter input listener
  document.getElementById('filterUnits').addEventListener('input', applyFiltersAndSort);
});
