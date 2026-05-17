import { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { TicketCard } from '../components/TicketCard';
import { Tabs } from '../components/Pagination';
import { Pagination } from '../components/Pagination';
import { tickets } from '../data/mock';

type Filter = 'all' | 'answered' | 'closed';

export function TicketListPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(1);

  const filtered = tickets.filter((t) =>
    filter === 'all' ? true : filter === 'answered' ? t.status === 'answered' : t.status === 'closed',
  );

  return (
    <PageContainer>
      <PageHeader />

      <div className="flex items-center justify-between">
        <Tabs
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'همه' },
            { value: 'answered', label: 'پاسخ داده شده' },
            { value: 'closed', label: 'بسته شده' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((t) => (
          <TicketCard key={t.id} ticket={t} />
        ))}
      </div>

      <Pagination page={page} total={3} onChange={setPage} />
    </PageContainer>
  );
}
