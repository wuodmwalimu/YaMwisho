document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById("donorForm");
  const submitButton = form.querySelector('button[type="submit"]');

  const fields = {
    lastName: document.getElementById("lastName"),
    firstName: document.getElementById("firstName"),
    phone: document.getElementById("phone"),
    dob: document.getElementById("dob"),
    age: document.getElementById("age"),
    residence: document.getElementById("residence"),
    donorType: document.getElementById("donorType"),
    medicalProblems: document.querySelector('input[name="medicalProblems"]:checked'),
    medicalProblemsDetails: document.getElementById("medicalProblemsDetails"),
    pregnancy: document.querySelector('input[name="pregnancy"]:checked'),
    cancerTreatment: document.querySelector('input[name="cancerTreatment"]:checked'),
    allergies: document.querySelector('input[name="allergies"]:checked'),
    allergiesDetails: document.getElementById("allergiesDetails"),
    chronicConditions: document.querySelector('input[name="chronicConditions"]:checked'),
    chronicConditionsDetails: document.getElementById("chronicConditionsDetails"),
    recentSurgeries: document.querySelector('input[name="recentSurgeries"]:checked'),
    recentSurgeriesDetails: document.getElementById("recentSurgeriesDetails"),
    bloodDisorders: document.querySelector('input[name="bloodDisorders"]:checked'),
    bloodDisordersDetails: document.getElementById("bloodDisordersDetails"),
    currentMedications: document.querySelector('input[name="currentMedications"]:checked'),
    currentMedicationsDetails: document.getElementById("currentMedicationsDetails"),
    organTransplant: document.querySelector('input[name="organTransplant"]:checked'),
    pregnantBreastfeeding: document.querySelector('input[name="pregnantBreastfeeding"]:checked'),
    recentVaccinations: document.querySelector('input[name="recentVaccinations"]:checked'),
    recentVaccinationsDetails: document.getElementById("recentVaccinationsDetails"),
    hivHepatitis: document.querySelector('input[name="hivHepatitis"]:checked'),
    hivHepatitisDetails: document.getElementById("hivHepatitisDetails"),
    sexualContact: document.querySelector('input[name="sexualContact"]:checked'),
    illicitDrugs: document.querySelector('input[name="illicitDrugs"]:checked'),
    contagiousContact: document.querySelector('input[name="contagiousContact"]:checked'),
    previousDonation: document.querySelector('input[name="previousDonation"]:checked'),
    donationReactions: document.querySelector('input[name="donationReactions"]:checked'),
    donationReactionsDetails: document.getElementById("donationReactionsDetails"),
    currentHealthStatus: document.querySelector('input[name="currentHealthStatus"]:checked'),
    voluntaryDonation: document.querySelector('input[name="voluntaryDonation"]:checked'),
    accuracyConfirmation: document.querySelector('input[name="accuracyConfirmation"]:checked'),
    signature: document.getElementById("signatureInput"),
    dateInput: document.getElementById("dateInput"),

    // New Fields for Physical Examination
    overallObservation: document.getElementById("overall-observation"),
    bpSystolic: document.getElementById("bp-systolic"),
    bpDiastolic: document.getElementById("bp-diastolic"),
    pulse: document.getElementById("pulse"),
    respiration: document.getElementById("respiration"),
    temperature: document.getElementById("temperature"),
    heartExamination: document.getElementById("heart-examination"),
    lungExamination: document.getElementById("lung-examination"),
    overallImpression: document.getElementById("overall-impression"),
  };

  // Function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Auto-populate age when DOB is entered
  fields.dob.addEventListener('change', () => {
    if (fields.dob.value) {
      fields.age.value = calculateAge(fields.dob.value);
    }
  });

  // Validation function
  const validateForm = () => {
    if (!fields.firstName.value.trim() || !fields.lastName.value.trim()) {
      alert("First and last names are required.");
      return false;
    }
    if (!fields.dob.value || !fields.age.value) {
      alert("Date of Birth and Age are required.");
      return false;
    }
    return true;
  };

  // Save donor data to localStorage
  const saveDonorData = () => {
    const donorData = {};

    // Collect all form data
    for (const key in fields) {
      if (fields[key] && (fields[key].type === "radio" || fields[key].type === "checkbox")) {
        donorData[key] = fields[key].checked ? fields[key].value : null;
      } else {
        donorData[key] = fields[key] ? fields[key].value || null : null;
      }
    }

    // Retrieve the existing donors list or initialize it
    const donors = JSON.parse(localStorage.getItem('donors')) || [];

    // Add new donor to the list
    donors.push(donorData);

    // Save the updated list back to localStorage
    localStorage.setItem('donors', JSON.stringify(donors));
    alert("Donor details saved successfully!");
  };

  // Event listener for form submission
  submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    if (validateForm()) {
      if (confirm("Are you sure you want to save the donor details?")) {
        saveDonorData();
      }
    }
  });
});