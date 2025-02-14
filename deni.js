document.addEventListener("DOMContentLoaded", function() {
  const denyButtons = document.querySelectorAll(".deny-btn");

  // Reasons for denying a request
  const denyReasons = [
    "Blood Type Incompatibility",
    "Insufficient Blood Supply",
    "Inadequate Testing or Documentation",
    "Risk of Transfusion Reactions",
    "Infection Concerns",
    "Medical Contraindications",
    "Alternative Treatments",
    "Ethical or Religious reasons",
    "Insurance /Finance Issues"
  ];

  // Function to deny request and capture reasons
  denyButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      const row = e.target.closest("tr");
      const recipientName = row.cells[0].textContent;
      const bloodType = row.cells[1].textContent;
      const unitsNeeded = row.cells[2].textContent;

      // Show modal with multi-select for reasons
      showDenialModal(recipientName, bloodType, unitsNeeded, row);
    });
  });

  // Function to show modal with multi-select dropdown for reasons
  function showDenialModal(recipientName, bloodType, unitsNeeded, row) {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Select Reasons for Denial</h2>
        <form id="denialForm">
          <select name="reason" id="reasonSelect" multiple size="6">
            ${denyReasons.map(reason => `
              <option value="${reason}">${reason}</option>
            `).join('')}
          </select>
          <button type="submit">Submit</button>
          <button type="button" id="closeModal">Cancel</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('denialForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const selectedReasons = Array.from(document.getElementById('reasonSelect').selectedOptions)
        .map(option => option.value);

      if (selectedReasons.length > 0) {
        denyRequest({
          recipientName,
          bloodType,
          unitsNeeded,
          reasons: selectedReasons
        }, row);
        closeModal();
      } else {
        alert("Please select at least one reason.");
      }
    });

    // Close modal if cancel button is clicked
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Function to close modal
    function closeModal() {
      document.body.removeChild(modal);
    }
  }

  // Function to handle the denial of a request
  function denyRequest(request, row) {
    // Remove the request from the "Recent Requests" table
    row.remove();

    // Store denied request with reasons in localStorage
    const deniedRequests = JSON.parse(localStorage.getItem("deniedRequests")) || [];
    deniedRequests.push(request);
    localStorage.setItem("deniedRequests", JSON.stringify(deniedRequests));

    // Add request to the Denied Requests table
    const deniedTableBody = document.querySelector("#deniedRequests tbody");
    const newRow = deniedTableBody.insertRow();
    newRow.insertCell(0).textContent = request.recipientName;
    newRow.insertCell(1).textContent = request.bloodType;
    newRow.insertCell(2).textContent = request.unitsNeeded;
    newRow.insertCell(3).textContent = request.reasons.join(", ");

    // Update Recent Requests list
    updateRecentRequestsList();
  }

  // Function to update the Recent Requests table
  function updateRecentRequestsList() {
    const requestTableBody = document.querySelector("#requestList tbody");
    requestTableBody.innerHTML = ''; // Clear current table

    const storedRequests = JSON.parse(localStorage.getItem("requests")) || [];
    storedRequests.forEach(request => {
      addRequestToTable(request);
    });
  }

  // Function to add request data to the table
  function addRequestToTable(request) {
    const requestTableBody = document.querySelector("#requestList tbody");
    const row = requestTableBody.insertRow();
    row.insertCell(0).textContent = request.recipientName;
    row.insertCell(1).textContent = request.bloodType;
    row.insertCell(2).textContent = request.unitsNeeded;

    const cellActions = row.insertCell(3);
    const approveButton = document.createElement("button");
    approveButton.textContent = "Approve";
    approveButton.classList.add("approve-btn");
    approveButton.addEventListener("click", function() {
      // Trigger approve action
      approveRequest(request, row);
    });

    const denyButton = document.createElement("button");
    denyButton.textContent = "Deny";
    denyButton.classList.add("deny-btn");
    denyButton.addEventListener("click", function() {
      // Trigger deny action
      showDenialModal(request.recipientName, request.bloodType, request.unitsNeeded, row);
    });

    cellActions.appendChild(approveButton);
    cellActions.appendChild(denyButton);
  }

  // Function to handle the approval of a request
  function approveRequest(request, row) {
    // Approve the request and remove from Recent Requests table
    row.remove();

    // Add the approved request to the "Approved Requests" table
    const approvedTableBody = document.querySelector("#approvedRequests tbody");
    const newRow = approvedTableBody.insertRow();
    newRow.insertCell(0).textContent = request.recipientName;
    newRow.insertCell(1).textContent = request.bloodType;
    newRow.insertCell(2).textContent = request.unitsNeeded;
    newRow.insertCell(3).textContent = "Approved";

    // Update Recent Requests list
    updateRecentRequestsList();
  }
});