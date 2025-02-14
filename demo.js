document.addEventListener('DOMContentLoaded', () => {
  const dbName = "BloodRequestDB";
  const dbVersion = 9;
  let db;

  // Open IndexedDB
  const openDB = () => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onupgradeneeded = (event) => {
      db = event.target.result;

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('requests')) {
        db.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('deniedRequests')) {
        db.createObjectStore('deniedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('approvedRequests')) {
        db.createObjectStore('approvedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('clearedRequests')) {
        db.createObjectStore('clearedRequests', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('sumup')) {
        db.createObjectStore('sumup', { keyPath: 'id', autoIncrement: true });
      }
      if (!db.objectStoreNames.contains('malizia')) {
        db.createObjectStore('malizia', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log('Database opened successfully');
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.errorCode);
    };
  };

  // Handle form submission and save data to IndexedDB
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the form's default submission

    // Retrieve the logged-in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
      alert("You must be logged in to submit a request.");
      return;
    }

    // Retrieve form field values
    const recipientName   = document.getElementById('recipientName').value;
    const dob             = document.getElementById('dob').value;
    const age             = document.getElementById('age').value;
    const bloodType       = document.getElementById('bloodType').value;
    const units           = document.getElementById('units').value;
    const gender          = document.getElementById('gender').value;
    const hospital        = document.getElementById('hospital').value;
    const doctor          = document.getElementById('doctor').value;
    const contactHospital = document.getElementById('contactHospital').value;
    const location        = document.getElementById('location').value;
    
    // Optional fields: urgency and reason.
    // (If these elements do not exist, they will default to an empty string.)
    const urgencyElem = document.getElementById('urgency');
    const reasonElem  = document.getElementById('reason');
    const urgency = urgencyElem ? urgencyElem.value : "";
    const reason  = reasonElem  ? reasonElem.value  : "";

    // Create an object to store in IndexedDB
    const formData = {
      recipientName,
      dob,
      age,
      bloodType,
      units,
      gender,
      hospital,
      doctor,
      contactHospital,
      location,
      urgency,
      reason,
      submittedBy: loggedInUser.username, // Logged-in user's username
      userEmail: loggedInUser.email,        // Logged-in user's email
      timestamp: new Date().toISOString()
    };

    // Save to the 'requests' object store in IndexedDB
    const transaction = db.transaction('requests', 'readwrite');
    const store = transaction.objectStore('requests');
    const addRequest = store.add(formData);

    addRequest.onsuccess = () => {
      console.log('Form data saved successfully!');
    };

    transaction.oncomplete = () => {
      alert("Request submitted successfully!");
      event.target.reset(); // Optionally clear the form fields
    };

    transaction.onerror = (event) => {
      console.error('Error saving form data:', event.target.error);
    };
  };

  // Bind the form submission handler to the form element
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }

  // Open the IndexedDB database
  openDB();
});
