import type { TicketSummary } from '../components/TicketCard';

export type AdminState = 'unreviewed' | 'reviewing' | 'pending' | 'closed' | 'spam';

export interface AdminTicket extends Omit<TicketSummary, 'status'> {
  user: string;
  state: AdminState;
}

export const adminTickets: AdminTicket[] = [
  { id: '55fr5671', title: 'مشکل SSL دارم', user: 'رضا قائمی', state: 'pending', priority: 'low',
    preview: 'مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir',
    date: '۱۴۰۵/۰۲/۱۸', time: '۲۰:۳۰', ago: '۳۰ دقیقه پیش' },
  { id: '55fr5672', title: 'صورتحساب اشتباه', user: 'مریم احمدی', state: 'reviewing', priority: 'medium',
    preview: 'هزینه ای که از من کم شده با صورتحساب همخوانی نداره.',
    date: '۱۴۰۵/۰۲/۱۷', time: '۱۸:۱۲', ago: '۱ روز پیش' },
  { id: '55fr5673', title: 'افزایش پهنای باند', user: 'علی محمدی', state: 'unreviewed', priority: 'low',
    preview: 'پهنای باند فعلی کافی نیست. آیا امکان افزایش وجود دارد؟',
    date: '۱۴۰۵/۰۲/۱۶', time: '۰۹:۴۵', ago: '۲ روز پیش' },
  { id: '55fr5674', title: 'ایمیل ها به اسپم می‌روند', user: 'سارا کریمی', state: 'unreviewed', priority: 'high',
    preview: 'تمام ایمیل های ارسالی به پوشه اسپم می‌روند، DKIM رو هم تنظیم کردم.',
    date: '۱۴۰۵/۰۲/۱۵', time: '۱۴:۲۰', ago: '۳ روز پیش' },
  { id: '55fr5675', title: 'فعال‌سازی CDN ابری', user: 'بهزاد قاسمی', state: 'closed', priority: 'low',
    preview: 'لطفاً CDN ابری روی دامنه‌ام فعال شود.',
    date: '۱۴۰۵/۰۲/۱۲', time: '۱۱:۰۰', ago: '۶ روز پیش' },
];

export const adminStateMap: Record<AdminState, { color: 'default'|'primary'|'warning'|'danger'|'violet'; label: string }> = {
  unreviewed: { color: 'danger', label: 'بررسی نشده' },
  reviewing: { color: 'primary', label: 'درحال بررسی' },
  pending: { color: 'warning', label: 'در انتظار پاسخ' },
  closed: { color: 'default', label: 'بسته شده' },
  spam: { color: 'violet', label: 'اسپم' },
};

export interface Category { id: string; title: string; description: string; count: number; }
export const initialCategories: Category[] = [
  { id: 'web', title: 'فنی', description: 'دسته بندی فنی متناسب با مشکلات فنی', count: 5 },
  { id: 'email', title: 'محصولات', description: 'دسته بندی فنی متناسب با مشکلات فنی', count: 5 },
  { id: 'domain', title: 'آموزشی', description: 'دسته بندی فنی متناسب با مشکلات فنی', count: 5 },
  { id: 'billing', title: 'خطا ها', description: 'دسته بندی فنی متناسب با مشکلات فنی', count: 5 },
];

export interface SavedAnswerAttachment { id: string; name: string; size: number; }
export interface SavedAnswer { id: number; category: string; title: string; body: string; attachments?: SavedAnswerAttachment[]; }
export const initialAnswers: SavedAnswer[] = [
  { id: 1, category: 'مشکل وب', title: 'گواهی SSL منقضی شده',
    body: 'گواهی SSL را از پنل هاست تمدید کنید. اگر از Let\'s Encrypt استفاده می‌کنید با دستور certbot renew گواهی را به‌روزرسانی نمایید.',
    attachments: [
      { id: 'att-1', name: 'ssl-renewal-guide.pdf', size: 204800 },
      { id: 'att-2', name: 'certbot-screenshot.png', size: 87400 },
    ] },
  { id: 2, category: 'مشکل وب', title: 'Mixed Content',
    body: 'تمام منابع HTTP را به HTTPS تغییر دهید. در CMS از افزونه Really Simple SSL کمک بگیرید.' },
  { id: 3, category: 'مشکل ایمیل', title: 'ایمیل به اسپم می‌رود',
    body: 'رکوردهای SPF، DKIM و DMARC را به‌درستی روی دامنه تنظیم کنید. آی‌پی سرور را در Mail Tester بررسی کنید.' },
  { id: 4, category: 'مالی', title: 'صورتحساب اشتباه',
    body: 'لطفا تصویر صورتحساب اشتباه و کد رهگیری پرداخت را پیوست کنید تا توسط واحد مالی بررسی شود.' },
];
