import type { ChatMessage } from '../data/mock';

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.author === 'user';
  return (
    <div className={`flex flex-col gap-1 max-w-[60%] ${isUser ? 'self-start items-start' : 'self-end items-end'}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-ink-400">
        {isUser ? (
          <>
            <span className="size-4 rounded-full bg-brand text-white grid place-items-center text-[8px] font-bold">
              {msg.authorName.charAt(0)}
            </span>
            <span>{msg.authorName}</span>
          </>
        ) : (
          <>
            <span className="size-4 rounded-full bg-success text-white grid place-items-center text-[8px] font-bold">
              پ
            </span>
            <span>{msg.authorName}</span>
          </>
        )}
      </div>
      <div
        className={`px-4 py-3 text-[13px] leading-6 text-ink-900 ${
          isUser
            ? 'bg-brand-tint rounded-[24px_0_24px_24px]'
            : 'bg-success-tint rounded-[0_24px_24px_24px]'
        }`}
      >
        {msg.body}
      </div>
      <div className={`flex items-center gap-2 text-[11px] text-ink-400 px-3 ${isUser ? 'self-end' : 'self-start flex-row-reverse'}`}>
        <span className="tabular">{msg.date}</span>
        <span className="tabular">{msg.time}</span>
      </div>
    </div>
  );
}

export function ChatHeaderBar({
  id,
  date,
  time,
  ago,
  status,
}: {
  id: string;
  date: string;
  time: string;
  ago: string;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-50 px-3 h-12">
      <span className="text-[13px] font-bold text-brand tabular">#{id}</span>
      <div className="flex items-center gap-3 text-[11px] text-ink-400 tabular">
        <span className="inline-flex items-center px-2 h-6 rounded-md bg-success-tint text-success text-[11px]">
          {status}
        </span>
        <span className="w-px h-3 bg-line" />
        <span className="text-ink-500">{ago}</span>
        <span className="w-px h-3 bg-line" />
        <span>{time}</span>
        <span className="w-px h-3 bg-line" />
        <span>{date}</span>
      </div>
    </div>
  );
}
