// Function to retrieve logged-in user and display user info
function displayUserInfo() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    document.getElementById('userDisplay').innerText = `Logged In as ${loggedInUser.username}`;
  } else {
    alert('Please log in to access this page.');
    window.location.href = 'index.html'; // Redirect to login page if not logged in
  }
}

// Function to log out the current user
function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html'; // Redirect to login page
}

// Function to display the processing list with expiry dates
function displayProcessingList(filteredList = null) {
  const processingList = filteredList || JSON.parse(localStorage.getItem('processingList')) || [];
  const processingTable = document.getElementById('processingTable').getElementsByTagName('tbody')[0];
  processingTable.innerHTML = '';

  if (processingList.length === 0) {
    processingTable.innerHTML = '<tr><td colspan="9">No processed donations yet.</td></tr>';
  } else {
    processingList.forEach((donation, index) => {
      const expiryDate = calculateExpiryDate(donation.donationDate, donation.componentType);

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
      
        <td>${donation.donationDate}</td>
        <td><i class="fas fa-tint"></i> ${donation.componentType}</td>
        <td>${donation.bloodGroup} (${donation.rhFactor})</td>
        <td>${donation.volumeCollected} mL</td>
        <td>${donation.unitNumber}</td>
        <td>${expiryDate}</td>
        <td><button onclick="discardDonation(${index})"><i class="fas fa-trash-alt"></i> Discard</button></td>
      `;
      processingTable.appendChild(row);
    });
  }
}

// Function to sort the processing list by a specified field
function sortProcessingList(field) {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];

  processingList.sort((a, b) => (a[field] > b[field] ? 1 : -1));

  localStorage.setItem('processingList', JSON.stringify(processingList));
  displayProcessingList();
}

// Function to filter the processing list based on blood group and component type
function filterProcessingList() {
  const bloodGroupFilter = document.getElementById('bloodGroupFilter').value;
  const componentTypeFilter = document.getElementById('componentTypeFilter').value;
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];

  const filteredList = processingList.filter(donation =>
    (bloodGroupFilter === '' || donation.bloodGroup === bloodGroupFilter) &&
    (componentTypeFilter === '' || donation.componentType === componentTypeFilter)
  );

  displayProcessingList(filteredList);
}

// Function to discard a donation and move it to the discarded list
function discardDonation(index) {
  const processingList = JSON.parse(localStorage.getItem('processingList')) || [];
  const discardedList = JSON.parse(localStorage.getItem('discardedList')) || [];

  const discardedDonation = processingList.splice(index, 1)[0]; // Remove the donation from processing

  // Get the current logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
  const timestamp = new Date().toISOString(); // Capture the timestamp of the action

  // Attach the discard information
  discardedDonation.discardedBy = loggedInUser.username || 'Unknown User';
  discardedDonation.discardTimestamp = timestamp;

  discardedList.push(discardedDonation); // Add it to the discarded list

  // Save the updated lists back to localStorage
  localStorage.setItem('processingList', JSON.stringify(processingList));
  localStorage.setItem('discardedList', JSON.stringify(discardedList));

  // Re-render the table
  displayProcessingList(processingList);
}

// Function to calculate expiry date based on donation date and component type
function calculateExpiryDate(donationDate, componentType) {
  const shelfLifeMap = {
    'Whole Blood': 35, // Days
    'Red Blood Cells': 42, // Days
    'Platelets': 7, // Days
    'Plasma': 365, // Days
    'Cryoprecipitate': 365, // Days
    'Granulocytes': 1, // Day
  };

  // Convert the donation date to a Date object
  const donationDateObj = new Date(donationDate);
  // Get the shelf life for the component type
  const shelfLifeInDays = shelfLifeMap[componentType];

  // Calculate the expiry date by adding the shelf life to the donation date
  const expiryDate = new Date(donationDateObj.setDate(donationDateObj.getDate() + shelfLifeInDays));

  // Return the expiry date as a readable string
  return expiryDate.toLocaleDateString();
}

// Initialize page
window.onload = function() {
  displayUserInfo();
  displayProcessingList();

  // Event listener for logout button
  document.getElementById('logoutButton').addEventListener('click', logoutUser);
};