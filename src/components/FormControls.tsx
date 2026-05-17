import React, { ReactNode, useState } from 'react';
import { ChevronDown } from '../icons';

export function Field({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-[13px] font-bold text-ink-900 text-right">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-ink-500 text-right">{hint}</span> : null}
    </label>
  );
}

export function Input({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-12 w-full rounded-xl border border-line bg-white px-4 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-brand focus:shadow-focus focus:outline-none transition ${className}`}
      {...rest}
    />
  );
}

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }
>(({ className = '', ...rest }, ref) => (
  <textarea
    ref={ref}
    className={`min-h-[200px] w-full rounded-xl border border-line bg-white p-4 text-[13px] leading-7 text-ink-900 placeholder:text-ink-400 focus:border-brand focus:shadow-focus focus:outline-none transition resize-none ${className}`}
    {...rest}
  />
));

export function RichTextArea({
  placeholder = '',
  className = '',
  editorRef,
  onContentChange,
}: {
  placeholder?: string;
  className?: string;
  editorRef?: React.RefObject<HTMLDivElement>;
  onContentChange?: (html: string) => void;
}) {
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <div className="relative">
      {isEmpty && (
        <span className="absolute top-4 right-4 text-[13px] text-ink-400 pointer-events-none select-none">
          {placeholder}
        </span>
      )}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        dir="rtl"
        onInput={(e) => {
          const el = e.currentTarget;
          setIsEmpty(el.textContent?.trim() === '');
          onContentChange?.(el.innerHTML);
        }}
        onClick={(e) => {
          const a = (e.target as HTMLElement).closest('a');
          if (a) {
            e.preventDefault();
            window.open((a as HTMLAnchorElement).href, '_blank', 'noopener,noreferrer');
          }
        }}
        className={`min-h-[200px] w-full rounded-xl border border-line bg-white p-4 text-[13px] leading-7 text-ink-900 focus:border-brand focus:shadow-focus focus:outline-none transition outline-none ${className}`}
      />
    </div>
  );
}

export function Select({
  className = '',
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={`h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 pl-10 text-[13px] text-ink-900 focus:border-brand focus:shadow-focus focus:outline-none transition ${className}`}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        size={16}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </div>
  );
}
