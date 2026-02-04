'use client';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ToggleGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ToggleGroupProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">{label}</label>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`py-2 px-4 text-sm font-medium rounded-lg border transition-all
              ${value === option.value
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-stone-600 border-stone-300 hover:border-amber-600'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
