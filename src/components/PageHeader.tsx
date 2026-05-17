import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ListIcon, Ticket, TicketStar } from '../icons';

export function PageHeader({
  title = 'تیکت پشتیبانی',
  subtitle = 'پشتیبانی ۲۴ ساعته آماده پاسخگویی',
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const { pathname } = useLocation();
  const isList = pathname === '/' || pathname === '/tickets';

  const defaultAction = isList ? (
    <Link
      to="/tickets/new"
      className="inline-flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition shrink-0"
    >
      <Ticket size={20} />
      <span className="hidden xs:inline">ثبت تیکت جدید</span>
      <span className="xs:hidden">تیکت جدید</span>
    </Link>
  ) : (
    <Link
      to="/tickets"
      className="inline-flex items-center gap-2 h-10 sm:h-12 px-4 sm:px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition shrink-0"
    >
      <ListIcon size={18} />
      <span>لیست تیکت ها</span>
    </Link>
  );

  return (
    <header className="pb-5 border-b border-line">
      {/* Mobile: compact single-row bar */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-brand shrink-0"><TicketStar size={28} /></span>
          <h1 className="text-[16px] font-bold text-ink-900 truncate">{title}</h1>
        </div>
        <div className="shrink-0">{action ?? defaultAction}</div>
      </div>

      {/* Desktop: full layout with subtitle */}
      <div className="hidden sm:flex items-start justify-between gap-6">
        <div className="flex items-start gap-3 text-right">
          <div className="text-brand">
            <TicketStar size={48} />
          </div>
          <div>
            <h1 className="text-[23px] font-bold text-ink-900 leading-[48px]">{title}</h1>
            <p className="text-[13px] text-ink-500 leading-6">{subtitle}</p>
          </div>
        </div>
        <div className="shrink-0">{action ?? defaultAction}</div>
      </div>
    </header>
  );
}
