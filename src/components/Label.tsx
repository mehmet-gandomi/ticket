import { ReactNode } from 'react';

type Color = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'violet';
type Size = 'sm' | 'md' | 'lg';

const palette: Record<Color, string> = {
  default: 'bg-surface-50 text-ink-500 border-line',
  primary: 'bg-brand-tint text-brand border-brand-soft',
  secondary: 'bg-success-tint text-success border-success/30',
  success: 'bg-[#E6FBE9] text-[#1C9F38] border-[#BDF2C6]',
  warning: 'bg-[#FFF8EC] text-[#B47100] border-[#FFE6A3]',
  danger: 'bg-[#FDEAEA] text-danger border-[#FBC9C9]',
  violet: 'bg-[#F1E8FF] text-violet border-[#D9C2FF]',
};

const sizes: Record<Size, string> = {
  sm: 'h-6 px-2 text-[11px] gap-1 rounded-md',
  md: 'h-8 px-2.5 text-[11px] gap-1.5 rounded-full',
  lg: 'h-9 px-3 text-[13px] gap-2 rounded-full',
};

export function Label({
  color = 'default',
  size = 'md',
  icon,
  children,
}: {
  color?: Color;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center border font-normal whitespace-nowrap ${palette[color]} ${sizes[size]}`}
    >
      {icon ? <span className="shrink-0">{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
