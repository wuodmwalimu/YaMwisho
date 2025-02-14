// Function to count the total number of approved donations
const countApprovedDonations = () => {
  const approvedBlood = JSON.parse(localStorage.getItem('approvedBlood')) || [];
  const approvedCount = approvedBlood.length;
  console.log(`Total Approved Donations: ${approvedCount}`);
  return approvedCount;
};

// Example usage: Call this function whenever needed
document.addEventListener('DOMContentLoaded', () => {
  const totalApproved = countApprovedDonations();

  // Dynamically update the total approved donations in the #total-approved-donations span
  const totalApprovedDonationsElement = document.querySelector('#total-approved-donations');
  if (totalApprovedDonationsElement) {
    totalApprovedDonationsElement.textContent = totalApproved;
  }
});