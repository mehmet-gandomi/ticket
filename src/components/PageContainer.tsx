import { ReactNode } from 'react';

/**
 * Top-level layout container shared by every dashboard screen.
 * 1920-wide design: heavy outer padding (320px gutters) on huge screens,
 * gracefully collapses on smaller ones.
 */
export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-0 text-ink-900" dir="rtl">
      <div className="mx-auto w-full max-w-[1280px] px-6 lg:px-10 py-12 md:py-20">
        <div className="flex flex-col gap-10">{children}</div>
      </div>
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-3xl border border-line bg-white p-6 ${className}`}
    >
      {children}
    </section>
  );
}
