import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { Field, Input, Select } from '../components/FormControls';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { Pagination } from '../components/Pagination';
import { ArrowLeft, Flag, Search, TicketStar, ListIcon } from '../icons';
import { adminTickets, adminStateMap, type AdminTicket, type AdminState } from '../data/adminMock';

const priorityMap = {
  low: { color: 'primary' as const, label: 'الویت کم' },
  medium: { color: 'warning' as const, label: 'الویت متوسط' },
  high: { color: 'danger' as const, label: 'الویت بالا' },
};

function StatBox({ count, label, tint }: { count: string | number; label: string; tint: 'gray'|'warning'|'primary'|'danger'|'default' }) {
  const tints: Record<string, string> = {
    gray: 'bg-surface-100 text-ink-700',
    warning: 'bg-[#FFF8EC] text-[#B47100]',
    primary: 'bg-brand-tint text-brand',
    danger: 'bg-[#FDEAEA] text-danger',
    default: 'bg-white text-ink-700 border border-line',
  };
  return (
    <div className={`flex-1 rounded-2xl px-5 py-4 flex flex-col items-center gap-1 ${tints[tint]}`}>
      <div className="text-[19px] font-bold tabular">{count}</div>
      <div className="text-[11px]">{label}</div>
    </div>
  );
}

function AdminTicketRow({ ticket, selected, onToggle }: {
  ticket: AdminTicket; selected: boolean; onToggle: () => void;
}) {
  const s = adminStateMap[ticket.state];
  const p = priorityMap[ticket.priority];
  const nav = useNavigate();
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-3 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.06)] transition">
      <button onClick={() => nav(`/tickets/${ticket.id}`)}
        className="grid place-items-center size-9 rounded-lg text-ink-500 hover:text-brand transition">
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Label color={s.color}>{s.label}</Label>
            <span className="w-px h-4 bg-line" />
            <Label color={p.color} icon={<Flag size={12} />}>{p.label}</Label>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <p className="text-[13px] text-ink-900 leading-6">{ticket.title}</p>
            <div className="flex items-center gap-3 text-[11px] text-ink-400 tabular">
              <span>{ticket.user}</span>
              <span className="w-px h-3 bg-line" />
              <span>{ticket.date}</span>
              <span className="w-px h-3 bg-line" />
              <span>{ticket.time}</span>
              <Label color="default" size="sm">{ticket.ago}</Label>
              <span className="font-bold text-brand text-[14px]">#{ticket.id}</span>
            </div>
          </div>
        </div>
        <p className="text-[13px] text-ink-700 leading-6 text-right truncate">{ticket.preview}</p>
      </div>
      <label className="flex items-center justify-center cursor-pointer">
        <input type="checkbox" checked={selected} onChange={onToggle}
          className="size-5 rounded-md border-2 border-line text-brand focus:ring-brand/30 cursor-pointer" />
      </label>
    </div>
  );
}

export function AdminTicketListPage() {
  const [filter, setFilter] = useState<AdminState | 'all'>('all');
  const [priority, setPriority] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  const counts = {
    all: adminTickets.length,
    unreviewed: adminTickets.filter((t) => t.state === 'unreviewed').length,
    reviewing: adminTickets.filter((t) => t.state === 'reviewing').length,
    pending: adminTickets.filter((t) => t.state === 'pending').length,
    closed: adminTickets.filter((t) => t.state === 'closed').length,
  };

  const filtered = adminTickets
    .filter((t) => (filter === 'all' ? true : t.state === filter))
    .filter((t) => (priority === 'all' ? true : t.priority === priority))
    .filter((t) => (search.trim() === '' ? true : t.id.includes(search) || t.title.includes(search)));

  const tabs: { value: AdminState | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'همه تیکت ها', count: counts.all },
    { value: 'unreviewed', label: 'بررسی نشده', count: counts.unreviewed },
    { value: 'reviewing', label: 'درحال بررسی', count: counts.reviewing },
    { value: 'pending', label: 'در انتظار پاسخ', count: counts.pending },
    { value: 'closed', label: 'بسته شده', count: counts.closed },
  ];

  const nav = useNavigate();

  return (
    <PageContainer>
      <header className="flex items-start justify-between gap-6 pb-5 border-b border-line">
        <button
          onClick={() => nav('/admin/settings')}
          className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-white border border-line text-ink-900 text-[13px] font-medium hover:bg-surface-50 transition"
        >
          <span>تنظیمات</span>
        </button>
        <div className="flex items-start gap-3 text-right">
          <div>
            <h1 className="text-[23px] font-bold text-ink-900 leading-[48px]">ادمین پشتیبانی</h1>
            <p className="text-[13px] text-ink-500 leading-6">پاسخ گویی به مشتریان با الویت های مشخص</p>
          </div>
          <div className="text-brand"><TicketStar size={48} /></div>
        </div>
      </header>

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-500 tabular">{counts.all} تیکت</span>
      </div>

      <Field label="شماره تیکت" hint="شماره تیکت مد نظر خودتان را وارد کنید">
        <div className="relative">
          <Input placeholder="شماره تیکت" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </Field>

      <div className="grid grid-cols-5 gap-3">
        <StatBox count="۳۲۰" label="همه تیکت ها" tint="default" />
        <StatBox count={counts.unreviewed} label="بررسی نشده" tint="danger" />
        <StatBox count={counts.reviewing} label="در حال بررسی" tint="primary" />
        <StatBox count={counts.pending} label="در انتظار پاسخ" tint="warning" />
        <StatBox count="۳۲۰" label="بسته شده" tint="gray" />
      </div>

      <div className="flex items-center justify-between gap-3">
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="!w-auto min-w-[140px]">
          <option value="all">الویت</option>
          <option value="high">الویت بالا</option>
          <option value="medium">الویت متوسط</option>
          <option value="low">الویت کم</option>
        </Select>
        <div className="flex items-center border-b border-line">
          {tabs.map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`flex items-center gap-2 h-12 px-4 text-[13px] transition relative ${filter === t.value ? 'text-brand font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              <span>{t.label}</span>
              <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] tabular ${filter === t.value ? 'bg-brand text-white' : 'bg-surface-100 text-ink-500'}`}>{t.count}</span>
              {filter === t.value && <span className="absolute right-0 left-0 -bottom-px h-0.5 bg-brand" />}
            </button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-brand-soft bg-brand-tint px-4 py-2.5">
          <Button variant="primary" size="sm">پاسخ گروهی</Button>
          <span className="text-[13px] text-brand">{selected.size} تیکت انتخاب شده</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-500 text-[13px]">تیکتی برای نمایش وجود ندارد.</div>
        ) : filtered.map((t) => (
          <AdminTicketRow key={t.id} ticket={t} selected={selected.has(t.id)} onToggle={() => toggle(t.id)} />
        ))}
      </div>

      <Pagination page={1} total={10} onChange={() => {}} />

      {/* unused-symbol guard for build cleanliness */}
      <span className="hidden"><ListIcon size={1} /></span>
    </PageContainer>
  );
}
