import { useNavigate }    from 'react-router-dom';
import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';
import { ticketsApi }     from '../api/tickets';

export function TicketNewPage() {
  const navigate = useNavigate();

  async function handleSubmit(payload: { title: string; body: string; priority: string; category_id?: number | null }) {
    const ticket = await ticketsApi.create(payload);

    if (ticket.aiStatus === 'done' && ticket.aiSuggestion) {
      navigate(`/tickets/${ticket.id}/ai-show`);
    } else {
      navigate(`/tickets/${ticket.id}`);
    }
  }

  return (
    <PageContainer>
      <PageHeader title="ثبت تیکت جدید" subtitle="پشتیبانی هوشمند، آماده پاسخگویی به سوالات شما" />
      <div className="flex">
        <TicketComposer
          onSubmit={handleSubmit}
          onCancel={() => navigate('/tickets')}
        />
      </div>
    </PageContainer>
  );
}
