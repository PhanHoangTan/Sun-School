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

          // Initialize cart dropdown functionality
          initCartDropdown();

          // Update cart count from localStorage
          updateCartCountFromStorage();

          // Generate the mobile navigation
          generateMobileNav();

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
  } else {
    // If no header container exists, still update cart count
    updateCartCountFromStorage();
  }

  // Expose updateCartCountFromStorage to global scope for cart-manager.js to use
  window.updateCartCountFromStorage = updateCartCountFromStorage;

  // Run update cart count directly on page load (outside header container logic)
  updateCartCountFromStorage();
});

// Function to generate mobile navigation that matches the image
function generateMobileNav() {
  const mobileNavContainer = document.querySelector(".mobile-nav-container");
  if (!mobileNavContainer) return;

  // Clear any existing content
  mobileNavContainer.innerHTML = "";

  // Define menu items to match the image
  const menuItems = [
    { label: "Trang chủ", url: "./index.html", hasSubmenu: false },
    {
      label: "Sản phẩm",
      url: "./SanPham.html",
      hasSubmenu: true,
      submenu: [
        { label: "Tất cả sản phẩm", url: "./SanPham.html" },
        {
          label: "Giá trị cho bé",
          url: "./SanPham.html?category=Giá trị cho bé",
        },
        {
          label: "Chương trình học",
          url: "./SanPham.html?category=Chương trình học",
        },
      ],
    },
    {
      label: "Chương trình giáo dục",
      url: "./ChuongTrinhGiaoDuc.html",
      hasSubmenu: true,
      submenu: [
        { label: "Giá trị cho bé", url: "./GiaTriChoBe.html" },
        { label: "Chương trình học", url: "./ChuongTrinhGiaoDuc.html" },
      ],
    },
    {
      label: "Tuyển sinh",
      url: "./ChuongTrinhHoc.html",
      hasSubmenu: true,
      submenu: [
        { label: "Chương trình học", url: "./ChuongTrinhHoc.html" },
        { label: "Học phí", url: "./HocPhi.html" },
        { label: "Thực đơn", url: "./ThucDon.html" },
      ],
    },
    { label: "Tin tức", url: "./TinTuc.html", hasSubmenu: false },
    {
      label: "Giới thiệu",
      url: "./GioiThieu.html",
      hasSubmenu: true,
      submenu: [
        { label: "Về chúng tôi", url: "./GioiThieu.html" },
        { label: "Cơ sở vật chất", url: "./CoSoVatChat.html" },
      ],
    },
  ];

  // Create menu items
  menuItems.forEach((item) => {
    const navItem = document.createElement("div");
    navItem.className = "mobile-nav-item";

    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.label;
    navItem.appendChild(link);

    if (item.hasSubmenu) {
      // Create toggle button
      const toggleBtn = document.createElement("button");
      toggleBtn.className = "toggle-submenu";
      toggleBtn.innerHTML = '<i class="fas fa-plus"></i>';
      navItem.appendChild(toggleBtn);

      // Create submenu container
      const submenu = document.createElement("div");
      submenu.className = "mobile-submenu";
      submenu.style.display = "none";

      // Add submenu items
      item.submenu.forEach((subItem) => {
        const subNavItem = document.createElement("div");
        subNavItem.className = "mobile-nav-subitem";

        const subLink = document.createElement("a");
        subLink.href = subItem.url;
        subLink.textContent = subItem.label;

        subNavItem.appendChild(subLink);
        submenu.appendChild(subNavItem);
      });

      navItem.appendChild(submenu);

      // Toggle functionality
      toggleBtn.addEventListener("click", function () {
        const submenu = this.parentElement.querySelector(".mobile-submenu");
        const icon = this.querySelector("i");

        if (submenu.style.display === "none") {
          submenu.style.display = "block";
          icon.classList.remove("fa-plus");
          icon.classList.add("fa-minus");
        } else {
          submenu.style.display = "none";
          icon.classList.remove("fa-minus");
          icon.classList.add("fa-plus");
        }
      });
    }

    mobileNavContainer.appendChild(navItem);
  });

  // Make sure the mobile menu is initially hidden
  mobileNavContainer.style.display = "none";
}

// Function to update cart count from localStorage
function updateCartCountFromStorage() {
  // Find all cart count elements (could be multiple if we have mobile and desktop headers)
  const cartCountElements = document.querySelectorAll(".cart-count");
  if (cartCountElements.length > 0) {
    try {
      const savedCart = localStorage.getItem("sunschool_cart");
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        // Calculate total quantity considering the quantity property of each item
        const count = cart.reduce(
          (total, item) => total + (parseInt(item.quantity) || 1),
          0
        );

        // Update all cart count elements
        cartCountElements.forEach((element) => {
          element.textContent = count;
        });

        // Log the count for debugging
        console.log("Cart count updated to:", count);
      } else {
        // Set to zero if cart is empty
        cartCountElements.forEach((element) => {
          element.textContent = "0";
        });
      }
    } catch (e) {
      console.error("Error loading cart count:", e);
      // Set to zero on error
      cartCountElements.forEach((element) => {
        element.textContent = "0";
      });
    }
  }
}

// Initialize cart dropdown functionality
function initCartDropdown() {
  // Update cart dropdown initially
  updateCartDropdown();

  // Listen for cart updates
  window.addEventListener("cartUpdated", function () {
    updateCartDropdown();
    updateCartCountFromStorage(); // Update count on cart changes
  });

  // Make sure cart icon click works
  const cartIcon = document.querySelector("#cart-icon");
  if (cartIcon) {
    cartIcon.addEventListener("click", function (e) {
      // Allow normal navigation to GioHang.html
      // e.preventDefault();
      // window.location.href = "./GioHang.html";
    });
  }

  // Fix hover issues with cart dropdown
  const cartContainer = document.querySelector(".cart-container");
  const cartDropdown = document.querySelector(".cart-dropdown");

  if (cartContainer && cartDropdown) {
    // Force dropdown to display when hovering over the container
    cartContainer.addEventListener("mouseenter", function () {
      cartDropdown.style.display = "block";
    });

    cartContainer.addEventListener("mouseleave", function (e) {
      // Check if the mouse is entering the dropdown
      const rect = cartDropdown.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        cartDropdown.style.display = "none";
      }
    });

    // Make sure dropdown stays open when hovering over it
    cartDropdown.addEventListener("mouseenter", function () {
      cartDropdown.style.display = "block";
    });

    cartDropdown.addEventListener("mouseleave", function () {
      cartDropdown.style.display = "none";
    });
  }
}

// Update cart dropdown content based on cart data
function updateCartDropdown() {
  const cartDropdown = document.querySelector(".cart-dropdown");
  if (!cartDropdown) return;

  // Get cart data from localStorage
  let cart = [];
  try {
    const savedCart = localStorage.getItem("sunschool_cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
  } catch (e) {
    console.error("Error loading cart:", e);
  }

  // If cart is empty
  if (!cart || cart.length === 0) {
    cartDropdown.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
      </div>
    `;
    return;
  }

  // Calculate total price and items
  let totalPrice = 0;
  let totalItems = 0;

  cart.forEach((item) => {
    // Only calculate total if price is not "Liên hệ"
    if (item.price && !item.price.includes("Liên hệ")) {
      const priceString = item.price;
      let numericPrice = 0;

      // Extract numeric value from price string
      const matches = priceString.match(/[\d,.]+/g);
      if (matches && matches.length > 0) {
        // Remove dots (thousands separators in VN) and convert to number
        numericPrice = parseFloat(
          matches[0].replace(/\./g, "").replace(/,/g, "")
        );
      }

      totalPrice += numericPrice * item.quantity;
    }

    totalItems += item.quantity;
  });

  // Create HTML for cart items
  let cartItemsHTML = "";

  // Show at most 3 items in dropdown
  const displayItems = cart.slice(0, 3);

  displayItems.forEach((item) => {
    cartItemsHTML += `
      <div class="cart-item">
        <div class="cart-item-image">
          <img src="${
            item.image.startsWith("//") ? "https:" + item.image : item.image
          }" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-price">${item.price}</div>
          <div class="cart-item-quantity">Số lượng: ${item.quantity}</div>
        </div>
      </div>
    `;
  });

  // Show "more items" message if there are more than 3 items
  if (cart.length > 3) {
    cartItemsHTML += `
      <div class="cart-more-items">
        <span>+ ${cart.length - 3} sản phẩm khác</span>
      </div>
    `;
  }

  // Format total price
  let formattedTotal = "";
  if (cart.length > 0) {
    if (cart[0].price.includes("₫")) {
      formattedTotal = `${totalPrice
        .toLocaleString("vi-VN")
        .replace(/,/g, ".")}₫`;
    } else if (cart[0].price.includes("đ")) {
      formattedTotal = `${totalPrice
        .toLocaleString("vi-VN")
        .replace(/,/g, ".")}đ`;
    } else {
      formattedTotal = `${totalPrice
        .toLocaleString("vi-VN")
        .replace(/,/g, ".")}`;
    }
  } else {
    formattedTotal = "0đ";
  }

  // Update cart dropdown content
  cartDropdown.innerHTML = `
    <div class="cart-items">
      ${cartItemsHTML}
    </div>
    <div class="cart-dropdown-total">
      <span class="cart-dropdown-total-label">Thành tiền:</span>
      <span class="cart-dropdown-total-price">${formattedTotal}</span>
    </div>
    <div class="cart-dropdown-buttons">
      <a href="./GioHang.html" class="cart-dropdown-button cart-view-button">GIỎ HÀNG</a>
      <a href="./ThanhToan.html" class="cart-dropdown-button cart-checkout-button">THANH TOÁN</a>
    </div>
  `;

  // Add event listeners for cart dropdown buttons
  const cartButtons = cartDropdown.querySelectorAll(".cart-dropdown-buttons a");
  cartButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Navigate to cart page
      window.location.href = "./GioHang.html";
    });
  });

  // Add styles for cart dropdown if not already added
  if (!document.getElementById("cart-dropdown-styles")) {
    const style = document.createElement("style");
    style.id = "cart-dropdown-styles";
    style.innerHTML = `
      /* Cart dropdown styles */
      .cart-items {
        max-height: 300px;
        overflow-y: auto;
      }
      
      .cart-item {
        display: flex;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
      }
      
      .cart-item:last-child {
        border-bottom: none;
      }
      
      .cart-item-image {
        width: 60px;
        height: 45px;
        margin-right: 10px;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .cart-item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .cart-item-info {
        flex: 1;
        min-width: 0; /* Allow content to shrink properly */
        width: 100%; /* Take available space */
      }
      
      .cart-item-title {
        font-size: 14px;
        font-weight: bold;
        margin: 0 0 5px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      
      .cart-item-price {
        font-size: 13px;
        color: #f6903d;
        font-weight: bold;
      }
      
      .cart-item-quantity {
        font-size: 12px;
        color: #666;
      }
      
      .cart-more-items {
        padding: 8px 0;
        text-align: center;
        font-size: 13px;
        color: #666;
        background: #f9f9f9;
        border-radius: 4px;
        margin-top: 5px;
      }
      
      .cart-dropdown-total {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-top: 1px solid #eee;
        margin-top: 10px;
        font-weight: bold;
      }
      
      .cart-dropdown-total-label {
        color: #333;
      }
      
      .cart-dropdown-total-price {
        color: #f6903d;
      }
      
      .cart-dropdown-buttons {
        display: flex;
        gap: 10px;
        margin-top: 10px;
      }
      
      .cart-dropdown-button {
        flex: 1;
        padding: 8px 0;
        text-align: center;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
      }
      
      .cart-view-button {
        background: #fff;
        color: #f6903d;
        border: 1px solid #f6903d;
      }
      
      .cart-view-button:hover {
        background: #fff8f3;
      }
      
      .cart-checkout-button {
        background: #f6903d;
        color: white;
        border: 1px solid #f6903d;
      }
      
      .cart-checkout-button:hover {
        background: #e67e00;
      }
      
      /* Fix for cart dropdown positioning */
      .cart-dropdown {
        position: absolute !important;
        top: 100% !important;
        right: 0 !important;
        width: 320px !important;
        min-width: 300px !important;
        z-index: 9999 !important;
        background: #fff !important;
        border-radius: 8px !important;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15) !important;
        overflow: visible !important;
        max-width: none !important;
      }
      
      /* Ensure parent containers don't clip the dropdown */
      .cart-container {
        position: relative !important;
        z-index: 9999 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function initMobileMenu() {
  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNavigation = document.querySelector(".main-navigation");
  const body = document.querySelector("body");

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.preventDefault();

      if (window.innerWidth <= 575) {
        // For mobile, toggle the mobile nav container
        const mobileNavContainer = document.querySelector(
          ".mobile-nav-container"
        );
        if (mobileNavContainer) {
          if (mobileNavContainer.style.display === "none") {
            mobileNavContainer.style.display = "block";
          } else {
            mobileNavContainer.style.display = "none";
          }
        }
      } else {
        // For tablet and up, use slide-in menu
        mainNavigation.classList.toggle("active");
        this.classList.toggle("active");

        // Create or activate overlay
        const overlay = document.querySelector(".menu-overlay");
        if (overlay) {
          overlay.classList.toggle("active");
        }

        // Prevent body scrolling when menu is open
        if (body && mainNavigation.classList.contains("active")) {
          body.style.overflow = "hidden";
        } else if (body) {
          body.style.overflow = "";
        }
      }
    });
  }

  // Add overlay for mobile menu
  const overlay = document.createElement("div");
  overlay.className = "menu-overlay";
  document.body.appendChild(overlay);

  overlay.addEventListener("click", function () {
    if (mainNavigation.classList.contains("active")) {
      mainNavigation.classList.remove("active");
      menuToggle.classList.remove("active");
      this.classList.remove("active");
      if (body) {
        body.style.overflow = "";
      }
    }
  });

  // Fix dropdown functionality
  const dropdownItems = document.querySelectorAll(".nav-item.has-dropdown");

  dropdownItems.forEach(function (item) {
    item.addEventListener("click", function (e) {
      if (window.innerWidth <= 991) {
        e.stopPropagation();
      }
    });
  });
}

function setActiveMenuItem() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  const menuItems = document.querySelectorAll(".main-menu .nav-item");

  // Set active state for cart icon if on cart page
  const cartLink = document.querySelector(".cart-link");
  const cartIcon = document.querySelector(".cart-link i");
  if (
    cartIcon &&
    cartLink &&
    (currentPage.includes("GioHang.html") || currentPage.includes("cart"))
  ) {
    cartIcon.classList.add("active");
    cartLink.classList.add("active");
  } else if (cartIcon && cartLink) {
    cartIcon.classList.remove("active");
    cartLink.classList.remove("active");
  }

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
    const homeItem = document.querySelector(".main-menu .nav-item:first-child");
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

// Function to check and highlight cart icon if on cart page
function updateCartIconActive() {
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split("/").pop() || "index.html";
  const cartLink = document.querySelector(".cart-link");
  const cartIcon = document.querySelector(".cart-link i");

  if (
    cartIcon &&
    cartLink &&
    (currentPage.includes("GioHang.html") || currentPage.includes("cart"))
  ) {
    cartIcon.classList.add("active");
    cartLink.classList.add("active");
  }
}

// Run after DOM is fully loaded and after a short delay to ensure styles are applied
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(updateCartIconActive, 500);
});

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
