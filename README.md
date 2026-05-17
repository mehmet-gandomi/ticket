# AI Ticket — React + Vite + Tailwind

A faithful reimplementation of the **Plugin – Ticket AI** Figma in modern
React. RTL Persian UI, Tailwind‑styled, fully typed.

## Stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3 (custom palette mirroring the Figma tokens)
- React Router 6

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Project structure

```
src/
  components/     # Button, Label, FormControls, PageHeader, TicketCard, ChatBubble, …
  pages/          # one file per top-level user screen
  icons/          # vuesax-style icon set (currentColor, sized via props)
  data/mock.ts    # mock tickets + sample chat + AI answer
  App.tsx         # routes
  main.tsx        # entry point
  index.css       # Tailwind + Ravi @font-face declaration
```

## Pages

| Route                  | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `/tickets`             | Ticket list with status tabs & pagination       |
| `/tickets/new`         | New ticket composer                             |
| `/tickets/:id`         | Threaded chat with the support team             |
| `/tickets/loading`     | AI-answer loading skeleton                      |
| `/tickets/ai-show`     | AI suggested answers + feedback                 |
| `/tickets/not-found`   | Empty-state when AI couldn't help               |

## Notes

- The Figma uses a custom **Ravi** Persian face that isn't published on
  Google Fonts. `index.css` declares it with a local() fallback to Tahoma
  / system-ui. Drop a `Ravi.woff2` into `public/fonts/` and extend the
  `@font-face` rule with a `url()` source when you have the licence.
- Colors and spacing values come directly from the Figma — see
  `tailwind.config.js`.
- Icons are inline SVG (vuesax outline style) and inherit `currentColor`,
  so you can recolor them with Tailwind text utilities.
