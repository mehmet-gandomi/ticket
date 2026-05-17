import { useParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { ChatBubble, ChatHeaderBar } from '../components/Chat';
import { Button } from '../components/Button';
import { Field, TextArea } from '../components/FormControls';
import { Check, Plus } from '../icons';
import { sampleConversation, tickets } from '../data/mock';
import { useState } from 'react';

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

        <Field label="پیام تیکت">
          <TextArea
            placeholder="پاسخ خود را بنویسید..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-brand">SVG, PNG, JPG or GIF</span>
            <span className="text-ink-500">پسوند های مجاز</span>
          </div>
          <Button variant="gray" size="sm" leadingIcon={<Plus size={14} />}>
            افزودن فایل
          </Button>
        </div>

        <div className="h-px bg-line" />

        <div className="flex justify-end">
          <Button variant="primary" size="md" leadingIcon={<Check size={16} />} onClick={send}>
            ثبت تیکت
          </Button>
        </div>
      </section>
    </PageContainer>
  );
}
