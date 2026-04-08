export function adjustTimeToDate(dateStr: string, timeStr: string) {
  if (!dateStr || !timeStr) return timeStr;

  const date = new Date(dateStr);
  const time = new Date(timeStr);

  date.setHours(time.getHours());
  date.setMinutes(time.getMinutes());
  date.setSeconds(0, 0);

  return date.toISOString();
}
