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
      className="group flex items-center gap-4 sm:gap-6 rounded-2xl border border-line bg-white px-4 sm:px-6 py-3 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.08)] transition"
    >
      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[13px] text-ink-900 leading-6 font-semibold">{ticket.title}</p>
            <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-ink-400 tabular flex-wrap">
              <span className="font-bold text-brand text-[12px] sm:text-[14px] shrink-0">#{ticket.id}</span>
              <span className="w-px h-3 bg-line shrink-0" />
              <span className="shrink-0">ثبت: {ticket.date} {ticket.time}</span>
              {ticket.ago && (
                <>
                  <span className="w-px h-3 bg-line shrink-0" />
                  <span className="shrink-0 text-ink-600">آخرین فعالیت: {ticket.ago}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
            <Label color={status.color} size="md">{status.label}</Label>
            <span className="w-px h-4 bg-line hidden sm:block" aria-hidden />
            <Label color={priority.color} size="md" icon={<Flag size={16} />}>{priority.label}</Label>
          </div>
        </div>

        {ticket.preview && (
          <p className="text-[13px] text-ink-500 leading-6 text-right truncate">
            {ticket.preview}
          </p>
        )}
      </div>

      <span className="grid place-items-center size-9 shrink-0 rounded-lg text-ink-500 group-hover:text-brand transition">
        <ChevronLeft size={20} />
      </span>
    </Link>
  );
}
