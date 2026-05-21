import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ListIcon,
  Plus,
  Close,
  Setting,
  TicketStar,
  Menu,
} from '../icons';
import { getConfig } from '../config';
import type { ReactNode } from 'react';

const USER_NAV = [
  { to: '/tickets',     label: 'لیست تیکت‌ها', icon: <ListIcon size={18} /> },
  { to: '/tickets/new', label: 'تیکت جدید',    icon: <Plus    size={18} /> },
];

const ADMIN_NAV = [
  { to: '/tickets',  label: 'صف تیکت‌ها', icon: <ListIcon size={18} /> },
  { to: '/settings', label: 'تنظیمات',    icon: <Setting  size={18} /> },
];

function NavItems({ items, onClose }: { items: typeof USER_NAV; onClose?: () => void }) {
  return (
    <>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end
          onClick={onClose}
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

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { mode } = getConfig();
  const nav       = mode === 'admin' ? ADMIN_NAV : USER_NAV;
  const homeRoute = '/tickets';

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-ink-900/40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 right-0 z-50 h-screen w-60 shrink-0 border-l border-line bg-white p-5
          flex flex-col gap-1 overflow-auto transition-transform duration-300
          lg:sticky lg:top-0 lg:z-auto lg:translate-x-0 lg:self-start
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between pb-5 mb-1 border-b border-line lg:hidden">
          <button
            onClick={onClose}
            className="size-9 grid place-items-center rounded-lg text-ink-500 hover:bg-surface-50"
          >
            <Close size={18} />
          </button>
          <Link to={homeRoute} onClick={onClose} className="flex items-center gap-2">
            <span className="text-brand"><TicketStar size={28} /></span>
            <span className="text-[14px] font-bold">AI Ticket</span>
          </Link>
        </div>

        <Link to={homeRoute} onClick={onClose} className="hidden lg:flex items-center gap-2 pb-5 mb-1 border-b border-line">
          <span className="text-brand"><TicketStar size={36} /></span>
          <div>
            <div className="text-[15px] font-bold leading-tight">AI Ticket</div>
            <div className="text-[11px] text-ink-500">
              {mode === 'admin' ? 'پنل مدیریت' : 'پنل کاربر'}
            </div>
          </div>
        </Link>

        <NavItems items={nav} onClose={onClose} />
      </aside>
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode } = getConfig();
  const homeRoute = '/tickets';

  return (
    <div className="min-h-screen flex bg-surface-50 text-ink-900" dir="rtl">
      <div className="lg:hidden fixed top-0 right-0 left-0 z-30 h-14 bg-white border-b border-line flex items-center justify-between px-4 shrink-0">
        <button
          onClick={() => setSidebarOpen(true)}
          className="size-9 grid place-items-center rounded-lg text-ink-700 hover:bg-surface-50"
        >
          <Menu size={20} />
        </button>
        <Link to={homeRoute} className="flex items-center gap-2">
          <span className="text-brand"><TicketStar size={28} /></span>
          <span className="text-[14px] font-bold">{mode === 'admin' ? 'AI Ticket Admin' : 'AI Ticket'}</span>
        </Link>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">{children}</main>
    </div>
  );
}
