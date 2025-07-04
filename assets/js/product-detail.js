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
        const productId = productLink.getAttribute("data-product-id");
        const action = productLink.getAttribute("data-action");

        // Handle different actions
        if (action === "register") {
          e.preventDefault();
          this.registerCourse(productId);
        } else if (action === "guide") {
          // Store product info for the guide page
          const product = this.findProductById(productId);
          if (product) {
            sessionStorage.setItem("currentProductName", product.name);
            sessionStorage.setItem("currentProductId", product.id);
          }
          // Don't prevent default - allow natural link navigation to HuongDan.html
          return true;
        } else {
          // Default product detail view
          e.preventDefault();
          this.showProductDetail(productId);
        }
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

      // Add thumbnail click functionality
      this.setupThumbnailClick();
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
        .map(([title, content]) => {
          // Check if this content is an image URL
          if (
            typeof content === "string" &&
            (title.toLowerCase().includes("image") ||
              content.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) ||
              content.includes("bizweb.dktcdn.net") ||
              content.includes(".jpg") ||
              content.includes(".png"))
          ) {
            // Handle image content
            const imageUrl = content.startsWith("//")
              ? "https:" + content
              : content;
            return `
              <div class="info-item info-item-image">
                <h4 class="info-title">Hình ảnh minh họa</h4>
                <div class="info-content">
                  <img src="${imageUrl}" alt="Hình ảnh minh họa - ${product.name}" class="info-image" loading="lazy">
                </div>
              </div>
            `;
          } else {
            // Handle regular text content
            return `
              <div class="info-item">
                <h4 class="info-title">${title}</h4>
                <div class="info-content">${content}</div>
              </div>
            `;
          }
        })
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
              <div class="product-thumbnail-container">
                <img src="${imageUrl}" alt="${
      product.name
    } - Ảnh phụ" class="product-thumbnail-image active">
              </div>
            </div>
            
            <div class="product-info-content">
              <div class="product-description">${product.description}</div>
              
              ${pricingHTML}
              
              <div class="action-buttons">
                <a href="#" class="btn-register" data-action="register" data-product-id="${
                  product.id
                }">
                  <i class="fas fa-user-plus"></i>
                  Đăng ký ngay
                </a>
                
                <a href="HuongDan.html" class="registration-guide-link" data-action="guide" data-product-id="${
                  product.id
                }">
                  <i class="fas fa-arrow-right"></i>
                  Hướng dẫn đăng ký
                </a>
              </div>
              
              <div class="consultation-info">
                <p class="consultation-text">Đặt hàng qua điện thoại ( 8h - 21h )</p>
                <div class="consultation-contact">
                  <a href="tel:046674232332" class="consultation-phone">
                    <i class="fas fa-phone"></i>
                    046674 2332
                  </a>
                  <span class="consultation-hours"></span>
                </div>
              </div>
            </div>
          </div>
          
          ${infoSectionsHTML}
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

  setupThumbnailClick() {
    const mainImage = document.querySelector(".product-main-image");
    const thumbnailImage = document.querySelector(".product-thumbnail-image");

    if (mainImage && thumbnailImage) {
      thumbnailImage.addEventListener("click", () => {
        // Add click animation to show interaction
        thumbnailImage.style.transform = "scale(0.95)";
        setTimeout(() => {
          thumbnailImage.style.transform = "";
        }, 150);

        // Add a subtle flash effect to main image to show it's selected
        mainImage.style.transform = "scale(1.02)";
        setTimeout(() => {
          mainImage.style.transform = "";
        }, 200);
      });
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
