import CONFIG from './Config';
import Carousel from './Carousel';
import util from './util/Util';

let start = function() {
  let options = {
    isBounce: false,
    data: [
      '<div class="a a1">a</div>',
      '<div class="a a2">b</div>',
      '<div class="a a3">c</div>',
      '<div class="a a4">d</div>',
      '<div class="a a5">e</div>',
      '<div class="a a6">f</div>',
    ],
    target: document.querySelector('.carousel'),
  };
  const carousel = new Carousel(options);
  carousel.start();
};

start();
