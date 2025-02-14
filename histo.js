// Retrieve data from localStorage
const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
const processedDonations = JSON.parse(localStorage.getItem('processedDonations')) || [];

// Combine all donations into a single history list
const donationHistory = [...unprocessedDonations, ...processingList, ...processedDonations];

// Display donation history
function displayDonations(donations = donationHistory) {
  const tableBody = document.getElementById('donationTable');
  tableBody.innerHTML = '';

  if (donations.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8">No donations found.</td></tr>';
    return;
  }

  donations.forEach((donation, index) => {
    const isRepeat = donationHistory.filter(d => d.donorName === donation.donorName).length > 1;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${donation.donorName}</td>
      <td>${donation.bloodGroup || 'N/A'}</td>
      <td>${donation.donationDate || 'N/A'}</td>
      <td>${donation.donationType || 'N/A'}</td>
      <td>${donation.volumeCollected || 'N/A'}</td>
      <td>${isRepeat ? 'Yes' : 'No'}</td>
      <td><button onclick="viewDetails(${index})" class="button">Details</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Filter donations by blood group and donor type
document.getElementById('filterButton').addEventListener('click', () => {
  const bloodGroupFilter = document.getElementById('bloodGroupFilter').value;
  const donorTypeFilter = document.getElementById('donorTypeFilter').value;

  const filteredDonations = donationHistory.filter(donation =>
    (bloodGroupFilter === '' || donation.bloodGroup === bloodGroupFilter) &&
    (donorTypeFilter === '' || donation.donationType === donorTypeFilter)
  );

  displayDonations(filteredDonations);
});

// Sort donations by date
document.getElementById('sortByDate').addEventListener('click', () => {
  donationHistory.sort((a, b) => new Date(a.donationDate) - new Date(b.donationDate));
  displayDonations();
});

// Search donation by unit number
document.getElementById('searchButton').addEventListener('click', () => {
  const searchValue = document.getElementById('unitNumberSearch').value.trim();

  const foundDonations = donationHistory.filter(donation =>
    donation.unitNumber && donation.unitNumber.includes(searchValue)
  );

  if (foundDonations.length === 0) {
    alert('No donations found for the provided Unit Number.');
  }

  displayDonations(foundDonations);
});

// View donation details
function viewDetails(index) {
  const donation = donationHistory[index];
  alert(
    `Details for ${donation.donorName}:\n\n` +
    `Blood Group: ${donation.bloodGroup || 'N/A'}\n` +
    `Donation Date: ${donation.donationDate || 'N/A'}\n` +
    `Donation Type: ${donation.donationType || 'N/A'}\n` +
    `Volume: ${donation.volumeCollected || 'N/A'} mL\n` +
    `Unit Number: ${donation.unitNumber || 'N/A'}`
  );
}

// Initialize page
displayDonations();