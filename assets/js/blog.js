// Blog Section JS
$(document).ready(function () {
  // Function to adjust heights of blog items
  function adjustBlogHeights() {
    // Reset heights first
    $(".blog-title").css("height", "auto");
    $(".blog-desc").css("height", "auto");

    // Only apply equal heights on larger screens
    if ($(window).width() >= 768) {
      // Group elements by row
      var titleHeights = [];
      var descHeights = [];

      // Collect heights
      $(".blog-title").each(function () {
        titleHeights.push($(this).height());
      });

      $(".blog-desc").each(function () {
        descHeights.push($(this).height());
      });

      // Find max heights
      var maxTitleHeight = Math.max.apply(null, titleHeights);
      var maxDescHeight = Math.max.apply(null, descHeights);

      // Apply max heights
      $(".blog-title").height(maxTitleHeight);
      $(".blog-desc").height(maxDescHeight);
    }
  }

  // Run on document ready
  adjustBlogHeights();

  // Run on window resize
  $(window).resize(function () {
    adjustBlogHeights();
  });

  // Run after images load to account for any layout shifts
  $(window).on("load", function () {
    adjustBlogHeights();
  });
});
