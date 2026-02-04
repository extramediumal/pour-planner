'use client';

interface Option<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-stone-600">{label}</label>
      <div className="flex bg-stone-200 rounded-lg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all
              ${value === option.value
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
              }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {options.find(o => o.value === value)?.description && (
        <p className="text-xs text-stone-500">
          {options.find(o => o.value === value)?.description}
        </p>
      )}
    </div>
  );
}
