import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { AdminTicketRow } from '../components/AdminTicketRow';
import { Field, Input, Select } from '../components/FormControls';
import { Button } from '../components/Button';
import { Pagination } from '../components/Pagination';
import { Search } from '../icons';
import { adminTickets as initialTickets, type AdminState, type AdminTicket } from '../data/adminMock';
import { Setting } from '../icons/index'

function StatBox({ count, label, tint }: { count: string | number; label: string; tint: 'gray'|'warning'|'primary'|'danger'|'default'|'violet' }) {
  const tints: Record<string, string> = {
    gray: 'bg-surface-100 text-ink-700',
    warning: 'bg-[#FFF8EC] text-[#B47100]',
    primary: 'bg-brand-tint text-brand',
    danger: 'bg-[#FDEAEA] text-danger',
    default: 'bg-white text-ink-700 border border-line',
    violet: 'bg-[#F1E8FF] text-violet',
  };
  return (
    <div className={`flex-1 rounded-2xl px-5 py-4 flex flex-col items-center gap-1 ${tints[tint]}`}>
      <div className="text-[19px] font-bold tabular">{count}</div>
      <div className="text-[11px]">{label}</div>
    </div>
  );
}


export function AdminTicketListPage() {
  const [tickets, setTickets] = useState<AdminTicket[]>(initialTickets);
  const [filter, setFilter] = useState<AdminState | 'all'>('all');
  const [priority, setPriority] = useState<string>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [bulkStatus, setBulkStatus] = useState<AdminState | ''>('');

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function applyBulkStatus() {
    if (!bulkStatus) return;
    setTickets((prev) =>
      prev.map((t) => selected.has(t.id) ? { ...t, state: bulkStatus } : t)
    );
    setSelected(new Set());
    setBulkStatus('');
  }

  const counts = {
    all: tickets.length,
    unreviewed: tickets.filter((t) => t.state === 'unreviewed').length,
    reviewing: tickets.filter((t) => t.state === 'reviewing').length,
    pending: tickets.filter((t) => t.state === 'pending').length,
    closed: tickets.filter((t) => t.state === 'closed').length,
    spam: tickets.filter((t) => t.state === 'spam').length,
  };

  const filtered = tickets
    .filter((t) => (filter === 'all' ? true : t.state === filter))
    .filter((t) => (priority === 'all' ? true : t.priority === priority))
    .filter((t) => (search.trim() === '' ? true : t.id.includes(search) || t.title.includes(search)));

  const tabs: { value: AdminState | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'همه تیکت ها', count: counts.all },
    { value: 'unreviewed', label: 'بررسی نشده', count: counts.unreviewed },
    { value: 'reviewing', label: 'درحال بررسی', count: counts.reviewing },
    { value: 'pending', label: 'در انتظار پاسخ', count: counts.pending },
    { value: 'closed', label: 'بسته شده', count: counts.closed },
    { value: 'spam', label: 'اسپم', count: counts.spam },
  ];

  const nav = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="ادمین پشتیبانی"
        subtitle="پاسخ گویی به مشتریان با الویت های مشخص"
        action={
          <button
            onClick={() => nav('/admin/settings')}
            className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition"
          >
            <Setting size={18} />
            <span>تنظیمات</span>
          </button>
        }
      />

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-500 tabular">{counts.all} تیکت</span>
      </div>

      <Field label="شماره تیکت" hint="شماره تیکت مد نظر خودتان را وارد کنید">
        <div className="relative">
          <Input placeholder="شماره تیکت" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </Field>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBox count={counts.all} label="همه تیکت ها" tint="default" />
        <StatBox count={counts.unreviewed} label="بررسی نشده" tint="danger" />
        <StatBox count={counts.reviewing} label="در حال بررسی" tint="primary" />
        <StatBox count={counts.pending} label="در انتظار پاسخ" tint="warning" />
        <StatBox count={counts.closed} label="بسته شده" tint="gray" />
        <StatBox count={counts.spam} label="اسپم" tint="violet" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Select value={priority} onChange={(e) => setPriority(e.target.value)} className="!w-auto min-w-[140px]">
          <option value="all">الویت</option>
          <option value="high">الویت بالا</option>
          <option value="medium">الویت متوسط</option>
          <option value="low">الویت کم</option>
        </Select>
        <div className="flex items-center border-b border-line overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={`flex items-center gap-2 h-12 px-3 sm:px-4 text-[13px] transition relative whitespace-nowrap ${filter === t.value ? 'text-brand font-medium' : 'text-ink-500 hover:text-ink-900'}`}>
              <span>{t.label}</span>
              <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] tabular ${filter === t.value ? 'bg-brand text-white' : 'bg-surface-100 text-ink-500'}`}>{t.count}</span>
              {filter === t.value && <span className="absolute right-0 left-0 -bottom-px h-0.5 bg-brand" />}
            </button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-brand-soft bg-brand-tint px-4 py-2.5 gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as AdminState | '')}
              className="!w-auto min-w-[140px] sm:min-w-[160px] !h-8 !text-[12px]"
            >
              <option value="">تغییر وضعیت...</option>
              <option value="unreviewed">بررسی نشده</option>
              <option value="reviewing">درحال بررسی</option>
              <option value="pending">در انتظار پاسخ</option>
              <option value="closed">بسته شده</option>
              <option value="spam">اسپم</option>
            </Select>
            {bulkStatus && (
              <Button variant="primary" size="sm" onClick={applyBulkStatus}>
                اعمال
              </Button>
            )}
          </div>
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
    </PageContainer>
  );
}
