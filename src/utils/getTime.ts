import * as dayjs from 'dayjs';

export default function (time?: string) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}
