import jalaali from 'jalaali-js';

export function toShamsi(iso: string): string {
  const d = new Date(iso);
  const { jy, jm, jd } = jalaali.toJalaali(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return `${jy}/${String(jm).padStart(2, '0')}/${String(jd).padStart(2, '0')}`;
}

export function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)     return 'لحظاتی پیش';
  if (diff < 3600)   return `${Math.floor(diff / 60)} دقیقه پیش`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)} ساعت پیش`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} روز پیش`;
  return toShamsi(iso);
}
