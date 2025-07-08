// View Switcher JavaScript - Handles Grid/List view switching functionality

document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for the page to fully load
  setTimeout(function () {
    // Get view switcher elements
    const gridViewBtn = document.querySelector(
      '.switch-view[data-view="grid"]'
    );
    const listViewBtn = document.querySelector(
      '.switch-view[data-view="list"]'
    );
    const productsContainer = document.querySelector(".products-view");
    const productItems = document.querySelectorAll(".item_product_main");

    console.log("Grid button:", gridViewBtn);
    console.log("List button:", listViewBtn);
    console.log("Products container:", productsContainer);
    console.log("Product items:", productItems.length);

    // Check if elements exist
    if (!gridViewBtn || !listViewBtn || !productsContainer) {
      console.warn("View switcher elements not found");
      return;
    }

    // Function to switch to grid view
    function switchToGridView() {
      console.log("Switching to grid view");

      // Update button states
      gridViewBtn.querySelector(".button-view-mode").classList.add("active");
      listViewBtn.querySelector(".button-view-mode").classList.remove("active");

      // Update container classes
      productsContainer.classList.remove("products-view-list");
      productsContainer.classList.add("products-view-grid");

      // Reset product items to grid layout
      productItems.forEach((item) => {
        item.classList.remove("list-item-layout");

        // Check if item has been converted to list layout
        const rowWrapper = item.querySelector(".row");
        if (rowWrapper) {
          // Get original elements from the row structure
          const imageCol = rowWrapper.querySelector(".col-lg-4.image");
          const infoCol = rowWrapper.querySelector(".col-lg-8.info");

          if (imageCol && infoCol) {
            const productThumbnail =
              imageCol.querySelector(".product-thumbnail");
            const productInfoWrapper = infoCol.querySelector(".product-info");
            const contactBtn = infoCol.querySelector(".contact");

            // Clear item and restore original structure
            item.innerHTML = "";

            // Create form wrapper (original structure)
            const form = document.createElement("form");
            form.action = "/cart/add";
            form.method = "post";
            form.className = "variants product-action";
            form.setAttribute("data-cart-form", "");
            form.setAttribute("data-id", "product-actions-1633302");
            form.setAttribute("enctype", "multipart/form-data");

            // Add thumbnail
            if (productThumbnail) {
              form.appendChild(productThumbnail.cloneNode(true));
            }

            // Create product info div
            const productInfoDiv = document.createElement("div");
            productInfoDiv.className = "product-info";

            // Add product name
            const productName =
              productInfoWrapper?.querySelector(".product-name");
            if (productName) {
              productInfoDiv.appendChild(productName.cloneNode(true));
            }

            form.appendChild(productInfoDiv);

            // Create price box
            const priceBoxDiv = document.createElement("div");
            priceBoxDiv.className = "price-box";
            if (contactBtn) {
              priceBoxDiv.appendChild(contactBtn.cloneNode(true));
            }

            form.appendChild(priceBoxDiv);
            item.appendChild(form);
          }
        }
      });

      // Store preference in localStorage
      localStorage.setItem("viewMode", "grid");
      console.log("Grid view applied");
    }

    // Function to switch to list view
    function switchToListView() {
      console.log("Switching to list view");

      // Update button states
      listViewBtn.querySelector(".button-view-mode").classList.add("active");
      gridViewBtn.querySelector(".button-view-mode").classList.remove("active");

      // Update container classes
      productsContainer.classList.remove("products-view-grid");
      productsContainer.classList.add("products-view-list");

      // Convert product items to list layout
      productItems.forEach((item) => {
        item.classList.add("list-item-layout");

        // Check if list wrapper already exists
        if (!item.querySelector(".row")) {
          const productThumbnail = item.querySelector(".product-thumbnail");
          const productInfo = item.querySelector(".product-info");
          const priceBox = item.querySelector(".price-box");

          if (productThumbnail && productInfo && priceBox) {
            // Store original content
            const originalContent = item.innerHTML;

            // Get product ID from the thumbnail link
            const productLink = productThumbnail.querySelector("a");
            const productId = productLink
              ? productLink.getAttribute("data-product-id")
              : null;

            // Get product data from the global products array if available
            let productData = null;
            if (window.productManager && productId) {
              productData = window.productManager.products.find(
                (p) => p.id === productId
              );
            }

            // Get price information
            let priceHtml = "";
            if (productData) {
              if (productData.price === "Liên hệ") {
                priceHtml = `<a class="contact">Liên hệ</a>`;
              } else if (productData.hasDiscount) {
                priceHtml = `${productData.price}&nbsp;<span class="compare-price">${productData.originalPrice}</span>`;
              } else {
                priceHtml = productData.price;
              }
            } else {
              // Fallback to existing price box content
              priceHtml = priceBox.innerHTML;
            }

            // Create row wrapper
            const rowWrapper = document.createElement("div");
            rowWrapper.className = "row";

            // Create image column
            const imageCol = document.createElement("div");
            imageCol.className = "col-lg-4 col-md-4 col-12 image";
            imageCol.appendChild(productThumbnail.cloneNode(true));

            // Create info column
            const infoCol = document.createElement("div");
            infoCol.className = "col-lg-8 col-md-8 col-12 info";

            // Create product info wrapper
            const infoWrapper = document.createElement("div");
            infoWrapper.className = "product-info";

            // Clone product name
            const productName = productInfo.querySelector(".product-name");
            if (productName) {
              infoWrapper.appendChild(productName.cloneNode(true));
            }

            // Add description div
            const descDiv = document.createElement("div");
            descDiv.className = "desproduct";

            // Add description from product data if available
            if (productData && productData.description) {
              descDiv.innerHTML = productData.description;
            } else {
              descDiv.innerHTML =
                "Trường mầm non Sunshine School sử dụng chương trình giáo dục mầm non tiên tiến được xây dựng bởi các chuyên gia giáo dục Canada. Chương trình ...";
            }
            infoWrapper.appendChild(descDiv);

            // Add price-box with price information
            const priceBoxElement = document.createElement("div");
            priceBoxElement.className = "price-box";
            priceBoxElement.innerHTML = priceHtml;
            infoWrapper.appendChild(priceBoxElement);

            // Add price-box2 with contact button if it's "Liên hệ"
            if (productData && productData.price === "Liên hệ") {
              const priceBox2 = document.createElement("div");
              priceBox2.className = "price-box2";
              const contactBtn = document.createElement("a");
              contactBtn.className = "contact";
              contactBtn.textContent = "Liên hệ";
              priceBox2.appendChild(contactBtn);
              infoWrapper.appendChild(priceBox2);
            }

            infoCol.appendChild(infoWrapper);

            // Add columns to row
            rowWrapper.appendChild(imageCol);
            rowWrapper.appendChild(infoCol);

            // Clear item content and add row
            item.innerHTML = "";
            item.appendChild(rowWrapper);

            // Store original content for restoration
            item.setAttribute("data-original-content", originalContent);
          }
        }
      });

      // Store preference in localStorage
      localStorage.setItem("viewMode", "list");
      console.log("List view applied");
    }

    // Function to load saved view mode
    function loadSavedViewMode() {
      const savedViewMode = localStorage.getItem("viewMode");

      if (savedViewMode === "list") {
        switchToListView();
      } else {
        // Default to grid view
        switchToGridView();
      }
    }

    // Event listeners for view switcher buttons
    gridViewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      switchToGridView();
    });

    listViewBtn.addEventListener("click", function (e) {
      e.preventDefault();
      switchToListView();
    });

    // Initialize view mode on page load - default to grid
    // Don't load saved mode initially to see the default state
    switchToGridView();

    // Optional: Add keyboard navigation
    document.addEventListener("keydown", function (e) {
      // Press 'G' for grid view
      if (e.key === "g" || e.key === "G") {
        switchToGridView();
      }
      // Press 'L' for list view
      else if (e.key === "l" || e.key === "L") {
        switchToListView();
      }
    });
  }, 500); // Wait 500ms for page to load
});

// Export functions for external use if needed
window.ViewSwitcher = {
  switchToGrid: function () {
    document.querySelector('.switch-view[data-view="grid"]').click();
  },
  switchToList: function () {
    document.querySelector('.switch-view[data-view="list"]').click();
  },
  getCurrentView: function () {
    return localStorage.getItem("viewMode") || "grid";
  },
};
