// Scroll to top functionality
document.addEventListener("DOMContentLoaded", function () {
  // Create the back-to-top button
  const backToTopButton = document.querySelector(".back-to-top");

  // Function to check scroll position and toggle button visibility
  function toggleBackToTopButton() {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  }

  // Show/hide button based on scroll position
  window.addEventListener("scroll", toggleBackToTopButton);

  // Scroll to top when the button is clicked
  backToTopButton.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
