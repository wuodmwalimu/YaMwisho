// Function to update the dropdown with unprocessed donations
function updateDonorDropdown() {
  const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
  const donorSelect = document.getElementById('donorSelect');
  donorSelect.innerHTML = ''; // Clear previous options

  if (unprocessedDonations.length === 0) {
    donorSelect.innerHTML = '<option value="">No unprocessed donations available</option>';
    document.getElementById('processButton').disabled = true;
  } else {
    unprocessedDonations.forEach((donation, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${donation.donorName} (Donor Type: ${donation.donorType}, Age: ${donation.donorAge})`;
      donorSelect.appendChild(option);
    });
    document.getElementById('processButton').disabled = false;
  }
}

// Function to start processing the selected donation
function startProcessing() {
  const donorSelect = document.getElementById('donorSelect');
  const selectedIndex = donorSelect.value;

  if (selectedIndex === '') {
    alert('Please select a donation to process.');
    return;
  }

  const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
  const selectedDonation = unprocessedDonations[selectedIndex];
  const processingForm = document.getElementById('processingForm');
  processingForm.style.display = 'block';
  processingForm.dataset.selectedIndex = selectedIndex;

  alert(
    `Processing donation for:\n\nName: ${selectedDonation.donorName}\nAge: ${selectedDonation.donorAge}\nDonor Type: ${selectedDonation.donorType}`
  );
}

// Function to save processing details
function saveProcessingDetails() {
  const selectedIndex = document.getElementById('processingForm').dataset.selectedIndex;
  const unprocessedDonations = JSON.parse(localStorage.getItem('unprocessedDonations')) || [];
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const selectedDonation = unprocessedDonations[selectedIndex];

  const donationDate = document.getElementById('donationDate').value;
  const donationType = document.getElementById('donationType').value;
  const componentType = document.getElementById('componentType').value;
  const bloodGroup = document.getElementById('bloodGroup').value;
  const rhFactor = document.getElementById('rhFactor').value;
  const volumeCollected = document.getElementById('volumeCollected').value;

  if (!donationDate || !donationType || !componentType || !bloodGroup || !volumeCollected) {
    alert('All fields are required.');
    return;
  }

  const unitNumber = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(processingList.length + 1).padStart(3, '0')}`;

  const processedDonation = {
    ...selectedDonation,
    donationDate,
    donationType,
    componentType,
    bloodGroup,
    rhFactor,
    volumeCollected,
    unitNumber,
  };
  processingList.push(processedDonation);
  unprocessedDonations.splice(selectedIndex, 1);

  localStorage.setItem('unprocessedDonations', JSON.stringify(unprocessedDonations));
  localStorage.setItem('processingList', JSON.stringify(processingList));

  document.getElementById('processingForm').style.display = 'none';
  alert('Donation successfully added to the processing list!');
  updateDonorDropdown();
  displayProcessingList();
}

// Function to display the processed donations list with a "Further Processing" link
function displayProcessingList() {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const processingTable = document.getElementById('processingTable');
  processingTable.innerHTML = '';

  if (processingList.length === 0) {
    processingTable.innerHTML = '<tr><td colspan="8">No processed donations yet.</td></tr>';
  } else {
    processingList.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${donation.unitNumber}</td>
        <td>${donation.donationDate}</td>
        <td>${donation.componentType}</td>
        <td>${donation.bloodGroup} (${donation.rhFactor})</td>
        <td>${donation.volumeCollected} mL</td>
        <td><button onclick="removeProcessedDonation(${index})">Remove</button></td>
        <td><a href="heist.html">Further Processing</a></td>
      `;
      processingTable.appendChild(row);
    });
  }
}

// Function to remove a processed donation from the list
function removeProcessedDonation(index) {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  processingList.splice(index, 1);
  localStorage.setItem('processingList', JSON.stringify(processingList));
  displayProcessingList();
}

// Initialize the page
window.onload = function() {
  updateDonorDropdown();
  displayProcessingList();

  document.getElementById('processButton').addEventListener('click', startProcessing);
  document.getElementById('saveProcessingDetails').addEventListener('click', saveProcessingDetails);
};