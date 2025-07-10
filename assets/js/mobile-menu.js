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

    // Use the existing desktop navigation for mobile view
    const mainNavigation = document.querySelector(".main-navigation");
    if (!mainNavigation) return;

    // Make the desktop navigation also available on mobile
    mainNavigation.classList.remove("d-none", "d-lg-flex");
    mainNavigation.classList.add("main-navigation-mobile");

    // Initially hide the navigation
    mainNavigation.style.display = "none";

    // Toggle mobile menu visibility when clicking the hamburger icon
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      if (mainNavigation.style.display === "none") {
        mainNavigation.style.display = "block";
        mainNavigation.classList.add("current");
      } else {
        mainNavigation.style.display = "none";
        mainNavigation.classList.remove("current");

        // Close all open dropdowns when closing the menu
        const activeItems = mainNavigation.querySelectorAll(".nav-item.active");
        activeItems.forEach(function (item) {
          item.classList.remove("active");
          const dropdown = item.querySelector(".dropdown-menu");
          if (dropdown) {
            dropdown.style.display = "none";
          }
          const icon = item.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        });
      }
    });

    // Handle dropdown toggles for the main navigation
    const dropdownItems = document.querySelectorAll(
      ".main-navigation .nav-item.has-dropdown"
    );

    dropdownItems.forEach(function (item) {
      const link = item.querySelector("a.nav-link");
      const icon = link.querySelector("i");
      const dropdown = item.querySelector(".dropdown-menu");

      // Set display property explicitly for all dropdowns
      if (dropdown) {
        dropdown.style.display = "none";
      }

      // When in mobile view, clicks should toggle the dropdown
      link.addEventListener("click", function (e) {
        if (window.innerWidth <= 991) {
          // Only for mobile
          e.preventDefault();
          e.stopPropagation();

          // Toggle dropdown visibility
          const isDisplayed = dropdown.style.display === "block";

          if (isDisplayed) {
            dropdown.style.display = "none";
            item.classList.remove("active");
            if (icon) {
              icon.classList.remove("fa-chevron-up");
              icon.classList.add("fa-chevron-down");
            }
          } else {
            dropdown.style.display = "block";
            item.classList.add("active");
            if (icon) {
              icon.classList.remove("fa-chevron-down");
              icon.classList.add("fa-chevron-up");
            }
          }
        }
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (
        mainNavigation.classList.contains("current") &&
        !mainNavigation.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mainNavigation.style.display = "none";
        mainNavigation.classList.remove("current");

        // Close all dropdowns when closing the menu by clicking outside
        dropdownItems.forEach(function (item) {
          item.classList.remove("active");
          const dropdown = item.querySelector(".dropdown-menu");
          if (dropdown) {
            dropdown.style.display = "none";
          }
          const icon = item.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        });
      }
    });

    // Handle window resize - restore proper display mode
    window.addEventListener("resize", function () {
      if (window.innerWidth > 991) {
        // Desktop view
        mainNavigation.classList.remove("current");
        mainNavigation.classList.remove("main-navigation-mobile");
        mainNavigation.classList.add("d-lg-flex");
        mainNavigation.style.display = "flex";

        // Reset all dropdowns to default desktop behavior
        dropdownItems.forEach(function (item) {
          item.classList.remove("active");
          const dropdown = item.querySelector(".dropdown-menu");
          if (dropdown) {
            dropdown.style.display = "";
          }
          const icon = item.querySelector("i");
          if (icon) {
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
          }
        });
      } else {
        // Mobile view
        if (!mainNavigation.classList.contains("current")) {
          mainNavigation.style.display = "none";
        }

        // Make sure dropdowns are hidden in mobile view
        dropdownItems.forEach(function (item) {
          if (!item.classList.contains("active")) {
            const dropdown = item.querySelector(".dropdown-menu");
            if (dropdown) {
              dropdown.style.display = "none";
            }
          }
        });
      }
    });
  }
});
