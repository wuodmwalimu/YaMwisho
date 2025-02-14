// Function to handle form submission
document.getElementById("bloodRequestForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Collect form data
    const recipientName = document.getElementById("recipientName").value;
    const age = document.getElementById("age").value;
    const bloodType = document.getElementById("bloodType").value;
    const units = document.getElementById("units").value;
    const gender = document.getElementById("gender").value;
    const hospital = document.getElementById("hospital").value;
    const doctor = document.getElementById("doctor").value;
    const contactHospital = document.getElementById("contactHospital").value;
    const location = document.getElementById("location").value;
    const urgency = document.getElementById("urgency").value;
    const reason = document.getElementById("reason").value;

    // Create an object to store the data
    const requestData = {
        recipientName,
        age,
        bloodType,
        units,
        gender,
        hospital,
        doctor,
        contactHospital,
        location,
        urgency,
        reason
    };

    // Get existing data from local storage
    let recentRequests = JSON.parse(localStorage.getItem("recentRequests")) || [];

    // Add the new request to the recentRequests array
    recentRequests.push(requestData);

    // Save the updated array back to localStorage
    localStorage.setItem("recentRequests", JSON.stringify(recentRequests));

    // Clear the form after submission
    document.getElementById("bloodRequestForm").reset();

    // Update the recent requests table
    displayRecentRequests();
});

// Function to display recent requests in the table
function displayRecentRequests() {
    // Get recent requests from localStorage
    let recentRequests = JSON.parse(localStorage.getItem("recentRequests")) || [];

    // Get the table body element
    const requestList = document.getElementById("requestList");

    // Clear the current list
    requestList.innerHTML = "";

    // Loop through the requests and create rows for each
    recentRequests.forEach((request, index) => {
        const row = document.createElement("tr");

        // Create table cells
        const recipientCell = document.createElement("td");
        recipientCell.textContent = request.recipientName;
        row.appendChild(recipientCell);

        const bloodTypeCell = document.createElement("td");
        bloodTypeCell.textContent = request.bloodType;
        row.appendChild(bloodTypeCell);

        const unitsCell = document.createElement("td");
        unitsCell.textContent = request.units;
        row.appendChild(unitsCell);

        // Create the actions cell with a "View" and "Deny" button
        const actionsCell = document.createElement("td");

        // "View" button
        const viewButton = document.createElement("button");
        viewButton.textContent = "View";
        viewButton.onclick = function() {
            viewRequestDetails(request);
        };
        actionsCell.appendChild(viewButton);

        // "Deny" button
        const denyButton = document.createElement("button");
        denyButton.textContent = "Deny";
        denyButton.onclick = function() {
            denyRequest(index);  // Call the denyRequest function from deny.js
        };
        actionsCell.appendChild(denyButton);

        row.appendChild(actionsCell);

        // Append the row to the table body
        requestList.appendChild(row);
    });
}

// Function to view detailed information in a popup or alert
function viewRequestDetails(request) {
    let details = `
        Recipient Name: ${request.recipientName}
        \nAge: ${request.age}
        \nBlood Type: ${request.bloodType}
        \nUnits Needed: ${request.units}
        \nGender: ${request.gender}
        \nHospital: ${request.hospital}
        \nDoctor: ${request.doctor}
        \nHospital Contact: ${request.contactHospital}
        \nLocation: ${request.location}
        \nUrgency: ${request.urgency}
        \nReason: ${request.reason}
    `;
    
    // Display the details in an alert box
    alert(details);
}

// Call the function to display recent requests when the page loads
window.onload = displayRecentRequests;
