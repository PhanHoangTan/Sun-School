// Cart Manager JavaScript
class CartManager {
  constructor() {
    this.cart = [];
    this.init();
  }

  init() {
    console.log("=== CART MANAGER INIT ===");
    this.loadCartFromStorage();
    this.setupEventListeners();
    this.updateCartCount();
    this.createCartModal();

    // Ensure cart is initialized even after page reload
    this.ensureCartInitialized();
  }

  ensureCartInitialized() {
    // This method ensures the cart is properly initialized after page reload
    console.log("Ensuring cart is initialized...");

    // Check if cart count exists in DOM
    if (!document.querySelector(".cart-count")) {
      console.log(
        "Cart count element not found on initial load, will check again"
      );
      // Try again after a delay to allow header to load
      setTimeout(() => {
        this.loadCartFromStorage();
        this.updateCartCount();
      }, 1000);
    }
  }

  loadCartFromStorage() {
    try {
      // Check if localStorage is available
      if (this.isLocalStorageAvailable()) {
        const savedCart = localStorage.getItem("sunschool_cart");
        if (savedCart) {
          try {
            this.cart = JSON.parse(savedCart);
            console.log("Cart loaded from storage:", this.cart.length, "items");
          } catch (e) {
            console.error("Error parsing cart from storage:", e);
            this.cart = [];
          }
        } else {
          console.log("No saved cart found in storage");
          this.cart = [];
        }
      } else {
        console.warn(
          "localStorage is not available, cart persistence will not work"
        );
        this.cart = [];
      }
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      this.cart = [];
    }
  }

  isLocalStorageAvailable() {
    try {
      const testKey = "__test_storage__";
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  saveCartToStorage() {
    try {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem("sunschool_cart", JSON.stringify(this.cart));
        console.log("Cart saved to storage:", this.cart.length, "items");
      } else {
        console.warn("localStorage is not available, cart not saved");
      }
    } catch (e) {
      console.error("Error saving cart to storage:", e);
    }
  }

  setupEventListeners() {
    // Close modal when clicking outside or on close button
    document.addEventListener("click", (e) => {
      const modal = document.getElementById("cart-modal");
      const closeBtn = document.querySelector(".cart-modal-close");

      if (
        e.target === modal ||
        e.target === closeBtn ||
        e.target.closest(".cart-modal-close")
      ) {
        this.hideModal();
      }
    });

    // Continue shopping button
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn-continue-shopping")) {
        e.preventDefault();
        this.hideModal();
      }
    });

    // Proceed to checkout button
    document.addEventListener("click", (e) => {
      if (e.target.matches(".btn-proceed-checkout")) {
        e.preventDefault();
        // Redirect to checkout page or show checkout form
        alert("Chức năng thanh toán đang được phát triển.");
      }
    });

    // Remove item from cart
    document.addEventListener("click", (e) => {
      if (
        e.target.matches(".remove-item-btn") ||
        e.target.closest(".remove-item-btn")
      ) {
        e.preventDefault();
        const removeBtn = e.target.closest(".remove-item-btn") || e.target;
        const productId = removeBtn.getAttribute("data-product-id");
        if (productId) {
          this.removeFromCart(productId);
        }
      }
    });

    // Cart icon click
    document.addEventListener("click", (e) => {
      const cartIcon = e.target.closest("#cart-icon");
      if (cartIcon) {
        e.preventDefault();
        if (this.cart.length > 0) {
          // If there are items in cart, show the modal with the last added item
          const lastProduct = this.cart[this.cart.length - 1];
          this.showModal(lastProduct);
        } else {
          // If cart is empty, show an alert
          alert("Giỏ hàng của bạn đang trống");
        }
      }
    });

    // Listen for header loaded event
    window.addEventListener("headerLoaded", () => {
      console.log("Header loaded, updating cart count");
      this.updateCartCount();
    });

    // Also update cart count when DOM is fully loaded
    if (document.readyState === "complete") {
      this.updateCartCount();
    } else {
      window.addEventListener("load", () => {
        this.updateCartCount();
      });
    }
  }

  createCartModal() {
    // Create modal element if it doesn't exist
    if (!document.getElementById("cart-modal")) {
      const modalHTML = `
        <div id="cart-modal" class="cart-modal">
          <div class="cart-modal-content">
            <span class="cart-modal-close">&times;</span>
            <div class="cart-modal-body">
              <!-- Content will be dynamically inserted here -->
            </div>
          </div>
        </div>
      `;

      // Append modal to body
      const modalContainer = document.createElement("div");
      modalContainer.innerHTML = modalHTML;
      document.body.appendChild(modalContainer.firstElementChild);

      // Add modal styles if not already in document
      if (!document.getElementById("cart-modal-styles")) {
        const styleElement = document.createElement("style");
        styleElement.id = "cart-modal-styles";
        styleElement.textContent = `
          .cart-modal {
            display: none;
            position: fixed;
            z-index: 9999;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.5);
          }
          
          .cart-modal-content {
            background-color: white;
            margin: 10% auto;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            width: 80%;
            max-width: 600px;
            position: relative;
            animation: modalFadeIn 0.3s ease;
          }
          
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .cart-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            color: #aaa;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.2s;
            z-index: 10;
            width: 30px;
            height: 30px;
            text-align: center;
            line-height: 30px;
            border-radius: 50%;
          }
          
          .cart-modal-close:hover {
            color: #f6903d;
            background-color: #f8f8f8;
          }
          
          .cart-modal-header {
            border-bottom: 1px solid #eee;
            padding-bottom: 15px;
            margin-bottom: 15px;
            position: relative;
            padding-right: 30px;
          }
          
          .cart-modal-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 0;
            padding-right: 30px;
          }
          
          .cart-item {
            display: flex;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
          }
          
          .cart-item-image {
            width: 80px;
            height: 60px;
            margin-right: 15px;
            border-radius: 8px;
            overflow: hidden;
          }
          
          .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .cart-item-info {
            flex: 1;
          }
          
          .cart-item-title {
            font-size: 16px;
            font-weight: bold;
            margin: 0 0 5px;
            color: #333;
          }
          
          .cart-item-price {
            font-size: 16px;
            color: #f6903d;
            font-weight: bold;
          }
          
          .cart-item-quantity {
            display: flex;
            align-items: center;
            margin-left: 15px;
          }
          
          .cart-item-quantity span {
            font-size: 16px;
            font-weight: bold;
            margin: 0 10px;
          }
          
          .remove-item-btn {
            color: #dc3545;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 18px;
            margin-left: 15px;
            transition: all 0.2s;
            padding: 5px;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .remove-item-btn:hover {
            color: #c82333;
            background-color: #f8f8f8;
            transform: scale(1.1);
          }
          
          .cart-summary {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
          }
          
          .cart-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 20px;
          }
          
          .cart-total-price {
            color: #f6903d;
            font-size: 20px;
          }
          
          .cart-buttons {
            display: flex;
            justify-content: space-between;
            gap: 15px;
          }
          
          .btn-continue-shopping,
          .btn-proceed-checkout {
            padding: 12px 25px;
            border-radius: 30px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            border: none;
            cursor: pointer;
            flex: 1;
          }
          
          .btn-continue-shopping {
            background: #fff;
            color: #f6903d;
            border: 2px solid #f6903d;
          }
          
          .btn-continue-shopping:hover {
            background: #fff8f3;
            transform: translateY(-2px);
          }
          
          .btn-proceed-checkout {
            background: #f6903d;
            color: white;
          }
          
          .btn-proceed-checkout:hover {
            background: #e67e00;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(246, 144, 61, 0.4);
          }
          
          .cart-empty {
            text-align: center;
            padding: 30px 0;
          }
          
          .cart-empty i {
            font-size: 48px;
            color: #ccc;
            margin-bottom: 15px;
          }
          
          .cart-empty p {
            font-size: 18px;
            color: #666;
            margin: 0;
          }
          
          @media (max-width: 768px) {
            .cart-modal-content {
              width: 95%;
              margin: 5% auto;
            }
            
            .cart-buttons {
              flex-direction: column;
            }
            
            .cart-item {
              flex-wrap: wrap;
            }
            
            .cart-item-quantity {
              margin-left: 0;
              margin-top: 10px;
            }
          }
        `;
        document.head.appendChild(styleElement);
      }

      // Add direct event listener to close button
      setTimeout(() => {
        const closeBtn = document.querySelector(".cart-modal-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", () => {
            this.hideModal();
          });
        }
      }, 100);
    }
  }

  showModal(product) {
    const modal = document.getElementById("cart-modal");
    if (!modal) return;

    const modalBody = modal.querySelector(".cart-modal-body");

    // Update modal content
    modalBody.innerHTML = `
      <div class="cart-modal-header">
        <h3 class="cart-modal-title">Bạn đã thêm ${
          product.name
        } vào giỏ hàng</h3>
      </div>
      
      <div class="cart-items">
        <div class="cart-item">
          <div class="cart-item-image">
            <img src="${
              product.image.startsWith("//")
                ? "https:" + product.image
                : product.image
            }" alt="${product.name}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${product.name}</h4>
            <div class="cart-item-price">${product.price}</div>
          </div>
          <div class="cart-item-quantity">
            <span>SỐ LƯỢNG: ${product.quantity || 1}</span>
          </div>
          <button class="remove-item-btn" data-product-id="${product.id}">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div class="cart-summary">
        <div class="cart-total">
          <span>Thành tiền:</span>
          <span class="cart-total-price">${product.price}</span>
        </div>
        <div class="cart-buttons">
          <button class="btn-continue-shopping">
            <i class="fas fa-arrow-left"></i>
            Tiếp tục mua hàng
          </button>
          <button class="btn-proceed-checkout">
            <i class="fas fa-shopping-cart"></i>
            Tiến hành đặt hàng
          </button>
        </div>
      </div>
    `;

    // Show modal
    modal.style.display = "block";

    // Prevent body scrolling when modal is open
    document.body.style.overflow = "hidden";

    // Ensure close button works
    const closeBtn = modal.querySelector(".cart-modal-close");
    if (closeBtn) {
      // Remove existing event listeners to prevent duplicates
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

      // Add event listener to the new button
      newCloseBtn.addEventListener("click", () => {
        this.hideModal();
      });
    }
  }

  hideModal() {
    const modal = document.getElementById("cart-modal");
    if (modal) {
      modal.style.display = "none";

      // Restore body scrolling
      document.body.style.overflow = "";
    }
  }

  addToCart(product) {
    // Check if product already exists in cart
    const existingProductIndex = this.cart.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex >= 0) {
      // Increment quantity if product already in cart
      this.cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to cart
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }

    // Save cart to storage
    this.saveCartToStorage();

    // Update cart count in header
    this.updateCartCount();

    // Show modal with added product
    this.showModal(product);
  }

  removeFromCart(productId) {
    // Remove product from cart
    this.cart = this.cart.filter((item) => item.id !== productId);

    // Save cart to storage
    this.saveCartToStorage();

    // Update cart count in header
    this.updateCartCount();

    // Hide modal if cart is empty
    if (this.cart.length === 0) {
      this.hideModal();
    } else {
      // Update modal content
      const product = this.cart[this.cart.length - 1];
      this.showModal(product);
    }
  }

  updateCartCount() {
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
      // Calculate total quantity
      const totalQuantity = this.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      cartCountElement.textContent = totalQuantity;
      console.log("Cart count updated:", totalQuantity);
    } else {
      console.log("Cart count element not found, will retry in 500ms");
      // If cart count element is not found yet (header might still be loading),
      // try again after a short delay
      setTimeout(() => this.updateCartCount(), 500);
    }
  }

  // Public method to be called from external scripts
  static init() {
    if (!window.cartManager) {
      window.cartManager = new CartManager();
    }
    return window.cartManager;
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("=== CART MANAGER INITIALIZATION ===");
  CartManager.init();
});

// Export for module usage if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = CartManager;
}
