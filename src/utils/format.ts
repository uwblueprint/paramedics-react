const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 
  'Sep', 'Oct', 'Nov', 'Dec'
]

const nth = (day: number) : string => {
  if (day > 3 && day < 21) {
    return 'th';
  } else {
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}

export const formatDate = (date: string) : string => {
  // date of the form YYYY-MM-DD
  const dateParts = date.split('-');
  const year = dateParts[0];
  const month = months[parseInt(dateParts[1])];
  const day = parseInt(dateParts[2]) + nth(parseInt(dateParts[2]));

  return `${month} ${day}, ${year}`
}