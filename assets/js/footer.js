// Footer JavaScript for the SunShine School theme

document.addEventListener("DOMContentLoaded", function () {
  // Social media icon interactions
  const socialIcons = document.querySelectorAll(".social_icon ul li a");

  socialIcons.forEach(function (icon) {
    icon.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    icon.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Footer menu item hover animations
  const footerMenuItems = document.querySelectorAll(".widget-menu li a");

  footerMenuItems.forEach(function (item) {
    item.addEventListener("mouseenter", function () {
      this.style.paddingLeft = "20px";
      this.style.color = "#ffa800";
    });

    item.addEventListener("mouseleave", function () {
      this.style.paddingLeft = "15px";
      this.style.color = "";
    });
  });

  // Remove plane animation - no longer needed
  const planeElements = document.querySelectorAll(".plane_fly, .plane_fly_lg");
  planeElements.forEach(function (plane) {
    plane.style.transform = "none";
    plane.style.transition = "none";
  });
});
