import CONFIG from './Config';
import Carousel from './Carousel';
import util from './util/Util';

let start = function() {
  let options = {
    isAutoRolling: false, // default : false
    isBounce: false, // default : false
    isPaginate: false,
    rollingSecond: 5,
    startIndex: 1,
    transitionSeconds: 0.2, // default : 0.2s
    limitVelocity: 0.5, // default : 0.5 m/s
    moveRange: 0.3, // default : 0.3, max : 1
    data: [
      '<div class="a a1">1</div>',
      '<div class="a a2">2</div>',
      '<div class="a a3">3</div>',
      '<div class="a a4">4</div>',
      '<div class="a a5">5</div>',
      '<div class="a a6">6</div>',
    ],
    target: document.querySelector('.carousel'),
  };
  const carousel = new Carousel(options);
  carousel.start();
};

start();
