import dayjs from 'dayjs';

export default (startTime: Date, value: number) => {
  const diffDays = dayjs(new Date()).diff(dayjs(startTime), 'days');
  // 每年使用时候价值损耗 0.35
  const depreValue = (0.35 * value * diffDays) / 365;

  return value - depreValue;
};
