// ts 中不可直接导入
import * as dayjs from 'dayjs';

export default (startTime: Date | string, value: number) => {
  const diffDays = dayjs(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')).diff(
    startTime,
    'days',
  );
  // 每年使用时候价值损耗 0.35
  const depreValue = (0.35 * value * diffDays) / 365;

  return value - depreValue;
};
