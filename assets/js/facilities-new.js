// Facility section animations and interactions
document.addEventListener("DOMContentLoaded", function () {
  console.log("Facilities JS loaded");

  // Ensure all images have the correct protocol
  const allImages = document.querySelectorAll("img");
  allImages.forEach((img) => {
    if (img.src && img.src.startsWith("//")) {
      img.src = "https:" + img.src;
      console.log("Fixed image URL:", img.src);
    }
  });

  // Check if element is in viewport function
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to handle animations when scrolling
  function handleScrollAnimations() {
    const facilitySection = document.querySelector(".home_csvc");
    const facilityItems = document.querySelectorAll(".facility-item");

    if (isElementInViewport(facilitySection)) {
      facilityItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("animated");
        }, 200 * index);
      });
    }
  }

  // Add hover effects for facility items
  const facilityItems = document.querySelectorAll(".facility-item");

  // Ensure equal heights for the top two facility items in 2-column layout
  function adjustHeights() {
    // Only apply this for desktop view
    if (window.innerWidth >= 992) {
      // Get all facility items in the first column (now side by side)
      const leftColumnItems = document.querySelectorAll(
        ".col-md-6.col-sm-6.facility-item"
      );

      if (leftColumnItems.length >= 2) {
        // First make sure both have the same height
        leftColumnItems.forEach((item) => {
          item.style.height = "auto";
        });

        // Find the tallest item in the first row
        let maxHeight = 0;
        leftColumnItems.forEach((item) => {
          const height = item.offsetHeight;
          if (height > maxHeight) {
            maxHeight = height;
          }
        });

        // Set all items to the tallest height
        leftColumnItems.forEach((item) => {
          item.style.height = maxHeight + "px";
        });
      }
    } else {
      // Reset heights on mobile
      const leftColumnItems = document.querySelectorAll(
        ".col-md-6.col-sm-6.facility-item"
      );
      leftColumnItems.forEach((item) => {
        item.style.height = "auto";
      });
    }
  }

  // Run on page load and resize
  window.addEventListener("resize", adjustHeights);
  window.addEventListener("load", adjustHeights);
  facilityItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.classList.add("hovered");
    });

    item.addEventListener("mouseleave", function () {
      this.classList.remove("hovered");
    });
  });

  // Initialize animations
  window.addEventListener("scroll", handleScrollAnimations);
  handleScrollAnimations(); // Check on initial load

  // Enhance image loading with progressive enhancement
  const lazyImages = document.querySelectorAll(".facility-img img");
  lazyImages.forEach((img) => {
    // Set initial opacity for fade-in effect
    img.style.opacity = "0";

    // Force image reload to ensure it loads properly
    const currentSrc = img.src;
    if (currentSrc) {
      // Add timestamp to bust cache if needed
      const newSrc = currentSrc.includes("?")
        ? currentSrc
        : currentSrc + "?t=" + new Date().getTime();

      // Reset and reload the image
      setTimeout(() => {
        img.src = newSrc;
      }, 100);
    }

    // When the image loads, fade it in
    img.onload = function () {
      img.style.transition = "opacity 0.5s ease-in";
      img.style.opacity = "1";

      // Add a subtle animation to the facility divider
      const divider = img
        .closest(".facility-inner")
        .querySelector(".facility-divider");
      if (divider) {
        divider.style.animation = "pulse 2s infinite";
      }
    };

    // Handle image loading errors
    img.onerror = function () {
      console.error("Failed to load image:", img.src);
      // Try again with protocol
      if (img.src.startsWith("//")) {
        img.src = "https:" + img.src;
      } else {
        // Fallback image or placeholder
        img.src =
          "https://bizweb.dktcdn.net/100/063/369/themes/877483/assets/placeholder.jpg";
      }
      img.style.opacity = "1";
    };
  });

  // Create a gentle pulse animation for the dividers
  const styleElement = document.createElement("style");
  styleElement.innerHTML = `
    @keyframes pulse {
      0% { opacity: 0.8; }
      50% { opacity: 1; }
      100% { opacity: 0.8; }
    }
    
    .facility-item.hovered .facility-divider {
      width: 80px;
      transition: width 0.3s ease-out;
    }
    
    .facility-item.hovered .facility-title {
      color: #e57f20;
      transition: color 0.3s ease;
    }

    .facility-item.animated {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleElement);
});
