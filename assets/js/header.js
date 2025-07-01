// Header JavaScript for the SunShine School theme

document.addEventListener("DOMContentLoaded", function () {
  // Load header component
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    fetch("./forms/components/header.html")
      .then((response) => response.text())
      .then((data) => {
        headerContainer.innerHTML = data;

        // Initialize mobile menu after header is loaded
        initMobileMenu();

        // Set active class based on current page
        setTimeout(() => {
          setActiveMenuItem();
        }, 100);
      })
      .catch((error) => {
        console.error("Error loading header component:", error);
      });
  }

  function initMobileMenu() {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle");
    const mainNavigation = document.querySelector(".main-navigation");
    const body = document.querySelector("body");

    if (menuToggle) {
      menuToggle.addEventListener("click", function (e) {
        e.preventDefault();
        this.classList.toggle("active");
        mainNavigation.classList.toggle("active");
        body.classList.toggle("menu-open");
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
        if (menuToggle) {
          menuToggle.classList.remove("active");
        }
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

    // Fix dropdown functionality
    const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");

    dropdownItems.forEach(function (item) {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown-menu");

      // Prevent default click behavior on dropdown parent links
      if (link && dropdown) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        });
      }

      // Force show dropdown on hover
      item.addEventListener("mouseenter", function () {
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
        if (dropdown) {
          setTimeout(() => {
            dropdown.style.opacity = "0";
            dropdown.style.visibility = "hidden";
            dropdown.style.transform = "translateY(-10px)";
            setTimeout(() => {
              dropdown.style.display = "none";
            }, 300);
          }, 100);
        }
      });
    });
  }

  function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll(".main-menu .nav-item");

    // Remove active class from all items
    menuItems.forEach((item) => item.classList.remove("active"));

    // Set active class based on path
    if (currentPath.endsWith("/") || currentPath.includes("index.html")) {
      // Home page
      const homeItem = document.querySelector(
        ".main-menu .nav-item:first-child"
      );
      if (homeItem) homeItem.classList.add("active");
    } else if (currentPath.includes("GioiThieu.html")) {
      // About page
      const aboutItem = document.querySelector(
        ".main-menu .nav-item:nth-child(6)"
      );
      if (aboutItem) aboutItem.classList.add("active");
    } else if (currentPath.includes("TinTuc.html")) {
      // News page
      const newsItem = document.querySelector(
        ".main-menu .nav-item:nth-child(5)"
      );
      if (newsItem) newsItem.classList.add("active");
    } else {
      // Handle other pages based on path
      menuItems.forEach((item) => {
        const link = item.querySelector(".nav-link");
        if (
          link &&
          link.getAttribute("href") &&
          currentPath.includes(link.getAttribute("href"))
        ) {
          item.classList.add("active");
        }
      });
    }
  }

  // Handle window resize for header responsiveness
  window.addEventListener("resize", function () {
    const mainNavigation = document.querySelector(".main-navigation");
    const body = document.querySelector("body");

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

  // Add hover style for better dropdown functionality
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
});
