// Mobile Menu functionality - FIXED VERSION
document.addEventListener("DOMContentLoaded", mobileMenuInit);
window.addEventListener("load", mobileMenuInit);

function mobileMenuInit() {
  console.log("Mobile menu fixed script loaded");

  // 1. HAMBURGER MENU TOGGLE
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    // Remove any existing click listeners
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

    // Add new click handler
    newMenuToggle.addEventListener("click", function (e) {
      e.preventDefault();
      const mainNav = document.querySelector(".main-navigation");
      if (mainNav) {
        mainNav.classList.toggle("current");
        mainNav.style.display = mainNav.classList.contains("current")
          ? "block"
          : "none";
      }
    });
  }

  // Apply to all devices with dropdown menu issues (including iPad Pro)
  // Instead of just checking window.innerWidth <= 991
  if (window.innerWidth <= 1366 || isIPad()) {
    // Close any open dropdowns first to avoid conflicts
    resetAllDropdowns();

    // Find all dropdown links
    const allDropdownLinks = document.querySelectorAll(
      ".nav-item.has-dropdown > .nav-link"
    );
    console.log("Found dropdown links:", allDropdownLinks.length);

    // Replace all icons with chevron-down
    allDropdownLinks.forEach(function (link) {
      // Remove the original link's href to prevent immediate navigation on first click
      const originalHref = link.getAttribute("href");
      link.setAttribute("data-original-href", originalHref);

      // Clone and replace to remove existing event handlers
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

      // For iPad Pro, we need to remove the href attribute to prevent navigation on first click
      if (isIPad()) {
        newLink.removeAttribute("href");
      }

      // Find existing icons and replace them
      let icon = newLink.querySelector("i.fas");

      // Remove any existing icon
      if (icon) {
        icon.remove();
      }

      // Create new chevron-down icon
      icon = document.createElement("i");
      icon.className = "fas fa-chevron-down";
      newLink.appendChild(icon);

      // Style the icon
      icon.style.position = "absolute";
      icon.style.right = "15px";
      icon.style.top = "50%";
      icon.style.transform = "translateY(-50%)";
      icon.style.fontSize = "12px";
      icon.style.color = "#f6903d";

      // Style the link
      newLink.style.position = "relative";
      newLink.style.paddingRight = "30px";

      // Initially hide the dropdown
      const parentItem = newLink.parentNode;
      const submenu = parentItem.querySelector(".dropdown-menu");
      if (submenu) {
        submenu.style.display = "none";
      }

      // Store a click counter to handle iPad double-click behavior
      let clickCount = 0;

      // Add click handler
      newLink.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const parent = this.parentNode;
        const submenu = parent.querySelector(".dropdown-menu");
        const icon = this.querySelector("i.fas");

        // For iPad Pro, we need special handling
        if (isIPad()) {
          clickCount++;

          // First click: open submenu
          if (clickCount === 1) {
            // Close any other open dropdown first
            const allDropdowns = document.querySelectorAll(
              ".nav-item.has-dropdown"
            );
            allDropdowns.forEach(function (item) {
              if (item !== parent && item.classList.contains("active")) {
                item.classList.remove("active");
                const itemSubmenu = item.querySelector(".dropdown-menu");
                if (itemSubmenu) {
                  itemSubmenu.style.display = "none";
                }
                const itemIcon = item.querySelector(".nav-link i.fas");
                if (itemIcon) {
                  itemIcon.className = "fas fa-chevron-down";
                  itemIcon.style.transform = "translateY(-50%)";
                }
              }
            });

            // Open current dropdown
            if (submenu) {
              submenu.style.display = "block";
              parent.classList.add("active");
              if (icon) icon.className = "fas fa-chevron-up";
              icon.style.transform = "translateY(-50%)";
            }

            // Reset clickCount after 500ms if no second click
            setTimeout(() => {
              clickCount = 0;
            }, 500);

            return false;
          }
          // Second click: navigate to href
          else if (clickCount === 2) {
            clickCount = 0;
            const originalHref = this.getAttribute("data-original-href");
            if (originalHref) {
              window.location.href = originalHref;
            }
            return true;
          }
        }
        // Normal mobile handling
        else {
          // Close any other open dropdown first
          const allDropdowns = document.querySelectorAll(
            ".nav-item.has-dropdown"
          );
          allDropdowns.forEach(function (item) {
            if (item !== parent && item.classList.contains("active")) {
              item.classList.remove("active");
              const itemSubmenu = item.querySelector(".dropdown-menu");
              if (itemSubmenu) {
                itemSubmenu.style.display = "none";
              }
              const itemIcon = item.querySelector(".nav-link i.fas");
              if (itemIcon) {
                itemIcon.className = "fas fa-chevron-down";
                itemIcon.style.transform = "translateY(-50%)";
              }
            }
          });

          // Toggle active state
          if (submenu) {
            if (submenu.style.display === "block") {
              submenu.style.display = "none";
              parent.classList.remove("active");
              if (icon) icon.className = "fas fa-chevron-down";
              icon.style.transform = "translateY(-50%)";
            } else {
              submenu.style.display = "block";
              parent.classList.add("active");
              if (icon) icon.className = "fas fa-chevron-up";
              icon.style.transform = "translateY(-50%)";
            }
          }
        }

        return false;
      };
    });

    // 2. CLICK OUTSIDE TO CLOSE MENU
    // Add document click event to close menu when clicking outside
    document.addEventListener("click", function (e) {
      const mainNav = document.querySelector(".main-navigation.current");
      const menuToggleBtn = document.querySelector(".menu-toggle");

      // Check if menu is open and click is outside menu
      if (
        mainNav &&
        !mainNav.contains(e.target) &&
        !menuToggleBtn.contains(e.target)
      ) {
        mainNav.classList.remove("current");
        mainNav.style.display = "none";

        // Also close any open dropdowns
        resetAllDropdowns();
      }
    });

    // Apply specific device-based positioning
    applyDeviceSpecificStyles();
  }
}

// Function to detect if the device is an iPad
function isIPad() {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    /ipad/.test(userAgent) ||
    (/macintosh/.test(userAgent) && "ontouchend" in document) ||
    (window.innerWidth >= 768 &&
      window.innerWidth <= 1366 &&
      navigator.maxTouchPoints > 1)
  );
}

// Function to reset all dropdowns to closed state
function resetAllDropdowns() {
  const allDropdowns = document.querySelectorAll(".nav-item.has-dropdown");
  allDropdowns.forEach(function (item) {
    item.classList.remove("active");
    const submenu = item.querySelector(".dropdown-menu");
    if (submenu) {
      submenu.style.display = "none";
    }
    const icon = item.querySelector(".nav-link i.fas");
    if (icon) {
      icon.className = "fas fa-chevron-down";
      icon.style.transform = "translateY(-50%)";
    }
  });
}

// Apply specific positioning based on device
function applyDeviceSpecificStyles() {
  const mainNav = document.querySelector(".main-navigation");

  if (!mainNav) return;

  if (isIPad()) {
    // iPad Pro
    mainNav.style.top = "100px";
    mainNav.style.width = "400px";
    mainNav.style.left = "20px";
    mainNav.style.maxHeight = "80vh";
    mainNav.style.overflowY = "auto";
  } else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
    // iPad
    mainNav.style.top = "100px";
    mainNav.style.width = "320px";
    mainNav.style.left = "20px";
  } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
    // Large mobile
    mainNav.style.top = "90px";
    mainNav.style.width = "90%";
    mainNav.style.left = "5%";
  } else if (window.innerWidth < 576) {
    // Small mobile
    mainNav.style.top = "110px";
    mainNav.style.width = "90%";
    mainNav.style.left = "5%";
  }
}

// Run on resize to handle orientation changes
window.addEventListener("resize", function () {
  if (window.innerWidth <= 1366 || isIPad()) {
    // Ensure menu is properly initialized on resize
    mobileMenuInit();

    // Also apply device-specific styles
    applyDeviceSpecificStyles();
  }
});
