export const currenHour = (): number => {
  return Math.floor(Date.now() / 1000) + 1;
};
