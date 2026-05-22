import { useState, useEffect, useCallback } from 'react';
import { useNavigate }        from 'react-router-dom';
import { PageContainer }      from '../components/PageContainer';
import { PageHeader }         from '../components/PageHeader';
import { AdminTicketRow }     from '../components/AdminTicketRow';
import { Field, Input, Select } from '../components/FormControls';
import { Button }             from '../components/Button';
import { Pagination }         from '../components/Pagination';
import { Search, Setting, Trash, Close } from '../icons';
import { adminApi, type AdminState, type AdminTicket } from '../api/admin';
import { toShamsi, relativeTime } from './TicketListPage';

function DeleteConfirmModal({ ticketId, onClose, onConfirm }: {
  ticketId: string;
  onClose: () => void;
  onConfirm: () => void;
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
          <h2 className="text-[16px] font-bold text-ink-900">حذف تیکت</h2>
          <button onClick={onClose} className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50">
            <Close size={18} />
          </button>
        </div>
        <div className="h-px bg-line" />
        <div className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-4">
            <span className="size-11 rounded-2xl bg-red-50 grid place-items-center text-danger shrink-0">
              <Trash size={20} />
            </span>
            <div className="flex flex-col gap-1 text-right">
              <p className="text-[14px] font-bold text-ink-900">آیا مطمئن هستید؟</p>
              <p className="text-[13px] text-ink-500 leading-6">
                تیکت <span className="font-bold text-ink-700">#{ticketId}</span> و تمام پیام‌های آن به طور کامل حذف می‌شود و قابل بازگشت نیست.
              </p>
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

function StatBox({ count, label, tint }: { count: number; label: string; tint: 'gray'|'warning'|'primary'|'danger'|'default'|'violet'|'success' }) {
  const tints: Record<string, string> = {
    gray:    'bg-surface-100 text-ink-700',
    warning: 'bg-[#FFF8EC] text-[#B47100]',
    primary: 'bg-brand-tint text-brand',
    danger:  'bg-[#FDEAEA] text-danger',
    default: 'bg-white text-ink-700 border border-line',
    violet:  'bg-[#F1E8FF] text-violet',
    success: 'bg-[#EAFAF3] text-success',
  };
  return (
    <div className={`flex-1 rounded-2xl px-5 py-4 flex flex-col items-center gap-1 ${tints[tint]}`}>
      <div className="text-[19px] font-bold tabular">{count}</div>
      <div className="text-[11px]">{label}</div>
    </div>
  );
}

export function AdminTicketListPage() {
  const [tickets, setTickets]     = useState<AdminTicket[]>([]);
  const [counts, setCounts]       = useState<Record<string, number>>({});
  const [aiResolved, setAiResolved] = useState(0);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [filter, setFilter]       = useState<AdminState | 'all'>('all');
  const [priority, setPriority]   = useState<string>('all');
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<AdminState | ''>('');
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [deleteId, setDeleteId]   = useState<string | null>(null);

  const nav = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    adminApi.tickets({
      page,
      perPage:  20,
      status:   filter === 'all' ? '' : filter,
      priority: priority === 'all' ? '' : priority,
      search,
    })
      .then((res) => {
        setTickets(res.items);
        setTotal(res.total_pages);
        setCounts({ ...res.counts, all: res.total });
        setAiResolved(res.aiResolved ?? 0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, filter, priority, search]);

  useEffect(() => { load(); }, [load]);

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  async function applyBulkStatus() {
    if (!bulkStatus) return;
    await Promise.all([...selected].map((id) => adminApi.updateTicketState(id, bulkStatus)));
    setSelected(new Set());
    setBulkStatus('');
    load();
  }

  return (
    <>
    <PageContainer>
      <PageHeader
        title="ادمین پشتیبانی"
        subtitle="پاسخ گویی به مشتریان با الویت های مشخص"
        action={
          <button
            onClick={() => nav('/settings')}
            className="inline-flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition shrink-0"
          >
            <Setting size={18} />
            <span>تنظیمات</span>
          </button>
        }
      />

      <Field label="شماره تیکت" hint="شماره تیکت مد نظر خودتان را وارد کنید">
        <div className="relative">
          <Input placeholder="شماره تیکت" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>
      </Field>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatBox count={counts.all        ?? 0} label="همه تیکت ها"      tint="default" />
        <StatBox count={counts.unreviewed ?? 0} label="بررسی نشده"        tint="danger"  />
        <StatBox count={counts.reviewing  ?? 0} label="در حال بررسی"     tint="primary" />
        <StatBox count={counts.pending    ?? 0} label="در انتظار پاسخ"   tint="warning" />
        <StatBox count={counts.closed     ?? 0} label="بسته شده"          tint="gray"    />
        <StatBox count={counts.spam       ?? 0} label="اسپم"              tint="violet"  />
        <StatBox count={aiResolved}             label="پاسخ هوشمند"       tint="success" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select value={filter} onChange={(e) => { setFilter(e.target.value as AdminState | 'all'); setPage(1); }}>
          <option value="all">همه وضعیت‌ها</option>
          <option value="unreviewed">بررسی نشده</option>
          <option value="reviewing">درحال بررسی</option>
          <option value="pending">در انتظار پاسخ</option>
          <option value="answered">پاسخ داده شده</option>
          <option value="closed">بسته شده</option>
          <option value="spam">اسپم</option>
        </Select>
        <Select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }}>
          <option value="all">همه الویت‌ها</option>
          <option value="high">الویت بالا</option>
          <option value="medium">الویت متوسط</option>
          <option value="low">الویت کم</option>
        </Select>
      </div>

      {selected.size > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-brand-soft bg-brand-tint px-4 py-2.5 gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as AdminState | '')}
              className="!h-8 !text-[12px]"
            >
              <option value="">تغییر وضعیت...</option>
              <option value="unreviewed">بررسی نشده</option>
              <option value="reviewing">درحال بررسی</option>
              <option value="pending">در انتظار پاسخ</option>
              <option value="answered">پاسخ داده شده</option>
              <option value="closed">بسته شده</option>
              <option value="spam">اسپم</option>
            </Select>
            {bulkStatus && <Button variant="primary" size="sm" onClick={applyBulkStatus}>اعمال</Button>}
          </div>
          <span className="text-[13px] text-brand">{selected.size} تیکت انتخاب شده</span>
        </div>
      )}

      {loading && <div className="text-center py-10 text-ink-500 text-[13px]">در حال بارگذاری...</div>}
      {error   && <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-danger">{error}</div>}
      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {tickets.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-500 text-[13px]">
              تیکتی برای نمایش وجود ندارد.
            </div>
          ) : tickets.map((t) => (
            <AdminTicketRow
              key={t.id}
              ticket={{
                id:       t.id,
                title:    t.title,
                user:     t.user,
                state:    t.state,
                priority: t.priority,
                preview:  t.preview,
                date:     toShamsi(t.createdAt),
                time:     t.createdAt.slice(11, 16),
                ago:      relativeTime(t.updatedAt),
              }}
              selected={selected.has(t.id)}
              onToggle={() => toggle(t.id)}
              onDelete={() => setDeleteId(t.id)}
            />
          ))}
        </div>
      )}

      <Pagination page={page} total={total} onChange={setPage} />
    </PageContainer>

    {deleteId && (
      <DeleteConfirmModal
        ticketId={deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          await adminApi.deleteTicket(deleteId);
          setDeleteId(null);
          load();
        }}
      />
    )}
    </>
  );
}
