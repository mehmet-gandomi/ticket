import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';
import { AiLoadingPanel } from '../components/AiLoadingPanel';

export function TicketLoadingPage() {
  return (
    <PageContainer>
      <PageHeader title="در حال تولید پاسخ" subtitle="پاسخ هوشمند ما در حال آماده شدن است" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex justify-end">
          <TicketComposer showSubmit={false} showCancel={false} />
        </div>
        <AiLoadingPanel />
      </div>
    </PageContainer>
  );
}
