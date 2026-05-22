import { useState }       from 'react';
import { useNavigate }    from 'react-router-dom';
import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';
import { AiLoadingPanel } from '../components/AiLoadingPanel';
import { ticketsApi }     from '../api/tickets';

export function TicketNewPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload: { title: string; body: string; priority: string; category_id?: number | null }) {
    setSubmitting(true);
    try {
      const ticket = await ticketsApi.create(payload);
      if (ticket.aiStatus === 'done' && ticket.aiSuggestion) {
        navigate(`/tickets/${ticket.id}/ai-show`);
      } else {
        navigate(`/tickets/${ticket.id}`);
      }
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title={submitting ? 'در حال تولید پاسخ' : 'ثبت تیکت جدید'}
        subtitle={submitting ? 'پاسخ هوشمند ما در حال آماده شدن است' : 'پشتیبانی هوشمند، آماده پاسخگویی به سوالات شما'}
      />

      <div className={submitting ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 items-start' : 'flex'}>
        <div className={submitting ? 'flex justify-end' : ''}>
          <TicketComposer
            onSubmit={handleSubmit}
            onCancel={() => navigate('/tickets')}
            showSubmit={!submitting}
            showCancel={!submitting}
          />
        </div>

        {submitting && <AiLoadingPanel />}
      </div>
    </PageContainer>
  );
}
