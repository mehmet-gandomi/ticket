import { useState, useEffect } from 'react';
import { Field, Input, Select } from './FormControls';
import { Button } from './Button';
import { RichEditor } from './RichEditor';
import { AttachmentsUploader } from './AttachmentsUploader';
import { adminApi, type Category } from '../api/admin';

interface SubmitPayload {
  title: string;
  body: string;
  priority: string;
  category_id: number | null;
}

interface TicketComposerProps {
  showCancel?: boolean;
  showSubmit?: boolean;
  onSubmit?: (payload: SubmitPayload) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  /** @deprecated Display only – not submitted to the API */
  defaultMessage?: string;
}

export function TicketComposer({
  showCancel = true,
  showSubmit = true,
  onSubmit,
  onCancel,
  submitLabel = 'ارسال تیکت',
  defaultMessage: _defaultMessage,
}: TicketComposerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi.categories().then(setCategories).catch(() => {});
  }, []);

  const isCustom = categoryId === 'other';
  const title    = isCustom ? customTitle : (categories.find((c) => c.id === categoryId)?.title ?? '');

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        title:       title.trim(),
        body:        body.trim(),
        priority:    'low',
        category_id: categoryId && !isCustom ? Number(categoryId) : null,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-4 w-full max-w-[583px]">
      <Field label="موضوع تیکت" hint="موضوع تیکت خود را از بین گزینه ها مشخص کنید">
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="" disabled>انتخاب کنید</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
          <option value="other">سایر</option>
        </Select>
      </Field>

      {isCustom && (
        <Field label="موضوع خود را بنویسید" hint="یک عنوان کوتاه برای تیکت انتخاب کنید">
          <Input
            placeholder="مشکل وب"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />
        </Field>
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
        <RichEditor placeholder="مشکل خود را با جزئیات کامل توضیح دهید..." onChange={setBody} />
      </div>

      <AttachmentsUploader />

      <div className="h-px bg-line my-1" />

      <div className="flex items-center gap-3">
        {showSubmit && (
          <Button variant="primary" size="md" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'در حال ارسال...' : submitLabel}
          </Button>
        )}
        {showCancel && (
          <Button variant="danger" size="md" onClick={onCancel}>
            لغو ارسال
          </Button>
        )}
      </div>
    </section>
  );
}
