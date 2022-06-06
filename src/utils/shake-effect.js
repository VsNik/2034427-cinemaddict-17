const SHAKE_CLASS_NAME = 'shake';
const SHAKE_ANIMATION_TIMEOUT = 600;

export const shake = (element, callback) => {
  element.classList.add(SHAKE_CLASS_NAME);

  setTimeout(() => {
    element.classList.remove(SHAKE_CLASS_NAME);
    callback?.();
  }, SHAKE_ANIMATION_TIMEOUT);
};
