import CONFIG from './Config';
import Util from './util/Util';

class Options {
  constructor() {
    this.options = {
      carouselClassname: CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_CLASSNAME,
      carouselDataClassname:
        CONFIG.CAROUSEL_DOM_INFORMATION.CAROUSEL_DATA_CLASSNAME,
      data: [],
      isAutoRolling: false,
      isBounce: false,
      isFixHeight: false,
      isPaginate: false,
      maxPage: 10,
      rollingSecond: 5,
      startIndex: 0,
      target: null,
      transitionSeconds: 0.2,
      type: 0,
    };
  }

  setDatas(datas) {
    // 사용자가 설정한 옵션을 가져옴
    Object.assign(this.options, datas);

    // bouce 일때는 autoRolling 이 꺼져있어야함
    if (this.options.isBounce) {
      this.options.isAutoRolling = false;
    }

    // bounce 가 아니고 data가 2개일때 왼쪽에 컨텐츠를 채워넣기위해 4개로 만들어줌
    if (!this.options.isBounce && this.options.data.length === 2) {
      this.options.data = [
        ...this.options.data,
        this.options.data[0],
        this.options.data[1],
      ];
    }
  }

  getCarouselClassname() {
    return this.options.carouselClassname;
  }

  getCarouselDataClassname() {
    return this.options.carouselDataClassname;
  }

  getData() {
    return this.options.data;
  }

  getDataLastIndex() {
    return this.getDataLength() - 1;
  }

  getDataLength() {
    return this.options.data.length;
  }

  getIsAutoRolling() {
    return this.options.isAutoRolling;
  }

  getIsBounce() {
    return this.options.isBounce;
  }

  getTarget() {
    return this.options.target;
  }

  getTransitionSeconds() {
    return this.options.getTransitionSeconds();
  }
}

export default new Options();
