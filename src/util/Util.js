import CONFIG from '../Config';

export default (() => {
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? true
      : false;
  };
  const renderCSSTransition = (target, value) => {
    for (let i = 0, j = CONFIG.CSS_TRANSFORM_PREFIX.length; i < j; i++) {
      target.style.setProperty(
        CONFIG.CSS_TRANSFORM_PREFIX[i] + 'transition',
        value
      );
    }
  };

  const renderCSSTransform = (target, value) => {
    for (let i = 0, j = CONFIG.CSS_TRANSFORM_PREFIX.length; i < j; i++) {
      target.style.setProperty(
        CONFIG.CSS_TRANSFORM_PREFIX[i] + 'transform',
        'translateX(' + value + ') translateZ(0)'
      );
    }
  };

  return {
    isMobile,
    renderCSSTransition,
    renderCSSTransform,
  };
})();
