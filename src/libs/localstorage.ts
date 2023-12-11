// Mousedown
export const setIsMouseDown = () => localStorage.setItem("isMouseDown", "true");
export const unsetIsMouseDown = () =>
  localStorage.setItem("isMouseDown", "false");
export const isMouseDown = () => localStorage.getItem("isMouseDown") === "true";

// Animation
export const getAnimationOn = () => {
  let animationOn = localStorage.getItem("animationOn");
  return animationOn === "false" ? false : true;
};

export const setAnimationOn = () => {
  localStorage.setItem("animationOn", "true");
};

export const setAnimationOff = () => {
  localStorage.setItem("animationOn", "false");
};
