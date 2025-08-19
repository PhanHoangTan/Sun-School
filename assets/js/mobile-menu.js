// Mobile Menu functionality - FIXED VERSION
document.addEventListener("DOMContentLoaded", mobileMenuInit);
window.addEventListener("load", mobileMenuInit);

// Apply critical CSS early to prevent menu jumping
(function () {
  // Pre-apply fixed styles immediately when script runs
  function applyEarlyStyles() {
    // iPad Pro needs special handling
    if (isIPadBasic()) {
      // Get menu elements
      var allMenus = document.querySelectorAll(
        ".main-navigation, .main-navigation.d-none.d-lg-flex"
      );

      // Apply fixed styling to all navigation elements
      allMenus.forEach(function (menu) {
        if (menu) {
          menu.style.display = "flex";
          menu.style.position = "static";
          menu.style.top = "auto";
          menu.style.left = "auto";
          menu.style.width = "100%";
          menu.style.maxWidth = "100%";
          menu.style.height = "auto";
          menu.style.minHeight = "50px";
          menu.style.transform = "none";
          menu.style.opacity = "1";
          menu.style.visibility = "visible";
          menu.style.transition = "none";
          menu.style.animation = "none";
          menu.style.backgroundColor = "transparent";
          menu.style.border = "none";
          menu.style.boxShadow = "none";
          menu.style.justifyContent = "flex-end";
          menu.style.alignItems = "center";

          // Also fix the menu container
          var mainMenu = menu.querySelector(".main-menu");
          if (mainMenu) {
            mainMenu.style.display = "flex";
            mainMenu.style.flexDirection = "row";
            mainMenu.style.justifyContent = "flex-end";
            mainMenu.style.width = "100%";
            mainMenu.style.margin = "0";
            mainMenu.style.padding = "0";
          }
        }
      });
    }
  }

  // Basic check if device is iPad - simplified for early execution
  function isIPadBasic() {
    var userAgent = navigator.userAgent.toLowerCase();
    return (
      /ipad/.test(userAgent) ||
      (/macintosh/.test(userAgent) && "ontouchend" in document) ||
      (window.innerWidth >= 768 &&
        window.innerWidth <= 1366 &&
        navigator.maxTouchPoints > 1)
    );
  }

  // Run immediately
  applyEarlyStyles();

  // Run again when DOM starts loading
  if (document.readyState === "loading") {
    document.addEventListener("readystatechange", function () {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        applyEarlyStyles();
      }
    });
  }

  // Run again when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", applyEarlyStyles);

  // Run once more after everything is loaded
  window.addEventListener("load", applyEarlyStyles);
})();

// Fix navigation jumping during page transitions
(function () {
  // Pre-set navigation styles before page fully loads to prevent flicker
  var preInitNav = function () {
    if (isIPad()) {
      var mainNav = document.querySelector(".main-navigation");
      if (mainNav) {
        // Immediately set styles
        mainNav.style.position = "relative";
        mainNav.style.top = "0";
        mainNav.style.left = "0";
        mainNav.style.width = "100%";
        mainNav.style.maxWidth = "100%";
      }
    }
  };

  // Run immediately
  preInitNav();

  // Run as soon as DOM is partially available
  if (document.readyState === "loading") {
    document.addEventListener("readystatechange", function () {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        preInitNav();
      }
    });
  }
})();

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
              submenu.style.position = "static";
              submenu.style.width = "100%";
              submenu.style.float = "none";
              submenu.style.clear = "both";
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
              // Smooth page transition
              document.body.classList.add("page-transitioning");

              // Set a delay to prevent visual jank during navigation
              setTimeout(function () {
                window.location.href = originalHref;
              }, 10);
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
              // Đảm bảo hiển thị đúng cho dropdown menu
              submenu.style.position = "static";
              submenu.style.width = "100%";
              submenu.style.float = "none";
              submenu.style.clear = "both";
              submenu.style.boxShadow = "none";
              submenu.style.border = "none";
              submenu.style.borderRadius = "0";
              submenu.style.margin = "0";
              submenu.style.padding = "0";
              submenu.style.backgroundColor = "#f9f9f9";

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
    // iPad Pro - không đặt vị trí để tránh bị nhảy, giữ nguyên như desktop
    // Không set các thuộc tính top, left, width vì đã xử lý bằng CSS
    mainNav.style.position = "static";
    mainNav.style.top = "auto";
    mainNav.style.left = "auto";
    mainNav.style.width = "100%";
    mainNav.style.maxWidth = "100%";
    mainNav.style.maxHeight = "none";
    mainNav.style.overflowY = "visible";
  } else if (window.innerWidth >= 768 && window.innerWidth <= 991) {
    // iPad - full width
    mainNav.style.top = "100px";
    mainNav.style.width = "100%";
    mainNav.style.minWidth = "100%";
    mainNav.style.maxWidth = "100%";
    mainNav.style.left = "0";
    mainNav.style.right = "0";
  } else if (window.innerWidth >= 576 && window.innerWidth < 768) {
    // Large mobile - full width
    mainNav.style.top = "90px";
    mainNav.style.width = "100%";
    mainNav.style.minWidth = "100%";
    mainNav.style.maxWidth = "100%";
    mainNav.style.left = "0";
    mainNav.style.right = "0";
  } else if (window.innerWidth < 576) {
    // Small mobile - full width
    mainNav.style.top = "110px";
    mainNav.style.width = "100%";
    mainNav.style.minWidth = "100%";
    mainNav.style.maxWidth = "100%";
    mainNav.style.left = "0";
    mainNav.style.right = "0";
  }

  // Đảm bảo menu dropdown hiển thị đúng
  if (window.innerWidth <= 991) {
    // Đảm bảo tất cả các dropdown menu không sử dụng absolute positioning
    const allDropdownMenus = document.querySelectorAll(".dropdown-menu");
    allDropdownMenus.forEach(function (menu) {
      menu.style.position = "static";
      menu.style.width = "100%";
      menu.style.float = "none";
      menu.style.clear = "both";
      menu.style.boxShadow = "none";
      menu.style.border = "none";
      menu.style.borderRadius = "0";
      menu.style.margin = "0";
      menu.style.padding = "0";
      menu.style.backgroundColor = "#f9f9f9";
    });

    // Đảm bảo tất cả các nav-item là block đầy đủ
    const allNavItems = document.querySelectorAll(".nav-item");
    allNavItems.forEach(function (item) {
      item.style.display = "block";
      item.style.width = "100%";
      item.style.position = "relative";
    });
  }
}

// Fix for current active state on iPad Pro
function updateActiveState() {
  // Only run for iPad Pro
  if (isIPad()) {
    // Get current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";

    // Find all nav items
    const allNavItems = document.querySelectorAll(".nav-item");

    // Remove any existing active states
    allNavItems.forEach((item) => {
      item.classList.remove("active");
    });

    // First, check exact matches
    allNavItems.forEach((item) => {
      const link = item.querySelector(".nav-link");
      if (link) {
        const href =
          link.getAttribute("href") || link.getAttribute("data-original-href");
        if (href) {
          const hrefPage = href.split("/").pop();
          if (hrefPage === currentPage) {
            item.classList.add("active");

            // If this is a child item, also activate parent
            const parentDropdown = item.closest(".dropdown-menu");
            if (parentDropdown) {
              const parentItem = parentDropdown.closest(".nav-item");
              if (parentItem) {
                parentItem.classList.add("active");
                // Show the dropdown
                parentDropdown.style.display = "block";
                // Change the icon
                const icon = parentItem.querySelector(".nav-link i.fas");
                if (icon) {
                  icon.className = "fas fa-chevron-up";
                }
              }
            }
          }
        }
      }
    });

    // Also check dropdown children
    allNavItems.forEach((item) => {
      if (item.classList.contains("has-dropdown")) {
        const submenuItems = item.querySelectorAll(".dropdown-menu a");
        submenuItems.forEach((submenuLink) => {
          const href = submenuLink.getAttribute("href");
          if (href) {
            const hrefPage = href.split("/").pop();
            if (hrefPage === currentPage) {
              item.classList.add("active");
              submenuLink.parentElement.classList.add("active");

              // Show the dropdown
              const dropdown = item.querySelector(".dropdown-menu");
              if (dropdown) {
                dropdown.style.display = "block";
              }

              // Change the icon
              const icon = item.querySelector(".nav-link i.fas");
              if (icon) {
                icon.className = "fas fa-chevron-up";
              }
            }
          }
        });
      }
    });

    // Special handling for home page
    if (currentPage === "index.html" || currentPage === "") {
      const homeItem = document.querySelector(".nav-item:first-child");
      if (homeItem) {
        homeItem.classList.add("active");
      }
    }
  }
}

// Run on resize to handle orientation changes
window.addEventListener("resize", function () {
  if (window.innerWidth <= 1366 || isIPad()) {
    // Ensure menu is properly initialized on resize
    mobileMenuInit();

    // Also apply device-specific styles
    applyDeviceSpecificStyles();

    // Update active state for iPad Pro
    if (isIPad()) {
      updateActiveState();
    }
  }
});

// Also call on page load and resize
window.addEventListener("load", updateActiveState);
window.addEventListener("resize", function () {
  if (isIPad()) {
    updateActiveState();
  }
});

// Make sure dropdown menu doesn't overlay other menu items
function fixMobileDropdowns() {
  if (window.innerWidth <= 991) {
    // Đảm bảo container chính luôn full width
    const mainNavigation = document.querySelector(".main-navigation.current");
    if (mainNavigation) {
      mainNavigation.style.position = "absolute";
      mainNavigation.style.width = "100%";
      mainNavigation.style.minWidth = "100%";
      mainNavigation.style.maxWidth = "100%";
      mainNavigation.style.left = "0";
      mainNavigation.style.right = "0";
      mainNavigation.style.borderLeft = "none";
      mainNavigation.style.borderRight = "none";
      mainNavigation.style.borderRadius = "0";
      mainNavigation.style.margin = "0";
      mainNavigation.style.padding = "0";
      mainNavigation.style.boxSizing = "border-box";

      // Đặt top dựa vào kích thước màn hình
      if (window.innerWidth >= 768) {
        mainNavigation.style.top = "100px";
      } else if (window.innerWidth >= 576) {
        mainNavigation.style.top = "90px";
      } else {
        mainNavigation.style.top = "110px";
      }
    }

    // Đảm bảo menu chính sử dụng flexbox với direction là column
    const mainMenu = document.querySelector(".main-navigation .main-menu");
    if (mainMenu) {
      mainMenu.style.display = "flex";
      mainMenu.style.flexDirection = "column";
      mainMenu.style.width = "100%";
      mainMenu.style.margin = "0";
      mainMenu.style.padding = "0";
      mainMenu.style.boxSizing = "border-box";
    }

    // Đảm bảo tất cả các nav-item là block và chiếm toàn bộ chiều rộng
    const navItems = document.querySelectorAll(".main-navigation .nav-item");
    navItems.forEach(function (item) {
      item.style.display = "block";
      item.style.width = "100%";
      item.style.maxWidth = "100%";
      item.style.position = "relative";
      item.style.float = "none";
      item.style.clear = "both";
      item.style.margin = "0";
      item.style.padding = "0";
      item.style.boxSizing = "border-box";
    });

    // Đảm bảo tất cả các dropdown menu không sử dụng absolute positioning
    const dropdownMenus = document.querySelectorAll(
      ".main-navigation .dropdown-menu"
    );
    dropdownMenus.forEach(function (menu) {
      menu.style.position = "static";
      menu.style.width = "100%";
      menu.style.maxWidth = "100%";
      menu.style.float = "none";
      menu.style.clear = "both";
      menu.style.boxShadow = "none";
      menu.style.border = "none";
      menu.style.borderRadius = "0";
      menu.style.margin = "0";
      menu.style.padding = "0";
      menu.style.boxSizing = "border-box";
      menu.style.backgroundColor = "#f9f9f9";
    });

    // Đảm bảo các dropdown đang mở hiển thị đúng
    const activeDropdowns = document.querySelectorAll(
      ".nav-item.has-dropdown.active"
    );
    activeDropdowns.forEach(function (item) {
      const submenu = item.querySelector(".dropdown-menu");
      if (submenu) {
        submenu.style.display = "block";
        submenu.style.position = "static";
        submenu.style.width = "100%";
        submenu.style.maxWidth = "100%";
        submenu.style.float = "none";
        submenu.style.clear = "both";
      }
    });

    // Đảm bảo tất cả các link trong menu có width 100%
    const navLinks = document.querySelectorAll(
      ".main-navigation .nav-link, .main-navigation .dropdown-menu a"
    );
    navLinks.forEach(function (link) {
      link.style.display = "block";
      link.style.width = "100%";
      link.style.boxSizing = "border-box";
    });
  }
}

// Run fixMobileDropdowns on page load and resize
window.addEventListener("load", fixMobileDropdowns);
window.addEventListener("resize", fixMobileDropdowns);

// Also run when menu is toggled
document.addEventListener("click", function (e) {
  if (
    e.target.closest(".nav-item.has-dropdown") ||
    e.target.closest(".menu-toggle")
  ) {
    // Slight delay to ensure the menu is fully toggled before fixing
    setTimeout(fixMobileDropdowns, 10);
  }
});
