export const DAYS_OF_WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export const DAY_LABELS = {
  MON: "T2",
  TUE: "T3",
  WED: "T4",
  THU: "T5",
  FRI: "T6",
  SAT: "T7",
  SUN: "CN",
};

export const parseWorkingDays = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(",")
    .map((day) => day.trim().toUpperCase())
    .filter((day) => DAYS_OF_WEEK.includes(day));
};
