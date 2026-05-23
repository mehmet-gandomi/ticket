import { useState, useEffect, type ReactNode } from 'react';
import { useNavigate }         from 'react-router-dom';
import { PageContainer }       from '../components/PageContainer';
import { Field, Input, Select } from '../components/FormControls';
import { Button }              from '../components/Button';
import { Label }               from '../components/Label';
import { Plus, Close, AddAnswer, ListIcon, Trash, Edit } from '../icons';
import { PageHeader }          from '../components/PageHeader';
import { RichEditor }          from '../components/RichEditor';
import { AttachmentsUploader } from '../components/AttachmentsUploader';
import {
  adminApi,
  type Category,
  type SavedAnswer,
  type Settings,
} from '../api/admin';
import { applyBrandColor } from '../utils/color';

// ── Generic helpers ───────────────────────────────────────────────────────────

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

// ── Category modals ───────────────────────────────────────────────────────────

function CategoryModal({ onClose, onSave }: { onClose: () => void; onSave: (title: string, description: string) => Promise<void> }) {
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

function EditCategoryModal({ cat, onClose, onSave }: { cat: Category; onClose: () => void; onSave: (title: string, description: string) => Promise<void> }) {
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
      <Field label="عنوان دسته"><Input placeholder="فنی" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="توضیحات دسته"><Input placeholder="دسته فنی در ..." value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-px bg-line" />
      <div className="flex">
        <Button variant="primary" onClick={save} disabled={saving}>ذخیره تغییرات</Button>
      </div>
    </Modal>
  );
}

function CategoriesPanel({ cats, onAdd, onEdit, onDelete }: {
  cats: Category[];
  onAdd: () => void;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5 flex-1 min-w-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-right">
          <h3 className="text-[16px] font-bold text-ink-900">دسته بندی سوالات</h3>
          <span className="w-px h-3 bg-line" />
          <span className="text-[11px] text-ink-400 tabular">{cats.length} دسته بندی</span>
        </div>
        <Button variant="primary" size="md" onClick={onAdd}>افزودن دسته</Button>
      </div>
      {cats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
          <div className="grid grid-cols-2 gap-2 opacity-30">
            {[0,1,2,3].map((i) => <div key={i} className="size-12 rounded-xl border-2 border-brand" />)}
          </div>
          <div>
            <p className="text-[13px] font-bold text-ink-900">مدیر عزیز، دسته بندی شما خزان است</p>
            <p className="text-[11px] text-ink-500 mt-1">هیچ دسته بندی برای نمایش تعریف نشده است</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-line rounded-2xl bg-white max-h-[420px] overflow-y-auto">
          {cats.map((c) => (
            <div key={c.id} className="flex items-start gap-4 px-5 py-4" dir="rtl">
              <div className="flex flex-col gap-1 flex-1 text-right">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[14px] font-bold text-ink-900 block">{c.title}</span>
                    <span className="text-[12px] text-ink-500 leading-6 block">{c.description}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Label color="default" size="sm">مرتبط {c.count}</Label>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onEdit(c)} className="w-6 h-6 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
                      <button onClick={() => onDelete(c.id)} className="w-6 h-6 grid place-items-center rounded-lg text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
                    </div>
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

// ── Saved Answer modals ───────────────────────────────────────────────────────

function AnswerModal({ cats, onClose, onSave }: {
  cats: Category[]; onClose: () => void; onSave: (title: string, body: string, categoryId: number | null) => Promise<void>;
}) {
  const [cat, setCat]     = useState(cats[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [body, setBody]   = useState('');
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
  answer: SavedAnswer; cats: Category[]; onClose: () => void;
  onSave: (title: string, body: string, categoryId: number | null) => Promise<void>;
}) {
  const [cat, setCat]     = useState(String(answer.categoryId ?? ''));
  const [title, setTitle] = useState(answer.title);
  const [body, setBody]   = useState(answer.body);
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

// ── AI providers config ───────────────────────────────────────────────────────

interface ModelGroup { label: string; models: string[] }
interface AiProvider { id: string; name: string; description: string; badge: string; badgeColor: string; modelGroups: ModelGroup[] }

const GAPCODE_MODEL_GROUPS: ModelGroup[] = [
  { label: 'گپ‌کد (بومی)', models: [
    'gapgpt-qwen-3.5', 'gapgpt-qwen-3.5-thinking', 'gapgpt-qwen-3.6', 'gapgpt-qwen-3.6-thinking',
  ]},
  { label: 'OpenAI', models: [
    'gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-4.1-nano',
    'gpt-5', 'gpt-5-mini', 'gpt-5-codex', 'o3-mini', 'o4-mini',
  ]},
  { label: 'Anthropic', models: [
    'claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5',
    'claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022',
  ]},
  { label: 'Google Gemini', models: [
    'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite',
    'gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash',
  ]},
  { label: 'Google Gemma', models: ['gemma-3-27b-it'] },
  { label: 'XAI', models: ['grok-4', 'grok-3', 'grok-3-mini', 'grok-3-mini-fast'] },
  { label: 'Deepseek', models: ['deepseek-v4-pro', 'deepseek-v4-flash', 'deepseek-r1'] },
  { label: 'Alibaba (Qwen)', models: [
    'qwen3-235b-a22b', 'qwen3-coder', 'qwen3-coder-480b-a35b-instruct', 'qwen-max', 'qwen-plus', 'qwen-turbo',
  ]},
];

const AI_PROVIDERS: AiProvider[] = [
  { id: 'chatgpt', name: 'ChatGPT',  description: 'مدل‌های هوشمند OpenAI برای پاسخ‌دهی خودکار',             badge: 'GPT', badgeColor: '#10A37F', modelGroups: [{ label: '', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] }] },
  { id: 'claude',  name: 'Claude',   description: 'مدل‌های Anthropic با دقت بالا در پردازش زبان',           badge: 'CLD', badgeColor: '#D97757', modelGroups: [{ label: '', models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'] }] },
  { id: 'gemini',  name: 'Gemini',   description: 'مدل‌های Google با قابلیت‌های چندوجهی',                   badge: 'GEM', badgeColor: '#4285F4', modelGroups: [{ label: '', models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash'] }] },
  { id: 'gapcode', name: 'گپ‌کد',   description: 'سرویس هوش مصنوعی داخلی با پشتیبانی از زبان فارسی',     badge: 'گپ',  badgeColor: '#7C3AED', modelGroups: GAPCODE_MODEL_GROUPS },
];

function AiProviderCard({ provider, config, onChange }: {
  provider: AiProvider;
  config: { enabled: boolean; apiKey: string; model: string };
  onChange: (c: { enabled: boolean; apiKey: string; model: string }) => void;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 flex flex-col gap-5 transition ${config.enabled ? 'border-brand shadow-[0_2px_18px_rgba(0,104,255,0.06)]' : 'border-line'}`}>
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => onChange({ ...config, enabled: !config.enabled })}
          className={`relative w-11 h-6 rounded-full transition shrink-0 mt-0.5 ${config.enabled ? 'bg-brand' : 'bg-line'}`}>
          <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${config.enabled ? 'right-0.5' : 'right-[22px]'}`} />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0" dir="rtl">
          <div className="size-12 rounded-xl grid place-items-center text-white text-[13px] font-bold shrink-0"
               style={{ background: provider.badgeColor }}>{provider.badge}</div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-[14px] font-bold text-ink-900">{provider.name}</span>
            <span className="text-[12px] text-ink-500 leading-5">{provider.description}</span>
          </div>
        </div>
      </div>
      {config.enabled && (
        <div className="flex flex-col gap-3 pt-4 border-t border-line">
          <Field label="کلید API">
            <Input dir="ltr" placeholder="sk-..." value={config.apiKey}
              onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
              className="text-left font-mono text-[12px]" />
          </Field>
          <Field label="مدل">
            <Select value={config.model} onChange={(e) => onChange({ ...config, model: e.target.value })}>
              {provider.modelGroups.map((group) =>
                group.label
                  ? <optgroup key={group.label} label={group.label}>
                      {group.models.map((m) => <option key={m} value={m}>{m}</option>)}
                    </optgroup>
                  : group.models.map((m) => <option key={m} value={m}>{m}</option>)
              )}
            </Select>
          </Field>
        </div>
      )}
    </div>
  );
}

function AiIntegrationTab({ settings, onChange }: { settings: Settings; onChange: (s: Settings) => void }) {
  const providers = settings.providers ?? {};

  function update(id: string, c: { enabled: boolean; apiKey: string; model: string }) {
    onChange({ ...settings, providers: { ...providers, [id]: c } });
  }

  const activeCount = Object.values(providers).filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-bold text-ink-900">ارائه دهندگان</h3>
          {activeCount > 0 && <Label color="primary" size="sm">{activeCount} فعال</Label>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AI_PROVIDERS.map((p) => (
            <AiProviderCard
              key={p.id}
              provider={p}
              config={providers[p.id] ?? { enabled: false, apiKey: '', model: p.modelGroups[0].models[0] }}
              onChange={(c) => update(p.id, c)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PersonalizationTab({ settings, onChange, cats, onAddCat, onEditCat, onDeleteCat }: {
  settings: Settings;
  onChange: (s: Settings) => void;
  cats: Category[];
  onAddCat: () => void;
  onEditCat: (c: Category) => void;
  onDeleteCat: (id: string) => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
      <div className="flex-1 flex flex-col gap-6">
        <Toggle
          checked={settings.aiEnabled}
          onChange={(v) => onChange({ ...settings, aiEnabled: v })}
          label="پاسخ هوشمند"
          hint="قابلیت پاسخ‌دهی هوشمند بر اساس پایگاه دانش فعال می‌شود"
        />

        {settings.aiEnabled && (
          <div className="flex flex-col gap-4 rounded-2xl border border-brand-soft bg-brand-tint/40 p-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
              <span className="text-amber-500 text-[16px] shrink-0 mt-px">⚠</span>
              <p className="text-[12px] text-amber-800 leading-6 text-right">
                هر درخواست به هوش مصنوعی هزینه دارد. مقادیر بزرگ‌تر پاسخ‌های دقیق‌تر اما هزینه‌ی بیشتری ایجاد می‌کنند.
              </p>
            </div>

            <Field
              label="تعداد پاسخ‌های ارسالی به هوش مصنوعی (TOP K)"
              hint="سیستم هر تیکت را با پایگاه دانش مقایسه می‌کند و بهترین N پاسخ را به هوش مصنوعی می‌فرستد. عدد بزرگ‌تر = متن بیشتر = هزینه بالاتر."
            >
              <Input
                type="number"
                dir="ltr"
                className="text-left"
                value={String(settings.aiTopK ?? 4)}
                onChange={(e) => onChange({ ...settings, aiTopK: Math.max(1, Math.min(10, Number(e.target.value))) })}
              />
            </Field>

            <Field
              label="حداکثر طول هر پاسخ — کاراکتر (MAX BODY)"
              hint="بدنه‌ی هر پاسخ آماده تا این تعداد کاراکتر کوتاه می‌شود پیش از ارسال به هوش مصنوعی. عدد کوچک‌تر = توکن کمتر = هزینه پایین‌تر."
            >
              <Input
                type="number"
                dir="ltr"
                className="text-left"
                value={String(settings.aiMaxBodyChars ?? 400)}
                onChange={(e) => onChange({ ...settings, aiMaxBodyChars: Math.max(100, Math.min(2000, Number(e.target.value))) })}
              />
            </Field>
          </div>
        )}

        <Field label="رنگ برند" hint="کد رنگ HEX برند خودتان را وارد کنید — رنگ‌های دکمه‌ها و عناصر اصلی همین رنگ می‌شوند.">
          <div className="relative">
            <Input
              value={settings.brandColor}
              onChange={(e) => {
                onChange({ ...settings, brandColor: e.target.value });
                applyBrandColor(e.target.value);
              }}
              placeholder="#0068ff"
              dir="ltr"
              className="pl-12 text-left"
            />
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 size-6 rounded-full border border-line"
              style={{ background: settings.brandColor }}
            />
          </div>
        </Field>
      </div>
      <div className="hidden lg:block w-px bg-line" />
      <div className="h-px bg-line lg:hidden" />
      <div className="flex-1 min-w-0">
        <CategoriesPanel cats={cats} onAdd={onAddCat} onEdit={onEditCat} onDelete={onDeleteCat} />
      </div>
    </div>
  );
}

function AnswersTab({ answers, cats, onAdd, onEdit, onDelete }: {
  answers: SavedAnswer[]; cats: Category[];
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
        {visible.map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-white px-5 py-4 hover:border-brand transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] font-bold text-ink-900">{a.title}</span>
                  {a.categoryTitle && <Label color="primary">{a.categoryTitle}</Label>}
                </div>
                <p className="text-[13px] text-ink-500 leading-7 text-right">{a.body}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEdit(a)} className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
                <button onClick={() => onDelete(a.id)} className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AdminSettingsPage() {
  const nav = useNavigate();
  const [tab, setTab]         = useState<'personal' | 'answers' | 'ai'>('personal');
  const [cats, setCats]       = useState<Category[]>([]);
  const [answers, setAnswers] = useState<SavedAnswer[]>([]);
  const [settings, setSettings] = useState<Settings>({ aiEnabled: false, brandColor: '#0068ff', providers: {}, aiTopK: 4, aiMaxBodyChars: 400 });
  const [catModal, setCatModal]   = useState(false);
  const [editCat, setEditCat]     = useState<Category | null>(null);
  const [ansModal, setAnsModal]   = useState(false);
  const [editAns, setEditAns]     = useState<SavedAnswer | null>(null);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    adminApi.categories().then(setCats).catch(() => {});
    adminApi.savedAnswers().then(setAnswers).catch(() => {});
    adminApi.settings().then(setSettings).catch(() => {});
  }, []);

  async function saveSettings() {
    setSaving(true);
    try {
      const updated = await adminApi.saveSettings(settings);
      setSettings(updated);
    } finally {
      setSaving(false);
    }
  }

  // Category handlers
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

  // Answer handlers
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
        title="تنظیمات پشتیبانی"
        subtitle="پاسخ گویی به مشتریان با الویت های مشخص"
        action={
          <button onClick={() => nav('/tickets')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition">
            <ListIcon size={18} />
            <span>لیست تیکت‌ها</span>
          </button>
        }
      />

      <div className="overflow-x-auto">
        <div className="inline-flex p-1 rounded-xl border border-line bg-surface-50 min-w-max">
          {([
            { id: 'personal', label: 'شخصی سازی' },
            { id: 'answers',  label: 'تعریف سوالات' },
            { id: 'ai',       label: 'یکپارچه‌سازی هوش مصنوعی' },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`h-10 px-4 sm:px-6 rounded-lg text-[13px] transition whitespace-nowrap ${tab === t.id ? 'bg-white text-ink-900 shadow font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'personal' && (
        <PersonalizationTab
          settings={settings}
          onChange={setSettings}
          cats={cats}
          onAddCat={() => setCatModal(true)}
          onEditCat={(c) => setEditCat(c)}
          onDeleteCat={handleDeleteCat}
        />
      )}
      {tab === 'answers' && (
        <AnswersTab
          answers={answers}
          cats={cats}
          onAdd={() => setAnsModal(true)}
          onEdit={(a) => setEditAns(a)}
          onDelete={handleDeleteAns}
        />
      )}
      {tab === 'ai' && <AiIntegrationTab settings={settings} onChange={setSettings} />}

      <div className="flex">
        <Button variant="primary" size="md" onClick={saveSettings} disabled={saving}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </div>

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
    </PageContainer>
  );
}
