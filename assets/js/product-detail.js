// Product Detail Manager JavaScript
class ProductDetailManager {
  constructor() {
    this.currentProduct = null;
    this.products = [];
    this.init();
  }

  async init() {
    console.log("=== PRODUCT DETAIL MANAGER INIT ===");
    try {
      await this.loadProducts();
      this.setupEventListeners();
      this.checkURLParams();
    } catch (error) {
      console.error("Error initializing ProductDetailManager:", error);
      this.showError("Có lỗi xảy ra khi tải thông tin sản phẩm");
    }
  }

  async loadProducts() {
    try {
      const response = await fetch("./assets/db/products.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.products = data.products || [];
      console.log("Products loaded:", this.products.length);
    } catch (error) {
      console.error("Error loading products:", error);
      throw error;
    }
  }

  setupEventListeners() {
    // Listen for product click events from the main product list
    document.addEventListener("click", (e) => {
      const productLink = e.target.closest("[data-product-id]");
      if (productLink) {
        e.preventDefault();
        const productId = productLink.getAttribute("data-product-id");
        this.showProductDetail(productId);
      }
    });

    // Handle browser back/forward
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.productId) {
        this.showProductDetail(e.state.productId, false);
      } else {
        this.hideProductDetail();
      }
    });
  }

  checkURLParams() {
    // Check if there's a product ID in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("product");
    if (productId) {
      this.showProductDetail(productId, false);
    }
  }

  findProductById(productId) {
    return this.products.find((product) => product.id === productId);
  }

  showProductDetail(productId, updateURL = true) {
    console.log("=== SHOWING PRODUCT DETAIL ===");
    console.log("Product ID:", productId);

    const product = this.findProductById(productId);
    if (!product) {
      console.error("Product not found:", productId);
      this.showError("Không tìm thấy thông tin sản phẩm");
      return;
    }

    this.currentProduct = product;

    // Update URL if needed
    if (updateURL) {
      const newURL = new URL(window.location);
      newURL.searchParams.set("product", productId);
      window.history.pushState({ productId: productId }, "", newURL);
    }

    // Update breadcrumb
    this.updateBreadcrumb(product);

    // Render product detail
    this.renderProductDetail(product);

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateBreadcrumb(product) {
    const breadcrumbContainer = document.querySelector(".breadcrumb");
    if (breadcrumbContainer) {
      breadcrumbContainer.innerHTML = `
        <li class="home">
          <a href="/">Trang chủ</a>
          <i class="fa-solid fa-chevron-right"></i>
        </li>
        <li>
          <a href="SanPham.html">Sản phẩm</a>
          <i class="fa-solid fa-chevron-right"></i>
        </li>
        <li>
          <span>${product.name}</span>
        </li>
      `;
    }
  }

  renderProductDetail(product) {
    const container = document.querySelector(".left-details");
    if (!container) {
      console.error("Product detail container not found");
      return;
    }

    // Show loading first
    container.innerHTML = `
      <div class="loading-detail">
        <i class="fas fa-spinner"></i>
        <div>Đang tải thông tin sản phẩm...</div>
      </div>
    `;

    // Simulate loading delay for better UX
    setTimeout(() => {
      container.innerHTML = this.createProductDetailHTML(product);

      // Add show animation
      const detailContainer = container.querySelector(
        ".product-detail-container"
      );
      if (detailContainer) {
        setTimeout(() => {
          detailContainer.classList.add("show");
        }, 100);
      }
    }, 500);
  }

  createProductDetailHTML(product) {
    const imageUrl = product.image.startsWith("//")
      ? "https:" + product.image
      : product.image;

    // Create pricing HTML
    let pricingHTML = "";
    if (product.price === "Liên hệ") {
      pricingHTML = `
        <div class="product-pricing">
          <div class="contact-price">Liên hệ để biết giá</div>
        </div>
      `;
    } else {
      pricingHTML = `
        <div class="product-pricing">
          <div class="current-price">${product.price}/Khóa</div>
          ${
            product.originalPrice
              ? `<span class="original-price">${product.originalPrice}</span>`
              : ""
          }
        </div>
      `;
    }

    // Create info sections HTML
    let infoSectionsHTML = "";
    if (product.info && Object.keys(product.info).length > 0) {
      const infoItems = Object.entries(product.info)
        .map(
          ([title, content]) => `
        <div class="info-item">
          <h4 class="info-title">${title}</h4>
          <div class="info-content">${content}</div>
        </div>
      `
        )
        .join("");

      infoSectionsHTML = `
        <div class="product-details-section">
          <h3 class="section-title">Thông tin chi tiết</h3>
          <div class="info-grid">
            ${infoItems}
          </div>
        </div>
      `;
    }

    return `
      <div class="product-detail-container">
        <div class="product-detail-header">
          <h1 class="product-title">${product.name}</h1>
        </div>
        
        <div class="product-detail-content">
          <div class="product-main-info">
            <div class="product-image-container">
              <img src="${imageUrl}" alt="${
      product.name
    }" class="product-main-image">
              ${
                product.hasDiscount
                  ? `<div class="discount-badge">-${product.discount}</div>`
                  : ""
              }
            </div>
            
            <div class="product-info-content">
              <div class="product-description">${product.description}</div>
              
              ${pricingHTML}
              
              <div class="action-buttons">
                <a href="#" class="btn-register" onclick="productDetailManager.registerCourse('${
                  product.id
                }')">
                  <i class="fas fa-user-plus"></i>
                  Đăng ký ngay
                </a>
                
                <a href="#" class="registration-guide-link" onclick="productDetailManager.showRegistrationGuide('${
                  product.id
                }')">
                  <i class="fas fa-arrow-right"></i>
                  Hướng dẫn đăng ký
                </a>
              </div>
            </div>
          </div>
          
          ${infoSectionsHTML}
          
          <div class="contact-section">
            <h3 class="contact-title">Liên hệ để được tư vấn chi tiết</h3>
            <div class="contact-info">
              <a href="tel:046674232332" class="phone-number">046674 2332</a>
              <span class="contact-hours">Đặt hàng qua điện thoại (8h - 21h)</span>
            </div>
            <div class="action-buttons">
              <a href="#" class="btn-register" onclick="productDetailManager.registerCourse('${
                product.id
              }')">
                <i class="fas fa-graduation-cap"></i>
                Đăng ký khóa học
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showError(message) {
    const container = document.querySelector(".left-details");
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-triangle"></i>
          <div>${message}</div>
          <button onclick="location.href='SanPham.html'" class="btn btn-primary mt-3">
            Quay lại danh sách sản phẩm
          </button>
        </div>
      `;
    }
  }

  hideProductDetail() {
    // Clear URL parameters
    const newURL = new URL(window.location);
    newURL.searchParams.delete("product");
    window.history.pushState({}, "", newURL);

    // Redirect back to products page
    window.location.href = "SanPham.html";
  }

  registerCourse(productId) {
    // Handle course registration
    const product = this.findProductById(productId);
    if (product) {
      alert(
        `Đăng ký khóa học: ${product.name}\n\nVui lòng gọi số 046674 2332 để hoàn tất đăng ký.`
      );

      // You can add more sophisticated registration logic here
      // For example, open a registration form modal, redirect to registration page, etc.
    }
  }

  showRegistrationGuide(productId) {
    // Handle registration guide display
    const product = this.findProductById(productId);
    if (product) {
      const guideContent = `
        <div style="text-align: left; line-height: 1.6;">
          <h4 style="color: #ff6b35; margin-bottom: 15px;">Hướng dẫn đăng ký khóa học: ${product.name}</h4>
          
          <div style="margin-bottom: 15px;">
            <strong>Bước 1:</strong> Liên hệ tư vấn qua hotline: <strong style="color: #ff6b35;">046674 2332</strong>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Bước 2:</strong> Cung cấp thông tin học viên (Họ tên, tuổi, trình độ hiện tại)
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Bước 3:</strong> Chọn lịch học phù hợp và đóng học phí
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong>Bước 4:</strong> Nhận xác nhận đăng ký và thông tin lớp học
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Giờ tư vấn:</strong> Thứ 2 - Thứ 6: 8:00 - 21:00 | Thứ 7 - CN: 8:00 - 18:00
          </div>
          
          <div style="text-align: center;">
            <a href="tel:046674232332" style="
              display: inline-block;
              background: linear-gradient(135deg, #ff6b35, #ff8c69);
              color: white;
              padding: 12px 25px;
              border-radius: 25px;
              text-decoration: none;
              font-weight: 600;
              margin-right: 10px;
            ">
              <i class="fas fa-phone"></i> Gọi ngay
            </a>
            <a href="mailto:support@sunschool.edu.vn" style="
              display: inline-block;
              background: #fff;
              color: #ff6b35;
              border: 2px solid #ff6b35;
              padding: 10px 25px;
              border-radius: 25px;
              text-decoration: none;
              font-weight: 600;
            ">
              <i class="fas fa-envelope"></i> Email
            </a>
          </div>
        </div>
      `;

      alert(
        "Hướng dẫn đăng ký khóa học\n\n" +
          "Bước 1: Liên hệ tư vấn qua hotline: 046674 2332\n" +
          "Bước 2: Cung cấp thông tin học viên\n" +
          "Bước 3: Chọn lịch học và đóng học phí\n" +
          "Bước 4: Nhận xác nhận đăng ký\n\n" +
          "Giờ tư vấn: T2-T6: 8:00-21:00 | T7-CN: 8:00-18:00"
      );

      // You can replace alert with a proper modal later
    }
  }

  // Public method to be called from external scripts
  static init() {
    if (!window.productDetailManager) {
      window.productDetailManager = new ProductDetailManager();
    }
    return window.productDetailManager;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("=== PRODUCT DETAIL MANAGER INITIALIZATION ===");

  // Only initialize if we're on the product detail page
  const leftDetailsContainer = document.querySelector(".left-details");
  if (leftDetailsContainer) {
    ProductDetailManager.init();
  }
});

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProductDetailManager;
}
