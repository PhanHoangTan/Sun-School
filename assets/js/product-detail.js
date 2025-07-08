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

  findRelatedProductsByCategory(currentProduct, limit = 4) {
    if (!currentProduct || !currentProduct.category) return [];

    // Find products with the same category, excluding the current product
    return this.products
      .filter(
        (product) =>
          product.category === currentProduct.category &&
          product.id !== currentProduct.id
      )
      .slice(0, limit); // Limit the number of related products
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

    // Render sidebar related products
    this.renderSidebarRelatedProducts(product);

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

  renderSidebarRelatedProducts(product) {
    const container = document.getElementById("related-sidebar-products");
    if (!container) {
      console.error("Sidebar related products container not found");
      return;
    }

    // Show loading first
    container.innerHTML = `
      <div class="loading-sidebar">
        <i class="fas fa-spinner"></i>
        <div>Đang tải...</div>
      </div>
    `;

    // Get related products
    const relatedProducts = this.findRelatedProductsByCategory(product);

    // Simulate loading delay for better UX
    setTimeout(() => {
      if (relatedProducts.length > 0) {
        const relatedProductsHTML = relatedProducts
          .map((relatedProduct) => {
            const relatedImageUrl = relatedProduct.image.startsWith("//")
              ? "https:" + relatedProduct.image
              : relatedProduct.image;

            let priceDisplay = relatedProduct.price;
            if (relatedProduct.hasDiscount && relatedProduct.originalPrice) {
              priceDisplay = `<span class="current-price">${relatedProduct.price}</span>
                            <span class="original-price">${relatedProduct.originalPrice}</span>`;
            }

            return `
            <div class="sidebar-related-product">
              <div class="sidebar-related-image">
                <a href="#" data-product-id="${relatedProduct.id}">
                  <img src="${relatedImageUrl}" alt="${relatedProduct.name}" loading="lazy">
                </a>
              </div>
              <div class="sidebar-related-info">
                <h4 class="sidebar-related-title">
                  <a href="#" data-product-id="${relatedProduct.id}">${relatedProduct.name}</a>
                </h4>
                <div class="sidebar-related-price">
                  ${priceDisplay}
                </div>
              </div>
            </div>
          `;
          })
          .join("");

        container.innerHTML = relatedProductsHTML;
      } else {
        container.innerHTML = `<p class="no-related-products" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Không có sản phẩm liên quan</p>`;
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
                </div>
              </div>
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
