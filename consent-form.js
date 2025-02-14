// Function to handle the form submission and save consent data to local storage
document.getElementById('donorForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Retrieve form data
  const signature = document.getElementById('signatureInput').value.trim();
  const date = document.getElementById('dateInput').value;
  const voluntaryDonation = document.querySelector('input[name="voluntaryDonation"]:checked');
  const accuracyConfirmation = document.querySelector('input[name="accuracyConfirmation"]:checked');

  // Validate form data
  if (!voluntaryDonation || !accuracyConfirmation || !signature || !date) {
    alert('Please fill out all required fields.');
    return;
  }

  // Create consent object
  const consent = {
    signature: signature,
    date: date,
    voluntaryDonation: voluntaryDonation.value,
    accuracyConfirmation: accuracyConfirmation.value,
  };

  // Get consent history from localStorage
  let consentHistory = JSON.parse(localStorage.getItem('consentHistory')) || [];

  // Add new consent to the history
  consentHistory.push(consent);

  // Save the updated consent history to localStorage
  localStorage.setItem('consentHistory', JSON.stringify(consentHistory));

  // Show success message
  alert('Your consent has been successfully submitted.');

  // Optionally reset the form (if needed)
  document.getElementById('donorForm').reset();

  // Reset radio buttons
  document.querySelector('input[name="voluntaryDonation"]:checked').checked = false;
  document.querySelector('input[name="accuracyConfirmation"]:checked').checked = false;

  // Display the updated consent list
  displayConsentList();
});

// Function to display the consent list
function displayConsentList() {
  const consentList = JSON.parse(localStorage.getItem('consentHistory')) || [];

  const consentListContainer = document.getElementById('consentListItems');
  consentListContainer.innerHTML = ''; // Clear current list

  if (consentList.length === 0) {
    consentListContainer.innerHTML = '<li>No consents available.</li>';
  } else {
    consentList.forEach((consent, index) => {
      const consentItem = document.createElement('li');
      consentItem.innerHTML = `
        <strong>Consent #${index + 1}:</strong><br>
        Signature: ${consent.signature}<br>
        Date: ${consent.date}<br>
        Voluntary Donation: ${consent.voluntaryDonation}<br>
        Accuracy Confirmation: ${consent.accuracyConfirmation}
      `;
      consentListContainer.appendChild(consentItem);
    });
  }
}

// Function to show/hide consent list when the button is clicked
document.getElementById('showConsentList').addEventListener('click', function() {
  const consentListItems = document.getElementById('consentListItems');
  const currentDisplay = consentListItems.style.display;

  // Toggle visibility of the consent list
  if (currentDisplay === 'none' || currentDisplay === '') {
    consentListItems.style.display = 'block';
    document.getElementById('showConsentList').textContent = 'Hide Consent List'; // Change button text
  } else {
    consentListItems.style.display = 'none';
    document.getElementById('showConsentList').textContent = 'Show Consent List'; // Reset button text
  }
});

// Display consent list when the page loads
window.onload = function() {
  displayConsentList();
};
