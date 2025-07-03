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
    try {
      await this.loadProducts();
      this.setupEventListeners();
      this.renderProducts();
    } catch (error) {
      console.error("Error initializing ProductManager:", error);
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
      this.filteredProducts = [...this.products];
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
    const container = document.querySelector(".products-view .row");
    if (!container) return;

    container.innerHTML = "";

    if (this.filteredProducts.length === 0) {
      container.innerHTML =
        '<div class="col-12"><p class="text-center">Không có sản phẩm nào.</p></div>';
      return;
    }

    this.filteredProducts.forEach((product) => {
      const productHtml = this.createProductHTML(product);
      container.appendChild(productHtml);
    });
  }

  createProductHTML(product) {
    const colDiv = document.createElement("div");
    colDiv.className =
      this.currentView === "list" ? "col-12" : "col-lg-4 col-md-4";

    const discountBadge = product.hasDiscount
      ? `<div class="sale_tag"><span class="smart">${product.discount}</span></div>`
      : "";

    const priceHtml =
      product.price === "Liên hệ"
        ? `<a class="contact">Liên hệ</a>`
        : product.hasDiscount
        ? `${product.price}&nbsp;<span class="compare-price">${product.originalPrice}</span>`
        : product.price;

    colDiv.innerHTML = `
            <div class="item_product_main ${
              this.currentView === "list" ? "list-item-layout" : ""
            }">
                <form action="/cart/add" method="post" class="variants product-action" 
                      data-cart-form="" data-id="${
                        product.id
                      }" enctype="multipart/form-data">
                    <div class="product-thumbnail">
                        <a class="image_thumb scale_hover" href="${
                          product.url
                        }" title="${product.name}">
                            <img class="lazyload loaded" 
                                 src="${product.image}" 
                                 data-src="${product.image}" 
                                 alt="${product.name}" 
                                 data-was-processed="true">
                        </a>
                        ${discountBadge}
                    </div>
                    ${
                      this.currentView === "list"
                        ? '<div class="list-content-wrapper">'
                        : ""
                    }
                    <div class="product-info">
                        <h3 class="product-name">
                            <a href="${product.url}" title="${product.name}">${
      product.name
    }</a>
                        </h3>
                    </div>
                    <div class="price-box">
                        ${priceHtml}
                    </div>
                    ${this.currentView === "list" ? "</div>" : ""}
                </form>
            </div>
        `;

    return colDiv;
  }

  // Public methods for external use
  filterByCategory(category) {
    if (category === "all") {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
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
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  window.productManager = new ProductManager();
});

// CSS for list view layout
const listViewCSS = `
<style>
.products-view-list .item_product_main {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.products-view-list .product-thumbnail {
    flex: 0 0 200px;
    margin-right: 20px;
}

.products-view-list .product-thumbnail img {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
}

.products-view-list .list-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 150px;
}

.products-view-list .product-info {
    margin-bottom: 10px;
}

.products-view-list .product-name {
    font-size: 18px;
    margin-bottom: 10px;
}

.products-view-list .price-box {
    margin-top: auto;
}

.products-view-list .sale_tag {
    position: absolute;
    top: 10px;
    left: 10px;
}

@media (max-width: 768px) {
    .products-view-list .item_product_main {
        flex-direction: column;
        text-align: center;
    }
    
    .products-view-list .product-thumbnail {
        flex: none;
        margin-right: 0;
        margin-bottom: 15px;
    }
    
    .products-view-list .list-content-wrapper {
        height: auto;
    }
}
</style>
`;

// Inject CSS
document.head.insertAdjacentHTML("beforeend", listViewCSS);
