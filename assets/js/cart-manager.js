/**
 * Cart Manager
 * Handles all cart operations for the SunSchool site
 */

class CartManager {
  constructor() {
    this.cart = [];
    this.loadCartFromStorage();
    this.updateCartCount();
    this.updateCartDropdown();
  }

  // Load cart from localStorage
  loadCartFromStorage() {
    try {
      const savedCart = localStorage.getItem("sunschool_cart");
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      }
    } catch (e) {
      console.error("Error loading cart:", e);
      this.cart = [];
    }
  }

  // Save cart to localStorage
  saveCartToStorage() {
    try {
      localStorage.setItem("sunschool_cart", JSON.stringify(this.cart));
      // Dispatch a custom event to notify that the cart has been updated
      window.dispatchEvent(new CustomEvent("cartUpdated"));
    } catch (e) {
      console.error("Error saving cart:", e);
    }
  }

  // Add item to cart
  addToCart(product) {
    console.log("Adding to cart:", product);

    // Check if product already exists in cart
    const existingProduct = this.cart.find((item) => item.id === product.id);

    if (existingProduct) {
      // Increase quantity if product already in cart
      existingProduct.quantity += product.quantity || 1;
    } else {
      // Add new product to cart
      this.cart.push({
        ...product,
        quantity: product.quantity || 1,
      });
    }

    this.saveCartToStorage();
    this.updateCartCount();
    this.updateCartDropdown();

    console.log("Cart after adding:", this.cart);

    // Show cart modal if it exists (for product detail page)
    this.showCartModal(product);

    return this.cart;
  }

  // Remove item from cart
  removeFromCart(productId) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCartToStorage();
    this.updateCartCount();
    this.updateCartDropdown();

    return this.cart;
  }

  // Increase quantity of a product
  increaseQuantity(productId) {
    const product = this.cart.find((item) => item.id === productId);
    if (product) {
      product.quantity += 1;
      this.saveCartToStorage();
      this.updateCartCount();
      this.updateCartDropdown();
    }

    return this.cart;
  }

  // Decrease quantity of a product
  decreaseQuantity(productId) {
    const product = this.cart.find((item) => item.id === productId);
    if (product) {
      product.quantity -= 1;

      if (product.quantity <= 0) {
        return this.removeFromCart(productId);
      }

      this.saveCartToStorage();
      this.updateCartCount();
      this.updateCartDropdown();
    }

    return this.cart;
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.updateCartCount();
    this.updateCartDropdown();

    return this.cart;
  }

  // Get cart total
  getCartTotal() {
    return this.cart.reduce((total, item) => {
      // Extract price from price string (e.g. "1.000.000đ" -> 1000000)
      let itemPrice = 0;
      if (item.price && !item.price.includes("Liên hệ")) {
        const priceString = item.price;
        const matches = priceString.match(/[\d,.]+/g);
        if (matches && matches.length > 0) {
          itemPrice = parseFloat(
            matches[0].replace(/\./g, "").replace(/,/g, "")
          );
        }
      }
      return total + itemPrice * item.quantity;
    }, 0);
  }

  // Get cart item count
  getCartCount() {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Update cart count in header
  updateCartCount() {
    // Find all cart count elements (could be multiple if we have mobile and desktop headers)
    const cartCountElements = document.querySelectorAll(".cart-count");
    if (cartCountElements.length > 0) {
      const count = this.getCartCount();
      cartCountElements.forEach((element) => {
        element.textContent = count;
      });
    }

    // Dispatch an event that the cart count has been updated
    window.dispatchEvent(
      new CustomEvent("cartCountUpdated", {
        detail: { count: this.getCartCount() },
      })
    );
  }

  // Format price
  formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₫", "đ");
  }

  // Show cart modal after adding product (for product detail page)
  showCartModal(addedProduct = null) {
    const modal = document.getElementById("cartModal");
    if (!modal) {
      console.log("Modal not found!");
      return; // Modal doesn't exist on this page
    }

    console.log("Showing cart modal...");

    // Update modal content first
    this.updateCartModalContent(addedProduct);

    // Use Bootstrap modal if available
    if (window.jQuery && window.jQuery.fn.modal) {
      console.log("Using Bootstrap modal");
      window.jQuery("#cartModal").modal("show");
    } else {
      console.log("Using fallback modal display");
      // Fallback if jQuery/Bootstrap modal not available
      modal.style.display = "block";
      modal.classList.add("show", "fade");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      // Add proper modal styling
      modal.style.paddingRight = "17px";

      // Create backdrop if it doesn't exist
      let backdrop = document.querySelector(".modal-backdrop");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.className = "modal-backdrop fade show";
        backdrop.style.zIndex = "1040";
        document.body.appendChild(backdrop);
      }

      // Setup close modal functionality
      const closeModal = () => {
        console.log("Closing modal...");
        modal.style.display = "none";
        modal.classList.remove("show", "fade");
        modal.setAttribute("aria-hidden", "true");
        modal.style.paddingRight = "";
        document.body.classList.remove("modal-open");
        if (backdrop && backdrop.parentNode) {
          backdrop.parentNode.removeChild(backdrop);
        }
      };

      // Remove existing event listeners to prevent duplicates
      const existingBackdrop = document.querySelector(".modal-backdrop");
      if (existingBackdrop) {
        existingBackdrop.replaceWith(existingBackdrop.cloneNode(true));
      }

      // Add event listeners
      backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.addEventListener("click", closeModal);
      }

      const closeButtons = modal.querySelectorAll(
        "[data-dismiss='modal'], .close"
      );
      closeButtons.forEach((btn) => {
        btn.addEventListener("click", closeModal);
      });

      // ESC key to close
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          closeModal();
        }
      });
    }
  }

  // Update cart modal content
  updateCartModalContent(addedProduct = null) {
    console.log("Updating cart modal content...");

    // Update cart count in header
    const cartCountEl = document.getElementById("modal-cart-count");
    if (cartCountEl) {
      cartCountEl.textContent = this.cart.length;
    }

    // Update cart items table
    const cartItemsTableEl = document.getElementById("cart-items-table");
    if (cartItemsTableEl) {
      cartItemsTableEl.innerHTML = this.generateCartTable();
    }

    // Update cart total
    const cartTotalEl = document.getElementById("cart-total-price");
    if (cartTotalEl) {
      const total = this.calculateTotal();
      cartTotalEl.textContent = this.formatPrice(total);
    }

    // If cart is empty after removing items, close modal
    if (this.cart.length === 0) {
      if (window.jQuery && window.jQuery.fn.modal) {
        window.jQuery("#cartModal").modal("hide");
      } else {
        const modal = document.getElementById("cartModal");
        if (modal) {
          modal.style.display = "none";
          modal.classList.remove("show");
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
          }
        }
      }
    }
  }

  // Generate complete cart table for modal
  generateCartTable() {
    if (this.cart.length === 0) {
      return '<div class="empty-cart-message" style="text-align: center; padding: 40px; color: #666; font-size: 16px;">Giỏ hàng của bạn đang trống</div>';
    }

    return `
      <table class="cart-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
            <th style="padding: 12px; text-align: left; font-weight: 600; color: #333; border-bottom: 1px solid #dee2e6;">Sản phẩm</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #333; border-bottom: 1px solid #dee2e6;">Đơn giá</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #333; border-bottom: 1px solid #dee2e6;">Số lượng</th>
            <th style="padding: 12px; text-align: center; font-weight: 600; color: #333; border-bottom: 1px solid #dee2e6;">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${this.generateModalCartItems()}
        </tbody>
      </table>
    `;
  }

  // Generate cart items HTML for modal
  generateModalCartItems() {
    if (this.cart.length === 0) {
      return '<tr><td colspan="4" class="text-center text-muted">Giỏ hàng trống</td></tr>';
    }

    return this.cart
      .map((item) => {
        const itemPrice = this.getItemPrice(item);
        const itemTotal = itemPrice * item.quantity;

        // Ensure image URL is valid
        let imageUrl = item.image || "";
        if (imageUrl.startsWith("//")) {
          imageUrl = "https:" + imageUrl;
        }

        return `
        <tr class="cart-item-row" data-product-id="${
          item.id
        }" style="border-bottom: 1px solid #dee2e6;">
          <td style="padding: 15px; vertical-align: middle;">
            <div class="cart-product-info" style="display: flex; align-items: center;">
              <img src="${imageUrl}" alt="${
          item.name
        }" class="cart-product-image" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px;">
              <div class="cart-product-details">
                <div class="cart-product-name" style="font-weight: 600; color: #333; margin-bottom: 8px;">${
                  item.name
                }</div>
                <div class="cart-product-remove" onclick="cartManager.removeFromCartModal('${
                  item.id
                }');" style="cursor: pointer; color: #dc3545; font-size: 12px; display: flex; align-items: center; gap: 4px;">
                  <i class="fas fa-times"></i>
                  <span>Bỏ sản phẩm</span>
                </div>
              </div>
            </div>
          </td>
          <td class="cart-price-cell" data-label="Đơn giá" style="padding: 15px; text-align: center; vertical-align: middle; font-weight: 600; color: #ff6b35;">${this.formatPrice(
            itemPrice
          )}</td>
          <td class="cart-quantity-cell" data-label="Số lượng" style="padding: 15px; text-align: center; vertical-align: middle;">
            <div class="quantity-controls" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
              <button class="quantity-btn decrease-btn ${
                item.quantity <= 1 ? "disabled" : ""
              }" 
                      onclick="cartManager.decreaseQuantityModal('${item.id}')"
                      ${item.quantity <= 1 ? "disabled" : ""}
                      style="width: 30px; height: 30px; border: 1px solid #dee2e6; background: white; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                -
              </button>
              <input type="number" 
                     class="quantity-input" 
                     value="${item.quantity}" 
                     min="1" 
                     max="99"
                     onchange="cartManager.updateQuantityModal('${
                       item.id
                     }', this.value)"
                     onblur="if(this.value < 1) this.value = 1; if(this.value > 99) this.value = 99;"
                     style="width: 50px; text-align: center; border: 1px solid #dee2e6; border-radius: 4px; padding: 4px 8px;">
              <button class="quantity-btn increase-btn" 
                      onclick="cartManager.increaseQuantityModal('${item.id}')"
                      style="width: 30px; height: 30px; border: 1px solid #dee2e6; background: white; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center;">
                +
              </button>
            </div>
          </td>
          <td class="cart-total-cell" data-label="Thành tiền" style="padding: 15px; text-align: center; vertical-align: middle; font-weight: 700; color: #ff6b35; font-size: 16px;">${this.formatPrice(
            itemTotal
          )}</td>
        </tr>
      `;
      })
      .join("");
  }

  // Get price of a single item
  getItemPrice(item) {
    if (!item.price || item.price.includes("Liên hệ")) {
      return 0;
    }

    const priceString = item.price;
    const matches = priceString.match(/[\d,.]+/g);
    if (matches && matches.length > 0) {
      return parseFloat(matches[0].replace(/\./g, "").replace(/,/g, ""));
    }

    return 0;
  }

  // Calculate total cart value
  calculateTotal() {
    return this.cart.reduce((total, item) => {
      const itemPrice = this.getItemPrice(item);
      return total + itemPrice * item.quantity;
    }, 0);
  }

  // Modal-specific quantity management methods
  increaseQuantityModal(productId) {
    const product = this.cart.find((item) => item.id === productId);
    if (product && product.quantity < 99) {
      product.quantity += 1;
      this.saveCartToStorage();
      this.updateCartCount();
      this.updateCartDropdown();
      this.updateCartModalContent();
    }
  }

  decreaseQuantityModal(productId) {
    const product = this.cart.find((item) => item.id === productId);
    if (product) {
      if (product.quantity <= 1) {
        // Remove product if quantity would be 0
        this.removeFromCartModal(productId);
      } else {
        product.quantity -= 1;
        this.saveCartToStorage();
        this.updateCartCount();
        this.updateCartDropdown();
        this.updateCartModalContent();
      }
    }
  }

  updateQuantityModal(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) {
      // If invalid quantity, remove product or reset to 1
      this.removeFromCartModal(productId);
      return;
    }

    const product = this.cart.find((item) => item.id === productId);
    if (product) {
      product.quantity = Math.min(quantity, 99); // Max 99 items
      this.saveCartToStorage();
      this.updateCartCount();
      this.updateCartDropdown();
      this.updateCartModalContent();
    }
  }

  removeFromCartModal(productId) {
    this.removeFromCart(productId);
    this.updateCartModalContent();

    // If cart is empty, close modal
    if (this.cart.length === 0) {
      if (window.jQuery && window.jQuery.fn.modal) {
        window.jQuery("#cartModal").modal("hide");
      }
    }
  }

  // Update cart dropdown in header
  updateCartDropdown() {
    const cartDropdown = document.querySelector(".cart-dropdown");
    if (!cartDropdown) return;

    if (this.cart.length === 0) {
      cartDropdown.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
        </div>
      `;
      return;
    }

    let cartItems = "";
    let totalPrice = 0;

    this.cart.forEach((item) => {
      // Extract price
      let itemPrice = 0;
      if (item.price && !item.price.includes("Liên hệ")) {
        const priceString = item.price;
        const matches = priceString.match(/[\d,.]+/g);
        if (matches && matches.length > 0) {
          itemPrice = parseFloat(
            matches[0].replace(/\./g, "").replace(/,/g, "")
          );
        }
      }

      totalPrice += itemPrice * item.quantity;

      cartItems += `
        <div class="cart-item">
          <div class="cart-item-image">
            <a href="${item.url || "#"}">
            <img src="${
              item.image.startsWith("//") ? "https:" + item.image : item.image
            }" alt="${item.name}">
            </a>
          </div>
          <div class="cart-item-info">
            <a href="${item.url || "#"}" class="cart-item-name">${item.name}</a>
            <div class="cart-item-price">${item.price} x ${item.quantity}</div>
          </div>
          <div class="cart-item-remove">
            <a href="javascript:;" data-product-id="${
              item.id
            }" class="remove-cart-item">
              <i class="fas fa-times"></i>
            </a>
          </div>
        </div>
      `;
    });

    cartDropdown.innerHTML = `
      <div class="cart-content">
        <div class="cart-items">
          ${cartItems}
      </div>
        <div class="cart-total">
          <span>Tổng tiền:</span>
          <span class="total-price">${this.formatPrice(totalPrice)}</span>
        </div>
        <div class="cart-actions">
          <a href="./GioHang.html" class="btn-view-cart">Xem giỏ hàng</a>
          <a href="./ThanhToan.html" class="btn-checkout">Thanh toán</a>
        </div>
      </div>
    `;

    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-cart-item").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-product-id");
        if (productId) {
          this.removeFromCart(productId);
        }
      });
    });

    // Add event listeners for cart buttons
    const cartButtons = document.querySelectorAll(".cart-actions a");
    cartButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.classList.contains("btn-checkout")) {
          // Prevent default only if we want to show a message
          // e.preventDefault();
          // alert("Tính năng thanh toán đang được phát triển!");
        }
      });
    });
  }

  // Render cart items on the cart page
  renderCartPage() {
    // Check if we're on the cart page
    const cartPageContainer = document.querySelector(".CartPageContainer");
    if (!cartPageContainer) return;

    // If cart is empty, show empty cart message
    if (this.cart.length === 0) {
      cartPageContainer.innerHTML = `
        <div class="empty-cart-page">
          <div class="empty-cart-icon">
            <i class="fas fa-shopping-cart fa-4x"></i>
          </div>
          <p class="empty-cart-message">Không có sản phẩm nào trong giỏ hàng của bạn</p>
          <div class="empty-cart-actions">
            <a href="./SanPham.html" class="btn btn-primary">Tiếp tục mua sắm</a>
          </div>
        </div>
      `;
      return;
    }

    // Generate cart items HTML
    let cartItemsHtml = "";
    let totalPrice = 0;

    this.cart.forEach((item, index) => {
      // Extract price
      let itemPrice = 0;
      if (item.price && !item.price.includes("Liên hệ")) {
        const priceString = item.price;
        const matches = priceString.match(/[\d,.]+/g);
        if (matches && matches.length > 0) {
          itemPrice = parseFloat(
            matches[0].replace(/\./g, "").replace(/,/g, "")
          );
        }
      }

      const itemTotal = itemPrice * item.quantity;
      totalPrice += itemTotal;

      cartItemsHtml += `
        <div class="ajaxcart__row">
          <div class="ajaxcart__product cart_product" data-line="${index + 1}">
            <div class="grid__item cart_info">
              <a href="${
                item.url || "#"
              }" class="ajaxcart__product-image cart_image" title="${
        item.name
      }">
                <img src="${
                  item.image.startsWith("//")
                    ? "https:" + item.image
                    : item.image
                }" alt="${item.name}">
              </a>
              <div class="ajaxcart__product-name-wrapper cart_name">
                <a href="${
                  item.url || "#"
                }" class="ajaxcart__product-name h4" title="${item.name}">${
        item.name
      }</a>
                <div class="remove-button-container">
                  <a class="cart__btn-remove remove-item-cart" href="javascript:;" data-product-id="${
                    item.id
                  }" title="Xóa">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" class="svg-inline--fa fa-times fa-w-11">
                      <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z" class=""></path>
                    </svg> 
                    <span style="color: #f6903d;">× Bỏ sản phẩm</span>
                  </a>
                </div>
              </div>
            </div>
            <div class="grid grid_price">
              <div class="grid__item one-half cart_prices">
                <span class="cart-price">${this.formatPrice(itemPrice)}</span>
              </div>
            </div>
            <div class="grid grid_amount">
              <div class="grid__item one-half cart_select">
                <div class="ajaxcart__qty input-group-btn">
                  <input type="text" name="updates[]" class="ajaxcart__qty-num number-sidebar" maxlength="3" value="${
                    item.quantity
                  }" min="0" data-id="${item.id}" data-line="${
        index + 1
      }" aria-label="quantity" pattern="[0-9]*">
                  <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--minus items-count" data-id="${
                    item.id
                  }" data-qty="${item.quantity - 1}" data-line="${
        index + 1
      }" aria-label="-">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"></path>
                    </svg>
                  </button>
                  <button type="button" class="ajaxcart__qty-adjust ajaxcart__qty--plus items-count" data-id="${
                    item.id
                  }" data-line="${index + 1}" data-qty="${
        item.quantity + 1
      }" aria-label="+">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="grid grib_money">
              <div class="grid__item one-half cart_prices">
                <span class="cart-price">${this.formatPrice(itemTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    // Generate form HTML
    const formHtml = `
      <form action="/cart" method="post" novalidate="" class="cart ajaxcart cartpage">
        <div class="cart-header-info">
          <div>Thông tin sản phẩm</div>
          <div>Đơn giá</div>
          <div>Số lượng</div>
          <div>Thành tiền</div>
        </div>
        <div class="ajaxcart__inner ajaxcart__inner--has-fixed-footer cart_body items">
          ${cartItemsHtml}
        </div>
        <div class="ajaxcart__footer ajaxcart__footer--fixed cart-footer">
          <div class="row">
            <div class="col-lg-7 d-none d-lg-block"></div>
            <div class="col-lg-5 col-md-12">
              <h4 class="text-right">TỔNG SỐ THÀNH TIỀN</h4>
              <div class="inner">
                <div class="ajaxcart__subtotal">
                  <div class="cart__subtotal">
                    <div class="cart__col-6">Tổng tiền:</div>
                    <div class="cart__totle"><span class="total-price">${this.formatPrice(
                      totalPrice
                    )}</span></div>
                  </div>
                  <hr>
                  <div class="cart__subtotal">
                    <div class="cart__col-6">Thành tiền:</div>
                    <div class="cart__totle"><span class="total-price">${this.formatPrice(
                      totalPrice
                    )}</span></div>
                  </div>
                </div>
                <button type="button" class="cart__btn-proceed-checkout-dt button btn btn-default cart__btn-proceed-checkout" id="btn-proceed-checkout" title="Thanh toán">Tiến hành thanh toán</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    `;

    cartPageContainer.innerHTML = formHtml;

    // Add event listeners
    this.addCartPageEventListeners();
  }

  // Add event listeners for cart page elements
  addCartPageEventListeners() {
    // Remove item buttons
    document.querySelectorAll(".remove-item-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-product-id");
        if (productId) {
          this.removeFromCart(productId);
          this.renderCartPage();
        }
      });
    });

    // Quantity inputs
    document.querySelectorAll(".ajaxcart__qty-num").forEach((input) => {
      input.addEventListener("change", (e) => {
        const productId = input.getAttribute("data-id");
        const newQuantity = parseInt(input.value);

        if (productId && !isNaN(newQuantity)) {
          if (newQuantity <= 0) {
            this.removeFromCart(productId);
          } else {
            const product = this.cart.find((item) => item.id === productId);
            if (product) {
              product.quantity = newQuantity;
              this.saveCartToStorage();
              this.updateCartCount();
              this.updateCartDropdown();
            }
          }
          this.renderCartPage();
        }
      });
    });

    // Quantity increase buttons
    document.querySelectorAll(".ajaxcart__qty--plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-id");
        if (productId) {
          this.increaseQuantity(productId);
          this.renderCartPage();
        }
      });
    });

    // Quantity decrease buttons
    document.querySelectorAll(".ajaxcart__qty--minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = btn.getAttribute("data-id");
        if (productId) {
          this.decreaseQuantity(productId);
          this.renderCartPage();
        }
      });
    });

    // Checkout button
    const checkoutButton = document.getElementById("btn-proceed-checkout");
    if (checkoutButton) {
      checkoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Redirect to checkout page instead of showing alert
        window.location.href = "./ThanhToan.html";
      });
    }
  }
}

// Initialize cart manager
document.addEventListener("DOMContentLoaded", function () {
  window.cartManager = new CartManager();

  // Initialize cart page if on cart page
  if (document.querySelector(".CartPageContainer")) {
    window.cartManager.renderCartPage();
  }

  // Make sure cart count is updated on all pages
  window.cartManager.updateCartCount();

  // Add to cart buttons
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const productId = this.getAttribute("data-id");
      const productName = this.getAttribute("data-name");
      const productPrice = this.getAttribute("data-price");
      const productImage = this.getAttribute("data-image");
      const productUrl = this.getAttribute("data-url") || "#";

      if (productId && productName && productPrice) {
        const product = {
          id: productId,
          name: productName,
          price: productPrice,
          image: productImage,
          url: productUrl,
          quantity: 1,
        };

        window.cartManager.addToCart(product);

        // Show notification
        alert("Sản phẩm đã được thêm vào giỏ hàng!");
      }
    });
  });
});

// Add styles for cart dropdown
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    .cart-dropdown {
      width: 320px;
      padding: 15px;
    }
    
    .cart-items {
      max-height: 300px;
      overflow-y: auto;
    }
    
    .cart-item {
      display: flex;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    
    .cart-item-image {
      width: 60px;
      flex-shrink: 0;
    }
    
    .cart-item-image img {
      width: 100%;
      height: auto;
      border-radius: 4px;
    }
    
    .cart-item-info {
      flex: 1;
      padding: 0 10px;
    }
    
    .cart-item-name {
      display: block;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
      text-decoration: none;
    }
    
    .cart-item-name:hover {
      color: #f6903d;
    }
    
    .cart-item-price {
      font-size: 13px;
      color: #f6903d;
    }
    
    .cart-item-remove {
      width: 20px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    
    .cart-item-remove a {
      color: #999;
      font-size: 12px;
    }
    
    .cart-item-remove a:hover {
      color: #ff5c5c;
    }
    
    .cart-total {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-top: 1px solid #eee;
      font-weight: bold;
    }
    
    .cart-total .total-price {
      color: #f6903d;
    }
    
    .cart-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    
    .btn-view-cart,
    .btn-checkout {
      padding: 8px 15px;
      border-radius: 4px;
      text-align: center;
      font-weight: bold;
      font-size: 13px;
      text-decoration: none;
      flex: 1;
    }
    
    .btn-view-cart {
      background: #f8f8f8;
      color: #333;
      margin-right: 5px;
    }
    
    .btn-view-cart:hover {
      background: #eee;
      color: #333;
      text-decoration: none;
    }
    
    .btn-checkout {
      background: #f6903d;
      color: white;
      margin-left: 5px;
    }
    
    .btn-checkout:hover {
      background: #e67e00;
      color: white;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);
});
