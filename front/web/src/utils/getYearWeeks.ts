export function getYearWeeks(year: number, data: { date: string; count: number; level: number }[]) {
  const weeks: any[] = [];
  const firstDay = new Date(year, 0, 1);
  const lastDay = new Date(year, 11, 31);

  // 1월 1일이 속한 주의 일요일
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - firstDay.getDay());

  // 12월 31일이 속한 주의 토요일
  const endDate = new Date(lastDay);
  endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

  let current = new Date(startDate);

  while (current <= endDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = current.toISOString().slice(0, 10);
      const found = data.find((d) => d.date.slice(0, 10) === dateStr);
      week.push({
        date: new Date(current),
        count: found ? found.count : 0,
        level: found ? found.level : 0,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
