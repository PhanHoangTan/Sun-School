document.addEventListener("DOMContentLoaded", function () {
  // Initialize Swiper for brand partners
  const brandSwiper = new Swiper(".brand-swiper", {
    slidesPerView: 3,
    spaceBetween: 50,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: ".brand .swiper-button-next",
      prevEl: ".brand .swiper-button-prev",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      // when window width is >= 992px
      992: {
        slidesPerView: 5,
        spaceBetween: 50,
      },
    },
  });

  // Pause autoplay on hover
  const swiperContainer = document.querySelector(".brand-swiper");

  if (swiperContainer) {
    swiperContainer.addEventListener("mouseenter", function () {
      brandSwiper.autoplay.stop();
    });

    swiperContainer.addEventListener("mouseleave", function () {
      brandSwiper.autoplay.start();
    });
  }
});
