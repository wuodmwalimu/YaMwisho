// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');
  const userProfileBtn = document.getElementById('user-profile-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Ensure all dropdowns are hidden at the start
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.style.display = 'none';
    menu.style.opacity = '0';
    menu.style.transform = 'translateY(-10px)';
    menu.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  });

  // Handle dropdown toggling
  dropdowns.forEach((dropdown) => {
    const dropdownBtn = dropdown.querySelector('.dropdown-btn');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');

    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default anchor behavior
      event.stopPropagation(); // Prevent triggering the document click event
      toggleDropdown(dropdownMenu);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target)) {
        closeDropdown(dropdownMenu);
      }
    });

    // Handle keyboard accessibility
    dropdownBtn.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleDropdown(dropdownMenu);
      } else if (event.key === 'Escape') {
        closeDropdown(dropdownMenu);
      }
    });
  });

  // Handle user profile button click
  if (userProfileBtn) {
    userProfileBtn.addEventListener('click', () => {
      alert('User Profile button clicked! Implement specific functionality here.');
    });
  }

  // Logout function
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      const username = localStorage.getItem('username') || 'User';

      // Display interactive goodbye message
      const goodbyeMessage = document.createElement('div');
      goodbyeMessage.innerText = `Goodbye, ${username}! Logging out...`;
      goodbyeMessage.style.position = 'fixed';
      goodbyeMessage.style.top = '50%';
      goodbyeMessage.style.left = '50%';
      goodbyeMessage.style.transform = 'translate(-50%, -50%)';
      goodbyeMessage.style.background = 'rgba(0, 0, 0, 0.8)';
      goodbyeMessage.style.color = 'white';
      goodbyeMessage.style.padding = '20px';
      goodbyeMessage.style.borderRadius = '5px';
      goodbyeMessage.style.fontSize = '18px';
      goodbyeMessage.style.zIndex = '1000';
      document.body.appendChild(goodbyeMessage);

      // Clear user session and redirect after a short delay
      setTimeout(() => {
        localStorage.removeItem('username'); // Clear stored username
        localStorage.removeItem('userSession'); // Remove session data if any
        window.location.href = 'index.html'; // Redirect to login page
      }, 2000); // 2-second delay for smooth experience
    });
  }

  // Function to toggle dropdown visibility
  function toggleDropdown(dropdownMenu) {
    if (dropdownMenu.style.display === 'block') {
      closeDropdown(dropdownMenu);
    } else {
      openDropdown(dropdownMenu);
    }
  }

  // Function to open a dropdown
  function openDropdown(dropdownMenu) {
    dropdownMenu.style.display = 'block';
    setTimeout(() => {
      dropdownMenu.style.opacity = '1';
      dropdownMenu.style.transform = 'translateY(0)';
    }, 10);
  }

  // Function to close a dropdown
  function closeDropdown(dropdownMenu) {
    dropdownMenu.style.opacity = '0';
    dropdownMenu.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      dropdownMenu.style.display = 'none';
    }, 200); // Match this duration with the CSS transition
  }
});