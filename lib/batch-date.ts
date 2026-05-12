const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getNextBatchDate(): {
  day: number;
  month: string;
  year: number;
  label: string;
} {
  const today = new Date();
  const currentDay = today.getDate();
  let targetMonth = today.getMonth();
  let targetYear = today.getFullYear();

  if (currentDay >= 7) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  return {
    day: 7,
    month: MONTHS[targetMonth],
    year: targetYear,
    label: `7th ${MONTHS[targetMonth]} ${targetYear}`,
  };
}
