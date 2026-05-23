/** Apply a hex brand color by updating CSS custom properties on :root.
 *  Tailwind classes like bg-brand / text-brand / border-brand read these vars.
 *  Derived shades are computed algorithmically from the base hex. */
export function applyBrandColor(hex: string): void {
  const m = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return;

  const r = parseInt(m[1], 16);
  const g = parseInt(m[2], 16);
  const b = parseInt(m[3], 16);

  // Blend base color onto white at the given fraction.
  const onWhite = (ch: number, frac: number) =>
    Math.round(255 * (1 - frac) + ch * frac);

  const root = document.documentElement;
  root.style.setProperty('--brand',      `${r} ${g} ${b}`);
  // dark  ≈ 91 % of each channel (matches #005FE8 for #0068FF)
  root.style.setProperty('--brand-dark', `${Math.round(r*0.91)} ${Math.round(g*0.91)} ${Math.round(b*0.91)}`);
  // tint  = 10 % brand on white
  root.style.setProperty('--brand-tint', `${onWhite(r,.10)} ${onWhite(g,.10)} ${onWhite(b,.10)}`);
  // soft  = 31 % brand on white
  root.style.setProperty('--brand-soft', `${onWhite(r,.31)} ${onWhite(g,.31)} ${onWhite(b,.31)}`);
}
