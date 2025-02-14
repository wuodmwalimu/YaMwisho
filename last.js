document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  let db;

  // Open the database
  const openDB = () => {
    const request = indexedDB.open(dbName, 9); // Ensure version 9 or above

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully!");
      loadMaliziaRecords();
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load malizia records
  const loadMaliziaRecords = () => {
    const transaction = db.transaction('malizia', 'readonly');
    const store = transaction.objectStore('malizia');
    const request = store.getAll();

    request.onsuccess = (event) => {
      const maliziaRecords = event.target.result;
      displayMaliziaRecords(maliziaRecords);
    };

    request.onerror = (event) => {
      console.error("Failed to load malizia records:", event.target.error);
    };
  };

  // Display malizia records in the table
  const displayMaliziaRecords = (records) => {
    const tbody = document.querySelector('#maliziaTable tbody');
    tbody.innerHTML = '';

    records.forEach(record => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.recipientName}</td>
        <td>${record.status}</td>
        <td>${record.bloodType}</td>
        <td>${record.units}</td>
        <td>${record.timestamp || 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
  };

  // Initialize the database and load records
  openDB();
});