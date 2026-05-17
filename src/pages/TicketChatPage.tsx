import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { ChatBubble, ChatHeaderBar } from '../components/Chat';
import { Button } from '../components/Button';
import { sampleConversation, tickets } from '../data/mock';
import { useState } from 'react';
import { RichEditor } from '../components/RichEditor';
import { AttachmentsUploader } from '../components/AttachmentsUploader';

export function TicketChatPage() {
  const { id } = useParams();
  const ticket = tickets.find((t) => t.id === id) ?? tickets[0];
  const [messages, setMessages] = useState(sampleConversation);
  const [draft, setDraft] = useState('');

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

  return (
    <PageContainer>
      <PageHeader title={ticket.title} subtitle="گفتگو با تیم پشتیبانی" />

      <section className="rounded-3xl border border-line bg-white p-6 flex flex-col gap-4">
        <ChatHeaderBar
          id={ticket.id}
          date={ticket.date}
          time={ticket.time}
          ago={ticket.ago}
          status="پاسخ پشتیبان"
        />

        <div className="flex flex-col gap-3 max-h-[320px] overflow-auto thin-scroll p-2">
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
            ثبت تیکت
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
