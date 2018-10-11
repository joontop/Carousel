import CONFIG from './Config';
import util from './util/Util';

export default class Carousel {
  constructor() {
    this.carousel = null;
    this.options = {
      isAutoRolling: false,
      isBounce: false,
      isFixHeight: false,
      isPaginate: false,
      maxPage: 10,
      rollingSecond: 5,
      startIndex: 0,
      target: null,
      type: 0,
      data: [],
      carouselClassname: CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_CLASSNAME,
      carouselDataClassname:
        CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_DATA_CLASSNAME,
    };
    this.emitter = null;
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
      time: {
        end: 0,
        start: 0,
      },
    };
  }

  start() {
    if (this.options && this.options.target) {
      console.log(this.options);
      // 바운스면 롤링은 false
      if (this.options.isBounce) {
        this.options.isAutoRolling = false;
      }

      // 개수 구하기
      this.value.idx.last = this.options.data.length - 1;
      console.log(this.isTwice());
      this.createCarousel();
      this.setData();
      this.setEvent();
    } else {
      console.log('taget is not defined.');
    }
  }

  createCarousel() {
    if (this.options && this.options.target) {
      this.options.target.innerHTML = '';
      this.carousel = document.createElement('div');
      this.carousel.setAttribute('class', this.options.carouselClassname);
      Object.assign(
        this.carousel.style,
        CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_CSS
      );
      this.options.target.appendChild(this.carousel);
    }
  }

  setData() {
    if (!this.carousel) {
      return;
    }
    if (this.options.data.length !== 1) {
      this.setIdx();
      if (!this.options.isBounce) {
        this.carousel.innerHTML += this.getDataHTML(this.value.idx.before);
      }
      this.carousel.innerHTML +=
        this.getDataHTML(this.value.idx.current) +
        this.getDataHTML(this.value.idx.after);
    } else {
      this.carousel.innerHTML = this.getDataHTML(0);
    }
  }

  getDataHTML(idx) {
    return (
      '<div class=' +
      this.options.carouselDataClassname +
      '>' +
      this.options.data[idx] +
      '</div>'
    );
  }

  setCount() {}

  isTwice() {
    return this.options.data.length === 2;
  }

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
      this.carousel.addEventListener(
        'mousedown',
        this.onStartEvent.bind(this)
      );
      document.addEventListener('mousemove', this.onMoveEvent.bind(this));
      document.addEventListener('mouseup', this.onEndEvent.bind(this));
    }
  }

  prev() {
    if (this.options.isBounce && this.value.idx.current === 0) {
      return true;
    }
    this.value.idx.current--;
  }

  next() {
    if (
      this.options.isBounce &&
      this.value.idx.current === this.value.idx.last
    ) {
      return true;
    }
    this.value.idx.current++;
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
          break;
        }
        case CONFIG.DIRECTION.NEXT: {
          console.log('next!!');
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
    if (this.options.isAutoRolling) {
    }
  }
  stopRolling() {
    if (this.options.isAutoRolling) {
    }
  }
}
