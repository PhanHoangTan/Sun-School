// Main JavaScript for the SunShine School theme

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

  // Handle window resize
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

  // Create a placeholder logo if the image doesn't load
  const logoImg = document.querySelector(".logo img");
  if (logoImg) {
    logoImg.onerror = function () {
      const logoContainer = document.querySelector(".logo");
      if (logoContainer) {
        logoContainer.innerHTML =
          '<h1 style="color: #f57f17; font-size: 24px; font-weight: bold"><span style="color: #ffb500">Sun</span><span style="color: #ff5252">Shine</span> School</h1>';
      }
    };
  }

  // Initialize Swiper Sliders
  var homeSlider = new Swiper(".home-slider", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".home-slider .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".home-slider .swiper-button-next",
      prevEl: ".home-slider .swiper-button-prev",
    },
  });

  // Parent Testimonials Slider
  var testimonialSlider = new Swiper(".people_say", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".heading-nav-container .swiper-button-next",
      prevEl: ".heading-nav-container .swiper-button-prev",
    },
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      body.classList.contains("menu-open") &&
      !e.target.closest(".main-navigation") &&
      !e.target.closest(".menu-toggle")
    ) {
      body.classList.remove("menu-open");
      mainNavigation.classList.remove("active");
    }
  });

  // Dropdown Menu for Mobile
  const hasDropdown = document.querySelectorAll(".has-dropdown");

  if (window.innerWidth < 992) {
    hasDropdown.forEach(function (item) {
      const link = item.querySelector(".nav-link");
      const dropdown = item.querySelector(".dropdown-menu");

      if (link && dropdown) {
        link.addEventListener("click", function (e) {
          if (window.innerWidth < 992) {
            e.preventDefault();
            dropdown.style.display =
              dropdown.style.display === "block" ? "none" : "block";
          }
        });
      }
    });
  }
});
