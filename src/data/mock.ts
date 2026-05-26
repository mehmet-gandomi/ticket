import type { TicketSummary } from '../components/TicketCard';

export const tickets: TicketSummary[] = [
  {
    id: '55fr5671',
    title: 'مشکل SSL دارم',
    status: 'pending',
    priority: 'low',
    preview: 'مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir',
    date: '۱۴۰۵/۰۲/۱۸',
    time: '۲۰:۳۰',
    ago: '۳۰ دقیقه پیش',
  },
  {
    id: '55fr5672',
    title: 'صورتحساب اشتباه ثبت شده',
    status: 'answered',
    priority: 'medium',
    preview: 'هزینه ای که از من کم شده با صورتحساب همخوانی نداره، لطفا بررسی کنید.',
    date: '۱۴۰۵/۰۲/۱۷',
    time: '۱۸:۱۲',
    ago: '۱ روز پیش',
  },
  {
    id: '55fr5673',
    title: 'درخواست افزایش پهنای باند',
    status: 'answered',
    priority: 'low',
    preview: 'پهنای باند فعلی کافی نیست. آیا امکان افزایش وجود دارد؟',
    date: '۱۴۰۵/۰۲/۱۶',
    time: '۰۹:۴۵',
    ago: '۲ روز پیش',
  },
  {
    id: '55fr5674',
    title: 'ایمیل ها به اسپم می‌روند',
    status: 'pending',
    priority: 'high',
    preview: 'تمام ایمیل های ارسالی به پوشه اسپم می‌روند، DKIM رو هم تنظیم کردم.',
    date: '۱۴۰۵/۰۲/۱۵',
    time: '۱۴:۲۰',
    ago: '۳ روز پیش',
  },
  {
    id: '55fr5675',
    title: 'فعال‌سازی CDN ابری',
    status: 'closed',
    priority: 'low',
    preview: 'لطفاً CDN ابری روی دامنه‌ام فعال شود.',
    date: '۱۴۰۵/۰۲/۱۲',
    time: '۱۱:۰۰',
    ago: '۶ روز پیش',
  },
];

export interface ChatMessage {
  id: string;
  author: 'user' | 'support' | 'system';
  authorName: string;
  body: string;
  date: string;
  time: string;
  attachments?: { id: string; url: string; filename: string; size: number }[];
}

export const sampleConversation: ChatMessage[] = [
  {
    id: 'm1',
    author: 'user',
    authorName: 'رضا قائمی',
    body: 'مشکل ssl چکار باید بکنم ادرس وبسایتم : https://ieffect.ir',
    date: '۱۴۰۵/۰۲/۱۲',
    time: '۲۰:۰۰',
  },
  {
    id: 'm2',
    author: 'support',
    authorName: 'پشتیبان',
    body:
      'سلام. بستگی داره مشکل دقیقاً چیه. رایج‌ترین حالت‌ها: ۱) گواهی منقضی شده، ۲) Mixed Content، ۳) Redirect ناقص. بگو از چه هاستی استفاده می‌کنی؟',
    date: '۱۴۰۵/۰۲/۱۲',
    time: '۲۰:۳۰',
  },
];

export const ticketSubjects = [
  'مشکل وب',
  'مشکل ایمیل',
  'مشکل دامنه',
  'مالی',
  'سایر',
];

export const aiFullAnswer = `بستگی داره مشکل دقیقاً چیه. رایج‌ترین حالت‌ها:

۱. گواهی SSL منقضی شده
گواهی رو تمدید کن (از Let's Encrypt یا هاستینگت).
اگه از Let's Encrypt استفاده می‌کنی:
  sudo certbot renew

۲. گواهی نصب نشده یا اشتباه نصب شده
از سایت SSL Labs آدرس سایتت رو چک کن، خطا رو دقیق می‌بینی.

۳. Mixed Content
سایت HTTPS هست ولی بعضی منابع با HTTP لود می‌شن. در کد یا CMS همه لینک‌ها رو به HTTPS تغییر بده.

۴. Redirect درست نیست
مطمئن شو HTTP به HTTPS ریدایرکت می‌شه:
  # Nginx
  return 301 https://$host$request_uri;

بگو از چه سرور یا هاستینگی استفاده می‌کنی؟`;
