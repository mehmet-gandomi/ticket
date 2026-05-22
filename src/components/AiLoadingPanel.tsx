import { AlignRight } from '../icons';

const WIDTHS = [100, 92, 84, 96, 70, 88, 80, 60, 90, 74, 88, 65, 78];

export function AiLoadingPanel() {
  return (
    <div className="flex flex-col gap-6 items-start">
      <span className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-brand-tint text-brand text-[13px]">
        <AlignRight size={16} />
        در حال نوشتن پاسخ
      </span>

      <div className="flex flex-col gap-3 w-full">
        {WIDTHS.map((w, i) => (
          <div
            key={i}
            className="h-3 rounded-md bg-line/60 overflow-hidden relative animate-pulse"
            style={{ width: `${w}%` }}
          >
            <div
              className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ animation: `shimmer 1.6s ease-in-out ${i * 0.08}s infinite` }}
            />
          </div>
        ))}
      </div>
      <style>{`@keyframes shimmer { 0% { transform: translateX(0); } 100% { transform: translateX(500%); } }`}</style>
    </div>
  );
}
