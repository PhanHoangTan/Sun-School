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

  // Only apply these changes for mobile and tablet devices
  if (window.innerWidth <= 991) {
    // Find all dropdown links
    const allDropdownLinks = document.querySelectorAll(
      ".nav-item.has-dropdown > .nav-link"
    );
    console.log("Found dropdown links:", allDropdownLinks.length);

    // Replace all icons with chevron-down
    allDropdownLinks.forEach(function (link) {
      // Clone and replace to remove existing event handlers
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);

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

      // Add click handler
      newLink.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();

        const parent = this.parentNode;
        const submenu = parent.querySelector(".dropdown-menu");
        const icon = this.querySelector("i.fas");

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
      }
    });
  }
}

// Run on resize to handle orientation changes
window.addEventListener("resize", function () {
  if (window.innerWidth <= 991) {
    // Ensure menu is properly initialized on resize
    mobileMenuInit();
  }
});
