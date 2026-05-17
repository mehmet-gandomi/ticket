import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Flag } from '../icons';
import { Label } from './Label';
import { adminStateMap, type AdminTicket } from '../data/adminMock';

const priorityMap = {
  low: { color: 'primary' as const, label: 'الویت کم' },
  medium: { color: 'warning' as const, label: 'الویت متوسط' },
  high: { color: 'danger' as const, label: 'الویت بالا' },
};

export function AdminTicketRow({ ticket, selected, onToggle }: {
  ticket: AdminTicket;
  selected: boolean;
  onToggle: () => void;
}) {
  const s = adminStateMap[ticket.state];
  const p = priorityMap[ticket.priority];
  const nav = useNavigate();

  return (
    <div className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-line bg-white px-4 sm:px-5 py-4 sm:py-5 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.06)] transition">
      <label className="hidden sm:flex items-center justify-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="size-5 rounded-md border-2 border-line text-brand focus:ring-brand/30 cursor-pointer"
        />
      </label>

      <div className="flex-1 flex flex-col gap-2 min-w-0">
        {/* Title + labels */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <p className="text-[14px] text-ink-900 leading-6 font-semibold truncate">{ticket.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Label color={s.color} size="sm">{s.label}</Label>
            <Label color={p.color} size="sm" icon={<Flag size={10} />}>{p.label}</Label>
          </div>
        </div>

        {/* Meta row — wraps naturally */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-ink-400 tabular">
          <span className="font-bold text-brand text-[13px]">#{ticket.id}</span>
          <span className="w-px h-3 bg-line" />
          <span>{ticket.ago}</span>
          <span className="w-px h-3 bg-line" />
          <span>{ticket.user}</span>
          <span className="w-px h-3 bg-line" />
          <span>{ticket.date}</span>
          <span className="w-px h-3 bg-line" />
          <span>{ticket.time}</span>
        </div>

        {/* Preview */}
        <p className="text-[12px] text-ink-500 leading-5 text-right truncate">{ticket.preview}</p>
      </div>

      <button
        onClick={() => nav(`/tickets/${ticket.id}?admin=1`)}
        className="grid place-items-center size-7 shrink-0 text-ink-400 hover:text-brand transition"
      >
        <ChevronLeft size={16} />
      </button>
    </div>
  );
}
