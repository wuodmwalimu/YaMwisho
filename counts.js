// Function to count the number of rows in the donor table
function countDonorTableRecords() {
  const donorTable = document.querySelector('#donorDataContainer table');
  if (donorTable) {
    return donorTable.querySelectorAll('tbody tr').length;
  }
  return 0;
}

// Function to count the number of rows in the unprocessed donations table
function countUnprocessedDonationsRecords() {
  const unprocessedTable = document.querySelector('#unprocessedDonationsList table');
  if (unprocessedTable) {
    return unprocessedTable.querySelectorAll('tbody tr').length;
  }
  return 0;
}

// Function to display the counts of records
function displayRecordCounts() {
  const donorCount = countDonorTableRecords();
  const unprocessedCount = countUnprocessedDonationsRecords();

  // Display the counts in the paragraph with id 'recordCountsDisplay'
  const displayElement = document.getElementById('recordCountsDisplay');
  displayElement.innerHTML = `
    Donor Table Records: ${donorCount}<br>
    Unprocessed Donations Records: ${unprocessedCount}
  `;
}