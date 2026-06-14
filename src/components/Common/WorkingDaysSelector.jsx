import "./WorkingDaysSelector.scss";
import { DAYS_OF_WEEK, DAY_LABELS, parseWorkingDays } from "./workingDaysUtils";

const WorkingDaysSelector = ({ value = "", onChange, disabledDays = [], disabled = false }) => {
  const selected = parseWorkingDays(value);
  const disabledSet = new Set(disabledDays);

  const toggleDay = (day) => {
    if (disabled || disabledSet.has(day)) return;
    const next = selected.includes(day)
      ? selected.filter((item) => item !== day)
      : DAYS_OF_WEEK.filter((item) => [...selected, day].includes(item));
    onChange?.(next.join(","));
  };

  return (
    <div className="working-days-selector">
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selected.includes(day);
        const isDisabled = disabled || disabledSet.has(day);
        return (
          <button
            key={day}
            type="button"
            className={`working-days-selector__btn ${isSelected ? "is-selected" : ""}`}
            onClick={() => toggleDay(day)}
            disabled={isDisabled}
            title={day}
          >
            {DAY_LABELS[day]}
          </button>
        );
      })}
    </div>
  );
};

export default WorkingDaysSelector;
