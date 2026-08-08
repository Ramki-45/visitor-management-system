import { Button } from "../../../components/ui/Button";

const RANGES = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "custom", label: "Custom Range" },
];

export function RangeSelector({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {RANGES.map((range) => (
        <Button
          key={range.value}
          type="button"
          variant={value === range.value ? "primary" : "secondary"}
          onClick={() => onChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
}
