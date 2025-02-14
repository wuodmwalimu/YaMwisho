document.addEventListener('DOMContentLoaded', () => {
  const requestList = document.querySelector('#requestList tbody');
  const deniedList = document.querySelector('#deniedList tbody');

  // Initialize storage if not already done
  initializeLocalStorage();

  // Load requests and denied requests on page load
  loadRequests();

  function initializeLocalStorage() {
    if (!localStorage.getItem('bloodRequests')) {
      localStorage.setItem('bloodRequests', JSON.stringify([]));
    }
    if (!localStorage.getItem('deniedRequests')) {
      localStorage.setItem('deniedRequests', JSON.stringify([]));
    }
  }

  function loadRequests() {
    const requests = getFromLocalStorage('bloodRequests');
    const deniedRequests = getFromLocalStorage('deniedRequests');

    // Clear current tables
    requestList.innerHTML = '';
    deniedList.innerHTML = '';

    // Populate tables
    requests.forEach((request) => addRequestToTable(request));
    deniedRequests.forEach((request) => addDeniedRequestToTable(request));
  }

  function addRequestToTable(request) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.recipientName}</td>
      <td>${request.bloodType}</td>
      <td>${request.units}</td>
      <td>
        <button class="view-btn">View</button>
        <button class="deny-btn">Deny</button>
      </td>
    `;

    row.querySelector('.view-btn').addEventListener('click', () => showDetails(request));
    row.querySelector('.deny-btn').addEventListener('click', () => openDenyModal(request));

    requestList.appendChild(row);
  }

  function addDeniedRequestToTable(request) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.recipientName}</td>
      <td>${request.bloodType}</td>
      <td>${request.units}</td>
      <td>${request.denyReasons.join(', ')}</td>
    `;
    deniedList.appendChild(row);
  }

  function showDetails(request) {
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

  function openDenyModal(request) {
    // Create modal elements
    const overlay = document.createElement('div');
    overlay.id = 'overlay';

    const modal = document.createElement('div');
    modal.id = 'denyModal';
    modal.innerHTML = `
      <h3>Choose Denial Reasons</h3>
      <form id="denyForm">
        <label><input type="checkbox" value="Blood Type Incompatibility"> Blood Type Incompatibility</label><br>
        <label><input type="checkbox" value="Insufficient Blood Supply"> Insufficient Blood Supply</label><br>
        <label><input type="checkbox" value="Inadequate Testing or Documentation"> Inadequate Testing or Documentation</label><br>
        <label><input type="checkbox" value="Risk of Transfusion Reactions"> Risk of Transfusion Reactions</label><br>
        <label><input type="checkbox" value="Infection Concerns"> Infection Concerns</label><br>
        <label><input type="checkbox" value="Medical Contraindications"> Medical Contraindications</label><br>
        <label><input type="checkbox" value="Alternative Treatments"> Alternative Treatments</label><br>
        <label><input type="checkbox" value="Ethical or Religious Reasons"> Ethical or Religious Reasons</label><br>
        <label><input type="checkbox" value="Insurance/Finance Issues"> Insurance/Finance Issues</label><br>
        <button type="button" id="submitDeny">Submit</button>
        <button type="button" id="cancelDeny">Cancel</button>
      </form>
    `;

    // Append modal and overlay to the DOM
    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    // Handle "Submit" button
    document.getElementById('submitDeny').addEventListener('click', () => {
      const selectedReasons = Array.from(
        document.querySelectorAll('#denyForm input[type="checkbox"]:checked')
      ).map((checkbox) => checkbox.value);

      if (selectedReasons.length === 0) {
        alert('Please select at least one reason.');
        return;
      }

      // Add to denied list and update storage
      const deniedRequests = getFromLocalStorage('deniedRequests');
      deniedRequests.push({ ...request, denyReasons: selectedReasons });
      saveToLocalStorage('deniedRequests', deniedRequests);

      // Remove from pending requests
      const requests = getFromLocalStorage('bloodRequests');
      const updatedRequests = requests.filter((r) => r.id !== request.id);
      saveToLocalStorage('bloodRequests', updatedRequests);

      // Reload tables and close modal
      loadRequests();
      closeModal();
    });

    // Handle "Cancel" button
    document.getElementById('cancelDeny').addEventListener('click', closeModal);
  }

  function closeModal() {
    const modal = document.getElementById('denyModal');
    const overlay = document.getElementById('overlay');
    if (modal) modal.remove();
    if (overlay) overlay.remove();
  }

  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
});