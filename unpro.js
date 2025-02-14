// Function to count and display the number of unprocessed donations
function countUnprocessedDonations() {
  const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
  const donationCountElement = document.getElementById('donationCount');

  // Set the count of unprocessed donations
  donationCountElement.textContent = unprocessedDonations.length;
}

// Call the count function every time unprocessed donations are updated
function updateUnprocessedDonationsList() {
  const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
  const unprocessedDonationsContainer = document.getElementById('unprocessedDonationsList');
  unprocessedDonationsContainer.innerHTML = ''; // Clear the existing list

  if (unprocessedDonations.length === 0) {
    unprocessedDonationsContainer.innerHTML = '<p>No unprocessed donations.</p>';
  } else {
    const unprocessedTable = document.createElement('table');
    unprocessedTable.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Age</th>
          <th>Donor Type</th>
          <th>Donation Date/Time</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;

    const tableBody = unprocessedTable.querySelector('tbody');
    unprocessedDonations.forEach((donation, index) => {
      const donationRow = document.createElement('tr');
      donationRow.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.donorName}</td>
        <td>${donation.donorAge}</td>
        <td>${donation.donorType}</td>
        <td>${donation.donationDateTime}</td>
      `;
      tableBody.appendChild(donationRow);
    });

    unprocessedDonationsContainer.appendChild(unprocessedTable);
  }

  // Call the function to count and display the number of unprocessed donations
  countUnprocessedDonations();
}

// Initialize the page
window.onload = function() {
  updateUnprocessedDonationsList();
};