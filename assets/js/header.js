// Header JavaScript for the SunShine School theme

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNavigation = document.querySelector(".main-navigation");
  const body = document.querySelector("body");

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      this.classList.toggle("active");
      mainNavigation.classList.toggle("active");
    });
  }

  // Add overlay for mobile menu
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function () {
    if (mainNavigation && mainNavigation.classList.contains("active")) {
      mainNavigation.classList.remove("active");
      body.classList.remove("menu-open");
    }
  });

  // Add dropdown toggles for mobile
  const hasDropdowns = document.querySelectorAll(".has-dropdown");

  hasDropdowns.forEach(function (item) {
    // Create dropdown toggle button for mobile
    const dropdownToggle = document.createElement("span");
    dropdownToggle.className = "dropdown-toggle d-lg-none";
    dropdownToggle.innerHTML = '<i class="fas fa-plus"></i>';
    item.appendChild(dropdownToggle);

    // Toggle dropdown on mobile
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const dropdown = item.querySelector(".dropdown-menu");

      if (dropdown) {
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";

        // Toggle plus/minus icon
        const icon = this.querySelector("i");
        if (icon.classList.contains("fa-plus")) {
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        } else {
          icon.classList.remove("fa-minus");
          icon.classList.add("fa-plus");
        }
      }
    });
  });

  // Handle window resize for header responsiveness
  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) {
      // Reset mobile menu styles when window is resized to desktop
      if (mainNavigation && mainNavigation.classList.contains("active")) {
        mainNavigation.classList.remove("active");
        body.classList.remove("menu-open");
      }

      // Reset all dropdown menus
      document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
        menu.style.display = "";
      });

      // Reset all toggle icons
      document.querySelectorAll(".dropdown-toggle i").forEach(function (icon) {
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
      });
    }
  });

  // Fix dropdown functionality
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Dropdown script loaded");

    // Fix dropdown functionality
    const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");
    console.log("Found dropdown items:", dropdownItems.length);

    dropdownItems.forEach(function (item, index) {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown-menu");

      console.log("Processing dropdown item", index, dropdown);

      // Prevent default click behavior on dropdown parent links
      if (link && dropdown) {
        link.addEventListener("click", function (e) {
          console.log("Dropdown link clicked, preventing default");
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }

      // Force show dropdown on hover
      item.addEventListener("mouseenter", function () {
        console.log("Mouse entered dropdown item");
        if (dropdown) {
          // Force show immediately
          dropdown.style.display = "block";
          dropdown.style.opacity = "1";
          dropdown.style.visibility = "visible";
          dropdown.style.transform = "translateY(0)";
          dropdown.style.zIndex = "999999";
          dropdown.style.position = "absolute";
          dropdown.style.top = "100%";
          dropdown.style.left = "0";
        }
      });

      item.addEventListener("mouseleave", function () {
        console.log("Mouse left dropdown item");
        if (dropdown) {
          setTimeout(() => {
            dropdown.style.display = "none";
            dropdown.style.opacity = "0";
            dropdown.style.visibility = "hidden";
          }, 100);
        }
      });

      // Also handle dropdown hover to prevent it from closing
      if (dropdown) {
        dropdown.addEventListener("mouseenter", function () {
          dropdown.style.display = "block";
          dropdown.style.opacity = "1";
          dropdown.style.visibility = "visible";
          dropdown.style.transform = "translateY(0)";
        });
      }
    });

    // Additional fallback - force hover states
    setTimeout(() => {
      const style = document.createElement("style");
      style.innerHTML = `
        .nav-item.has-dropdown:hover .dropdown-menu {
          display: block !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: translateY(0) !important;
          z-index: 999999 !important;
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }, 100);
  });
});
