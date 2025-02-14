document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  const storeName = "malizia";
  let db;

  // Open the IndexedDB database
  const openDB = () => {
    const request = indexedDB.open(dbName, 9);

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database opened successfully!");
      loadMaliziaRecords(); // Load records after opening the database
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Load malizia records from the database
  const loadMaliziaRecords = (filter = null) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = (event) => {
      let records = event.target.result;

      // Apply filter if provided
      if (filter) {
        records = records.filter(filter);
      }

      displayMaliziaRecords(records); // Display filtered records
    };

    request.onerror = (event) => {
      console.error("Failed to load malizia records:", event.target.error);
    };
  };

  // Display malizia records in the table
  const displayMaliziaRecords = (records) => {
    const tbody = document.querySelector('#maliziaTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    records.forEach((record) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${record.recipientName || 'N/A'}</td>
        <td>${record.status || 'N/A'}</td>
        <td>${record.bloodType || 'N/A'}</td>
        <td>${record.units || 'N/A'}</td>
        <td>${record.timestamp || 'N/A'}</td>
      `;
      tbody.appendChild(row);
    });
  };

  // Filter records based on a date range
  const filterRecordsByDate = (startDate, endDate) => {
    return (record) => {
      if (!record.timestamp) return false; // Skip records without a timestamp
      const recordDate = new Date(record.timestamp);
      return recordDate >= startDate && recordDate <= endDate;
    };
  };

  // Generate a report based on the selected date range
  const generateReport = (startDate, endDate) => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    // Convert input strings to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      alert("Start date cannot be after end date.");
      return;
    }

    // Load records filtered by the selected date range
    loadMaliziaRecords(filterRecordsByDate(start, end));
  };

  // Print the table
  const printTable = () => {
    window.print();
  };

  // Event listener for the filter form submission
  document.querySelector('#filterForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const startDate = document.querySelector('#startDate').value;
    const endDate = document.querySelector('#endDate').value;
    generateReport(startDate, endDate); // Generate report based on the selected date range
  });

  // Event listener for the print button
  document.querySelector('#printButton').addEventListener('click', printTable);

  // Initialize the database and load records
  openDB();
});