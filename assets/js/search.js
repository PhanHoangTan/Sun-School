// Search Results JavaScript

class SearchManager {
  constructor() {
    this.searchQuery = "";
    this.products = [];
    this.filteredProducts = [];
    this.init();
  }

  async init() {
    try {
      // Get search query from URL
      const urlParams = new URLSearchParams(window.location.search);
      this.searchQuery = urlParams.get("query") || "";

      // Update UI elements
      this.updateSearchTitle();

      // If no search query, show empty state
      if (!this.searchQuery) {
        this.displayEmptyState();
        return;
      }

      // Show loading spinner
      this.showLoadingSpinner();

      // Load products
      await this.loadProducts();

      // Filter products
      this.filterProducts();

      // Render results
      this.renderResults();
    } catch (error) {
      console.error("Error initializing search:", error);
      this.displayError();
    }
  }

  updateSearchTitle() {
    const searchTitle = document.querySelector(".search-results-title");
    if (searchTitle && this.searchQuery) {
      searchTitle.textContent = `Tìm kiếm: "${this.searchQuery}"`;
    }
  }

  showLoadingSpinner() {
    const productsContainer = document.getElementById("products-container");
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="col-12 text-center">
          <div class="loading-spinner">
            <i class="fa fa-spinner fa-spin"></i> Đang tải sản phẩm...
          </div>
        </div>
      `;
    }
  }

  async loadProducts() {
    try {
      const response = await fetch("./assets/db/products.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.products = data.products;
    } catch (error) {
      console.error("Error loading products:", error);
      this.products = [];
      throw error;
    }
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = [...this.products];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.subcategory.toLowerCase().includes(query)
      );
    }

    console.log(
      `Found ${this.filteredProducts.length} products matching "${this.searchQuery}"`
    );
  }

  renderResults() {
    const productsContainer = document.getElementById("products-container");
    if (!productsContainer) return;

    // Clear loading spinner
    productsContainer.innerHTML = "";

    // Update search count
    const searchCount = document.getElementById("search-count");
    if (searchCount) {
      searchCount.textContent = this.filteredProducts.length;
    }

    // If no results found
    if (this.filteredProducts.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-12">
          <div class="empty-result">
            <i class="fas fa-search"></i>
            <p>Không tìm thấy kết quả nào cho từ khóa: <span class="search-keyword">${this.searchQuery}</span></p>
            <p>Vui lòng thử lại với từ khóa khác</p>
          </div>
        </div>
      `;
      return;
    }

    // Render each product
    this.filteredProducts.forEach((product) => {
      const productElement = this.createProductHTML(product);
      productsContainer.appendChild(productElement);
    });
  }

  createProductHTML(product) {
    const colDiv = document.createElement("div");
    colDiv.className = "col-lg-3 col-md-4 col-sm-6 col-6";

    const discountBadge = product.hasDiscount
      ? `<div class="sale_tag"><span class="smart">${product.discount}</span></div>`
      : "";

    // Adjust price HTML based on product
    let priceHtml = "";
    if (product.price === "Liên hệ") {
      priceHtml = `<a class="contact">Liên hệ</a>`;
    } else if (product.hasDiscount) {
      priceHtml = `${product.price}&nbsp;<span class="compare-price">${product.originalPrice}</span>`;
    } else {
      priceHtml = product.price;
    }

    colDiv.innerHTML = `
      <div class="item_product_main">
        <div class="product-thumbnail">
          <a class="image_thumb" href="ChiTietSanPham.html?product=${product.id}" 
             title="${product.name}" data-product-id="${product.id}">
            <img class="lazyload loaded" 
                 src="${product.image}" 
                 alt="${product.name}" 
                 data-was-processed="true">
          </a>
          ${discountBadge}
        </div>
        <div class="product-info">
          <h3 class="product-name">
            <a href="ChiTietSanPham.html?product=${product.id}" title="${product.name}">${product.name}</a>
          </h3>
          <div class="price-box">
            ${priceHtml}
          </div>
        </div>
      </div>
    `;

    return colDiv;
  }

  displayEmptyState() {
    const productsContainer = document.getElementById("products-container");
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="col-12">
          <div class="empty-result">
            <i class="fas fa-search"></i>
            <p>Vui lòng nhập từ khóa để tìm kiếm</p>
          </div>
        </div>
      `;
    }
  }

  displayError() {
    const productsContainer = document.getElementById("products-container");
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div class="col-12">
          <div class="empty-result">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.</p>
          </div>
        </div>
      `;
    }
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  window.searchManager = new SearchManager();
});
