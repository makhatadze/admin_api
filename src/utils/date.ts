import moment from 'moment';

/**
 *
 * @param dateNum
 * @param isDue
 */
export const formatDate = (dateNum: string | number, isDue = false): string => {
  if (isDue) {
    return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
  } else {
    return moment(dateNum).format('YYYY-MM-DD HH:mm:ss');
  }
};

/**
 * @param date
 */
export const getDay = (date: Date = new Date()): string => {
  return moment(date).format('YYYYMMDD');
};

export const getTime = (): number => {
  return new Date().getTime();
};

/**
 * @param date
 */
export const birthdayYear = (date: Date): string | null => {
  try {
    return date ? `${moment().diff(date, 'years')}` : null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const dueDateMillisecond = (date: string): number => {
  // Current time
  const currentTime = Number.parseInt(String(new Date().getTime() / 1000));
  // Future time
  const futureTime = Number.parseInt(String(new Date(date).getTime() / 1000));
  if (futureTime <= currentTime) {
    return 0;
  } else {
    // Here convert the number of seconds to milliseconds
    return (futureTime - currentTime) * 1000;
  }
};
