document.addEventListener('DOMContentLoaded', function() {
  // Select the dropdown element
  const dropdown = document.querySelector('.dropdown');
  const dropdownBtn = dropdown.querySelector('.dropdown-btn');
  const dropdownMenu = dropdown.querySelector('.dropdown-menu');

  // Toggle dropdown visibility when the button is clicked
  dropdownBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    // Toggle the 'active' class and display the menu
    dropdown.classList.toggle('active');
    dropdownMenu.style.display = dropdown.classList.contains('active') ? 'block' : 'none';
  });

  // Close the dropdown if clicked outside
  document.addEventListener('click', function(event) {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('active');
      dropdownMenu.style.display = 'none';
    }
  });
});
