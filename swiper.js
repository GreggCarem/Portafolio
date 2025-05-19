const swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 2,
    loop: true,
    spaceBetween: 50,
    coverflowEffect: {
      rotate: 20,
      stretch: 20,
      depth: 100,
      modifier: 1.5,
      slideShadows: false,
    },
    autoplay: {
      delay: 2000,
      disableOnInteraction: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });