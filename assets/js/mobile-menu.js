// Mobile Menu functionality
document.addEventListener("DOMContentLoaded", function () {
  // Wait for the header to be loaded
  window.addEventListener("headerLoaded", initMobileNavigation);

  // Initialize immediately if the header is already loaded
  initMobileNavigation();

  function initMobileNavigation() {
    // Mobile menu toggle button
    const menuToggle = document.querySelector(".menu-toggle");
    if (!menuToggle) return;

    // Mobile menu container
    const headerNav = document.querySelector(".header-nav");
    if (!headerNav) return;

    // Toggle mobile menu visibility when clicking the hamburger icon
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      headerNav.classList.toggle("current");
    });

    // Handle dropdown toggles
    const dropdownItems = document.querySelectorAll(".menu-item.has-dropdown");
    dropdownItems.forEach(function (item) {
      const link = item.querySelector("a");
      const icon = item.querySelector("i");

      link.addEventListener("click", function (e) {
        // Only prevent default if the click is on the icon or if submenu exists
        if (e.target === icon || item.querySelector(".submenu")) {
          e.preventDefault();
          item.classList.toggle("active");

          // Change icon from plus to minus and vice versa
          if (icon) {
            if (icon.classList.contains("fa-plus")) {
              icon.classList.remove("fa-plus");
              icon.classList.add("fa-minus");
            } else {
              icon.classList.remove("fa-minus");
              icon.classList.add("fa-plus");
            }
          }
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        headerNav.classList.contains("current") &&
        !headerNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        headerNav.classList.remove("current");
      }
    });

    // Handle window resize
    window.addEventListener("resize", function () {
      if (window.innerWidth > 991 && headerNav.classList.contains("current")) {
        headerNav.classList.remove("current");

        // Reset all dropdowns
        dropdownItems.forEach(function (item) {
          item.classList.remove("active");
          const icon = item.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-minus");
            icon.classList.add("fa-plus");
          }
        });
      }
    });
  }
});
