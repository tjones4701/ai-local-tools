import { format as formatDate } from 'date-fns';

type DateType = string | Date | number | null;
function toDate(value: any): Date | null {
  if (value == null) {
    return null;
  }
  let dateValue = value;
  if (typeof value === 'string') {
    dateValue = new Date(value);
  }
  if (typeof value === 'number') {
    dateValue = new Date(value);
  }
  if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
    return dateValue;
  }
  return null;
}

export const DateLib = {
  toDateOrNull: (value: any): Date | null => {
    return toDate(value);
  },
  now: (): Date => {
    return new Date();
  },
  format: (date: DateType, format: string) => {
    const d = toDate(date);
    if (d == null) {
      return '';
    }
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case 'short':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'medium':
        options.year = 'numeric';
        options.month = 'short';
        options.day = '2-digit';
        break;
      case 'long':
        options.year = 'numeric';
        options.month = 'long';
        options.day = '2-digit';
        break;
      case 'full':
        options.weekday = 'long';
        options.year = 'numeric';
        options.month = 'long';
        options.day = '2-digit';
        break;
      default:
        return formatDate(d, format);
    }

    return new Intl.DateTimeFormat('en-US', options).format(d);
  },
  toDateOfBirth: (date: DateType) => {
    return DateLib.format(date, 'short');
  }
};
