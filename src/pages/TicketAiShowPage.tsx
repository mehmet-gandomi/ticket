import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { TicketComposer } from '../components/TicketComposer';
import { Button } from '../components/Button';
import { Like, Dislike, Check, Close, AlignRight } from '../icons';
import { aiFullAnswer, aiSuggestions } from '../data/mock';

export function TicketAiShowPage() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  return (
    <PageContainer>
      <PageHeader title="پاسخ هوشمند" subtitle="پیشنهاد های هوش مصنوعی برای مشکل شما" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: AI answer panel */}
        <section className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-5">
          {/* Original user prompt bubble */}
          <div className="self-end max-w-[60%] flex flex-col items-end gap-1">
            <span className="text-[11px] text-ink-400">رضا قائمی</span>
            <div className="px-4 py-3 text-[13px] leading-6 bg-brand-tint rounded-[24px_0_24px_24px]">
              مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[13px] font-bold text-right">پاسخ های پیشنهادی</h3>
            <div className="flex flex-col gap-2">
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  className="text-right p-3 rounded-xl border border-line bg-white hover:border-brand hover:bg-brand-tint/40 transition text-[13px] leading-6"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Full AI answer */}
          <div className="rounded-xl border border-line bg-surface-50 p-4 max-h-[260px] overflow-auto thin-scroll">
            <p className="text-[13px] leading-7 whitespace-pre-line text-right">{aiFullAnswer}</p>
          </div>

          {/* Helpful? */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFeedback('down')}
                className={`size-9 grid place-items-center rounded-lg border transition ${
                  feedback === 'down'
                    ? 'bg-danger/10 border-danger text-danger'
                    : 'border-line text-ink-500 hover:border-danger hover:text-danger'
                }`}
              >
                <Dislike size={18} />
              </button>
              <span className="w-px h-4 bg-line" />
              <button
                onClick={() => setFeedback('up')}
                className={`size-9 grid place-items-center rounded-lg border transition ${
                  feedback === 'up'
                    ? 'bg-success/10 border-success text-success'
                    : 'border-line text-ink-500 hover:border-success hover:text-success'
                }`}
              >
                <Like size={18} />
              </button>
            </div>
            <span className="text-[11px] text-ink-500">این پیشنهاد کمک کرد ؟</span>
          </div>

          <div className="h-px bg-line" />

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 h-9 px-3 rounded-lg bg-brand-tint text-brand text-[13px]">
              <AlignRight size={16} />
              در حال نوشتن پاسخ
            </span>
            <div className="flex items-center gap-3">
              <Button variant="danger" size="md" leadingIcon={<Close size={16} />} onClick={() => navigate('/tickets/not-found')}>
                مشکل حل نشد
              </Button>
              <Button variant="success" size="md" leadingIcon={<Check size={16} />} onClick={() => navigate('/tickets')}>
                مشکل حل شد
              </Button>
            </div>
          </div>
        </section>

        {/* Right: ticket recap composer */}
        <div className="flex justify-end">
          <TicketComposer
            defaultMessage="مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir"
            files={[{ name: 'اسم فایل.jpg', size: '200KB' }]}
            showCancel={false}
            submitLabel="ارسال تیکت"
          />
        </div>
      </div>
    </PageContainer>
  );
}
