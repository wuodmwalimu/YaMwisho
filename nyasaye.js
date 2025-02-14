document.addEventListener("DOMContentLoaded", () => {
  const dbName = "BloodRequestDB";
  const dbVersion = 9;
  // We use all four object stores for search, but by default only display clearedRequests.
  const objectStores = ["requests", "approvedRequests", "deniedRequests", "clearedRequests"];

  // Manual records are used if no data is found in a store.
  const manualRecords = {
    requests: [
      { id: 1, recipientName: "John Doe", bloodType: "A+", urgency: "High", hospital: "City Hospital", submittedBy: "Nurse Jane", submittedAt: new Date().toISOString() },
      { id: 2, recipientName: "Jane Smith", bloodType: "O-", urgency: "Medium", hospital: "General Hospital", submittedBy: "Dr. Smith", submittedAt: new Date().toISOString() }
    ],
    approvedRequests: [
      { id: 3, recipientName: "Alice Johnson", bloodType: "B+", urgency: "Low", hospital: "County Hospital", approvedBy: "Dr. Brown", approvedAt: new Date().toISOString() },
      { id: 4, recipientName: "Bob Brown", bloodType: "AB+", urgency: "High", hospital: "City Hospital", approvedBy: "Dr. Green", approvedAt: new Date().toISOString() }
    ],
    deniedRequests: [
      { id: 5, recipientName: "Charlie Davis", bloodType: "A-", urgency: "Medium", hospital: "General Hospital", deniedBy: "Dr. White", deniedAt: new Date().toISOString() },
      { id: 6, recipientName: "Diana Evans", bloodType: "O+", urgency: "Low", hospital: "County Hospital", deniedBy: "Dr. Black", deniedAt: new Date().toISOString() }
    ],
    clearedRequests: [
      { id: 7, recipientName: "Eve Foster", bloodType: "B-", urgency: "High", hospital: "City Hospital", completedBy: "Nurse Kate", completedAt: new Date().toISOString() },
      { id: 8, recipientName: "Frank Green", bloodType: "AB-", urgency: "Medium", hospital: "General Hospital", completedBy: "Dr. Lee", completedAt: new Date().toISOString() }
    ]
  };

  // Fetch data from IndexedDB (or fall back to manual records) and save to localStorage.
  function fetchAndSaveRequests() {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(objectStores, "readonly");

      let allRequests = {};
      let pendingStores = objectStores.length;

      objectStores.forEach((storeName) => {
        const store = transaction.objectStore(storeName);
        const getRequest = store.getAll();

        getRequest.onsuccess = (event) => {
          allRequests[storeName] = event.target.result.length
            ? event.target.result
            : manualRecords[storeName];
          pendingStores--;
          if (pendingStores === 0) {
            localStorage.setItem("savedRequests", JSON.stringify(allRequests));
            displayRequests(allRequests);
          }
        };
      });
    };

    request.onerror = (event) => {
      console.error("Error opening IndexedDB:", event.target.error);
      localStorage.setItem("savedRequests", JSON.stringify(manualRecords));
      displayRequests(manualRecords);
    };
  }

  // Display requests in the container.
  // If the search input is empty, display only clearedRequests.
  // Otherwise, combine records from all stores and display the search results.
  function displayRequests(data) {
    const query = document.getElementById("searchInput").value.trim();
    const container = document.getElementById("requestsContainer");
    container.innerHTML = "";

    if (query === "") {
      // No search: display only "clearedRequests"
      const storeName = "clearedRequests";
      const section = document.createElement("section");
      section.innerHTML = `
        <h3><i class="fas fa-table icon"></i> Cleared Requests</h3>
        <button onclick="exportData('${storeName}', 'csv')"><i class="fas fa-file-csv"></i> Export CSV</button>
        <button onclick="exportData('${storeName}', 'json')"><i class="fas fa-file-alt"></i> Export JSON</button>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Blood Type</th><th>Urgency</th><th>Hospital</th><th>Details</th>
            </tr>
          </thead>
          <tbody id="${storeName}Table"></tbody>
        </table>`;
      container.appendChild(section);
      populateTable(storeName, data[storeName]);
    } else {
      // Search query exists: combine records from all stores
      let combinedResults = [];
      Object.keys(data).forEach((storeName) => {
        combinedResults = combinedResults.concat(
          data[storeName].map((item) => ({ ...item, source: storeName }))
        );
      });
      const filteredResults = combinedResults.filter((item) =>
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase())
      );
      const section = document.createElement("section");
      section.innerHTML = `
        <h3><i class="fas fa-table icon"></i> Search Results</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Blood Type</th><th>Urgency</th><th>Hospital</th><th>Source</th><th>Details</th>
            </tr>
          </thead>
          <tbody id="searchResultsTable"></tbody>
        </table>`;
      container.appendChild(section);
      populateCombinedTable(filteredResults);
    }
  }

  // Populate the table for a single store (for non-search view)
  function populateTable(storeName, records) {
    const tableBody = document.getElementById(`${storeName}Table`);
    tableBody.innerHTML = records.length
      ? records
          .map((item, index) => `
        <tr>
          <td>${item.id || "N/A"}</td>
          <td>${item.recipientName || "Unknown"}</td>
          <td>${item.bloodType || "N/A"}</td>
          <td>${item.urgency || "N/A"}</td>
          <td>${item.hospital || "N/A"}</td>
          <td><button class="expand-btn" onclick="toggleDetails('${storeName}', ${index})"><i class="fas fa-chevron-down"></i></button></td>
        </tr>
        <tr id="${storeName}-details-${index}" class="dropdown">
          <td colspan="6">
            <p><strong>Submitted By:</strong> ${item.submittedBy || "N/A"}</p>
            <p><strong>Approved By:</strong> ${item.approvedBy || "N/A"}</p>
            <p><strong>Completed By:</strong> ${item.completedBy || "N/A"}</p>
            <p><strong>Denied By:</strong> ${item.deniedBy || "N/A"}</p>
            <p><strong>Submitted At:</strong> ${item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Approved At:</strong> ${item.approvedAt ? new Date(item.approvedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Completed At:</strong> ${item.completedAt ? new Date(item.completedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Denied At:</strong> ${item.deniedAt ? new Date(item.deniedAt).toLocaleString() : "N/A"}</p>
          </td>
        </tr>
      `)
          .join("")
      : "<tr><td colspan='6'>No records found.</td></tr>";
  }

  // Populate the combined search results table
  function populateCombinedTable(records) {
    const tableBody = document.getElementById("searchResultsTable");
    tableBody.innerHTML = records.length
      ? records
          .map((item, index) => `
        <tr>
          <td>${item.id || "N/A"}</td>
          <td>${item.recipientName || "Unknown"}</td>
          <td>${item.bloodType || "N/A"}</td>
          <td>${item.urgency || "N/A"}</td>
          <td>${item.hospital || "N/A"}</td>
          <td>${item.source}</td>
          <td><button class="expand-btn" onclick="toggleSearchDetails(${index})"><i class="fas fa-chevron-down"></i></button></td>
        </tr>
        <tr id="search-details-${index}" class="dropdown">
          <td colspan="7">
            <p><strong>Submitted By:</strong> ${item.submittedBy || "N/A"}</p>
            <p><strong>Approved By:</strong> ${item.approvedBy || "N/A"}</p>
            <p><strong>Completed By:</strong> ${item.completedBy || "N/A"}</p>
            <p><strong>Denied By:</strong> ${item.deniedBy || "N/A"}</p>
            <p><strong>Submitted At:</strong> ${item.submittedAt ? new Date(item.submittedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Approved At:</strong> ${item.approvedAt ? new Date(item.approvedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Completed At:</strong> ${item.completedAt ? new Date(item.completedAt).toLocaleString() : "N/A"}</p>
            <p><strong>Denied At:</strong> ${item.deniedAt ? new Date(item.deniedAt).toLocaleString() : "N/A"}</p>
          </td>
        </tr>
      `)
          .join("")
      : "<tr><td colspan='7'>No records found.</td></tr>";
  }

  // Toggle details row for non-search (single store) view
  window.toggleDetails = (storeName, index) => {
    const detailsRow = document.getElementById(`${storeName}-details-${index}`);
    detailsRow.style.display = detailsRow.style.display === "table-row" ? "none" : "table-row";
  };

  // Toggle details row for search results
  window.toggleSearchDetails = (index) => {
    const detailsRow = document.getElementById(`search-details-${index}`);
    detailsRow.style.display = detailsRow.style.display === "table-row" ? "none" : "table-row";
  };

  // Global search – simply re-read the saved data and re-run displayRequests.
  window.globalSearch = () => {
    const savedData = JSON.parse(localStorage.getItem("savedRequests"));
    displayRequests(savedData);
  };

  // Export function (unchanged from your original)
  window.exportData = (storeName, format) => {
    const savedData = JSON.parse(localStorage.getItem("savedRequests"));
    const data = savedData[storeName];
    if (!data.length) {
      alert("No data to export.");
      return;
    }
    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8," + Object.keys(data[0]).join(",") + "\n";
      csvContent += data.map(row => Object.values(row).join(",")).join("\n");
      downloadFile(csvContent, `${storeName}.csv`);
    } else if (format === "json") {
      let jsonContent = "data:text/json;charset=utf-8," + JSON.stringify(data, null, 2);
      downloadFile(jsonContent, `${storeName}.json`);
    }
  };

  function downloadFile(content, filename) {
    const encodedUri = encodeURI(content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Fetch data from IndexedDB on load
  fetchAndSaveRequests();
});
