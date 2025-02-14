document.addEventListener('DOMContentLoaded', function() {
  displayProcessingList();
  displayConfirmedDonations();
  displayDiscardedDonations();
});

// Function to display processing donations
function displayProcessingList() {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const processingTable = document.getElementById('processingTable');
  processingTable.innerHTML = '';

  if (processingList.length === 0) {
    processingTable.innerHTML = '<tr><td colspan="8">No donations being processed.</td></tr>';
  } else {
    processingList.forEach((donation, index) => {
      const storageInfo = getStorageInfo(donation.componentType);
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${donation.unitNumber}</td>
                <td>${donation.donationDate}</td>
                <td>${donation.componentType}</td>
                <td>${donation.bloodGroup} (${donation.rhFactor})</td>
                <td>${donation.volumeCollected} mL</td>
                <td>${storageInfo.temperature}</td>
                <td>${storageInfo.duration}</td>
                <td><button onclick="showTestResults(${index})">Confirm Test</button></td>
            `;
      processingTable.appendChild(row);
    });
  }
}

// Function to show test results modal
function showTestResults(index) {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const donation = processingList[index];

  // Populate modal with donation details
  document.getElementById('testUnitNumber').innerText = donation.unitNumber;
  document.getElementById('testComponentType').innerText = donation.componentType;
  document.getElementById('testBloodGroup').innerText = `${donation.bloodGroup} (${donation.rhFactor})`;
  document.getElementById('testVolume').innerText = `${donation.volumeCollected} mL`;

  // Display modal
  const testModal = document.getElementById('testResultsModal');
  testModal.style.display = 'block';

  // Save index for confirmation
  testModal.dataset.donationIndex = index;
}

// Function to confirm donation after test results
function confirmTestResults() {
  const testModal = document.getElementById('testResultsModal');
  const index = testModal.dataset.donationIndex;
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const confirmedDonations = JSON.parse(localStorage.getItem('confirmedDonations')) || [];
  const discardedList = JSON.parse(localStorage.getItem('discardedList')) || [];
  const donation = processingList[index];

  // Collect test results
  const testResults = {
    hiv: document.getElementById('hivTest').value,
    hbsAg: document.getElementById('hbsAgTest').value,
    hcv: document.getElementById('hcvTest').value,
    syphilis: document.getElementById('syphilisTest').value,
    otherTests: document.getElementById('otherTests').value
  };

  // Check if any test result is positive
  if ([testResults.hiv, testResults.hbsAg, testResults.hcv, testResults.syphilis].includes('Positive')) {
    alert('Donation has been discarded due to positive test results.');

    // Move donation to discarded list
    const discardedDonation = {
      ...donation,
      testResults
    };
    discardedList.push(discardedDonation);

    // Remove from processing list
    processingList.splice(index, 1);

    // Update local storage
    localStorage.setItem('processingList', JSON.stringify(processingList));
    localStorage.setItem('discardedList', JSON.stringify(discardedList));

    // Close modal and update lists
    testModal.style.display = 'none';
    displayProcessingList();
    displayDiscardedDonations();
    return;
  }

  // If all tests are negative, confirm donation
  const storageInfo = getStorageInfo(donation.componentType);

  // Move donation to confirmed list
  const confirmedDonation = {
    ...donation,
    storageTemperature: storageInfo.temperature,
    shelfLife: storageInfo.duration,
    testResults
  };
  confirmedDonations.push(confirmedDonation);

  // Remove from processing list
  processingList.splice(index, 1);

  // Update local storage
  localStorage.setItem('processingList', JSON.stringify(processingList));
  localStorage.setItem('confirmedDonations', JSON.stringify(confirmedDonations));

  // Close modal and update lists
  testModal.style.display = 'none';
  alert('Donation confirmed and added to confirmed list!');
  displayProcessingList();
  displayConfirmedDonations();
}

// Function to close modal
function closeModal() {
  document.getElementById('testResultsModal').style.display = 'none';
}

// Helper function for storage temperature and shelf life
function getStorageInfo(componentType) {
  const storageDetails = {
    'Whole Blood': { temperature: '1-6°C', duration: '35-42 days' },
    'Red Blood Cells': { temperature: '1-6°C', duration: 'Up to 42 days' },
    'Platelets': { temperature: '20-24°C (with agitation)', duration: '5-7 days' },
    'Plasma': { temperature: '-18°C or lower', duration: 'Up to 1 year' },
    'Cryoprecipitate': { temperature: '-18°C or lower', duration: 'Up to 1 year' },
    'Granulocytes': { temperature: '20-24°C', duration: 'Must be used within 24 hours' }
  };
  return storageDetails[componentType] || { temperature: 'Unknown', duration: 'N/A' };
}

// Function to display confirmed donations
function displayConfirmedDonations() {
  const confirmedDonations = JSON.parse(localStorage.getItem('confirmedDonations')) || [];
  const confirmedTable = document.getElementById('confirmedTable');
  confirmedTable.innerHTML = '';

  if (confirmedDonations.length === 0) {
    confirmedTable.innerHTML = '<tr><td colspan="8">No confirmed donations yet.</td></tr>';
  } else {
    confirmedDonations.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${donation.unitNumber}</td>
                <td>${donation.donationDate}</td>
                <td>${donation.componentType}</td>
                <td>${donation.bloodGroup} (${donation.rhFactor})</td>
                <td>${donation.volumeCollected} mL</td>
                <td>${donation.storageTemperature}</td>
                <td>${donation.shelfLife}</td>
            `;
      confirmedTable.appendChild(row);
    });
  }
}

// Function to display discarded donations
function displayDiscardedDonations() {
  const discardedList = JSON.parse(localStorage.getItem('discardedList')) || [];
  const discardedTable = document.getElementById('discardedTable');
  discardedTable.innerHTML = '';

  if (discardedList.length === 0) {
    discardedTable.innerHTML = '<tr><td colspan="8">No discarded donations yet.</td></tr>';
  } else {
    discardedList.forEach((donation, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${donation.unitNumber}</td>
                <td>${donation.donationDate}</td>
                <td>${donation.componentType}</td>
                <td>${donation.bloodGroup} (${donation.rhFactor})</td>
                <td>${donation.volumeCollected} mL</td>
                <td>Discarded</td>
            `;
      discardedTable.appendChild(row);
    });
  }
}