import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer }       from '../components/PageContainer';
import { PageHeader }          from '../components/PageHeader';
import { Field, Input, Select } from '../components/FormControls';
import { Button }              from '../components/Button';
import { Label }               from '../components/Label';
import { Close, AddAnswer, Trash, Edit, Setting } from '../icons';
import { RichEditor }          from '../components/RichEditor';
import { AttachmentsUploader } from '../components/AttachmentsUploader';
import {
  adminApi,
  type Category,
  type SavedAnswer,
} from '../api/admin';

// ── Modal ─────────────────────────────────────────────────────────────────────

function Modal({ children, onClose, title, wide }: {
  children: ReactNode; onClose: () => void; title: string; wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-3 sm:p-6" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} dir="rtl"
        className={`bg-white rounded-3xl border border-line flex flex-col max-h-[90vh] w-full ${wide ? 'max-w-[640px]' : 'max-w-[480px]'}`}>
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-4 shrink-0">
          <h2 className="text-[16px] font-bold">{title}</h2>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50"><Close size={18} /></button>
        </div>
        <div className="h-px bg-line shrink-0" />
        <div className="flex flex-col gap-4 overflow-y-auto p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Delete confirm modal ──────────────────────────────────────────────────────

function DeleteConfirmModal({ title, description, onClose, onConfirm }: {
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [deleting, setDeleting] = useState(false);

  async function confirm() {
    setDeleting(true);
    try { await onConfirm(); } finally { setDeleting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} dir="rtl"
        className="bg-white rounded-3xl border border-line w-full max-w-[420px] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[16px] font-bold text-ink-900">{title}</h2>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50"><Close size={18} /></button>
        </div>
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-4">
            <span className="size-11 rounded-2xl bg-red-50 grid place-items-center text-danger shrink-0">
              <Trash size={20} />
            </span>
            <div className="flex flex-col gap-1 text-right">
              <p className="text-[14px] font-bold text-ink-900">آیا مطمئن هستید؟</p>
              <p className="text-[13px] text-ink-500 leading-6">{description}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="danger" size="md" onClick={confirm} disabled={deleting}>
              {deleting ? 'در حال حذف...' : 'بله، حذف شود'}
            </Button>
            <Button variant="secondary" size="md" onClick={onClose}>انصراف</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category modals + tab ─────────────────────────────────────────────────────

function CategoryModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
}) {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving]           = useState(false);

  async function save() {
    if (!title.trim()) return;
    setSaving(true);
    await onSave(title, description);
    onClose();
  }

  return (
    <Modal onClose={onClose} title="افزودن دسته بندی">
      <Field label="عنوان دسته"><Input placeholder="فنی" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="توضیحات دسته"><Input placeholder="دسته فنی در ..." value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-px bg-line" />
      <div className="flex">
        <Button variant="primary" onClick={save} disabled={saving}>افزودن دسته</Button>
      </div>
    </Modal>
  );
}

function EditCategoryModal({ cat, onClose, onSave }: {
  cat: Category;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void>;
}) {
  const [title, setTitle]             = useState(cat.title);
  const [description, setDescription] = useState(cat.description);
  const [saving, setSaving]           = useState(false);

  async function save() {
    if (!title.trim()) return;
    setSaving(true);
    await onSave(title, description);
    onClose();
  }

  return (
    <Modal onClose={onClose} title="ویرایش دسته بندی">
      <Field label="عنوان دسته"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="توضیحات دسته"><Input value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-px bg-line" />
      <div className="flex">
        <Button variant="primary" onClick={save} disabled={saving}>ذخیره تغییرات</Button>
      </div>
    </Modal>
  );
}

function CategoriesTab({ cats, onAdd, onEdit, onDelete }: {
  cats: Category[];
  onAdd: () => void;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-right">
          <h3 className="text-[16px] font-bold text-ink-900">دسته بندی سوالات</h3>
          <span className="w-px h-3 bg-line" />
          <span className="text-[11px] text-ink-400 tabular">{cats.length} دسته بندی</span>
        </div>
        <Button variant="primary" size="md" onClick={onAdd}>افزودن دسته</Button>
      </div>

      {cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="grid grid-cols-2 gap-2 opacity-30">
            {[0,1,2,3].map((i) => <div key={i} className="size-12 rounded-xl border-2 border-brand" />)}
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink-900">مدیر عزیز، دسته بندی شما خزان است</p>
            <p className="text-[11px] text-ink-500 mt-1">هیچ دسته بندی برای نمایش تعریف نشده است</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line rounded-2xl bg-white border border-line overflow-hidden">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-4" dir="rtl">
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex flex-col gap-0.5 text-right min-w-0">
                  <span className="text-[14px] font-bold text-ink-900">{c.title}</span>
                  {c.description && <span className="text-[12px] text-ink-500 leading-6">{c.description}</span>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Label color="default" size="sm">مرتبط {c.count}</Label>
                  <div className="flex items-center gap-1">
                    <button onClick={() => onEdit(c)} className="size-7 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
                    <button onClick={() => onDelete(c.id)} className="size-7 grid place-items-center rounded-lg text-ink-500 hover:text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Answer card + modals + tab ─────────────────────────────────────────────────

const COLLAPSED_H = 84;

function AnswerCard({ answer, onEdit, onDelete }: {
  answer: SavedAnswer;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded]       = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) return;
    const el = bodyRef.current;
    if (!el) return;
    setNeedsToggle(el.scrollHeight > COLLAPSED_H + 2);
  }, [answer.body, expanded]);

  return (
    <div className="rounded-2xl border border-line bg-white px-5 py-4 hover:border-brand transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-ink-900">{answer.title}</span>
            {answer.categoryTitle && <Label color="primary">{answer.categoryTitle}</Label>}
          </div>
          <div className="relative">
            <div
              ref={bodyRef}
              style={!expanded ? { maxHeight: COLLAPSED_H, overflow: 'hidden' } : undefined}
              className="text-[13px] text-ink-500 leading-7 text-right [&_p]:mb-1 [&_ul]:list-disc [&_ul]:pr-5 [&_ol]:list-decimal [&_ol]:pr-5 [&_strong]:font-semibold [&_a]:text-brand [&_a]:underline"
              dangerouslySetInnerHTML={{ __html: answer.body }}
            />
            {!expanded && needsToggle && (
              <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
            )}
          </div>
          {needsToggle && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-[12px] text-brand hover:underline text-right self-start"
            >
              {expanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onEdit} className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
          <button onClick={onDelete} className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
        </div>
      </div>
    </div>
  );
}

function AnswerModal({ cats, onClose, onSave }: {
  cats: Category[];
  onClose: () => void;
  onSave: (title: string, body: string, categoryId: number | null) => Promise<void>;
}) {
  const [cat, setCat]       = useState(cats[0]?.id ?? '');
  const [title, setTitle]   = useState('');
  const [body, setBody]     = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    await onSave(title, body, cat ? Number(cat) : null);
    onClose();
  }

  return (
    <Modal onClose={onClose} title="افزودن پاسخ آماده" wide>
      <div className="flex flex-col sm:flex-row gap-2">
        <Field label="عنوان سوال"><Input placeholder="مثلاً گواهی SSL منقضی شده" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="دسته سوال">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </Field>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
        <RichEditor placeholder="مشکل خود را با جزئیات کامل توضیح دهید..." onChange={setBody} />
      </div>
      <AttachmentsUploader />
      <div className="flex gap-3 mt-2">
        <Button variant="primary" onClick={save} disabled={saving}>افزودن پاسخ</Button>
        <Button variant="danger" onClick={onClose}>لغو</Button>
      </div>
    </Modal>
  );
}

function EditAnswerModal({ answer, cats, onClose, onSave }: {
  answer: SavedAnswer;
  cats: Category[];
  onClose: () => void;
  onSave: (title: string, body: string, categoryId: number | null) => Promise<void>;
}) {
  const [cat, setCat]       = useState(String(answer.categoryId ?? ''));
  const [title, setTitle]   = useState(answer.title);
  const [body, setBody]     = useState(answer.body);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!title.trim() || !body.trim()) return;
    setSaving(true);
    await onSave(title, body, cat ? Number(cat) : null);
    onClose();
  }

  return (
    <Modal onClose={onClose} title="ویرایش پاسخ آماده" wide>
      <div className="flex flex-col sm:flex-row gap-2">
        <Field label="عنوان سوال"><Input value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="دسته سوال">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </Select>
        </Field>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">متن پاسخ</span>
        <RichEditor placeholder="متن پاسخ آماده را بنویسید..." defaultValue={answer.body} onChange={setBody} />
      </div>
      <AttachmentsUploader />
      <div className="flex gap-3 mt-2">
        <Button variant="primary" onClick={save} disabled={saving}>ذخیره تغییرات</Button>
        <Button variant="danger" onClick={onClose}>لغو</Button>
      </div>
    </Modal>
  );
}

function AnswersTab({ answers, cats, onAdd, onEdit, onDelete }: {
  answers: SavedAnswer[];
  cats: Category[];
  onAdd: () => void;
  onEdit: (a: SavedAnswer) => void;
  onDelete: (id: number) => void;
}) {
  const [catFilter, setCatFilter] = useState('all');

  const visible = catFilter === 'all'
    ? answers
    : answers.filter((a) => String(a.categoryId) === catFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="primary" size="lg" leadingIcon={<AddAnswer size={16} />} onClick={onAdd}>افزودن پاسخ</Button>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="!w-auto min-w-[160px]">
          <option value="all">همه دسته‌ها</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </Select>
      </div>
      <div className="flex flex-col gap-3">
        {visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center text-ink-400">
            <AddAnswer size={40} />
            <p className="text-[13px]">هیچ پاسخ آماده‌ای وجود ندارد</p>
          </div>
        )}
        {visible.map((a) => (
          <AnswerCard
            key={a.id}
            answer={a}
            onEdit={() => onEdit(a)}
            onDelete={() => onDelete(a.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AdminKnowledgePage() {
  const nav = useNavigate();
  const [tab, setTab]         = useState<'categories' | 'answers'>('categories');
  const [cats, setCats]       = useState<Category[]>([]);
  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [catModal, setCatModal]   = useState(false);
  const [editCat, setEditCat]     = useState<Category | null>(null);
  const [deleteCat, setDeleteCat] = useState<Category | null>(null);
  const [ansModal, setAnsModal]   = useState(false);
  const [editAns, setEditAns]     = useState<SavedAnswer | null>(null);
  const [deleteAns, setDeleteAns] = useState<SavedAnswer | null>(null);

  useEffect(() => {
    adminApi.categories().then(setCats).catch(() => {});
    adminApi.savedAnswers().then(setAnswers).catch(() => {});
  }, []);

  async function handleAddCat(title: string, description: string) {
    const cat = await adminApi.createCategory(title, description);
    setCats((prev) => [...prev, cat]);
  }
  async function handleEditCat(id: string, title: string, description: string) {
    const cat = await adminApi.updateCategory(id, title, description);
    setCats((prev) => prev.map((c) => c.id === id ? cat : c));
  }
  async function handleDeleteCat(id: string) {
    await adminApi.deleteCategory(id);
    setCats((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleAddAns(title: string, body: string, categoryId: number | null) {
    const ans = await adminApi.createSavedAnswer({ title, body, category_id: categoryId });
    setAnswers((prev) => [ans, ...prev]);
  }
  async function handleEditAns(id: number, title: string, body: string, categoryId: number | null) {
    const ans = await adminApi.updateSavedAnswer(id, { title, body, category_id: categoryId });
    setAnswers((prev) => prev.map((a) => a.id === id ? ans : a));
  }
  async function handleDeleteAns(id: number) {
    await adminApi.deleteSavedAnswer(id);
    setAnswers((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <PageContainer>
      <PageHeader
        title="پایگاه دانش"
        subtitle="مدیریت دسته بندی‌ها و پاسخ‌های آماده"
        action={
          <button onClick={() => nav('/settings')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition">
            <Setting size={18} />
            <span>تنظیمات</span>
          </button>
        }
      />

      <div className="overflow-x-auto">
        <div className="inline-flex p-1 rounded-xl border border-line bg-surface-50 min-w-max">
          {([
            { id: 'categories', label: 'دسته بندی‌ها' },
            { id: 'answers',    label: 'پاسخ‌های آماده' },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`h-10 px-5 rounded-lg text-[13px] transition whitespace-nowrap ${tab === t.id ? 'bg-white text-ink-900 shadow font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'categories' && (
        <CategoriesTab
          cats={cats}
          onAdd={() => setCatModal(true)}
          onEdit={(c) => setEditCat(c)}
          onDelete={(id) => setDeleteCat(cats.find((c) => c.id === id) ?? null)}
        />
      )}
      {tab === 'answers' && (
        <AnswersTab
          answers={answers}
          cats={cats}
          onAdd={() => setAnsModal(true)}
          onEdit={(a) => setEditAns(a)}
          onDelete={(id) => setDeleteAns(answers.find((a) => a.id === id) ?? null)}
        />
      )}

      {catModal && (
        <CategoryModal onClose={() => setCatModal(false)} onSave={handleAddCat} />
      )}
      {editCat && (
        <EditCategoryModal
          cat={editCat}
          onClose={() => setEditCat(null)}
          onSave={(title, desc) => handleEditCat(editCat.id, title, desc)}
        />
      )}
      {ansModal && (
        <AnswerModal cats={cats} onClose={() => setAnsModal(false)} onSave={handleAddAns} />
      )}
      {editAns && (
        <EditAnswerModal
          answer={editAns}
          cats={cats}
          onClose={() => setEditAns(null)}
          onSave={(title, body, catId) => handleEditAns(editAns.id, title, body, catId)}
        />
      )}
      {deleteCat && (
        <DeleteConfirmModal
          title="حذف دسته بندی"
          description={`دسته بندی «${deleteCat.title}» حذف می‌شود. پاسخ‌های آماده مرتبط بدون دسته بندی باقی می‌مانند.`}
          onClose={() => setDeleteCat(null)}
          onConfirm={async () => { await handleDeleteCat(deleteCat.id); setDeleteCat(null); }}
        />
      )}
      {deleteAns && (
        <DeleteConfirmModal
          title="حذف پاسخ آماده"
          description={`پاسخ آماده «${deleteAns.title}» به طور کامل حذف می‌شود و قابل بازگشت نیست.`}
          onClose={() => setDeleteAns(null)}
          onConfirm={async () => { await handleDeleteAns(deleteAns.id); setDeleteAns(null); }}
        />
      )}
    </PageContainer>
  );
}
