import type { ChatMessage } from '../data/mock';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
}

export function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.author === 'user';
  return (
    <div className={`flex flex-col gap-1 w-[88%] sm:max-w-[65%] sm:w-auto ${isUser ? 'self-start items-start' : 'self-end items-end'}`}>
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
        className={`w-full px-4 py-3 text-[13px] leading-6 text-ink-900 ${
          isUser
            ? 'bg-brand-tint rounded-[24px_0_24px_24px]'
            : 'bg-success-tint rounded-[0_24px_24px_24px]'
        }`}
        dangerouslySetInnerHTML={{ __html: msg.body }}
      />
      {msg.attachments && msg.attachments.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {msg.attachments.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 h-8 pl-2 pr-3 rounded-lg border border-line bg-white text-[11px] hover:border-brand transition"
            >
              <span className="px-1.5 py-0.5 rounded-md bg-brand-tint text-brand text-[9px] font-bold shrink-0">
                {getExt(a.filename)}
              </span>
              <span className="truncate text-ink-700 max-w-[120px]">{a.filename}</span>
              <span className="text-ink-400 tabular shrink-0">{formatSize(a.size)}</span>
            </a>
          ))}
        </div>
      )}
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
    <div className="rounded-xl bg-surface-50 px-3 py-2.5 sm:py-0 sm:h-12 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0">
      <div className="flex items-center justify-between sm:contents gap-2">
        <span className="text-[13px] font-bold text-brand tabular">#{id}</span>
        <span className="inline-flex items-center px-2 h-6 rounded-md bg-success-tint text-success text-[11px] sm:hidden">
          {status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-[11px] text-ink-400 tabular">
        <span className="hidden sm:inline-flex items-center px-2 h-6 rounded-md bg-success-tint text-success">
          {status}
        </span>
        <span className="hidden sm:block w-px h-3 bg-line" />
        <span className="text-ink-500">{ago}</span>
        <span className="w-px h-3 bg-line" />
        <span>{time}</span>
        <span className="w-px h-3 bg-line" />
        <span>{date}</span>
      </div>
    </div>
  );
}
