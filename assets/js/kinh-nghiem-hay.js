// Kinh Nghiem Hay section JS
$(document).ready(function () {
  // Function to adjust heights of blog items
  function adjustKinhNghiemHayHeights() {
    // Reset heights first
    $(".home_knh .new-name").css("height", "auto");
    $(".home_knh .new-description").css("height", "auto");

    // Only apply equal heights on larger screens
    if ($(window).width() >= 768) {
      // For each row of items
      for (let i = 0; i < Math.ceil($(".home_knh_items").length / 2); i++) {
        let titleHeights = [];
        let descHeights = [];

        // Get heights for this row
        $(".home_knh_items")
          .slice(i * 2, i * 2 + 2)
          .each(function () {
            titleHeights.push($(this).find(".new-name").height());
            descHeights.push($(this).find(".new-description").height());
          });

        // Find max heights
        let maxTitleHeight = Math.max.apply(null, titleHeights);
        let maxDescHeight = Math.max.apply(null, descHeights);

        // Apply max heights to this row
        $(".home_knh_items")
          .slice(i * 2, i * 2 + 2)
          .each(function () {
            $(this).find(".new-name").height(maxTitleHeight);
            $(this).find(".new-description").height(maxDescHeight);
          });
      }
    }
  }

  // Run on document ready
  adjustKinhNghiemHayHeights();

  // Run on window resize
  $(window).resize(function () {
    adjustKinhNghiemHayHeights();
  });

  // Run after images load to account for any layout shifts
  $(window).on("load", function () {
    adjustKinhNghiemHayHeights();
  });
});
