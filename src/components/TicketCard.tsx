import { Link } from 'react-router-dom';
import { ChevronLeft, Flag } from '../icons';
import { Label } from './Label';

export interface TicketSummary {
  id: string;
  title: string;
  status: 'pending' | 'answered' | 'closed';
  priority: 'low' | 'medium' | 'high';
  preview: string;
  date: string; // Persian date string
  time: string;
  ago: string; // relative time
}

const statusMap = {
  pending: { color: 'warning' as const, label: 'در انتظار پاسخ' },
  answered: { color: 'success' as const, label: 'پاسخ داده شد' },
  closed: { color: 'default' as const, label: 'بسته شده' },
};

const priorityMap = {
  low: { color: 'primary' as const, label: 'الویت کم' },
  medium: { color: 'warning' as const, label: 'الویت متوسط' },
  high: { color: 'danger' as const, label: 'الویت بالا' },
};

export function TicketCard({ ticket }: { ticket: TicketSummary }) {
  const status = statusMap[ticket.status];
  const priority = priorityMap[ticket.priority];

  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="group flex items-center gap-6 rounded-2xl border border-line bg-white px-6 py-3 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.08)] transition"
    >
      {/* Middle/right: the ticket meta */}
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] text-ink-900 leading-6 font-semibold">{ticket.title}</p>
            <div className="flex items-center gap-3 text-[11px] text-ink-400 tabular">
              <span className="font-bold text-brand text-[14px]">#{ticket.id}</span>
              <Label color="default" size="sm">
                {ticket.ago}
              </Label>
              <span>{ticket.time}</span>
              <span className="w-px h-3 bg-line" />
              <span>{ticket.date}</span>
            </div>
          </div>
          {/* labels on the left, title + meta on the right */}
          <div className="flex items-center gap-3">
            <Label color={status.color} size="md">
              {status.label}
            </Label>
            <span className="w-px h-4 bg-line" aria-hidden />
            <Label color={priority.color} size="md" icon={<Flag size={16} />}>
              {priority.label}
            </Label>
          </div>
        </div>

        <p className="text-[13px] text-ink-700 leading-6 text-right truncate">
          {ticket.preview}
        </p>
      </div>

      {/* Left side: arrow into ticket */}
      <span className="grid place-items-center size-9 rounded-lg text-ink-500 group-hover:text-brand transition">
        <ChevronLeft size={20} />
      </span>
    </Link>
  );
}
