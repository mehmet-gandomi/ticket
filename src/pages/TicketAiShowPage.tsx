import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer }  from '../components/PageContainer';
import { PageHeader }     from '../components/PageHeader';
import { Button }         from '../components/Button';
import { Like, Dislike, Check, Close } from '../icons';
import { ticketsApi, type Ticket, type Message } from '../api/tickets';
import { toShamsi }       from '../utils/date';
import { getConfig }      from '../config';

export function TicketAiShowPage() {
  const { id }         = useParams<{ id: string }>();
  const navigate       = useNavigate();
  const { user }       = getConfig();
  const [feedback, setFeedback]   = useState<'up' | 'down' | null>(null);
  const [ticket, setTicket]       = useState<Ticket | null>(null);
  const [firstMsg, setFirstMsg]   = useState<Message | null>(null);
  const [loading, setLoading]     = useState(true);
  const [resolving, setResolving]   = useState(false);
  const [routing, setRouting]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  async function handleResolve() {
    if (!id || resolving) return;
    setResolving(true);
    try {
      await ticketsApi.aiResolve(id);
      navigate('/tickets');
    } catch {
      setResolving(false);
    }
  }

  async function handleRouteToSupport() {
    if (!id || routing) return;
    setRouting(true);
    try {
      await ticketsApi.routeToSupport(id);
      navigate(`/tickets/${id}`);
    } catch {
      navigate(`/tickets/${id}`);
    }
  }

  useEffect(() => {
    if (!id) return;
    let active = true;
    ticketsApi.detail(id)
      .then((res) => {
        if (!active) return;
        setTicket(res.ticket);
        setFirstMsg(res.messages[0] ?? null);
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-20 text-ink-500 text-[13px]">در حال بارگذاری...</div>
      </PageContainer>
    );
  }

  if (error || !ticket) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-danger">
          {error ?? 'تیکت یافت نشد.'}
        </div>
      </PageContainer>
    );
  }

  const initials = (user.name ?? '?').charAt(0);

  return (
    <PageContainer>
      <PageHeader title="پاسخ هوشمند" subtitle="پیشنهاد هوش مصنوعی برای مشکل شما" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* Left: AI answer panel */}
        <section className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-5 order-first lg:order-last">

          {/* User's original message */}
          {firstMsg && (
            <div className="max-w-[80%] flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[12px] text-ink-500">
                <span className="size-5 rounded-full bg-brand text-white grid place-items-center text-[9px] font-bold shrink-0">
                  {initials}
                </span>
                <span>{user.name}</span>
              </div>
              <div className="px-4 py-3 text-[13px] leading-6 bg-brand-tint rounded-[24px_0_24px_24px] text-right"
                dangerouslySetInnerHTML={{ __html: firstMsg.body }} />
              <div className="flex items-center gap-2 text-[11px] text-ink-400 px-3">
                <span className="tabular">{toShamsi(ticket.createdAt)}</span>
                <span className="tabular">{ticket.createdAt.slice(11, 16)}</span>
              </div>
            </div>
          )}

          {/* AI answer */}
          <h3 className="text-[13px] font-bold text-right">پاسخ هوشمند</h3>
          <div className="rounded-xl border border-line bg-surface-50 p-4 max-h-[279px] overflow-auto thin-scroll">
            <p className="text-[13px] leading-7 whitespace-pre-line text-right">
              {ticket.aiSuggestion}
            </p>
          </div>

          {/* Helpful? */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-ink-500">این پیشنهاد کمک کرد؟</span>
            <div className="flex items-center gap-3">
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
              <span className="w-px h-4 bg-line" />
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
            </div>
          </div>

          <div className="h-px bg-line" />

          <div className="flex items-center gap-3">
            <Button
              variant="success"
              size="md"
              leadingIcon={<Check size={16} />}
              onClick={handleResolve}
              disabled={resolving}
            >
              {resolving ? 'در حال بستن...' : 'مشکل حل شد'}
            </Button>
            <Button
              variant="danger"
              size="md"
              leadingIcon={<Close size={16} />}
              onClick={handleRouteToSupport}
              disabled={routing}
            >
              {routing ? 'در حال ارجاع...' : 'مشکل حل نشد، ادامه با پشتیبان'}
            </Button>
          </div>
        </section>

        {/* Right: ticket info */}
        <div className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-3">
          <h3 className="text-[14px] font-bold text-right">{ticket.title}</h3>
          {ticket.categoryTitle && (
            <span className="text-[12px] text-ink-500 text-right">{ticket.categoryTitle}</span>
          )}
          <div className="h-px bg-line" />
          <div className="text-[13px] text-ink-700 leading-7 text-right"
            dangerouslySetInnerHTML={{ __html: firstMsg?.body ?? '' }} />
        </div>
      </div>
    </PageContainer>
  );
}
