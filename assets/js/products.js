// Product Management JavaScript
class ProductManager {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.currentView = "grid";
    this.currentSort = "default";
    this.productsPerPage = 6;
    this.currentPage = 1;
    this.init();
  }

  async init() {
    console.log("=== PRODUCT MANAGER INIT ===");
    try {
      console.log("Loading products...");
      await this.loadProducts();
      console.log("Products loaded:", this.products.length);

      console.log("Setting up event listeners...");
      this.setupEventListeners();

      console.log("Initial render...");
      this.renderProducts();

      // Notify that ProductManager is ready
      console.log("=== PRODUCT MANAGER READY ===");
      window.dispatchEvent(new CustomEvent("productManagerReady"));
    } catch (error) {
      console.error("Error initializing ProductManager:", error);
    }
  }

  async loadProducts() {
    try {
      console.log("Fetching products from ./assets/db/products.json");
      const response = await fetch("./assets/db/products.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Raw data loaded:", data);
      this.products = data.products;
      this.filteredProducts = [...this.products];
      console.log("Products array:", this.products);
      console.log("Filtered products array:", this.filteredProducts);
    } catch (error) {
      console.error("Error loading products:", error);
      // Fallback data if JSON file fails to load
      this.products = [];
      this.filteredProducts = [];
    }
  }

  setupEventListeners() {
    // Sort functionality
    const sortSelect = document.getElementById("sortBy");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.currentSort = e.target.value;
        this.sortProducts();
        this.renderProducts();
      });
    }

    // View mode switches
    const viewSwitches = document.querySelectorAll(".switch-view");
    viewSwitches.forEach((switcher) => {
      switcher.addEventListener("click", (e) => {
        e.preventDefault();
        this.currentView = switcher.getAttribute("data-view");
        this.updateViewMode();
        this.renderProducts();
      });
    });
  }

  sortProducts() {
    switch (this.currentSort) {
      case "alpha-asc":
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alpha-desc":
        this.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        this.filteredProducts.sort(
          (a, b) => this.getPriceValue(a.price) - this.getPriceValue(b.price)
        );
        break;
      case "price-desc":
        this.filteredProducts.sort(
          (a, b) => this.getPriceValue(b.price) - this.getPriceValue(a.price)
        );
        break;
      case "created-desc":
        // Assuming newer products have higher IDs
        this.filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "created-asc":
        this.filteredProducts.sort((a, b) => a.id.localeCompare(b.id));
        break;
      default:
        // Default sorting - restore original order
        this.filteredProducts = [...this.products];
        break;
    }
  }

  getPriceValue(priceString) {
    if (priceString === "Liên hệ") return 0;
    const numericValue = priceString.replace(/[^\d]/g, "");
    return parseInt(numericValue) || 0;
  }

  updateViewMode() {
    // Update active button
    document.querySelectorAll(".button-view-mode").forEach((btn) => {
      btn.classList.remove("active");
    });
    document
      .querySelector(`[data-view="${this.currentView}"] .button-view-mode`)
      .classList.add("active");

    // Update container classes
    const container = document.querySelector(".products-view");
    container.className = `products-view products-view-${this.currentView} list_hover_pro`;
  }

  renderProducts() {
    console.log("=== RENDER PRODUCTS DEBUG ===");
    console.log(
      "renderProducts called, products to render:",
      this.filteredProducts.length
    );
    const container = document.querySelector("#products-container");
    if (!container) {
      console.error(
        "Products container not found! Looking for #products-container"
      );
      // Try to find any container as fallback
      const allContainers = document.querySelectorAll("[id*='product']");
      console.log("Found containers with 'product' in ID:", allContainers);
      return;
    }

    console.log("Found products container:", container);
    container.innerHTML = "";

    if (this.filteredProducts.length === 0) {
      container.innerHTML =
        '<div class="col-12"><p class="text-center">Không có sản phẩm nào.</p></div>';
      console.log("No products to display - showing empty message");
      return;
    }

    console.log("Rendering", this.filteredProducts.length, "products...");

    // Add a wrapper row for proper spacing in list view
    if (this.currentView === "list") {
      const listWrapper = document.createElement("div");
      listWrapper.className = "product-list-wrapper";
      container.appendChild(listWrapper);

      this.filteredProducts.forEach((product, index) => {
        console.log(`Creating HTML for product ${index + 1}:`, product.name);
        const productHtml = this.createProductHTML(product);
        listWrapper.appendChild(productHtml);
      });
    } else {
      // Standard grid view rendering
      this.filteredProducts.forEach((product, index) => {
        console.log(`Creating HTML for product ${index + 1}:`, product.name);
        const productHtml = this.createProductHTML(product);
        container.appendChild(productHtml);
      });
    }

    console.log("=== PRODUCTS RENDERED SUCCESSFULLY ===");
  }

  createProductHTML(product) {
    const colDiv = document.createElement("div");
    colDiv.className =
      this.currentView === "list"
        ? "col-12"
        : "col-lg-4 col-md-4 col-sm-6 col-6";

    const discountBadge = product.hasDiscount
      ? `<div class="sale_tag"><span class="smart">${product.discount}</span></div>`
      : "";

    // Adjust price HTML based on view mode
    let priceHtml = "";
    if (product.price === "Liên hệ") {
      priceHtml = `<a class="contact">Liên hệ</a>`;
    } else if (product.hasDiscount) {
      priceHtml = `${product.price}&nbsp;<span class="compare-price">${product.originalPrice}</span>`;
    } else {
      priceHtml = product.price;
    }

    if (this.currentView === "list") {
      // List view layout - with single line content
      colDiv.innerHTML = `
        <div class="item_product_main list-item-layout">
          <div class="row">
            <div class="col-lg-4 image">
              <div class="product-thumbnail">
                <a class="image_thumb" href="ChiTietSanPham.html?product=${
                  product.id
                }" 
                   title="${product.name}" data-product-id="${product.id}">
                  <img class="lazyload loaded" 
                       src="${product.image}" 
                       alt="${product.name}" 
                       data-was-processed="true">
                </a>
                ${discountBadge}
              </div>
            </div>
            <div class="col-lg-8 info">
              <div class="product-info">
                <h3 class="product-name">
                  <a href="ChiTietSanPham.html?product=${product.id}" title="${
        product.name
      }">${product.name}</a>
                </h3>
                <div class="desproduct" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                  product.description || ""
                }</div>
                <div class="price-box">
                  ${priceHtml}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Grid view layout - updated for image 2 style
      colDiv.innerHTML = `
        <div class="item_product_main">
          <div class="product-thumbnail">
            ${discountBadge}
            <a class="image_thumb" href="ChiTietSanPham.html?product=${product.id}" 
               title="${product.name}" data-product-id="${product.id}">
              <img class="lazyload loaded" 
                   src="${product.image}" 
                   alt="${product.name}" 
                   data-was-processed="true">
            </a>
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
    }

    return colDiv;
  }

  // Public methods for external use
  filterByCategory(category) {
    console.log("=== FILTER BY CATEGORY DEBUG ===");
    console.log("filterByCategory called with:", category);
    console.log("Available products:", this.products.length);
    console.log("Current filteredProducts:", this.filteredProducts.length);

    // Debug: show all product categories
    console.log("All product categories:");
    this.products.forEach((product, index) => {
      console.log(
        `${index + 1}. "${product.name}" - Category: "${product.category}"`
      );
    });

    if (category === "Sản phẩm" || category === "all") {
      this.filteredProducts = [...this.products];
      console.log("Showing all products:", this.filteredProducts.length);
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.category === category
      );
      console.log(
        "Filtered products for category '" + category + "':",
        this.filteredProducts.length
      );

      // Debug: log matching products
      if (this.filteredProducts.length > 0) {
        console.log("Matching products:");
        this.filteredProducts.forEach((product, index) => {
          console.log(
            `${index + 1}. "${product.name}" (category: "${product.category}")`
          );
        });
      } else {
        console.log("No products found for category:", category);
        console.log("Available categories in data:");
        const uniqueCategories = [
          ...new Set(this.products.map((p) => p.category)),
        ];
        uniqueCategories.forEach((cat) => console.log(`- "${cat}"`));
      }
    }
    console.log("=== CALLING RENDER PRODUCTS ===");
    this.renderProducts();
  }

  filterBySubcategory(subcategory) {
    console.log("filterBySubcategory called with:", subcategory);
    console.log("Available products:", this.products.length);

    if (subcategory === "Sản phẩm" || subcategory === "all") {
      this.filteredProducts = [...this.products];
      console.log("Showing all products:", this.filteredProducts.length);
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.subcategory === subcategory
      );
      console.log(
        "Filtered products for subcategory '" + subcategory + "':",
        this.filteredProducts.length
      );

      // Debug: log matching products
      this.filteredProducts.forEach((product) => {
        console.log(
          "- " + product.name + " (subcategory: " + product.subcategory + ")"
        );
      });
    }
    this.renderProducts();
  }

  searchProducts(searchTerm) {
    if (!searchTerm) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.renderProducts();
  }

  // Method to change view mode
  setViewMode(mode) {
    this.currentView = mode;
  }

  // Get all unique categories
  getCategories() {
    const categories = [
      ...new Set(this.products.map((product) => product.category)),
    ];
    return ["Sản phẩm", ...categories];
  }

  // Get all unique subcategories
  getSubcategories() {
    const subcategories = [
      ...new Set(this.products.map((product) => product.subcategory)),
    ];
    return ["Sản phẩm", ...subcategories];
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("=== DOM CONTENT LOADED ===");
  console.log("Creating ProductManager instance...");
  window.productManager = new ProductManager();
  console.log("ProductManager instance created:", window.productManager);
});

// Additional debug - listen for the ready event
document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("productManagerReady", function () {
    console.log("=== PRODUCT MANAGER READY EVENT FIRED ===");
    console.log(
      "ProductManager products:",
      window.productManager.products.length
    );
    console.log(
      "ProductManager filteredProducts:",
      window.productManager.filteredProducts.length
    );
  });
});

// CSS for list view layout
const listViewCSS = `
<style>
/* List View Styles */
.products-view-list .item_product_main.list-item-layout {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 20px;
    transition: all 0.3s ease;
    height: auto;
    min-height: 180px;
}

.products-view-list .item_product_main.list-item-layout:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.products-view-list .item_product_main.list-item-layout .variants {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
}

.products-view-list .product-thumbnail {
    flex: 0 0 280px;
    margin-right: 0;
    margin-bottom: 0;
    position: relative;
    overflow: hidden;
    height: 100%;
}

.products-view-list .product-thumbnail .image_thumb {
    display: block;
    width: 100%;
    height: 100%;
}

.products-view-list .product-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.products-view-list .product-thumbnail:hover img {
    transform: scale(1.05);
}

.products-view-list .product-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}



.products-view-list .product-name {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 15px;
    color: #333;
}

.products-view-list .product-name a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
}

.products-view-list .product-name a:hover {
    color: #ff6b35;
}

.products-view-list .product-description {
    font-size: 15px;
    line-height: 1.6;
    color: #666;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-align: justify;
}

.products-view-list .price-box {
    margin-top: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 700;
    color: #ff6b35;
}

.products-view-list .price-box .compare-price {
    font-size: 18px;
    color: #999;
    text-decoration: line-through;
    font-weight: 400;
}

.products-view-list .price-box .contact {
    background: linear-gradient(135deg, #ff6b35, #ff8c69);
    color: white;
    padding: 10px 25px;
    border-radius: 25px;
    text-decoration: none;
    font-size: 16px;
    transition: all 0.3s ease;
    display: inline-block;
    margin-left: auto;
}

.products-view-list .price-box .contact:hover {
    background: linear-gradient(135deg, #ff8c69, #ffab94);
    color: white;
    text-decoration: none;
    transform: translateY(-2px);
}

.products-view-list .sale_tag {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 2;
}

.products-view-list .sale_tag .smart {
    background: linear-gradient(135deg, #ff4757, #ff3838);
    color: white;
    padding: 8px 15px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

/* Grid view - keep normal styling */
.products-view-grid .item_product_main {
    display: block;
}

.products-view-grid .product-content {
    padding: 15px;
    text-align: center;
}

.products-view-grid .product-info {
    margin-bottom: 15px;
}

.products-view-grid .price-box {
    text-align: left;
    font-size: 18px;
    font-weight: bold;
    color: #ff8c00;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
    .products-view-list .product-thumbnail {
        flex: 0 0 250px;
    }
    
    .products-view-list .product-content {
        padding: 20px;
    }
    
    .products-view-list .product-name {
        font-size: 20px;
    }
    
    .products-view-list .product-description {
        font-size: 14px;
    }
    
    .products-view-list .price-box {
        font-size: 22px;
    }
    
    .products-view-list .price-box .compare-price {
        font-size: 16px;
    }
}

@media (max-width: 992px) {
    .products-view-list .product-thumbnail {
        flex: 0 0 220px;
    }
    
    .products-view-list .product-content {
        padding: 18px;
    }
    
    .products-view-list .product-name {
        font-size: 18px;
        margin-bottom: 12px;
    }
    
    .products-view-list .product-description {
        -webkit-line-clamp: 2;
        margin-bottom: 15px;
    }
    
    .products-view-list .price-box {
        font-size: 20px;
    }
    
    .products-view-list .price-box .compare-price {
        font-size: 16px;
    }
}

@media (max-width: 768px) {
    .products-view-list .item_product_main.list-item-layout {
        flex-direction: column;
        min-height: auto;
    }
    
    .products-view-list .item_product_main.list-item-layout .variants {
        flex-direction: column;
    }
    
    .products-view-list .product-thumbnail {
        flex: none;
        height: 200px;
    }
    
    .products-view-list .product-content {
        padding: 20px;
        text-align: left;
    }
    
    .products-view-list .product-name {
        font-size: 18px;
        margin-bottom: 10px;
    }
    
    .products-view-list .product-description {
        -webkit-line-clamp: 2;
        margin-bottom: 15px;
        text-align: left;
    }
    
    .products-view-list .price-box {
        justify-content: flex-start;
    }
    
    .products-view-list .price-box .contact {
        margin-left: 0;
        margin-top: 10px;
    }
}

@media (max-width: 576px) {
    .products-view-list .product-thumbnail {
        height: 180px;
    }
    
    .products-view-list .product-content {
        padding: 15px;
    }
    
    .products-view-list .product-name {
        font-size: 16px;
    }
    
    .products-view-list .product-description {
        font-size: 13px;
    }
    
    .products-view-list .price-box {
        font-size: 18px;
    }
    
    .products-view-list .price-box .compare-price {
        font-size: 14px;
    }
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML("beforeend", listViewCSS);
