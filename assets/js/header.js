// Header JavaScript for the SunShine School theme

document.addEventListener("DOMContentLoaded", function () {
  // Load header component
  const headerContainer = document.getElementById("header-container");
  if (headerContainer) {
    // Prevent FOUC (Flash of Unstyled Content) before header loads
    headerContainer.style.opacity = "0";

    fetch("./forms/components/header.html")
      .then((response) => response.text())
      .then((data) => {
        headerContainer.innerHTML = data;

        // Initialize mobile menu after header is loaded
        initMobileMenu();

        // Set active class based on current page
        setTimeout(() => {
          setActiveMenuItem();

          // Add click event listeners for immediate visual feedback
          addMenuClickHandlers();

          // Smoothly fade in the header once everything is initialized
          headerContainer.style.transition = "opacity 0.3s ease";
          headerContainer.style.opacity = "1";

          // Dispatch an event to notify that the header has been loaded
          window.dispatchEvent(new CustomEvent("headerLoaded"));
        }, 100);
      })
      .catch((error) => {
        console.error("Error loading header component:", error);
        // Show header even if there was an error
        headerContainer.style.opacity = "1";
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
    const currentPage = currentPath.split("/").pop() || "index.html";
    const menuItems = document.querySelectorAll(".main-menu .nav-item");

    // Debug: Log current page for testing
    console.log("=== ACTIVE MENU DEBUG ===");
    console.log("Current page:", currentPage);
    console.log("Current path:", currentPath);
    console.log("Found menu items:", menuItems.length);

    // Remove active class from all items
    menuItems.forEach((item) => item.classList.remove("active"));

    // Set active class based on current page
    if (
      currentPath.endsWith("/") ||
      currentPath.includes("index.html") ||
      currentPage === "index.html" ||
      currentPage === ""
    ) {
      // Home page
      console.log("Activating HOME");
      const homeItem = document.querySelector(
        ".main-menu .nav-item:first-child"
      );
      if (homeItem) homeItem.classList.add("active");
    } else if (currentPage.includes("SanPham.html")) {
      // Products page
      console.log("Activating PRODUCTS");
      const productItem = document.querySelector(
        ".main-menu .nav-item:nth-child(2)"
      );
      if (productItem) productItem.classList.add("active");
    } else if (
      currentPage.includes("ChuongTrinhGiaoDuc.html") ||
      currentPage.includes("GiaTriChoBe.html")
    ) {
      // Education program or Values for children (both under Chương trình giáo dục)
      console.log("Activating EDUCATION PROGRAM");
      const educationItem = document.querySelector(
        ".main-menu .nav-item:nth-child(3)"
      );
      if (educationItem) {
        educationItem.classList.add("active");
        console.log("Education item activated successfully");

        // Also highlight any sub-menu items if they match
        const subLinks = educationItem.querySelectorAll(".dropdown-menu a");
        subLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (
            href &&
            (href.includes(currentPage) ||
              currentPage.includes(href.replace("./", "")))
          ) {
            link.style.backgroundColor = "#ff8c00";
            link.style.color = "white";
          }
        });
      } else {
        console.log("Education item NOT found");
      }
    } else if (
      currentPage.includes("ChuongTrinhHoc.html") ||
      currentPage.includes("HocPhi.html") ||
      currentPage.includes("ThucDon.html")
    ) {
      // Admission, Tuition, or Menu (all under Tuyển sinh)
      console.log("Activating ADMISSION");
      const admissionItem = document.querySelector(
        ".main-menu .nav-item:nth-child(4)"
      );
      if (admissionItem) {
        admissionItem.classList.add("active");

        // Also highlight any sub-menu items if they match
        const subLinks = admissionItem.querySelectorAll(".dropdown-menu a");
        subLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (
            href &&
            (href.includes(currentPage) ||
              currentPage.includes(href.replace("./", "")))
          ) {
            link.style.backgroundColor = "#ff8c00";
            link.style.color = "white";
          }
        });
      }
    } else if (currentPath.includes("TinTuc.html")) {
      // News page
      console.log("Activating NEWS");
      const newsItem = document.querySelector(
        ".main-menu .nav-item:nth-child(5)"
      );
      if (newsItem) newsItem.classList.add("active");
    } else if (
      currentPath.includes("GioiThieu.html") ||
      currentPath.includes("CoSoVatChat.html")
    ) {
      // About page or Facilities page (both under Giới thiệu)
      console.log("Activating ABOUT");
      const aboutItem = document.querySelector(
        ".main-menu .nav-item:nth-child(6)"
      );
      if (aboutItem) {
        aboutItem.classList.add("active");

        // Also highlight any sub-menu items if they match
        const subLinks = aboutItem.querySelectorAll(".dropdown-menu a");
        subLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (
            href &&
            (href.includes(currentPage) ||
              currentPage.includes(href.replace("./", "")))
          ) {
            link.style.backgroundColor = "#ff8c00";
            link.style.color = "white";
          }
        });
      }
    } else {
      // Fallback: Handle other pages based on href matching
      menuItems.forEach((item) => {
        const link = item.querySelector(".nav-link");
        if (link && link.getAttribute("href")) {
          const href = link.getAttribute("href").replace("./", "");
          if (href === currentPage || currentPath.includes(href)) {
            item.classList.add("active");
          }
        }
      });
    }

    // Special handling for query parameters (like SanPham.html?category=...)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("category") && currentPage === "SanPham.html") {
      const productItem = document.querySelector(
        ".main-menu .nav-item:nth-child(2)"
      );
      if (productItem) productItem.classList.add("active");
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

  // Ensure dropdowns are always on top
  const dropdowns = document.querySelectorAll(".dropdown-menu");

  // Add event listeners for dropdown hover
  const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");

  dropdownItems.forEach((item) => {
    // Force dropdown to be on top when hovered
    item.addEventListener("mouseenter", function () {
      const dropdown = this.querySelector(".dropdown-menu");
      if (dropdown) {
        // Ensure the dropdown is displayed on top
        dropdown.style.zIndex = "9999";
        dropdown.style.display = "block";
        dropdown.style.opacity = "1";
        dropdown.style.visibility = "visible";
        dropdown.style.transform = "translateY(0)";
      }
    });

    // Handle mouse leave
    item.addEventListener("mouseleave", function () {
      const dropdown = this.querySelector(".dropdown-menu");
      if (dropdown) {
        // Hide the dropdown with a slight delay for better UX
        setTimeout(() => {
          if (!item.matches(":hover")) {
            dropdown.style.display = "none";
            dropdown.style.opacity = "0";
            dropdown.style.visibility = "hidden";
            dropdown.style.transform = "translateY(-10px)";
          }
        }, 100);
      }
    });
  });

  // Fix any z-index issues with other elements that might be overlapping
  function ensureProperZIndex() {
    // Make sure header has high z-index
    const header = document.querySelector(".header");
    if (header) {
      header.style.zIndex = "1000";
    }

    // Ensure dropdowns have highest z-index
    dropdowns.forEach((dropdown) => {
      dropdown.style.zIndex = "9999";
    });
  }

  // Run on page load and on resize
  ensureProperZIndex();
  window.addEventListener("resize", ensureProperZIndex);

  // Add click event listeners to menu items for immediate visual feedback
  function addMenuClickHandlers() {
    const menuLinks = document.querySelectorAll(".main-menu .nav-link");
    menuLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        // Remove active class from all menu items
        const menuItems = document.querySelectorAll(".main-menu .nav-item");
        menuItems.forEach((item) => item.classList.remove("active"));

        // Add active class to clicked item
        const parentItem = this.closest(".nav-item");
        if (parentItem) {
          parentItem.classList.add("active");
          console.log(
            "Menu clicked, setting active for:",
            this.textContent.trim()
          );
        }
      });
    });
  }

  // Manual test function for debugging
  window.testEducationActive = function () {
    const educationItem = document.querySelector(
      ".main-menu .nav-item:nth-child(3)"
    );
    if (educationItem) {
      document
        .querySelectorAll(".main-menu .nav-item")
        .forEach((item) => item.classList.remove("active"));
      educationItem.classList.add("active");
      console.log("Manual test: Education item activated");
    } else {
      console.log("Manual test: Education item not found");
    }
  };

  // Force refresh active state
  window.refreshActiveMenu = function () {
    console.log("=== FORCE REFRESH ACTIVE MENU ===");
    setTimeout(() => {
      setActiveMenuItem();
    }, 100);
  };

  // Auto refresh when DOM changes
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Check if header content was added
        const hasHeader = document.querySelector(".main-menu");
        if (hasHeader && !hasHeader.dataset.activeSet) {
          console.log("Header detected, setting active menu...");
          hasHeader.dataset.activeSet = "true";
          setTimeout(setActiveMenuItem, 200);
        }
      }
    });
  });

  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
