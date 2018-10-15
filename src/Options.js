import CONFIG from './Config';
import Util from './util/Util';

class Options {
  constructor() {
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
  }

  setDatas(datas) {
    console.log(datas);
    Object.assign(this.options, datas);

    if (!this.options.isBounce && this.options.data.length === 2) {
      this.options.data = [
        ...this.options.data,
        this.options.data[0],
        this.options.data[1],
      ];
    }
  }

  isAutoRolling() {
    return this.options.isAutoRolling;
  }
  setAutoRolling(value) {
    Object.assign(this.options, { isAutoRolling: value });
  }
  isBounce() {
    return this.options.isBounce;
  }
  isFixHeight() {
    return this.options.isFixHeight;
  }
  isPaginate() {
    return this.options.isPaginate;
  }
  getCarouselClassname() {
    return this.options.carouselClassname;
  }
  getCarouselDataClassname() {
    return this.options.carouselDataClassname;
  }
  getTarget() {
    return this.options.target;
  }
  getType() {}
  getMaxPage() {}
  getData() {
    return this.options.data;
  }
  getDataLastIndex() {
    return this.getDataLength() - 1;
  }
  getDataLength() {
    return this.options.data.length;
  }
  getRollingSecond() {}
}

export default new Options();
