// Facility section animations and interactions
document.addEventListener("DOMContentLoaded", function () {
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
    const facilityItems = document.querySelectorAll(".home_csvc_item");

    if (isElementInViewport(facilitySection)) {
      facilityItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add("animated");
        }, 200 * index);
      });
    }
  }

  // Add hover effects for facility items
  const facilityItems = document.querySelectorAll(".home_csvc_item");
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
  const lazyImages = document.querySelectorAll(".csvc_img");
  lazyImages.forEach((img) => {
    // Get the background image URL from CSS
    const computedStyle = window.getComputedStyle(img);
    const bgImg = computedStyle.backgroundImage;

    if (bgImg && bgImg !== "none") {
      // Extract the URL from the background-image property
      const imageUrl = bgImg.match(/url\(['"]?(.*?)['"]?\)/)[1];

      // Create a new image to preload
      const tempImg = new Image();
      tempImg.src = imageUrl;

      // Set initial opacity for fade-in effect
      img.style.opacity = "0";

      // When the image loads, fade it in
      tempImg.onload = function () {
        img.style.transition = "opacity 0.5s ease-in";
        img.style.opacity = "1";
        img.style.backgroundImage = `url(${imageUrl})`;

        // Add a subtle animation to the zigzag divider
        const zigzag = img
          .closest(".home_csvc_item")
          .querySelector(".zigzag-divider");
        if (zigzag) {
          zigzag.style.animation = "pulse 2s infinite";
        }
      };
    }
  });

  // Create a gentle pulse animation for the zigzag divider
  const style = document.createElement("style");
  style.innerHTML = `
        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
    `;
  document.head.appendChild(style);
});
