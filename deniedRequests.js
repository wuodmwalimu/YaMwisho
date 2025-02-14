document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  let db;

  // Open IndexedDB
  const openDB = () => {
    const request = indexedDB.open(dbName, 9);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      const objectStores = ['requests', 'deniedRequests', 'approvedRequests', 'clearedRequests', 'sumup', 'malizia'];
      objectStores.forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
        }
      });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      loadDeniedRequests(); // Load denied requests on success
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load denied requests into the table
  const loadDeniedRequests = () => {
    const transaction = db.transaction('deniedRequests', 'readonly');
    const store = transaction.objectStore('deniedRequests');
    const request = store.getAll();

    request.onsuccess = (event) => {
      const requests = event.target.result;
      const tbody = document.getElementById('deniedRequestsList');

      tbody.innerHTML = '';

      requests.forEach((req) => {
        // Ensure denial reasons are correctly displayed
        let denialReasons = req.denialReasons ? req.denialReasons.join(', ') : 'Not Provided';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${req.recipientName || 'N/A'}</td>
          <td>${req.bloodType || 'N/A'}</td>
          <td>${req.units || 'N/A'}</td>
          <td>${req.urgency || 'N/A'}</td>
          <td>${denialReasons}</td>
          <td>${req.deniedBy || 'Unknown'}</td>
          <td>${req.deniedAt ? new Date(req.deniedAt).toLocaleString() : 'Unknown'}</td> 
          <td>
            <button class="view-btn" data-id="${req.id}">View</button>
            <button class="revert-btn" data-id="${req.id}">Revert</button>
          </td>
        `;
        tbody.appendChild(row);
      });

      document.querySelectorAll('.view-btn').forEach((btn) =>
        btn.addEventListener('click', viewRequest)
      );

      document.querySelectorAll('.revert-btn').forEach((btn) =>
        btn.addEventListener('click', revertToPending)
      );
    };

    request.onerror = (event) => {
      console.error("Error loading denied requests:", event.target.errorCode);
    };
  };

  // View request details in a popup
  const viewRequest = (event) => {
    const id = Number(event.target.dataset.id);

    const transaction = db.transaction('deniedRequests', 'readonly');
    const store = transaction.objectStore('deniedRequests');
    const request = store.get(id);

    request.onsuccess = (event) => {
      const data = event.target.result;

      if (data) {
        let denialReasons = data.denialReasons ? data.denialReasons.join(', ') : 'N/A';

        const viewModal = document.getElementById('viewModal');
        viewModal.querySelector('#viewRecipientName').textContent = data.recipientName || 'N/A';
        viewModal.querySelector('#viewAge').textContent = data.age || 'N/A';
        viewModal.querySelector('#viewBloodType').textContent = data.bloodType || 'N/A';
        viewModal.querySelector('#viewUnits').textContent = data.units || 'N/A';
        viewModal.querySelector('#viewUrgency').textContent = data.urgency || 'N/A';
        viewModal.querySelector('#viewDenialReasons').textContent = denialReasons;
        viewModal.querySelector('#viewDeniedBy').textContent = data.deniedBy || 'Unknown';
        viewModal.querySelector('#viewDeniedOn').textContent = data.deniedAt ? new Date(data.deniedAt).toLocaleString() : 'Unknown';
        viewModal.querySelector('#viewAdditionalNotes').textContent = data.additionalNotes || 'N/A';

        viewModal.classList.remove('hidden');
      }
    };

    request.onerror = (event) => {
      console.error(`Error retrieving request ID ${id}:`, event.target.errorCode);
    };
  };

  // Close the view modal
  document.getElementById('closeViewModal').addEventListener('click', () => {
    document.getElementById('viewModal').classList.add('hidden');
  });

  // Revert a denied request to pending list
  const revertToPending = (event) => {
    const id = Number(event.target.dataset.id);

    const transaction = db.transaction(['deniedRequests', 'requests'], 'readwrite');
    const deniedStore = transaction.objectStore('deniedRequests');
    const pendingStore = transaction.objectStore('requests');

    const getRequest = deniedStore.get(id);

    getRequest.onsuccess = (event) => {
      const data = event.target.result;

      if (data) {
        delete data.deniedBy;
        delete data.deniedAt;
        delete data.denialReasons; // Remove denial reasons before reverting

        pendingStore.add(data).onsuccess = () => {
          deniedStore.delete(id).onsuccess = () => {
            console.log(`Request ID ${id} reverted to pending.`);
            loadDeniedRequests();
          };
        };
      }
    };

    getRequest.onerror = (event) => {
      console.error(`Error retrieving request ID ${id}:`, event.target.errorCode);
    };
  };

  // Initialize the database and load denied requests
  openDB();
});
