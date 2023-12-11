const speedKey = "speed";
const defaultSpeed = "5";
const getCurrentSpeedAlias = (speed: number) => {
  if (speed < 0 || speed > 10) return defaultSpeed;
  return String(speed);
};
const setSpeed = (speed: number) =>
  localStorage.setItem(speedKey, speed.toString());
const getSpeed = () => localStorage.getItem(speedKey) ?? defaultSpeed;
const getSpeedObject = () => {
  let speed = localStorage.getItem(speedKey);
  switch (speed) {
    case "0":
      return { skip: 0, delay: 300 };
    case "1":
      return { skip: 0, delay: 200 };
    case "2":
      return { skip: 0, delay: 100 };
    case "3":
      return { skip: 0, delay: 50 };
    case "4":
      return { skip: 0, delay: 25 };
    case "5":
      return { skip: 0, delay: 1 };
    case "6":
      return { skip: 1, delay: 1 };
    case "7":
      return { skip: 2, delay: 1 };
    case "8":
      return { skip: 3, delay: 1 };
    case "9":
      return { skip: 4, delay: 1 };
    case "10":
      return { skip: 0, delay: 0 };
    default:
      return { skip: 1, delay: 1 };
  }
};

const delayFactory = () => {
  var currentNum = 0;
  return async (config: { skip: number; delay: number } | null = null) => {
    let { skip, delay } = { skip: 0, delay: 0 };
    if (config !== null) {
      ({ skip, delay } = config);
    } else {
      ({ skip, delay } = getSpeedObject());
    }

    if (delay === 0) return;

    if (skip <= currentNum) {
      currentNum = 0;
      await new Promise((r) => setTimeout(r, delay));
    } else {
      currentNum += 1;
    }
  };
};

export { delayFactory, getSpeed, setSpeed, getCurrentSpeedAlias };
