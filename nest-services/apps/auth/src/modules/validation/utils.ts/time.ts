export const currenHour = (): number => {
  return Math.floor(Date.now() / 1000) + 1;
};

export enum Times {
  Day = 86400,
  Hour = 3600,
}
