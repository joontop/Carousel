import CONFIG from './Config';
import util from './util/Util';
import Options from './Options';

export default class Carousel {
  constructor(options) {
    this.carousel = null;
    this.emitter = null;
    Options.setDatas(options || {});
    this.state = {
      isOnTouch: false,
      isOnRolling: false,
    };
    this.value = {
      idx: {
        after: 0,
        before: 0,
        current: 0,
        last: 0,
      },
      time: {
        end: 0,
        start: 0,
      },
      x: {
        end: 0,
        move: 0,
        start: 0,
      },
      y: {
        end: 0,
        move: 0,
        start: 0,
      },
    };
  }

  start() {
    Object.assign(this.value.idx, { last: Options.getDataLastIndex() });
    this.setCarousel();
    this.setEvent();
  }

  setCarousel() {
    Options.getTarget().innerHTML = '';
    this.carousel = this.getCarouseElement();
    Options.getTarget().appendChild(this.carousel);
    this.setDataTransition();
  }

  getCarouseElement() {
    let element = document.createElement(
      CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_TAGNAME
    );
    element.setAttribute(
      CONFIG.TAG_ATTRIBUTE.CLASS,
      Options.getCarouselClassname()
    );
    Object.assign(element.style, CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_CSS);
    if (Options.getDataLastIndex() === 0) {
      element.appendChild(this.getDataElement(0));
    } else {
      this.setIdx();
      if (!Options.getIsBounce()) {
        element.appendChild(this.getDataElement(this.value.idx.before));
      }
      element.appendChild(this.getDataElement(this.value.idx.current));
      element.appendChild(this.getDataElement(this.value.idx.after));
    }
    return element;
  }

  getDataElement(idx) {
    let element = document.createElement(
      CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_DATA_TAGNAME
    );
    element.setAttribute(
      CONFIG.TAG_ATTRIBUTE.CLASS,
      Options.getCarouselDataClassname()
    );
    element.innerHTML = Options.getData()[idx];
    return element;
  }

  setDataTransition() {
    const dataElements = this.carousel.querySelectorAll(
      '.' + Options.getCarouselDataClassname()
    );
    for (let i = 0, j = dataElements.length; i < j; i++) {
      Object.assign(
        dataElements[i].style,
        CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_DATA_CSS
      );
    }
    if (dataElements.length > 1) {
      if (dataElements.length === 2) {
        if (this.value.idx.current === 0) {
          util.setTransformPrefix(dataElements[0], CONFIG.PERCENT.DEFAULT);
          util.setTransformPrefix(dataElements[1], CONFIG.PERCENT.UP);
        } else {
          util.setTransformPrefix(dataElements[0], CONFIG.PERCENT.DOWN);
          util.setTransformPrefix(dataElements[1], CONFIG.PERCENT.DEFAULT);
        }
      } else {
        util.setTransformPrefix(dataElements[0], CONFIG.PERCENT.DOWN);
        util.setTransformPrefix(dataElements[1], CONFIG.PERCENT.DEFAULT);
        util.setTransformPrefix(dataElements[2], CONFIG.PERCENT.UP);
      }
    }
  }

  setEvent() {
    if (util.isMobile()) {
      this.carousel.addEventListener(
        'touchstart',
        this.onStartEvent.bind(this)
      );
      document.addEventListener('touchmove', this.onMoveEvent.bind(this));
      document.addEventListener('touchend', this.onEndEvent.bind(this));
    } else {
      this.carousel.addEventListener('mousedown', this.onStartEvent.bind(this));
      document.addEventListener('mousemove', this.onMoveEvent.bind(this));
      document.addEventListener('mouseup', this.onEndEvent.bind(this));
    }
  }

  prev() {
    util.setTransformPrefix(this.carousel, CONFIG.PERCENT.UP);
    setTimeout(
      function() {
        if (Options.getIsBounce() && this.value.idx.current === 0) {
        } else {
          if (
            Options.getIsBounce() &&
            this.value.idx.current === this.value.idx.last
          ) {
          } else {
            this.carousel.removeChild(this.carousel.lastChild);
          }
          this.value.idx.current--;
          if (this.value.idx.current < 0) {
            this.value.idx.current = this.value.idx.last;
          }
          this.setIdx();
          if (Options.getIsBounce() && this.value.idx.current === 0) {
          } else {
            this.carousel.insertBefore(
              this.getDataElement(this.value.idx.before),
              this.carousel.firstChild
            );
          }
          util.setTransitionPrefix(this.carousel, 'none');
          util.setTransformPrefix(this.carousel, '0');
          this.setDataTransition();
        }
      }.bind(this),
      200
    );
  }

  next() {
    util.setTransformPrefix(this.carousel, CONFIG.PERCENT.DOWN);
    setTimeout(
      function() {
        if (
          Options.getIsBounce() &&
          this.value.idx.current === this.value.idx.last
        ) {
        } else {
          if (Options.getIsBounce() && this.value.idx.current === 0) {
          } else {
            this.carousel.removeChild(this.carousel.firstChild);
          }
          this.value.idx.current++;
          if (this.value.idx.current > this.value.idx.last) {
            this.value.idx.current = 0;
          }

          this.setIdx();
          if (
            Options.getIsBounce() &&
            this.value.idx.current === this.value.idx.last
          ) {
          } else {
            this.carousel.appendChild(
              this.getDataElement(this.value.idx.after)
            );
          }
          util.setTransitionPrefix(this.carousel, 'none');
          util.setTransformPrefix(this.carousel, '0');
          this.setDataTransition();
        }
      }.bind(this),
      200
    );
  }

  onStartEvent(e) {
    e.preventDefault();
    this.state.isOnTouch = true;
    const pageXY = this.getPageXY(e);
    this.value.x.start = pageXY.x;
    this.value.y.start = pageXY.y;
    this.value.time.start = new Date().getTime();

    // 롤링이라면 롤링 멈춤
    this.stopRolling();

    util.setTransitionPrefix(this.carousel, 'none');
  }

  onMoveEvent(e) {
    e.preventDefault();
    if (this.state.isOnTouch) {
      const pageXY = this.getPageXY(e);
      this.value.x.move = pageXY.x;
      this.value.y.move = pageXY.y;

      let startPercent = (this.value.x.start / this.carousel.offsetWidth) * 100;
      let movePercent = (this.value.x.move / this.carousel.offsetWidth) * 100;
      let currentPercent = (movePercent - startPercent) * 0.3;

      util.setTransformPrefix(this.carousel, currentPercent + '%');
    }
  }

  onEndEvent(e) {
    if (this.state.isOnTouch) {
      this.state.isOnTouch = false;
      const pageXY = this.getPageXY(e);
      this.value.x.end = pageXY.x;
      this.value.y.end = pageXY.y;
      this.value.time.end = new Date().getTime();

      // 제한 속도를 구함

      // 방향에 따라 액션을 수행
      switch (this.getDirection()) {
        case CONFIG.DIRECTION.PREV: {
          this.prev();
          break;
        }
        case CONFIG.DIRECTION.NEXT: {
          this.next();
          break;
        }
        case CONFIG.DIRECTION.DEFAULT: {
          util.setTransformPrefix(this.carousel, CONFIG.PERCENT.DEFAULT);
          break;
        }
      }

      util.setTransitionPrefix(this.carousel, '0.2s ease-out', 'transform');
      // util.setTransformPrefix(this.carousel, 0);

      // 롤링이라면 다시 롤링을 시작
      this.startRolling();
    }
  }

  getPageXY(e) {
    return {
      x: util.isMobile() ? e.changedTouches[0].pageX : e.pageX,
      y: util.isMobile() ? e.changedTouches[0].pageY : e.pageY,
    };
  }

  getDirection() {
    let direction = CONFIG.DIRECTION.DEFAULT;
    if (Options.getIsAutoRolling() && this.state.isOnRolling) {
      direction = CONFIG.DIRECTION.NEXT;
      return;
    }
    if (this.value.x.start > this.value.x.end) {
      if (
        Options.getIsBounce() &&
        this.value.idx.current === this.value.idx.last
      ) {
      } else {
        direction = CONFIG.DIRECTION.NEXT;
      }
    } else if (this.value.x.start < this.value.x.end) {
      if (Options.getIsBounce() && this.value.idx.current === 0) {
      } else {
        direction = CONFIG.DIRECTION.PREV;
      }
    }
    return direction;
  }

  setIdx() {
    this.value.idx.before =
      this.value.idx.current === 0
        ? this.value.idx.last
        : this.value.idx.current - 1;
    this.value.idx.after =
      this.value.idx.current === this.value.idx.last
        ? 0
        : this.value.idx.current + 1;
  }

  startRolling() {
    if (Options.getIsAutoRolling()) {
    }
  }

  stopRolling() {
    if (Options.getIsAutoRolling()) {
    }
  }
}
