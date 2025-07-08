// View Switcher JavaScript - Handles Grid/List view switching functionality

$(document).ready(function () {
  // View mode switching
  $(".switch-view").on("click", function (e) {
    e.preventDefault();
    var view = $(this).data("view");

    // Update active button
    $(".button-view-mode").removeClass("active");
    $(this).find(".button-view-mode").addClass("active");

    // Switch view
    if (view === "grid") {
      $(".product-list-wrapper")
        .removeClass("products-view-list")
        .addClass("products-view-grid");
      $(".product-list-wrapper .row").removeClass("flex-column");
      $(".item_product_main").removeClass("list-item-layout");

      // Set grid column classes
      $(".product-list-wrapper .item")
        .removeClass("col-12")
        .addClass("col-lg-4 col-md-4 col-sm-6 col-6");

      // Reset product structure
      $(".item_product_main").each(function () {
        var $this = $(this);

        // Remove list-specific structure if it exists
        if ($this.find(".row").length) {
          var $thumbnail = $this.find(".product-thumbnail").first();
          var $info = $this.find(".product-info").first();

          // Move elements back to their original positions
          $this.append($thumbnail);
          $this.append($info);

          // Remove the row structure
          $this.find(".row").remove();
          $this.find(".col-lg-4.image").contents().unwrap();
          $this.find(".col-lg-8.info").contents().unwrap();

          // Remove single-line styling
          $this.find(".desproduct").removeAttr("style");
        }
      });

      // Save the view preference
      localStorage.setItem("product_view", "grid");
    } else {
      $(".product-list-wrapper")
        .removeClass("products-view-grid")
        .addClass("products-view-list");
      $(".product-list-wrapper .row").addClass("flex-column");
      $(".item_product_main").addClass("list-item-layout");

      // Set list column class
      $(".product-list-wrapper .item")
        .removeClass("col-lg-4 col-md-4 col-sm-6 col-6")
        .addClass("col-12");

      // Create list structure for each product
      $(".item_product_main").each(function () {
        var $this = $(this);

        // Only restructure if not already in list format
        if (!$this.find(".row").length) {
          var $thumbnail = $this.find(".product-thumbnail").first().detach();
          var $info = $this.find(".product-info").first().detach();

          // Create row structure
          var $row = $('<div class="row"></div>');
          var $imageCol = $('<div class="col-lg-4 image"></div>').append(
            $thumbnail
          );
          var $infoCol = $('<div class="col-lg-8 info"></div>').append($info);

          $row.append($imageCol).append($infoCol);
          $this.append($row);

          // Add single-line styling to description
          if ($this.find(".desproduct").length) {
            $this
              .find(".desproduct")
              .attr(
                "style",
                "white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              );
          } else {
            $this
              .find(".product-info")
              .append(
                '<div class="desproduct" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Chương trình học được thiết kế phù hợp với lứa tuổi và khả năng tiếp thu của học viên.</div>'
              );
          }
        }
      });

      // Save the view preference
      localStorage.setItem("product_view", "list");
    }
  });

  // Load saved view preference
  var savedView = localStorage.getItem("product_view") || "grid";
  $('.switch-view[data-view="' + savedView + '"]').trigger("click");
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
