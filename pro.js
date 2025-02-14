document.addEventListener('DOMContentLoaded', () => {
  const donatedBlood = JSON.parse(localStorage.getItem('donatedBlood')) || [];
  const approvedBlood = JSON.parse(localStorage.getItem('approvedBlood')) || [];
  const unprocessedTableBody = document.querySelector('#unprocessedTable tbody');
  const approvedTableBody = document.querySelector('#approvedTable tbody');
  const approvalModal = document.createElement('div'); // Modal for approval form
  approvalModal.classList.add('modal');

  // Function to populate the Unprocessed Donations table
  const populateUnprocessedTable = () => {
    unprocessedTableBody.innerHTML = '';
    if (!donatedBlood.length) {
      unprocessedTableBody.innerHTML = `<tr><td colspan="7">No donations awaiting approval.</td></tr>`;
      return;
    }

    donatedBlood.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.id}</td>
        <td>${donation.donor}</td>
        <td>${donation.bloodGroup}</td>
        <td>${donation.date}</td>
        <td>${donation.time}</td>
        <td><button class="approve-btn" data-index="${index}"><i class="fas fa-check-circle"></i> Approve</button></td>
      `;
      unprocessedTableBody.appendChild(row);
    });
  };

  // Function to populate the Approved Donations table
  const populateApprovedTable = () => {
    approvedTableBody.innerHTML = '';
    if (!approvedBlood.length) {
      approvedTableBody.innerHTML = `<tr><td colspan="7">No approved donations yet.</td></tr>`;
      return;
    }

    approvedBlood.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.id}</td>
        <td>${donation.donor}</td>
        <td>${donation.bloodGroup}</td>
        <td>${donation.units}</td>
        <td>${donation.approvalDate}</td>
        <td>${donation.comments || 'N/A'}</td>
      `;
      approvedTableBody.appendChild(row);
    });
  };

  // Function to handle donation approval
  const approveDonation = (donorIndex) => {
    const donation = donatedBlood[donorIndex];
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const units = ['1', '2', '3', '4', '5', '6']; // Unit options

    // Create the approval form
    approvalModal.innerHTML = `
      <div class="modal-content">
        <h3>Approve Donation - ${donation.donor}</h3>
        <label for="bloodType">Blood Type</label>
        <select id="bloodType">
          ${bloodTypes.map(type => `<option value="${type}" ${type === donation.bloodGroup ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
        <label for="units">Units</label>
        <select id="units">
          ${units.map(unit => `<option value="${unit}">${unit} unit(s)</option>`).join('')}
        </select>
        <label for="comments">Comments</label>
        <textarea id="comments" placeholder="Enter comments (optional)"></textarea>
        <div class="modal-actions">
          <button id="approveBtn">Approve Donation</button>
          <button id="cancelBtn">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(approvalModal);
    approvalModal.style.display = 'block'; // Show the modal

    // Approve button functionality
    document.querySelector('#approveBtn').addEventListener('click', () => {
      const selectedBloodType = document.querySelector('#bloodType').value;
      const selectedUnits = document.querySelector('#units').value;
      const comments = document.querySelector('#comments').value;
      const approvalDate = new Date().toLocaleDateString();

      // Add the donation to the approved list
      const approvedDonation = {
        id: donation.id,
        donor: donation.donor,
        bloodGroup: selectedBloodType,
        units: selectedUnits,
        approvalDate,
        comments,
      };

      approvedBlood.push(approvedDonation);
      localStorage.setItem('approvedBlood', JSON.stringify(approvedBlood));

      // Remove the donation from unprocessed list
      donatedBlood.splice(donorIndex, 1);
      localStorage.setItem('donatedBlood', JSON.stringify(donatedBlood));

      // Refresh the tables
      populateUnprocessedTable();
      populateApprovedTable();

      // Close the modal
      approvalModal.remove();
    });

    // Cancel button functionality
    document.querySelector('#cancelBtn').addEventListener('click', () => {
      approvalModal.remove(); // Close the modal
    });
  };

  // Event listener for Approve button in Unprocessed Donations
  unprocessedTableBody.addEventListener('click', (e) => {
    if (e.target.closest('.approve-btn')) {
      const donorIndex = e.target.closest('.approve-btn').getAttribute('data-index');
      approveDonation(donorIndex);
    }
  });

  // Populate the tables on page load
  populateUnprocessedTable();
  populateApprovedTable();
});