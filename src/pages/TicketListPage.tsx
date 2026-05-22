import { useState, useEffect, useCallback } from 'react';
import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { TicketCard }     from '../components/TicketCard';
import { Tabs, Pagination } from '../components/Pagination';
import { ticketsApi, type Ticket } from '../api/tickets';

const PER_PAGE = 5;

type Filter = 'all' | 'answered' | 'closed';

function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)     return 'لحظاتی پیش';
  if (diff < 3600)   return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return iso.slice(0, 10);
}

function toCard(t: Ticket) {
  return {
    id:       t.id,
    title:    t.title,
    status:   t.status,
    priority: t.priority,
    preview:  t.preview,
    date:     t.createdAt.slice(0, 10),
    time:     t.createdAt.slice(11, 16),
    ago:      relativeTime(t.updatedAt),
  };
}

export function TicketListPage() {
  const [filter, setFilter]   = useState<Filter>('all');
  const [page, setPage]       = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);

    ticketsApi.list(page, PER_PAGE)
      .then((res) => {
        if (!active) return;
        setTickets(res.items);
        setTotalPages(res.total_pages);
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [page]);

  useEffect(load, [load]);

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <PageContainer>
      <PageHeader />

      <div className="sm:self-start">
        <Tabs
          value={filter}
          onChange={(v) => { setFilter(v as Filter); setPage(1); }}
          options={[
            { value: 'all',      label: 'همه' },
            { value: 'answered', label: 'پاسخ داده شده' },
            { value: 'closed',   label: 'بسته شده' },
          ]}
        />
      </div>

      {loading && (
        <div className="text-center py-10 text-ink-500 text-[13px]">در حال بارگذاری...</div>
      )}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-danger">{error}</div>
      )}
      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-500 text-[13px]">
              تیکتی برای نمایش وجود ندارد.
            </div>
          ) : (
            filtered.map((t) => <TicketCard key={t.id} ticket={toCard(t)} />)
          )}
        </div>
      )}

      <Pagination page={page} total={totalPages} onChange={setPage} />
    </PageContainer>
  );
}
