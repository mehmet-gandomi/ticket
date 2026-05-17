import { NavLink, Link } from 'react-router-dom';
import {
  ListIcon,
  Plus,
  AlignRight,
  Monitor,
  Like,
  Close,
  Setting,
  TicketStar,
} from '../icons';
import type { ReactNode } from 'react';

const userItems = [
  { to: '/tickets', label: 'لیست تیکت‌ها', icon: <ListIcon size={18} /> },
  { to: '/tickets/new', label: 'تیکت جدید', icon: <Plus size={18} /> },
  { to: '/tickets/55fr5671', label: 'گفتگو', icon: <AlignRight size={18} /> },
  { to: '/tickets/loading', label: 'در حال تولید', icon: <Monitor size={18} /> },
  { to: '/tickets/ai-show', label: 'پاسخ هوشمند', icon: <Like size={18} /> },
  { to: '/tickets/not-found', label: 'پاسخ نیامد', icon: <Close size={18} /> },
];
const adminItems = [
  { to: '/admin/tickets', label: 'صف تیکت‌ها', icon: <ListIcon size={18} /> },
  { to: '/admin/settings', label: 'تنظیمات', icon: <Setting size={18} /> },
];

function Section({ title, items }: { title: string; items: typeof userItems }) {
  return (
    <>
      <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-ink-400">{title}</div>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end
          className={({ isActive }) =>
            `flex items-center gap-3 h-11 px-3 rounded-xl text-[13px] transition ${
              isActive ? 'bg-brand-tint text-brand font-medium' : 'text-ink-700 hover:bg-surface-50'
            }`
          }
        >
          <span className="shrink-0">{it.icon}</span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export function Sidebar() {
  return (
    <aside className="w-60 shrink-0 sticky top-0 self-start h-screen border-l border-line bg-white p-5 flex flex-col gap-1 overflow-auto">
      <Link to="/tickets" className="flex items-center gap-2 pb-5 mb-1 border-b border-line">
        <span className="text-brand"><TicketStar size={36} /></span>
        <div>
          <div className="text-[15px] font-bold leading-tight">AI Ticket</div>
          <div className="text-[11px] text-ink-500">پنل کاربر و ادمین</div>
        </div>
      </Link>
      <Section title="کاربر" items={userItems} />
      <Section title="ادمین" items={adminItems} />
    </aside>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-50 text-ink-900" dir="rtl">
      <Sidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
