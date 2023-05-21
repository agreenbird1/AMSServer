// ts 中不可直接导入
import * as dayjs from 'dayjs';

export default (startTime: Date | string, value: number) => {
  const diffDays = dayjs(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')).diff(
    startTime,
    'days',
  );

  const nMultiply = (n, x) => {
    let result = 1;
    for (let i = 0; i < n; i++) {
      result *= x;
    }
    return result;
  };

  const diffYears = Math.floor(diffDays / 365);
  const yearValue = nMultiply(diffYears, 0.65) * value;
  // 每年使用时候价值损耗 0.35
  const depreValue = (1 - 0.35 * ((diffDays % 365) / 365)) * yearValue;

  return depreValue;
};
