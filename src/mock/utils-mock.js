import dayjs from 'dayjs';

export const generateRandomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export const getRandomElement = (arrayValue) => arrayValue[generateRandomInt(0, arrayValue.length - 1)];

export const getRandomElements = (arrayValue, minCount, maxCount) => {
  const result = [];
  Array(generateRandomInt(minCount, maxCount)).fill('').forEach(() => {
    result.push(getRandomElement(arrayValue));
  });

  return result;
};

export const getRandomPastDate = (years = 10) => {
  const diffDays = generateRandomInt(0, 365 * years);
  const date = dayjs().add(-diffDays, 'day');

  return date.toISOString();
};

