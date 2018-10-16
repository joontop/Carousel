import CONFIG from '../Config';

export default (() => {
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? true
      : false;
  };

  function setTransitionPrefix() {
    for (let i = 0, j = CONFIG.CSS_TRANSFORM_PREFIX.length; i < j; i++) {
      if (arguments.length === 2) {
        arguments[0].style.setProperty(
          CONFIG.CSS_TRANSFORM_PREFIX[i] + 'transition',
          arguments[1]
        );
      } else {
        arguments[0].style.setProperty(
          CONFIG.CSS_TRANSFORM_PREFIX[i] + 'transition',
          CONFIG.CSS_TRANSFORM_PREFIX[i] + arguments[2] + ' ' + arguments[1]
        );
      }
    }
  }

  function setTransformPrefix(target, value) {
    for (let i = 0, j = CONFIG.CSS_TRANSFORM_PREFIX.length; i < j; i++) {
      target.style.setProperty(
        CONFIG.CSS_TRANSFORM_PREFIX[i] + 'transform',
        'translateX(' + value + ') translateZ(0)'
      );
    }
  }

  return {
    isMobile,
    setTransitionPrefix,
    setTransformPrefix,
  };
})();
