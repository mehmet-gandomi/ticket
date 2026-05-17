import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { Field, Input, Select } from '../components/FormControls';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { Plus, Close, AddAnswer, ListIcon, Trash, Edit } from '../icons';
import { PageHeader } from '../components/PageHeader';
import { RichEditor } from '../components/RichEditor';
import { AttachmentsUploader } from '../components/AttachmentsUploader';
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
        className={`bg-white rounded-3xl border border-line flex flex-col max-h-[90vh] ${wide ? 'w-full max-w-[640px]' : 'w-full max-w-[480px]'}`}>
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-[16px] font-bold">{title}</h2>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50"><Close size={18} /></button>
        </div>
        <div className="h-px bg-line shrink-0" />
        <div className="flex flex-col gap-4 overflow-y-auto p-6">
          {children}
        </div>
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
      <div className="h-px bg-line" />
      <div className="flex">
        <Button variant="primary"
          onClick={() => { if (title.trim()) { onSave({ id: 'c' + Date.now(), title, description, count: 0 }); onClose(); } }}>
          افزودن دسته
        </Button>
      </div>
    </Modal>
  );
}

function EditCategoryModal({ cat, onClose, onSave }: { cat: Category; onClose: () => void; onSave: (c: Category) => void }) {
  const [title, setTitle] = useState(cat.title);
  const [description, setDescription] = useState(cat.description);
  return (
    <Modal onClose={onClose} title="ویرایش دسته بندی">
      <Field label="عنوان دسته"><Input placeholder="فنی" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
      <Field label="توضیحات دسته"><Input placeholder="دسته فنی در ..." value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
      <div className="h-px bg-line" />
      <div className="flex">
        <Button variant="primary"
          onClick={() => { if (title.trim()) { onSave({ ...cat, title, description }); onClose(); } }}>
          ذخیره تغییرات
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
      <div className="flex gap-2">
        <Field label="عنوان سوال"><Input placeholder="مثلاً گواهی SSL منقضی شده" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="دسته سوال">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
          </Select>
        </Field>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
        <RichEditor placeholder="مشکل خود را با جزئیات کامل توضیح دهید..." />
      </div>
      <AttachmentsUploader />
      <div className="flex gap-3 mt-2">
        <Button variant="primary"
          onClick={() => { if (title.trim() && body.trim()) { onSave({ id: Date.now(), category: cat, title, body }); onClose(); } }}>
          افزودن پاسخ
        </Button>
        <Button variant="danger" onClick={onClose}>لغو</Button>
      </div>
    </Modal>
  );
}

function EditAnswerModal({ answer, cats, onClose, onSave }: {
  answer: SavedAnswer; cats: Category[]; onClose: () => void; onSave: (a: SavedAnswer) => void;
}) {
  const [cat, setCat] = useState(answer.category);
  const [title, setTitle] = useState(answer.title);
  const [body, setBody] = useState(answer.body);
  return (
    <Modal onClose={onClose} title="ویرایش پاسخ آماده" wide>
      <div className="flex gap-2">
        <Field label="عنوان سوال"><Input placeholder="مثلاً گواهی SSL منقضی شده" value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
        <Field label="دسته سوال">
          <Select value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
          </Select>
        </Field>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
        <RichEditor placeholder="متن پاسخ آماده را بنویسید..." defaultValue={answer.body} onChange={setBody} />
      </div>
      <AttachmentsUploader defaultFiles={answer.attachments ?? []} />
      <div className="flex gap-3 mt-2">
        <Button variant="primary"
          onClick={() => { if (title.trim() && body.trim()) { onSave({ ...answer, category: cat, title, body }); onClose(); } }}>
          ذخیره تغییرات
        </Button>
        <Button variant="danger" onClick={onClose}>لغو</Button>
      </div>
    </Modal>
  );
}

function CategoriesPanel({ cats, setCats, onAdd }: {
  cats: Category[]; setCats: (c: Category[]) => void; onAdd: () => void;
}) {
  const [editing, setEditing] = useState<Category | null>(null);
  const remove = (id: string) => setCats(cats.filter((c) => c.id !== id));
  const saveEdit = (updated: Category) => setCats(cats.map((c) => c.id === updated.id ? updated : c));
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
            {[0, 1, 2, 3].map((i) => <div key={i} className="size-12 rounded-xl border-2 border-brand" />)}
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
                      <button onClick={() => setEditing(c)} className="w-6 h-6 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => remove(c.id)} className="w-6 h-6 grid place-items-center rounded-lg text-danger hover:bg-red-50 transition">
                        <Trash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && <EditCategoryModal cat={editing} onClose={() => setEditing(null)} onSave={saveEdit} />}
    </div>
  );
}

interface AiProvider {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  models: string[];
}

const externalProviders: AiProvider[] = [
  { id: 'chatgpt', name: 'ChatGPT', description: 'مدل‌های هوشمند OpenAI برای پاسخ‌دهی خودکار', badge: 'GPT', badgeColor: '#10A37F', models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'] },
  { id: 'claude', name: 'Claude', description: 'مدل‌های Anthropic با دقت بالا در پردازش زبان', badge: 'CLD', badgeColor: '#D97757', models: ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'] },
  { id: 'gemini', name: 'Gemini', description: 'مدل‌های Google با قابلیت‌های چندوجهی', badge: 'GEM', badgeColor: '#4285F4', models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'] },
];

const internalProviders: AiProvider[] = [
  { id: 'gapcode', name: 'گپ‌کد', description: 'سرویس هوش مصنوعی داخلی با پشتیبانی از زبان فارسی', badge: 'گپ', badgeColor: '#7C3AED', models: ['gapcode-v1', 'gapcode-v2'] },
];

interface AiConfig { enabled: boolean; apiKey: string; model: string; }

function AiProviderCard({ provider, config, onChange }: {
  provider: AiProvider;
  config: AiConfig;
  onChange: (c: AiConfig) => void;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-5 flex flex-col gap-4 transition ${config.enabled ? 'border-brand shadow-[0_2px_18px_rgba(0,104,255,0.06)]' : 'border-line'}`}>
      <div className="flex items-center justify-between gap-4">
        <Toggle checked={config.enabled} onChange={(v) => onChange({ ...config, enabled: v })} label="" />
        <div className="flex items-center gap-3 flex-1">
          <div className="flex flex-col gap-0.5 text-right flex-1">
            <span className="text-[14px] font-bold text-ink-900">{provider.name}</span>
            <span className="text-[12px] text-ink-500">{provider.description}</span>
          </div>
          <div
            className="size-11 rounded-xl grid place-items-center text-white text-[12px] font-bold shrink-0"
            style={{ background: provider.badgeColor }}
          >
            {provider.badge}
          </div>
        </div>
      </div>

      {config.enabled && (
        <div className="flex flex-col gap-3 pt-1 border-t border-line">
          <Field label="کلید API">
            <Input
              dir="ltr"
              placeholder="sk-..."
              value={config.apiKey}
              onChange={(e) => onChange({ ...config, apiKey: e.target.value })}
              className="text-left font-mono text-[12px]"
            />
          </Field>
          <Field label="مدل">
            <Select value={config.model} onChange={(e) => onChange({ ...config, model: e.target.value })}>
              {provider.models.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
          </Field>
        </div>
      )}
    </div>
  );
}

function AiIntegrationTab() {
  const makeDefault = (p: AiProvider): AiConfig => ({ enabled: false, apiKey: '', model: p.models[0] });
  const [configs, setConfigs] = useState<Record<string, AiConfig>>(() =>
    Object.fromEntries([...externalProviders, ...internalProviders].map((p) => [p.id, makeDefault(p)]))
  );

  function update(id: string, c: AiConfig) {
    setConfigs((prev) => ({ ...prev, [id]: c }));
  }

  const activeCount = Object.values(configs).filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-bold text-ink-900">خارجی</h3>
          <span className="w-px h-3 bg-line" />
          <span className="text-[11px] text-ink-400">سرویس‌های هوش مصنوعی بین‌المللی</span>
          {activeCount > 0 && <Label color="primary" size="sm">{activeCount} فعال</Label>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {externalProviders.map((p) => (
            <AiProviderCard key={p.id} provider={p} config={configs[p.id]} onChange={(c) => update(p.id, c)} />
          ))}
        </div>
      </div>

      <div className="h-px bg-line" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-[15px] font-bold text-ink-900">داخلی</h3>
          <span className="w-px h-3 bg-line" />
          <span className="text-[11px] text-ink-400">سرویس‌های هوش مصنوعی ایرانی</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {internalProviders.map((p) => (
            <AiProviderCard key={p.id} provider={p} config={configs[p.id]} onChange={(c) => update(p.id, c)} />
          ))}
        </div>
      </div>

      <div className="flex">
        <Button variant="primary" size="md" onClick={() => {}}>ذخیره تنظیمات</Button>
      </div>
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

function AnswersTab({ answers, setAnswers, cats, openAns }: {
  answers: SavedAnswer[]; setAnswers: (a: SavedAnswer[]) => void; cats: Category[]; openAns: () => void;
}) {
  const [catFilter, setCatFilter] = useState('all');
  const [editing, setEditing] = useState<SavedAnswer | null>(null);

  const visible = catFilter === 'all' ? answers : answers.filter((a) => a.category === catFilter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button variant="primary" size="lg" leadingIcon={<AddAnswer size={16} />} onClick={openAns}>افزودن پاسخ</Button>
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className="!w-auto min-w-[160px]">
          <option value="all">همه دسته‌ها</option>
          {cats.map((c) => <option key={c.id} value={c.title}>{c.title}</option>)}
        </Select>
      </div>
      <div className="flex flex-col gap-3">
        {visible.map((a) => (
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
                <button onClick={() => setEditing(a)} className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-brand hover:bg-brand-tint transition"><Edit size={14} /></button>
                <button onClick={() => setAnswers(answers.filter((x) => x.id !== a.id))}
                  className="size-8 grid place-items-center rounded-lg text-ink-500 hover:text-danger hover:bg-red-50 transition"><Trash size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <EditAnswerModal
          answer={editing}
          cats={cats}
          onClose={() => setEditing(null)}
          onSave={(updated) => { setAnswers(answers.map((a) => a.id === updated.id ? updated : a)); setEditing(null); }}
        />
      )}
    </div>
  );
}

export function AdminSettingsPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<'personal' | 'answers' | 'ai'>('personal');
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
          {([{ id: 'personal', label: 'شخصی سازی' }, { id: 'answers', label: 'تعریف سوالات' }, { id: 'ai', label: 'یکپارچه‌سازی هوش مصنوعی' }] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`h-10 px-6 rounded-lg text-[13px] transition ${tab === t.id ? 'bg-white text-ink-900 shadow font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'personal' && <PersonalizationTab cats={cats} setCats={setCats} openCat={() => setCatModal(true)} />}
      {tab === 'answers' && <AnswersTab answers={answers} setAnswers={setAnswers} cats={cats} openAns={() => setAnsModal(true)} />}
      {tab === 'ai' && <AiIntegrationTab />}

      {catModal && <CategoryModal onClose={() => setCatModal(false)} onSave={(c) => setCats([...cats, c])} />}
      {ansModal && <AnswerModal onClose={() => setAnsModal(false)} cats={cats} onSave={(a) => setAnswers([a, ...answers])} />}
    </PageContainer>
  );
}
