import { useState } from 'react';
import { Field, Input, Select } from './FormControls';
import { Button } from './Button';
import { Plus, Close, Check } from '../icons';
import { ticketSubjects } from '../data/mock';
import { RichEditor } from './RichEditor';

interface TicketComposerProps {
  defaultSubject?: string;
  defaultTitle?: string;
  defaultMessage?: string;
  showCancel?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
  files?: { name: string; size: string }[];
}

export function TicketComposer({
  defaultSubject = '',
  defaultTitle = '',
  defaultMessage: _defaultMessage = '',
  showCancel = true,
  onSubmit,
  onCancel,
  submitLabel = 'ارسال تیکت',
  files = [],
}: TicketComposerProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [title, setTitle] = useState(defaultTitle);

  return (
    <section className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-4 w-full max-w-[583px]">
      <Field label="موضوع تیکت" hint="موضوع تیکت خود را از بین گزینه ها مشخص کنید">
        <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="" disabled>انتخاب کنید</option>
          {ticketSubjects.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>

      {subject === 'سایر' && (
        <Field label="موضوع خود را بنویسید" hint="یک عنوان کوتاه برای تیکت انتخاب کنید">
          <Input
            placeholder="مشکل وب"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
        <RichEditor placeholder="مشکل خود را با جزئیات کامل توضیح دهید..." />
      </div>

      {/* attachments */}
      <div className="flex flex-col gap-3">
        <span className="text-[13px] font-bold text-ink-900 text-right">ضمیمه فایل</span>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 h-12">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-brand">SVG, PNG, JPG or GIF</span>
            <span className="text-ink-500">پسوند های مجاز</span>
          </div>
          <Button variant="gray" size="sm" leadingIcon={<Plus size={14} />}>
            افزودن فایل
          </Button>
        </div>

        {files.map((f) => (
          <div key={f.name} className="flex items-center gap-4 rounded-xl border border-line bg-white p-3">
            <div className="size-10 rounded-lg bg-brand-tint text-brand grid place-items-center text-[10px] font-bold">
              DOCX
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-ink-500 tabular">{f.size}</span>
                <span className="text-ink-900">{f.name}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                <div className="h-full w-full bg-brand" />
              </div>
            </div>
            <button className="size-8 grid place-items-center text-ink-700 hover:text-danger transition">
              <Close size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="h-px bg-line my-1" />

      <div className="flex items-center justify-end gap-3">
        {showCancel && (
          <Button variant="danger" size="md" onClick={onCancel}>
            لغو ارسال
          </Button>
        )}
        <Button variant="primary" size="md" leadingIcon={<Check size={16} />} onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </section>
  );
}
