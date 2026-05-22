import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Flag, Trash } from '../icons';
import { Label } from './Label';
import { adminStateMap, type AdminState } from '../api/admin';

interface AdminTicket {
  id: string;
  title: string;
  user: string;
  state: AdminState;
  priority: 'low' | 'medium' | 'high';
  preview: string;
  date: string;
  time: string;
  ago: string;
}

const priorityMap = {
  low: { color: 'primary' as const, label: 'اولویت کم' },
  medium: { color: 'warning' as const, label: 'اولویت متوسط' },
  high: { color: 'danger' as const, label: 'اولویت بالا' },
};

export function AdminTicketRow({ ticket, selected, onToggle, onDelete }: {
  ticket: AdminTicket;
  selected: boolean;
  onToggle: () => void;
  onDelete?: () => void;
}) {
  const s = adminStateMap[ticket.state];
  const p = priorityMap[ticket.priority];
  const nav = useNavigate();

  return (
    <div className="group flex items-center gap-4 sm:gap-6 rounded-2xl border border-line bg-white px-4 sm:px-6 py-3 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.06)] transition">
      <label className="hidden sm:flex items-center justify-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="size-5 rounded-md border-2 border-line text-brand focus:ring-brand/30 cursor-pointer"
        />
      </label>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          {/* Title + meta */}
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[13px] text-ink-900 leading-6 font-semibold">{ticket.title}</p>
            <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-[11px] text-ink-400 tabular flex-nowrap overflow-hidden">
              <span className="font-bold text-brand text-[12px] sm:text-[14px] shrink-0">#{ticket.id}</span>
              {ticket.ago && (
                <>
                  <span className="w-px h-3 bg-line shrink-0" />
                  <span className="shrink-0">{ticket.ago}</span>
                </>
              )}
              <span className="w-px h-3 bg-line shrink-0" />
              <span className="shrink-0">{ticket.user}</span>
              <span className="w-px h-3 bg-line shrink-0" />
              <span className="shrink-0">{ticket.time}</span>
              <span className="w-px h-3 bg-line shrink-0" />
              <span className="shrink-0">{ticket.date}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
            <Label color={p.color} size="md" icon={<Flag size={16} />}>{p.label}</Label>
            <span className="w-px h-4 bg-line hidden sm:block" aria-hidden />
            <Label color={s.color} size="md">{s.label}</Label>
          </div>
        </div>

        {ticket.preview && (
          <p className="text-[13px] text-ink-500 leading-6 text-right truncate">
            {ticket.preview}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="grid place-items-center size-8 text-ink-400 hover:text-danger transition rounded-lg hover:bg-red-50"
          >
            <Trash size={15} />
          </button>
        )}
        <button
          onClick={() => nav(`/tickets/${ticket.id}`)}
          className="grid place-items-center size-9 shrink-0 rounded-lg text-ink-500 group-hover:text-brand transition"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
    </div>
  );
}
