import { useRef, useState } from 'react';
import { Field, Input, Select, RichTextArea } from './FormControls';
import { Button } from './Button';
import { Plus, Close, Check, Bold, Italic, AlignRight, AlignCenter, AlignLeft, Link, ListIcon, MessageText } from '../icons';
import { ticketSubjects } from '../data/mock';

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
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  function execFormat(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function insertList() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selectedText = range.toString();

    const ul = document.createElement('ul');
    ul.style.cssText = 'padding-right:1.5em;margin:4px 0;list-style-type:disc;';
    const lines = selectedText ? selectedText.split('\n') : [''];
    lines.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      ul.appendChild(li);
    });

    range.deleteContents();
    range.insertNode(ul);

    const lastLi = ul.lastElementChild as HTMLLIElement;
    const newRange = document.createRange();
    newRange.setStart(lastLi, lastLi.childNodes.length);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  function insertQuote() {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selectedText = range.toString();

    const bq = document.createElement('blockquote');
    bq.style.cssText = 'border-right:3px solid #e5e7eb;margin:4px 0;padding:2px 12px;color:#9ca3af;font-style:italic;';
    bq.textContent = selectedText || '​';

    range.deleteContents();
    range.insertNode(bq);

    const newRange = document.createRange();
    const textNode = bq.firstChild;
    if (textNode) {
      newRange.setStart(textNode, textNode.textContent?.length ?? 0);
    } else {
      newRange.setStart(bq, 0);
    }
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
  }

  function openLinkInput() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
    setLinkUrl('');
    setShowLinkInput(true);
  }

  function confirmLink() {
    const url = linkUrl.trim();
    if (!url) { cancelLink(); return; }

    const range = savedRange.current;
    if (!range) { setShowLinkInput(false); return; }

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const a = document.createElement('a');
    a.href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.textContent = range.toString() || url;
    a.style.cssText = 'color:#3b82f6;text-decoration:underline;cursor:pointer;';

    range.deleteContents();
    range.insertNode(a);

    const newRange = document.createRange();
    newRange.setStartAfter(a);
    newRange.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(newRange);

    savedRange.current = null;
    setShowLinkInput(false);
    editorRef.current?.focus();
  }

  function cancelLink() {
    savedRange.current = null;
    setShowLinkInput(false);
    editorRef.current?.focus();
  }

  const btnCls = 'size-8 grid place-items-center rounded-md hover:bg-surface-50';

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

      <div className="flex flex-col gap-2">
        {/* toolbar */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-0.5 rounded-xl border border-line bg-white px-2 h-10 text-ink-500">
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('bold'); }} className={btnCls} title="Bold">
              <Bold size={16} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('italic'); }} className={btnCls} title="Italic">
              <Italic size={16} />
            </button>
            <span className="w-px h-4 bg-line mx-1" />
            <button type="button" onMouseDown={(e) => { e.preventDefault(); openLinkInput(); }} className={btnCls} title="Link">
              <Link size={16} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertList(); }} className={btnCls} title="List">
              <ListIcon size={16} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); insertQuote(); }} className={btnCls} title="Quote">
              <MessageText size={16} />
            </button>
            <span className="w-px h-4 bg-line mx-1" />
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('justifyRight'); }} className={btnCls} title="Align Right">
              <AlignRight size={16} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('justifyCenter'); }} className={btnCls} title="Align Center">
              <AlignCenter size={16} />
            </button>
            <button type="button" onMouseDown={(e) => { e.preventDefault(); execFormat('justifyLeft'); }} className={btnCls} title="Align Left">
              <AlignLeft size={16} />
            </button>
          </div>
        </div>

        {/* inline link input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 rounded-xl border border-brand bg-white px-3 h-10">
            <input
              autoFocus
              type="text"
              dir="ltr"
              placeholder="https://"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); confirmLink(); }
                if (e.key === 'Escape') cancelLink();
              }}
              className="flex-1 text-[13px] text-ink-900 outline-none placeholder:text-ink-400 bg-transparent"
            />
            <button type="button" onClick={confirmLink} className="text-[13px] font-medium text-brand hover:opacity-80 whitespace-nowrap">
              افزودن
            </button>
            <span className="w-px h-4 bg-line" />
            <button type="button" onClick={cancelLink} className="text-ink-400 hover:text-ink-600">
              <Close size={14} />
            </button>
          </div>
        )}
      </div>

      <Field label="پیام تیکت">
        <RichTextArea
          editorRef={editorRef}
          placeholder="مشکل خود را با جزئیات کامل توضیح دهید..."
        />
      </Field>

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
