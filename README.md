# POS & Kiosk Dashboard

A Next.js POS (Point of Sale) and Kiosk dashboard inspired by [Petpooja](https://www.petpooja.com/), with **dark/light mode**, **Zustand** state management, and an industry-level structure.

## Features

- **Dashboard** – Today’s sales, order count, active orders, average order value, hourly sales bar, and active orders list
- **POS** – Menu by category, cart with quantity/discount, dine-in / takeaway / delivery, table number, place order
- **Kiosk** – Touch-friendly self-order flow: menu → cart → confirm
- **Menu** – View menu by category (ready for CRUD)
- **Settings** – Theme: Light / Dark / System
- **State** – Zustand stores: `useThemeStore`, `useCartStore`, `useOrdersStore`, `useUIStore`
- **Theme** – CSS variables for light/dark; theme persisted in `localStorage`

## Tech Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (dark mode via `class`)
- **Zustand** (state + persist for theme)
- **TypeScript**
- **Lucide React** (icons)

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard layout group
│   │   ├── layout.tsx        # Sidebar + Header wrapper
│   │   ├── page.tsx         # Dashboard home
│   │   ├── pos/page.tsx     # POS
│   │   ├── kiosk/page.tsx   # Kiosk
│   │   ├── menu/page.tsx    # Menu
│   │   └── settings/page.tsx
│   ├── layout.tsx           # Root layout + ThemeProvider
│   └── globals.css          # Tailwind + CSS variables (light/dark)
├── components/
│   ├── layout/              # Sidebar, Header, DashboardLayout
│   ├── providers/           # ThemeProvider
│   └── ui/                  # Button, Card
├── stores/                  # Zustand: theme, cart, orders, UI
├── lib/                     # utils, mockData
└── types/                   # Shared TypeScript types
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use the header icon to toggle **light/dark** mode.

## Design Reference

UI layout and flows are inspired by the [Petpooja Clone Figma](https://www.figma.com/design/eaQUCCUrqIfyqVJvb62sJ2/Petpooja-Clone?node-id=270-340&p=f) and common POS patterns: dashboard metrics, order types, cart, and kiosk-style touch targets.
