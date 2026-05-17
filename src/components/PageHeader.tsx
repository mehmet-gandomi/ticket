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
      className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition"
    >
      <Ticket size={24} />
      <span>ثبت تیکت جدید</span>
    </Link>
  ) : (
    <Link
      to="/tickets"
      className="inline-flex items-center gap-2 h-12 px-5 rounded-xl bg-brand text-white text-[13px] font-medium hover:bg-brand-dark transition"
    >
      <ListIcon size={18} />
      <span>لیست تیکت ها</span>
    </Link>
  );

  return (
    <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 pb-5 border-b border-line">
      <div className="flex items-start gap-3 text-right">
        <div className="text-brand hidden sm:block">
          <TicketStar size={48} />
        </div>
        <div className="text-brand sm:hidden">
          <TicketStar size={36} />
        </div>
        <div>
          <h1 className="text-[19px] sm:text-[23px] font-bold text-ink-900 leading-9 sm:leading-[48px]">{title}</h1>
          <p className="text-[13px] text-ink-500 leading-6">{subtitle}</p>
        </div>
      </div>

      <div className="sm:shrink-0">{action ?? defaultAction}</div>
    </header>
  );
}
