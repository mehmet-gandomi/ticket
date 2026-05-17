import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';
import { BotLaughing } from '../icons';

export function TicketNotFoundPage() {
  const navigate = useNavigate();
  return (
    <PageContainer>
      <PageHeader title="پاسخ هوشمند یافت نشد" subtitle="منتظر پاسخ تیم پشتیبانی باشید" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex justify-end">
          <TicketComposer
            defaultMessage="مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir"
            files={[{ name: 'اسم فایل.jpg', size: '200KB' }]}
            showCancel={false}
            submitLabel="ثبت تیکت"
            onSubmit={() => navigate('/tickets')}
          />
        </div>
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-success/60">
            <BotLaughing size={220} />
          </div>
          <div className="space-y-2">
            <h2 className="text-[19px] font-bold">متاسفانه پاسخ هوشمند ایجاد نشد</h2>
            <p className="text-[13px] text-ink-500 leading-7 max-w-xs">
              منتظر پاسخ ادمین های ما باشید. در سریع ترین زمان پاسخگو شما هستند.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
