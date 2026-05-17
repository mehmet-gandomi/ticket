import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { Field, Input, Select, TextArea } from '../components/FormControls';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { Plus, Check, Close, TicketStar, ListIcon, Trash, Edit } from '../icons';
import { PageHeader } from '../components/PageHeader';
import {
  initialCategories,
  initialAnswers,
  type Category,
  type SavedAnswer,
} from '../data/adminMock';

function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3 w-full">
      <button onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition shrink-0 ${checked ? 'bg-brand' : 'bg-line'}`}>
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? 'right-0.5' : 'right-[22px]'}`} />
      </button>
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-[13px] font-bold text-ink-900 text-right">{label}</span>
        {hint && <span className="text-[11px] text-ink-500 text-right leading-5">{hint}</span>}
      </div>
    </div>
  );
}

function Modal({ children, onClose, title, wide }: {
  children: ReactNode; onClose: () => void; title: string; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} dir="rtl"
        className={`bg-white rounded-3xl border border-line p-6 flex flex-col gap-4 ${wide ? 'w-full max-w-[640px]' : 'w-full max-w-[480px]'}`}>
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50"><Close size={18} /></button>
          <h2 className="text-[16px] font-bold">{title}</h2>
        </div>
        <div className="h-px bg-line -mx-6" />
        {children}
      </div>
    </div>
  );
}

function CategoryModal({ onClose, onSave }: { onClose: () => void; onSave: (c: Category) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  return (
    <Modal onClose={onClose} title="افزودن دسته بندی">
      <Field label="عنوان دسته"><Input placeholder="فنی" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="توضیحات دسته"><Input placeholder="دسته فنی در ..." value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-px bg-line -mx-6" />
      <div className="flex justify-end">
        <Button variant="primary"
          onClick={() => { if (title.trim()) { onSave({ id: 'c' + Date.now(), title, description, count: 0 }); onClose(); } }}>
          افزودن دسته
        </Button>
      </div>
    </Modal>
  );
}

function AnswerModal({ onClose, onSave, cats }: {
  onClose: () => void; onSave: (a: SavedAnswer) => void; cats: Category[];
}) {
  const [cat, setCat] = useState(cats[0]?.title ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  return (
    <Modal onClose={onClose} title="افزودن پاسخ آماده" wide>
      <Field label="دسته سوال">
        <Select value={cat} onChange={(e) => setCat(e.target.value)}>
          {cats.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
        </Select>
      </Field>
      <Field label="عنوان پاسخ"><Input placeholder="مثلاً گواهی SSL منقضی شده" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="پیام تیکت">
        <TextArea placeholder="متن پاسخ آماده را بنویسید..." value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-bold text-ink-900 text-right">ضمیمه فایل</span>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3 h-12">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-brand">SVG, PNG, JPG or GIF</span>
            <span className="text-ink-500">پسوند های مجاز</span>
          </div>
          <Button variant="gray" size="sm" leadingIcon={<Plus size={14} />}>افزودن فایل</Button>
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-2">
        <Button variant="danger" onClick={onClose}>لغو</Button>
        <Button variant="primary" leadingIcon={<Check size={16} />}
          onClick={() => { if (title.trim() && body.trim()) { onSave({ id: Date.now(), category: cat, title, body }); onClose(); } }}>
          افزودن پاسخ
        </Button>
      </div>
    </Modal>
  );
}

function CategoriesPanel({ cats, setCats, onAdd }: {
  cats: Category[]; setCats: (c: Category[]) => void; onAdd: () => void;
}) {
  const remove = (id: string) => setCats(cats.filter((c) => c.id !== id));
  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-right">
          <h3 className="text-[16px] font-bold text-ink-900">دسته بندی سوالات</h3>
          <span className="w-px h-3 bg-line" />
          <span className="text-[11px] text-ink-400 tabular">{cats.length} دسته بندی</span>
        </div>
        <Button variant="primary" size="md" leadingIcon={<Plus size={14} />} onClick={onAdd}>افزودن دسته</Button>
      </div>
      {cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
          <div className="grid grid-cols-2 gap-2 opacity-30">
            {[0, 1, 2, 3].map((i) => <div key={i} className="size-12 rounded-xl border-2 border-brand" />)}
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink-900">مدیر عزیز، دسته بندی شما خزان است</p>
            <p className="text-[11px] text-ink-500 mt-1">هیچ دسته بندی برای نمایش تعریف نشده است</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line border border-line rounded-2xl bg-white max-h-[420px] overflow-y-auto">
          {cats.map((c) => (
            <div key={c.id} className="flex items-start gap-4 px-5 py-4" dir="rtl">
              <div className="flex flex-col gap-1 flex-1 text-right">
                <div className="flex items-center justify-between">
                  <Label color="default" size="sm">مرتبط {c.count}</Label>
                  <span className="text-[14px] font-bold text-ink-900">{c.title}</span>
                </div>
                <span className="text-[12px] text-ink-500 leading-6">{c.description}</span>
                <button onClick={() => remove(c.id)} className="w-8 h-8 grid place-items-center rounded-lg text-danger hover:bg-red-50 transition">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonalizationTab({ cats, setCats, openCat }: {
  cats: Category[]; setCats: (c: Category[]) => void; openCat: () => void;
}) {
  const [ai, setAi] = useState(true);
  const [brand, setBrand] = useState('#3B3214');
  return (
    <div className="flex gap-12">
      <div className="flex-1 flex flex-col gap-6">
        <Toggle checked={ai} onChange={setAi} label="پاسخ هوشمند" hint="قابلیت پاسخ دهی هوشمند وجود داشته باشد" />
        <Field label="رنگ برند" hint="کد رنگ برند خودتان را وارد کنید.">
          <div className="relative">
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="#3B3214" dir="ltr" className="pl-12 text-left" />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 size-6 rounded-full border border-line" style={{ background: brand }} />
          </div>
        </Field>
      </div>
      <div className="w-px bg-line" />
      <div className="flex-1 min-w-0"><CategoriesPanel cats={cats} setCats={setCats} onAdd={openCat} /></div>
    </div>
  );
}

function AnswersTab({ answers, setAnswers, openAns }: {
  answers: SavedAnswer[]; setAnswers: (a: SavedAnswer[]) => void; openAns: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="primary" size="lg" leadingIcon={<Plus size={16} />} onClick={openAns}>افزودن پاسخ</Button>
      </div>
      <div className="flex flex-col gap-3">
        {answers.map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-white px-5 py-4 hover:border-brand transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-ink-900">{a.title}</span>
                  <Label color="primary">{a.category}</Label>
                </div>
                <p className="text-[13px] text-ink-500 leading-7 text-right">{a.body}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
                <button onClick={() => setAnswers(answers.filter((x) => x.id !== a.id))}
                  className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminSettingsPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'personal' | 'answers'>('personal');
  const [cats, setCats] = useState<Category[]>(initialCategories);
  const [answers, setAnswers] = useState<SavedAnswer[]>(initialAnswers);
  const [catModal, setCatModal] = useState(false);
  const [ansModal, setAnsModal] = useState(false);

  return (
    <PageContainer>

      <PageHeader
        title="تنظیمات پشتیبانی"
        subtitle="پاسخ گویی به مشتریان با الویت های مشخص"
        action={
          <button
            onClick={() => nav('/admin/tickets')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition"
          >
            <ListIcon size={18} />
            <span>لیست تیکت‌ها</span>
          </button>
        }
      />

      <div className="flex">
        <div className="inline-flex p-1 rounded-xl border border-line bg-surface-50">
          {([{ id: 'personal', label: 'شخصی سازی' }, { id: 'answers', label: 'تعریف سوالات' }] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`h-10 px-6 rounded-lg text-[13px] transition ${tab === t.id ? 'bg-white text-ink-900 shadow font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'personal'
        ? <PersonalizationTab cats={cats} setCats={setCats} openCat={() => setCatModal(true)} />
        : <AnswersTab answers={answers} setAnswers={setAnswers} openAns={() => setAnsModal(true)} />}

      {catModal && <CategoryModal onClose={() => setCatModal(false)} onSave={(c) => setCats([...cats, c])} />}
      {ansModal && <AnswerModal onClose={() => setAnsModal(false)} cats={cats} onSave={(a) => setAnswers([a, ...answers])} />}
    </PageContainer>
  );
}
