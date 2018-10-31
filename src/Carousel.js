import CONFIG from './Config';
import util from './util/Util';
import Options from './Options';

export default class Carousel {
  constructor(options) {
    this.carousel = null;
    this.emitter = null;
    this.timer = null;
    Options.setDatas(options || {});
    this.state = {
      isOnTouch: false,
      isOnAutoRolling: false,
      isPossible: true,
    };
    this.value = {
      idx: { after: 0, before: 0, current: 0, last: 0 },
      time: { end: 0, start: 0 },
      x: { end: 0, move: 0, start: 0 },
      y: { end: 0, move: 0, start: 0 },
    };
  }

  start() {
    Object.assign(this.value.idx, {
      current: Options.getStartIndex(),
      last: Options.getDataLastIndex(),
    });
    this.setCarousel();
    this.setEvent();
    if (Options.getIsAutoRolling()) {
      this.startRolling();
    }
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
          util.setTransformPrefix(dataElements[0], '0');
          util.setTransformPrefix(dataElements[1], '100%');
        } else {
          util.setTransformPrefix(dataElements[0], '-100%');
          util.setTransformPrefix(dataElements[1], '0');
        }
      } else {
        util.setTransformPrefix(dataElements[0], '-100%');
        util.setTransformPrefix(dataElements[1], '0');
        util.setTransformPrefix(dataElements[2], '100%');
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
    util.setTransformPrefix(this.carousel, '100%');
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
      Options.getTransitionSeconds() * 1000
    );
  }

  next() {
    util.setTransformPrefix(this.carousel, '-100%');
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
      Options.getTransitionSeconds() * 1000
    );
  }

  onStartEvent(e) {
    e.preventDefault();
    if (!this.state.isOnTouch) {
      if (!this.state.isPossible) {
        return;
      }
      this.state.isPossible = false;
      this.state.isOnTouch = true;
      const pageXY = util.getPageXY(e);
      this.value.x.start = pageXY.x;
      this.value.y.start = pageXY.y;
      this.value.time.start = new Date().getTime();

      // 롤링이라면 롤링 멈춤
      this.stopRolling();

      util.setTransitionPrefix(this.carousel, 'none');
    }
  }

  onMoveEvent(e) {
    e.preventDefault();
    if (this.state.isOnTouch) {
      const pageXY = util.getPageXY(e);
      this.value.x.move = pageXY.x;
      this.value.y.move = pageXY.y;
      let startPercent = (this.value.x.start / this.carousel.offsetWidth) * 100;
      let movePercent = (this.value.x.move / this.carousel.offsetWidth) * 100;
      let currentPercent =
        (movePercent - startPercent) * Options.getMoveRange();
      util.setTransformPrefix(this.carousel, currentPercent + '%');
    }
  }

  onEndEvent(e) {
    e.preventDefault();
    if (this.state.isOnTouch) {
      this.state.isOnTouch = false;
      const pageXY = util.getPageXY(e);
      this.value.x.end = pageXY.x;
      this.value.y.end = pageXY.y;
      this.value.time.end = new Date().getTime();
      this.action();

      setTimeout(
        function() {
          this.state.isPossible = true;
        }.bind(this),
        Options.getTransitionSeconds() * 1000
      );

      // 롤링이라면 다시 롤링을 시작
      this.startRolling();
    }
  }

  action() {
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
        util.setTransformPrefix(this.carousel, '0');
        break;
      }
    }

    util.setTransitionPrefix(
      this.carousel,
      Options.getTransitionSeconds() + 's ease-out',
      'transform'
    );
  }

  getDirection() {
    const distance = Math.abs(this.value.x.end - this.value.x.start) / 1000; // 대충 미터로 환산
    const second = (this.value.time.end - this.value.time.start) / 1000; // 대충 초로 환산
    const velocity = (distance / second).toFixed(2); // 거리 / 시간 = 속도 (m/s)
    let direction = CONFIG.DIRECTION.DEFAULT;

    if (Options.getIsAutoRolling() && this.state.isOnAutoRolling) {
      // 오토롤링 상태일 경우
      direction = CONFIG.DIRECTION.NEXT;
      return direction;
    }

    if (
      this.value.x.start > this.value.x.end &&
      velocity > Options.getLimitVelocity()
    ) {
      // next 상태
      if (
        Options.getIsBounce() &&
        this.value.idx.current === this.value.idx.last
      ) {
        // bounce 이고 마지막 일떄 아무것도 하지않음
      } else {
        direction = CONFIG.DIRECTION.NEXT;
      }
    } else if (
      this.value.x.start < this.value.x.end &&
      velocity > Options.getLimitVelocity()
    ) {
      // prev 상태
      if (Options.getIsBounce() && this.value.idx.current === 0) {
        // bounce 이고 처음일때 아무것도 하지 않음
      } else {
        direction = CONFIG.DIRECTION.PREV;
      }
    }
    return direction;
  }

  setIdx() {
    if (this.value.idx.current < 0) {
      this.value.idx.current = this.value.idx.last;
    }
    if (this.value.idx.current > this.value.idx.last) {
      this.value.idx.current = 0;
    }
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
      this.state.isOnAutoRolling = true;
      this.timer = setInterval(
        function() {
          this.action();
        }.bind(this),
        Options.getRollingSecond() * 1000
      );
    }
  }

  stopRolling() {
    if (Options.getIsAutoRolling()) {
      this.state.isOnAutoRolling = false;
      clearInterval(this.timer);
    }
  }
}
