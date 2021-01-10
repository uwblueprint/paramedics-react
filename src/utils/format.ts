import moment from 'moment';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const nth = (day: number): string => {
  if (day > 3 && day < 21) {
    return 'th';
  }

  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

export const formatDate = (date: string): string => {
  // date of the form YYYY-MM-DD
  const dateParts = date.split('-');
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1]) - 1];
  const day = parseInt(dateParts[2]) + nth(parseInt(dateParts[2]));

  return `${month} ${day}, ${year}`;
};

export const formatLastUpdated = (
  date: string,
  includeTime: boolean
): string => {
  const currentDate = new Date();
  const updatedDay = moment(date).format('D'); // 21
  const updatedMonth = moment(date).format('MMM'); // Nov
  const updatedYear = moment(date).format('YYYY'); // 2020

  // Checks if patient was last updated within 24 hours
  return updatedDay === currentDate.getDate().toString() &&
    updatedMonth === months[currentDate.getMonth()] &&
    updatedYear === currentDate.getFullYear().toString()
    ? moment(date).format('h:mm A')
    : moment(date).format(`MMM D YYYY ${includeTime ? ', h:mm A' : ''}`);
};

export const capitalize = (s: string): string => {
  const sArray = s.split(' ');
  const formattedArray = sArray.map((word) => {
    const lowercased = word.toLowerCase();
    return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  });

  return formattedArray.join();
};

export const formatDateToString = (date: Date | null) => {
  if (!date) {
    return '';
  }
  const dateParts: {
    year?: string;
    month?: string;
    day?: string;
  } = new Intl.DateTimeFormat().formatToParts(date).reduce(
    (obj, currentPart) => ({
      ...obj,
      [currentPart.type]: currentPart.value,
    }),
    {}
  );

  if (dateParts.day) {
    if (dateParts.day.length < 2) {
      dateParts.day = '0'.concat(dateParts.day);
    }
  }

  if (dateParts.month) {
    if (dateParts.month.length < 2) {
      dateParts.month = '0'.concat(dateParts.month);
    }
  }

  if (dateParts && dateParts.year && dateParts.month && dateParts.day) {
    return dateParts.year.concat('-', dateParts.month, '-', dateParts.day);
  }

  return '';
};
