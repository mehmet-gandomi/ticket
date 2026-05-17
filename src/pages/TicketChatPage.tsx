import { useParams, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { ChatBubble, ChatHeaderBar } from '../components/Chat';
import { Button } from '../components/Button';
import { Label } from '../components/Label';
import { Select } from '../components/FormControls';
import { sampleConversation, tickets } from '../data/mock';
import { adminTickets, adminStateMap, type AdminState } from '../data/adminMock';
import { useState } from 'react';
import { RichEditor } from '../components/RichEditor';
import { AttachmentsUploader } from '../components/AttachmentsUploader';

export function TicketChatPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get('admin') === '1';

  const ticket = tickets.find((t) => t.id === id) ?? tickets[0];
  const adminTicket = isAdmin ? adminTickets.find((t) => t.id === (id ?? ticket.id)) : null;

  const [messages, setMessages] = useState(sampleConversation);
  const [draft, setDraft] = useState('');
  const [ticketState, setTicketState] = useState<AdminState | undefined>(adminTicket?.state);

  function send() {
    if (!draft.trim()) return;
    setMessages([
      ...messages,
      {
        id: 'm' + (messages.length + 1),
        author: 'user',
        authorName: 'رضا قائمی',
        body: draft,
        date: '۱۴۰۵/۰۲/۱۸',
        time: '۲۱:۰۰',
      },
    ]);
    setDraft('');
  }

  const stateInfo = ticketState ? adminStateMap[ticketState] : null;

  return (
    <PageContainer>
      <PageHeader title={ticket.title} subtitle="گفتگو با تیم پشتیبانی" />

      {isAdmin && adminTicket && ticketState && stateInfo && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-line bg-white px-4 sm:px-5 py-3 gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-ink-500">وضعیت:</span>
            <Label color={stateInfo.color}>{stateInfo.label}</Label>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-ink-500 shrink-0">تغییر وضعیت:</span>
            <Select
              value={ticketState}
              onChange={(e) => setTicketState(e.target.value as AdminState)}
              className="!w-full sm:!w-auto sm:min-w-[160px] !h-8 !text-[12px]"
            >
              <option value="unreviewed">بررسی نشده</option>
              <option value="reviewing">درحال بررسی</option>
              <option value="pending">در انتظار پاسخ</option>
              <option value="closed">بسته شده</option>
              <option value="spam">اسپم</option>
            </Select>
          </div>
        </div>
      )}

      <section className="rounded-3xl border border-line bg-white p-4 sm:p-6 flex flex-col gap-4">
        <ChatHeaderBar
          id={ticket.id}
          date={ticket.date}
          time={ticket.time}
          ago={ticket.ago}
          status="پاسخ پشتیبان"
        />

        <div className="flex flex-col gap-3 max-h-[320px] overflow-auto thin-scroll p-1">
          {messages.map((m) => (
            <ChatBubble key={m.id} msg={m} />
          ))}
        </div>

        <div className="h-px bg-line" />

        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] font-bold text-ink-900 text-right">پیام تیکت</span>
          <RichEditor placeholder="مشکل خود را با جزئیات کامل توضیح دهید..." />
        </div>

        <AttachmentsUploader />

        <div className="h-px bg-line" />

        <div className="flex">
          <Button variant="primary" size="md" onClick={send}>
            ثبت پیام
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
