import { useState } from 'react';
import { Field, Input, Select } from './FormControls';
import { Button } from './Button';
import { Check } from '../icons';
import { ticketSubjects } from '../data/mock';
import { RichEditor } from './RichEditor';
import { AttachmentsUploader } from './AttachmentsUploader';

interface TicketComposerProps {
  defaultSubject?: string;
  defaultTitle?: string;
  defaultMessage?: string;
  showCancel?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  submitLabel?: string;
}

export function TicketComposer({
  defaultSubject = '',
  defaultTitle = '',
  defaultMessage: _defaultMessage = '',
  showCancel = true,
  onSubmit,
  onCancel,
  submitLabel = 'ارسال تیکت',
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

      <AttachmentsUploader />

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
