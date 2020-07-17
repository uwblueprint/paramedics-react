export const capitalize = (s: string): string => {
  const sArray = s.split(" ");
  const formattedArray = sArray.map((word) => {
    const lowercased = word.toLowerCase();
    return lowercased.charAt(0).toUpperCase() + lowercased.slice(1);
  });

  return formattedArray.join();
};
