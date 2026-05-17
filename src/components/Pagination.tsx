import { ChevronLeft, ChevronRight } from '../icons';

function Ellipsis() {
  return (
    <span className="size-10 grid place-items-center text-[13px] text-ink-400 select-none">
      …
    </span>
  );
}

export function Pagination({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const btnBase =
    'size-10 grid place-items-center rounded-lg text-[13px] tabular transition border';
  const active = 'bg-brand text-white border-brand';
  const idle = 'border-line bg-white text-ink-700 hover:bg-surface-50';

  // Build the list of page numbers/ellipsis to render
  const items: (number | 'start-ellipsis' | 'end-ellipsis')[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) items.push(i);
  } else {
    const left = Math.max(2, page - 1);
    const right = Math.min(total - 1, page + 1);

    items.push(1);
    if (left > 2) items.push('start-ellipsis');
    for (let i = left; i <= right; i++) items.push(i);
    if (right < total - 1) items.push('end-ellipsis');
    items.push(total);
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`${btnBase} ${idle} disabled:opacity-40`}
      >
        <ChevronRight size={18} />
      </button>

      {items.map((item, i) =>
        item === 'start-ellipsis' || item === 'end-ellipsis' ? (
          <Ellipsis key={item + i} />
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            className={`${btnBase} ${item === page ? active : idle}`}
          >
            {item}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className={`${btnBase} ${idle} disabled:opacity-40`}
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
    <div className="flex sm:inline-flex p-1 rounded-full bg-[#FAFAFA] w-full sm:w-auto">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 h-10 rounded-full text-[13px] transition whitespace-nowrap md:min-w-[110px] ${
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
