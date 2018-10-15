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
    if (Options.getTarget()) {
      if (Options.isBounce()) {
        Options.setAutoRolling(false);
      }
    }
    Object.assign(this.value.idx, { last: Options.getDataLastIndex() });
    this.createCarousel();
    this.setData();
    this.setDataTransition();
    this.setEvent();
    console.log(Options.getData());
  }

  createCarousel() {
    Options.getTarget().innerHTML = '';
    this.carousel = document.createElement(
      CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_TAGNAME
    );
    this.carousel.setAttribute(
      CONFIG.TAG_ATTRIBUTE.CLASS,
      Options.getCarouselClassname()
    );
    Object.assign(
      this.carousel.style,
      CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_CSS
    );
    Options.getTarget().appendChild(this.carousel);
  }

  setData() {
    if (Options.getDataLastIndex() === 0) {
      this.carousel.innerHTML = this.getDataHTML(0);
    } else {
      this.setIdx();
      if (!Options.isBounce()) {
        this.carousel.innerHTML += this.getDataHTML(this.value.idx.before);
      }
      this.carousel.innerHTML +=
        this.getDataHTML(this.value.idx.current) +
        this.getDataHTML(this.value.idx.after);
    }
  }

  setDataTransition() {
    const datas = this.carousel.querySelectorAll(
      '.' + Options.getCarouselDataClassname()
    );
    for (let i = 0, j = datas.length; i < j; i++) {
      Object.assign(
        datas[i].style,
        CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_DATA_CSS
      );
    }
    if (Options.getDataLength() > 1) {
      if (Options.getDataLength === 2) {
        if (this.value.idx.current === 0) {
          util.renderCSSTransform(datas[0], '0');
          util.renderCSSTransform(datas[1], '100%');
        } else {
          util.renderCSSTransform(datas[0], '-100%');
          util.renderCSSTransform(datas[1], '0');
        }
      } else {
        util.renderCSSTransform(datas[0], '-100%');
        util.renderCSSTransform(datas[1], '0');
        util.renderCSSTransform(datas[2], '100%');
      }
    }
    console.log(datas);
  }

  getDataHTML(idx) {
    return (
      '<div class=' +
      Options.getCarouselDataClassname() +
      '>' +
      Options.getData()[idx] +
      '</div>'
    );
  }

  setCount() {}

  setEvent() {
    if (!this.carousel) {
      return;
    }
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
    if (Options.isBounce() && this.value.idx.current === 0) {
    } else {
      if (
        Options.isBounce() &&
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
      if (Options.isBounce() && this.value.idx.current === 0) {
      } else {
        let data = document.createElement(
          CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_TAGNAME
        );
        data.setAttribute(
          CONFIG.TAG_ATTRIBUTE.CLASS,
          Options.getCarouselDataClassname()
        );
        data.innerHTML = Options.getData()[this.value.idx.before];
        this.carousel.insertBefore(data, this.carousel.firstChild);
      }
      this.setDataTransition();
    }
  }

  next() {
    if (Options.isBounce() && this.value.idx.current === this.value.idx.last) {
    } else {
      if (Options.isBounce() && this.value.idx.current === 0) {
      } else {
        this.carousel.removeChild(this.carousel.firstChild);
      }
      this.value.idx.current++;
      if (this.value.idx.current > this.value.idx.last) {
        this.value.idx.current = 0;
      }

      this.setIdx();
      if (
        Options.isBounce() &&
        this.value.idx.current === this.value.idx.last
      ) {
      } else {
        let data = document.createElement(
          CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_TAGNAME
        );
        data.setAttribute(
          CONFIG.TAG_ATTRIBUTE.CLASS,
          Options.getCarouselDataClassname()
        );
        data.innerHTML = Options.getData()[this.value.idx.after];
        this.carousel.appendChild(data);
      }
      this.setDataTransition();
    }
  }

  onStartEvent(e) {
    e.preventDefault();
    this.state.isOnTouch = true;
    const pageXY = this.getPageXY(e);
    this.value.x.start = pageXY.x;
    this.value.y.start = pageXY.y;
    this.value.time.start = new Date().getTime();
    console.log(this.value);

    // 롤링이라면 롤링 멈춤
    this.stopRolling();
  }

  onMoveEvent(e) {
    e.preventDefault();
    if (this.state.isOnTouch) {
      const pageXY = this.getPageXY(e);
      this.value.x.move = pageXY.x;
      this.value.y.move = pageXY.y;
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
          console.log('prev!!');
          this.prev();
          break;
        }
        case CONFIG.DIRECTION.NEXT: {
          console.log('next!!');
          this.next();
          break;
        }
      }

      // 롤링이라면 다시 롤링을 시작
      this.startRolling();

      console.log('default');
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
    if (this.state.isOnRolling) {
      direction = CONFIG.DIRECTION.NEXT;
      return;
    }
    if (this.value.x.start > this.value.x.end) {
      direction = CONFIG.DIRECTION.NEXT;
    } else if (this.value.x.start < this.value.x.end) {
      direction = CONFIG.DIRECTION.PREV;
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
    if (Options.isAutoRolling()) {
    }
  }

  stopRolling() {
    if (Options.isAutoRolling()) {
    }
  }
}
