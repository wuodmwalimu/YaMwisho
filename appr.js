document.addEventListener('DOMContentLoaded', () => {
  // Utility Functions
  const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
  const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));

  // Initialize Lists and Counters
  ensureSectionVisible('#recentRequestsSection');
  loadRecentRequests();
  loadApprovedRequests();
  updateRequestCounters();

  // Ensure Section is Visible
  function ensureSectionVisible(selector) {
    const section = document.querySelector(selector);
    if (section && section.style.display === 'none') {
      section.style.display = 'block';
    }
  }

  // Load Recent Requests
  function loadRecentRequests() {
    const recentRequestsList = document.querySelector('#recentRequestsList tbody');
    ensureSectionVisible('#recentRequestsSection');
    recentRequestsList.innerHTML = '';

    const requests = getFromLocalStorage('bloodRequests');
    if (requests.length === 0) {
      recentRequestsList.innerHTML = `<tr><td colspan="5">No recent requests found.</td></tr>`;
      return;
    }

    requests.forEach((request, index) => {
      addRequestToTable(request, recentRequestsList, index + 1, 'recent');
    });
  }

  // Load Approved Requests
  function loadApprovedRequests() {
    const approvedRequestsList = document.querySelector('#approvedRequestsList tbody');
    approvedRequestsList.innerHTML = '';

    const requests = getFromLocalStorage('approvedRequests');
    if (requests.length === 0) {
      approvedRequestsList.innerHTML = `<tr><td colspan="7">No approved requests found.</td></tr>`;
      return;
    }

    requests.forEach((request, index) => {
      addRequestToTable(request, approvedRequestsList, index + 1, 'approved');
    });
  }

  // Add Request to Table
  function addRequestToTable(request, tableBody, serialNumber, status) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${serialNumber}</td>
      <td>${request.recipientName}</td>
      <td>${request.bloodType}</td>
      <td>${request.units}</td>
      ${
        status === 'approved'
          ? `<td>${request.priceType || ''}</td><td>${request.anticipatedDate || ''}</td><td>${request.approvedDate || ''}</td>`
          : ''
      }
      <td>
        ${
          status === 'recent'
            ? `
              <button class="view-btn" data-action="view">View</button>
              <button class="approve-btn" data-action="approve">Approve</button>
            `
            : ''
        }
      </td>
    `;
    row.addEventListener('click', (event) => handleRowAction(event, request, status, row));
    tableBody.appendChild(row);
  }

  // Handle Row Actions
  function handleRowAction(event, request, status, row) {
    const action = event.target.dataset.action;
    if (!action) return;

    switch (action) {
      case 'view':
        showRequestDetails(request);
        break;
      case 'approve':
        openApprovalConfirmation(request, status, row);
        break;
    }
  }

  // Show Request Details
  function showRequestDetails(request) {
    alert(`
      Date: ${request.date}
      Recipient Name: ${request.recipientName}
      Recipient Age: ${request.age}
      Blood Type: ${request.bloodType}
      Units Needed: ${request.units}
      Gender: ${request.gender}
      Hospital: ${request.hospital}
      Doctor: ${request.doctor}
      Hospital Contact: ${request.contactHospital}
      Location: ${request.location}
      Urgency: ${request.urgency}
      Reason: ${request.reason}
    `);
  }

  // Open Approval Confirmation Modal
  function openApprovalConfirmation(request, status, row) {
    const modalHtml = `
      <div id="approvalConfirmationModal" class="modal">
        <div class="modal-content">
          <h2>Confirm Approval</h2>
          <p>Are you sure you want to approve this request for <strong>${request.recipientName}</strong>?</p>
          <label for="priceType">Price Type:</label>
          <select id="priceType">
            <option value="Related to Donor">Related to Donor</option>
            <option value="Not Related to Donor">Not Related to Donor</option>
          </select>
          <label for="anticipatedDate">Anticipated Date:</label>
          <input type="date" id="anticipatedDate" required />
          <div class="modal-actions">
            <button id="confirmApprovalBtn">Confirm</button>
            <button id="cancelApprovalBtn">Cancel</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modal = document.getElementById('approvalConfirmationModal');
    modal.querySelector('#confirmApprovalBtn').addEventListener('click', () => {
      const priceType = modal.querySelector('#priceType').value;
      const anticipatedDate = modal.querySelector('#anticipatedDate').value;

      if (!anticipatedDate) {
        alert('Anticipated date is required.');
        return;
      }

      request.priceType = priceType;
      request.anticipatedDate = anticipatedDate;
      request.approvedDate = new Date().toLocaleDateString();

      updateRequestList(request, 'approvedRequests', 'bloodRequests', row);
      modal.remove();
    });

    modal.querySelector('#cancelApprovalBtn').addEventListener('click', () => {
      modal.remove();
    });
  }

  // Update Request List
  function updateRequestList(request, targetKey, sourceKey, row) {
    const sourceList = getFromLocalStorage(sourceKey);
    const targetList = getFromLocalStorage(targetKey);

    // Add request to Approved List
    if (!targetList.some((req) => JSON.stringify(req) === JSON.stringify(request))) {
      targetList.push(request);
      saveToLocalStorage(targetKey, targetList);
    }

    // Remove request from Recent List
    const updatedSourceList = sourceList.filter((req) => JSON.stringify(req) !== JSON.stringify(request));
    saveToLocalStorage(sourceKey, updatedSourceList);

    row.remove();
    loadRecentRequests();
    loadApprovedRequests();
    updateRequestCounters();
  }

  // Update Counters for Recent and Approved Requests
  function updateRequestCounters() {
    const recentRequests = getFromLocalStorage('bloodRequests');
    const approvedRequests = getFromLocalStorage('approvedRequests');

    document.getElementById('recentCount').textContent = `Recent Requests: ${recentRequests.length}`;
    document.getElementById('approvedCount').textContent = `Approved Requests: ${approvedRequests.length}`;
  }
});
