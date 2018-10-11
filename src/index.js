import CONFIG from './Config';
import Carousel from './Carousel';
import util from './util/Util';

let start = function() {

  const carousel = new Carousel();
  carousel.options.data = ['123456', '41512312313', 'csadfsadfsadfsf'];
  carousel.options.target = document.querySelector('.carousel');
  carousel.start();
};

start();
