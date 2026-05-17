// Icon set in the vuesax / outline style used by the Figma source.
// Each icon takes standard SVG props so you can size/color via Tailwind's
// `size-*`, `w-*`, `h-*`, `text-*` (icons inherit currentColor).

import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size?: number) => ({
  width: size ?? 24,
  height: size ?? 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const ArrowLeft = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9 5l-7 7 7 7" />
    <path d="M2 12h20" />
  </svg>
);

export const ArrowRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M15 5l7 7-7 7" />
    <path d="M22 12H2" />
  </svg>
);

export const ChevronLeft = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M14.5 17l-5-5 5-5" />
  </svg>
);

export const ChevronRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9.5 7l5 5-5 5" />
  </svg>
);

export const ChevronDown = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M19 9l-7 6-7-6" />
  </svg>
);

export const Close = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Plus = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Ticket = ({ size, ...p }: IconProps) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 20.75H7C2.59 20.75 1.25 19.41 1.25 15V14.5C1.25 14.09 1.59 13.75 2 13.75C2.96 13.75 3.75 12.96 3.75 12C3.75 11.04 2.96 10.25 2 10.25C1.59 10.25 1.25 9.91 1.25 9.5V9C1.25 4.59 2.59 3.25 7 3.25H17C21.41 3.25 22.75 4.59 22.75 9V10C22.75 10.41 22.41 10.75 22 10.75C21.04 10.75 20.25 11.54 20.25 12.5C20.25 13.46 21.04 14.25 22 14.25C22.41 14.25 22.75 14.59 22.75 15C22.75 19.41 21.41 20.75 17 20.75ZM2.75 15.16C2.77 18.6 3.48 19.25 7 19.25H17C20.34 19.25 21.15 18.66 21.24 15.66C19.81 15.32 18.75 14.03 18.75 12.5C18.75 10.97 19.82 9.68 21.25 9.34V9C21.25 5.43 20.58 4.75 17 4.75H7C3.48 4.75 2.77 5.4 2.75 8.84C4.18 9.18 5.25 10.47 5.25 12C5.25 13.53 4.18 14.82 2.75 15.16Z" fill="#FAFAFA"/>
    <path d="M10 7.25C9.59 7.25 9.25 6.91 9.25 6.5V4C9.25 3.59 9.59 3.25 10 3.25C10.41 3.25 10.75 3.59 10.75 4V6.5C10.75 6.91 10.41 7.25 10 7.25Z" fill="#FAFAFA"/>
    <path d="M10 14.58C9.59 14.58 9.25 14.24 9.25 13.83V10.16C9.25 9.75 9.59 9.41 10 9.41C10.41 9.41 10.75 9.75 10.75 10.16V13.83C10.75 14.25 10.41 14.58 10 14.58Z" fill="#FAFAFA"/>
    <path d="M10 20.75C9.59 20.75 9.25 20.41 9.25 20V17.5C9.25 17.09 9.59 16.75 10 16.75C10.41 16.75 10.75 17.09 10.75 17.5V20C10.75 20.41 10.41 20.75 10 20.75Z" fill="#FAFAFA"/>
  </svg>
);

export const Check = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12l5 5L20 6" />
  </svg>
);

export const Monitor = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="3.5" width="19" height="13" rx="2.5" />
    <path d="M8.5 20.5h7M12 16.5v4" />
  </svg>
);

export const ListIcon = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M8 6h13M8 12h13M8 18h13" />
    <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const Search = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const Info = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8h.01M12 12v5" />
  </svg>
);

export const Flag = ({ size, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...p}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.50121 9.73468C4.49955 9.72921 4.49797 9.72369 4.49648 9.71813L3.05075 4.32259C2.83838 3.53 3.30874 2.71531 4.10133 2.50294L10.182 0.873626C11.0863 0.631328 11.889 1.50722 11.5689 2.38698L10.7865 4.53771C10.7639 4.59978 10.7825 4.66936 10.8331 4.71182L12.5861 6.18318C13.3032 6.78503 13.046 7.94494 12.1417 8.18724L5.5921 9.9422L6.82336 14.5373C6.89483 14.8041 6.73654 15.0782 6.4698 15.1497C6.20307 15.2212 5.9289 15.0629 5.85743 14.7961L4.50121 9.73468ZM10.4408 1.83955C10.5636 1.80664 10.6727 1.92561 10.6292 2.04509L9.84672 4.19582C9.68044 4.65286 9.8177 5.1651 10.1902 5.47778L11.9432 6.94913C12.0406 7.03088 12.0057 7.18841 11.8829 7.22132L5.33328 8.97627L4.10198 4.38102C4.10049 4.37546 4.09891 4.36994 4.09725 4.36447L4.01668 4.06377C3.94724 3.80465 4.10102 3.5383 4.36015 3.46886L10.4408 1.83955Z"
      fill="currentColor"
    />
  </svg>
);


export const Like = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M7 22V11M2 13v7a2 2 0 0 0 2 2h3V11H4a2 2 0 0 0-2 2zm5-2 4-8a3 3 0 0 1 3-3h.5a1.5 1.5 0 0 1 1.5 1.5V6l-1 5h5a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.6 22H7" />
  </svg>
);

export const Dislike = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M17 2v11M22 11V4a2 2 0 0 0-2-2h-3v11h3a2 2 0 0 0 2-2zm-5 2-4 8a3 3 0 0 1-3 3h-.5A1.5 1.5 0 0 1 8 22.5V18l1-5H4a2 2 0 0 1-2-2.3L3.4 3.7A2 2 0 0 1 5.4 2H17" />
  </svg>
);

export const AlignRight = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h18M9 12h12M3 18h18" />
  </svg>
);

export const AlignCenter = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h18M6 12h12M3 18h18" />
  </svg>
);

export const AlignLeft = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h18M3 12h12M3 18h18" />
  </svg>
);

export const Link = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const Bold = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p} strokeWidth={2}>
    <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" />
  </svg>
);

export const Italic = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M15 4h-6M15 20H5M14 4 10 20" />
  </svg>
);

export const Record = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
  </svg>
);

export const Setting = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.5 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
  </svg>
);

export const Trash = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

export const Edit = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export const MessageText = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-3-.5L4 21l1-4A8 8 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" />
    <path d="M8 10h8M8 14h5" />
  </svg>
);

/* === Bulk / filled accent icon used for the page header === */
export const TicketStar = ({ size, ...p }: IconProps) => (
  <svg
    width={size ?? 48}
    height={size ?? 48}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...p}
  >
    <path
      opacity="0.4"
      d="M43.9999 18.42V29.58C43.9999 37.78 41.4999 40.28 33.2999 40.28H19.8199V34.24C19.8199 33.48 19.1799 32.84 18.4199 32.84V15.16C19.1799 15.16 19.8199 14.52 19.8199 13.76V7.72H33.2999C41.4999 7.72 43.9999 10.22 43.9999 18.42Z"
      fill="currentColor"
    />
    <path
      d="M36.9399 23.8C37.2799 23.48 37.3999 22.98 37.2599 22.54C37.1199 22.08 36.7399 21.76 36.2599 21.7L33.6999 21.32C33.5999 21.3 33.5199 21.24 33.4799 21.16L32.3399 18.84C32.1399 18.42 31.6999 18.16 31.2399 18.16C30.7599 18.16 30.3399 18.42 30.1199 18.84L28.9799 21.16C28.9399 21.26 28.8399 21.32 28.7399 21.32L26.1799 21.7C25.7199 21.76 25.3199 22.1 25.1799 22.54C25.0399 23 25.1599 23.48 25.4999 23.8L27.3599 25.6C27.4399 25.66 27.4599 25.78 27.4399 25.88L26.9999 28.42C26.9199 28.88 27.0999 29.36 27.4999 29.62C27.7199 29.78 27.9599 29.86 28.2199 29.86C28.4199 29.86 28.6199 29.82 28.7999 29.72L31.0999 28.52C31.1799 28.48 31.2999 28.48 31.3799 28.52L33.6799 29.72C34.0999 29.94 34.5999 29.9 34.9799 29.62C35.3599 29.34 35.5599 28.88 35.4799 28.4L35.0399 25.86C35.0199 25.76 35.0599 25.66 35.1199 25.58L36.9399 23.8Z"
      fill="currentColor"
    />
    <path
      d="M18.42 15.16V32.84C17.66 32.84 17.02 33.48 17.02 34.24V40.28H14.7C6.79999 40.28 4.19999 37.92 4.01999 30.56C3.99999 30.18 4.15999 29.82 4.41999 29.56C4.67999 29.28 5.05999 29.14 5.41999 29.14C8.21999 29.14 10.52 26.84 10.52 24.02C10.52 21.2 8.21999 18.88 5.41999 18.88C5.01999 18.88 4.67999 18.74 4.41999 18.46C4.15999 18.2 3.99999 17.82 4.01999 17.46C4.19999 10.08 6.79999 7.72 14.7 7.72H17.02V13.76C17.02 14.54 17.66 15.16 18.42 15.16Z"
      fill="currentColor"
    />
  </svg>
);

export const TicketOutline = ({ size, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M22 11.6V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3.6a1.5 1.5 0 0 0 1.5 1.5 2.4 2.4 0 0 1 0 4.8A1.5 1.5 0 0 0 2 19.4V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-.6a1.5 1.5 0 0 0-1.5-1.5 2.4 2.4 0 0 1 0-4.8A1.5 1.5 0 0 0 22 11.6z" />
    <path d="M9 7v14" strokeDasharray="2 3" />
  </svg>
);

/* === Bot illustration (empty / "not found" state) === */
export const BotLaughing = ({ size, ...p }: IconProps) => (
  <svg width={size ?? 200} height={size ?? 200} viewBox="0 0 200 200" fill="none" {...p}>
    <rect x="36" y="56" width="128" height="104" rx="28" fill="currentColor" opacity="0.18" />
    <rect x="36" y="56" width="128" height="104" rx="28" stroke="currentColor" strokeWidth="3" />
    <circle cx="100" cy="40" r="8" fill="currentColor" />
    <path d="M100 48v8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M70 90 q6 -10 14 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M116 90 q6 -10 14 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path
      d="M74 124 q26 22 52 0"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <rect x="20" y="100" width="14" height="28" rx="6" fill="currentColor" opacity="0.6" />
    <rect x="166" y="100" width="14" height="28" rx="6" fill="currentColor" opacity="0.6" />
  </svg>
);
