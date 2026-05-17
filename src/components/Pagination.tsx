import { ChevronLeft, ChevronRight } from '../icons';

export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        className="size-10 grid place-items-center rounded-lg border border-line bg-white text-ink-700 hover:bg-surface-50 disabled:opacity-40"
        disabled={page === 1}
      >
        <ChevronRight size={18} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`size-10 grid place-items-center rounded-lg text-[13px] tabular transition ${
            p === page
              ? 'bg-brand text-white'
              : 'border border-line bg-white text-ink-700 hover:bg-surface-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        className="size-10 grid place-items-center rounded-lg border border-line bg-white text-ink-700 hover:bg-surface-50 disabled:opacity-40"
        disabled={page === total}
      >
        <ChevronLeft size={18} />
      </button>
    </div>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="inline-flex p-1 rounded-full bg-[#FAFAFA]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`h-10 min-w-[116px] rounded-full text-[13px] transition ${
            value === opt.value
              ? 'bg-[#F0F1F3] text-[#3D4350] font-medium'
              : 'text-[#A3A9B6] hover:text-ink-900'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
