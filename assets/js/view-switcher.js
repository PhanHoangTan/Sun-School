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

          // Remove the row structure and custom classes
          $this.find(".row").remove();
          $this.find(".list-image-col").contents().unwrap();
          $this.find(".list-info-col").contents().unwrap();

          // Reset inline styles
          $this.removeAttr("style");
          $this.find(".row").removeAttr("style");
          $this.find(".list-image-col").removeAttr("style");
          $this.find(".list-info-col").removeAttr("style");

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

          // Create row structure with explicit CSS for responsive
          var $row = $('<div class="row no-gutters"></div>');
          var $imageCol = $('<div class="list-image-col"></div>').append($thumbnail);
          var $infoCol = $('<div class="list-info-col"></div>').append($info);

          $row.append($imageCol).append($infoCol);
          $this.append($row);

          // Force responsive behavior with inline styles
          $this.css({
            'display': 'block',
            'width': '100%',
            'margin-bottom': '15px'
          });

          $row.css({
            'display': 'flex',
            'flex-wrap': 'wrap',
            'margin': '0',
            'width': '100%'
          });

          // Desktop and Tablet: side by side
          if (window.innerWidth >= 768) {
            $imageCol.css({
              'flex': '0 0 33.333333%',
              'max-width': '33.333333%',
              'padding': '0'
            });
            $infoCol.css({
              'flex': '0 0 66.666667%',
              'max-width': '66.666667%',
              'padding': '0 15px'
            });
          } else {
            // Mobile: stacked
            $imageCol.css({
              'flex': '0 0 100%',
              'max-width': '100%',
              'padding': '0'
            });
            $infoCol.css({
              'flex': '0 0 100%',
              'max-width': '100%',
              'padding': '15px'
            });
          }

          // Add single-line styling to description for non-mobile
          if (window.innerWidth >= 768) {
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
        }
      });

      // Save the view preference
      localStorage.setItem("product_view", "list");
    }
  });

  // Load saved view preference
  var savedView = localStorage.getItem("product_view") || "grid";
  $('.switch-view[data-view="' + savedView + '"]').trigger("click");

  // Handle window resize for responsive list view
  let resizeTimeout;
  $(window).on('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
      // Only apply if in list view
      if ($(".product-list-wrapper").hasClass("products-view-list")) {
        $(".item_product_main.list-item-layout").each(function() {
          var $this = $(this);
          var $row = $this.find(".row");
          var $imageCol = $this.find(".list-image-col");
          var $infoCol = $this.find(".list-info-col");
          
          if ($row.length && $imageCol.length && $infoCol.length) {
            if (window.innerWidth >= 768) {
              // Desktop/Tablet: side by side
              $imageCol.css({
                'flex': '0 0 33.333333%',
                'max-width': '33.333333%',
                'padding': '0'
              });
              $infoCol.css({
                'flex': '0 0 66.666667%',
                'max-width': '66.666667%',
                'padding': '0 15px'
              });
              
              // Apply single-line text for description
              $this.find(".desproduct").css({
                'white-space': 'nowrap',
                'overflow': 'hidden',
                'text-overflow': 'ellipsis'
              });
            } else {
              // Mobile: stacked
              $imageCol.css({
                'flex': '0 0 100%',
                'max-width': '100%',
                'padding': '0'
              });
              $infoCol.css({
                'flex': '0 0 100%',
                'max-width': '100%',
                'padding': '15px'
              });
              
              // Remove single-line text for mobile
              $this.find(".desproduct").css({
                'white-space': 'normal',
                'overflow': 'visible',
                'text-overflow': 'unset'
              });
            }
          }
        });
      }
    }, 250);
  });
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
