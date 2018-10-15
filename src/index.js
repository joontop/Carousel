import CONFIG from './Config';
import Carousel from './Carousel';
import util from './util/Util';

let start = function() {
  let options = {
    isBounce: false,
    data: ['<span>a</span>', '<div>b</div>', '<div>c</div>', '<div>d</div>', '<div>e</div>', '<div>f</div>'],
    target: document.querySelector('.carousel'),
  };
  const carousel = new Carousel(options);
  carousel.start();
};

start();
