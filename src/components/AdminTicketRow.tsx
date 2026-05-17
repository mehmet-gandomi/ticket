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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-[13px] text-ink-900 leading-6 font-semibold">{ticket.title}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-ink-400 tabular">
              <span className="font-bold text-brand text-[14px]">#{ticket.id}</span>
              <Label color="default" size="sm">{ticket.ago}</Label>
              <span className="hidden sm:inline">{ticket.user}</span>
              <span className="w-px h-3 bg-line hidden sm:block" />
              <span className="hidden sm:inline">{ticket.date}</span>
              <span className="w-px h-3 bg-line hidden sm:block" />
              <span className="hidden sm:inline">{ticket.time}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:shrink-0">
            <Label color={s.color}>{s.label}</Label>
            <span className="w-px h-4 bg-line hidden sm:block" />
            <Label color={p.color} icon={<Flag size={12} />}>{p.label}</Label>
          </div>
        </div>
        <p className="text-[13px] text-ink-700 leading-6 text-right truncate">{ticket.preview}</p>
      </div>
      <button
        onClick={() => nav(`/tickets/${ticket.id}`)}
        className="grid place-items-center size-9 shrink-0 rounded-lg text-ink-500 hover:text-brand transition"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}
