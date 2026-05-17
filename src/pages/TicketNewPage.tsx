import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';

export function TicketNewPage() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <PageHeader title="ثبت تیکت جدید" subtitle="پشتیبانی هوشمند، آماده پاسخگویی به سوالات شما" />
      <div className="flex">
        <TicketComposer
          onSubmit={() => navigate('/tickets/loading')}
          onCancel={() => navigate('/tickets')}
        />
      </div>
    </PageContainer>
  );
}
