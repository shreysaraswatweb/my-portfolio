# Shrey Saraswat — Portfolio

Personal developer portfolio for **Shrey Saraswat**, a frontend-focused software developer (React & Angular) based in Gurugram, India. Glassmorphic UI with an amber/violet accent system, plus light, dark, and system themes: identity + contact tiles on mobile, and a three-column dashboard on desktop.

Professional copy is sourced from [`PORTFOLIO_INTELLIGENCE.md`](PORTFOLIO_INTELLIGENCE.md) — do not invent employers, metrics, skills, or contact details.

**Live site:** [https://portfolioweb-shrey-saraswat-portfolio.vercel.app/](https://portfolioweb-shrey-saraswat-portfolio.vercel.app/)

## Features

- Responsive layouts from `design-system.json`
  - **Mobile:** profile card, bento contact tiles, then Photos / Music / Videos
  - **Desktop:** sticky sidebar, scrolling main column, skills and quick links rail
- Hero, skills, experience, featured projects, supporting projects, and a music widget
- Motion with Framer Motion (avatar float, tab underline, staggered cards)
- Light, dark, and system color themes (preference is saved)

## Tech stack

| Layer   | Tools            |
| ------- | ---------------- |
| UI      | React 19, Vite 8 |
| Styling | Tailwind CSS 4   |
| Motion  | Framer Motion    |
| Icons   | lucide-react     |
| Deploy  | Vercel           |

## Run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/`.

```bash
npm run build    # production build
npm run preview  # preview the build
npm run lint     # ESLint
```

## Customize

Most copy, links, skills, projects, and experience live in [`src/data/profile.jsx`](src/data/profile.jsx).

Replace the avatar later by swapping [`src/assets/avatar.png`](src/assets/avatar.png). Visual tokens stay in [`design-system.json`](design-system.json) and [`tailwind.config.js`](tailwind.config.js).

## License

Private project — all rights reserved.
