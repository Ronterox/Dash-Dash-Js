export const getRandomRange = (min, max) => Math.random() * (max - min) + min;
export const getRandomColor = () => `hsl(${Math.random() * 360}, 50%, 50%)`;