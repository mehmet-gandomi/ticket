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
    <div className="group flex items-center gap-3 sm:gap-4 rounded-2xl border border-line bg-white px-4 sm:px-5 py-3 hover:border-brand hover:shadow-[0_2px_18px_rgba(0,104,255,0.06)] transition">
      <label className="flex items-center justify-center cursor-pointer shrink-0">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="size-5 rounded-md border-2 border-line text-brand focus:ring-brand/30 cursor-pointer"
        />
      </label>

      <div className="flex-1 flex flex-col gap-1.5 min-w-0">
        {/* Title + labels row */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[13px] text-ink-900 leading-6 font-semibold min-w-0 truncate">{ticket.title}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <Label color={s.color} size="sm">{s.label}</Label>
            <Label color={p.color} size="sm" icon={<Flag size={10} />}>{p.label}</Label>
          </div>
        </div>

        {/* Meta row — all info, compact, single line */}
        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-ink-400 tabular flex-nowrap">
          <span className="font-bold text-brand text-[12px] sm:text-[14px] shrink-0">#{ticket.id}</span>
          <span className="w-px h-3 bg-line shrink-0" />
          <span className="shrink-0">{ticket.ago}</span>
          <span className="w-px h-3 bg-line shrink-0" />
          <span className="shrink-0 truncate max-w-[80px] sm:max-w-none">{ticket.user}</span>
          <span className="w-px h-3 bg-line shrink-0" />
          <span className="shrink-0">{ticket.date}</span>
          <span className="w-px h-3 bg-line shrink-0" />
          <span className="shrink-0">{ticket.time}</span>
        </div>

        {/* Preview */}
        <p className="text-[12px] sm:text-[13px] text-ink-500 leading-5 text-right truncate">{ticket.preview}</p>
      </div>

      <button
        onClick={() => nav(`/tickets/${ticket.id}?admin=1`)}
        className="grid place-items-center size-9 shrink-0 rounded-lg text-ink-500 hover:text-brand transition"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}
