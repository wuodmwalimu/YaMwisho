// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const recentRequestsList = document.querySelector('#recentRequestsList tbody');

  // Load recent requests on page load
  loadRecentRequests();

  // Load requests from localStorage and display them in the table
  function loadRecentRequests() {
    const requests = getFromLocalStorage('bloodRequests');
    requests.forEach((request) => addRequestToTable(request));
  }

  // Add request to the table
  function addRequestToTable(request) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.recipientName}</td>
      <td>${request.bloodType}</td>
      <td>${request.units}</td>
      <td>
        <button class="view-btn">View</button>
      </td>
    `;

    // Add event listener to the "View" button
    row.querySelector('.view-btn').addEventListener('click', () => showDetails(request));

    recentRequestsList.appendChild(row);
  }

  // Show request details in an alert
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

  // Retrieve data from localStorage
  function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
  }
});
