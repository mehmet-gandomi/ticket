import { useState, useEffect } from 'react';
import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { TicketCard }     from '../components/TicketCard';
import { Tabs, Pagination } from '../components/Pagination';
import { ticketsApi, type Ticket } from '../api/tickets';

type Filter = 'all' | 'answered' | 'closed';

export function TicketListPage() {
  const [filter, setFilter]   = useState<Filter>('all');
  const [page, setPage]       = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    ticketsApi.list(page)
      .then((res) => {
        if (!active) return;
        setTickets(res.items);
        setTotal(res.total_pages);
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [page]);

  const filtered = tickets.filter((t) =>
    filter === 'all' ? true : t.status === filter,
  );

  return (
    <PageContainer>
      <PageHeader />

      <div className="sm:self-start">
        <Tabs
          value={filter}
          onChange={setFilter}
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
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-danger">
          {error}
        </div>
      )}
      {!loading && !error && (
        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-500 text-[13px]">
              تیکتی برای نمایش وجود ندارد.
            </div>
          ) : (
            filtered.map((t) => (
              <TicketCard key={t.id} ticket={{
                id:      t.id,
                title:   t.title,
                status:  t.status,
                priority:t.priority,
                preview: '',
                date:    t.createdAt.slice(0, 10),
                time:    t.createdAt.slice(11, 16),
                ago:     '',
              }} />
            ))
          )}
        </div>
      )}

      <Pagination page={page} total={total} onChange={setPage} />
    </PageContainer>
  );
}
