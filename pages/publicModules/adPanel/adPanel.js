import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
window.onload = () => {
  const swiper = new Swiper('.nkc-movable-ad-container', {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });
  swiper.el.onmouseover = function () {
    swiper.autoplay.stop();
  };
  swiper.el.onmouseleave = function () {
    swiper.autoplay.start();
  };
};
