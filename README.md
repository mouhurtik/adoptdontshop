# 🐾 Adopt Don't Shop - Pet Adoption Community

A modern, open-source pet adoption platform and community hub connecting shelters, rescues, and potential pet parents. Built with Next.js for SEO-first rendering and deployed on Cloudflare Pages.

🌐 **Live Site:** [adoptdontshop.xyz](https://adoptdontshop.xyz)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()
[![License](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)]()
[![Cloudflare Pages](https://img.shields.io/badge/deploy-Cloudflare%20Pages-F38020)]()
[![Live Demo](https://img.shields.io/badge/demo-adoptdontshop.xyz-FF7F50)](https://adoptdontshop.xyz)

---

## ✨ Features

### For Pet Adopters
- 🔍 **Advanced Search & Filtering** — Find pets by type, breed, age, location, and more
- 📱 **Responsive Design** — Seamless experience across desktop, tablet, and mobile
- 🖼️ **Pet Profiles** — Detailed information including photos, medical history, and personality
- 💬 **Direct Contact** — Connect directly with shelters and caregivers

### For Shelters & Caregivers
- 📝 **Easy Pet Listing** — Simple form to list pets for adoption
- 🔒 **Secure** — Supabase Auth with Row-Level Security

### Community & Engagement
- 💬 **Community Forums** — Discuss tips, share success stories, and ask for advice
- 🛍️ **Pet Essentials Store** — Browse recommended products and essential starter kits
- 📬 **Direct Messaging** — Connect directly with shelters, caregivers, and fellow adopters
- 🛡️ **Admin Safety Monitoring** — Platform communications are monitored to ensure a safe environment

### Technical Highlights
- 🚀 **SSR + SEO** — Server-rendered pages with dynamic Open Graph meta tags per pet
- ⚡ **Fast Performance** — Next.js App Router with static generation and ISR
- 🎨 **Modern UI** — Playful design with Framer Motion animations and shadcn/ui
- 🔐 **Secure Backend** — Supabase with Row-Level Security (RLS)
- ✅ **Type-Safe** — Full TypeScript with strict mode

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 (strict) |
| **Styling** | Tailwind CSS 3 |
| **UI Components** | shadcn/ui (Radix UI) |
| **State** | TanStack Query (React Query) |
| **Animations** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deployment** | Cloudflare Pages via @opennextjs/cloudflare |
| **Linting** | ESLint 9 + Prettier |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22 ([Download](https://nodejs.org/)) — CI runs Node 22
- **pnpm** 9+ (`npm i -g pnpm`)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/mouhurtik/adoptdontshop.git
cd adoptdontshop

# Install dependencies (pnpm only — an npm install creates a different tree)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔐 Environment Setup

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Security**: The anon key is a publishable key — safe to use client-side. Your data is protected by Row-Level Security (RLS) policies in Supabase.

---

## 💻 Development

### Available Scripts

```bash
pnpm dev             # Start dev server (localhost:3000)
pnpm build           # Production build
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm type-check      # TypeScript check
pnpm test            # Run Vitest

# Cloudflare Pages
pnpm cf:build        # Build for Cloudflare Workers
pnpm cf:dev          # Local Cloudflare dev
pnpm cf:deploy       # Build + deploy to Cloudflare
```

---

## 📁 Project Structure

```
adoptdontshop/
├── app/                    # Next.js App Router — route + metadata per segment
│   ├── layout.tsx          # Root layout (Providers + LayoutShell + JSON-LD)
│   ├── providers.tsx       # QueryClient + Auth + Sonner
│   ├── page.tsx            # Home feed (SSR via server-queries)
│   ├── browse/  pet/[slug]/  about/  welcome/  explore/  community/[slug]/ ...
│   ├── communities/  adopt-pets-in/[city]/  user/[id]/  messages/  profile/ ...
│   ├── admin/              # 7 admin sub-routes (separate layout)
│   ├── sitemap.ts  robots.ts  feed.xml/  not-found.tsx
├── views/                  # Page-level 'use client' views (1:1 with app routes)
├── components/
│   ├── ui/                 # shadcn primitives (button, dialog, tabs, sonner…)
│   ├── home/  browse/  community/  groups/  messaging/  pet-details/  pet-listing/
│   ├── AppSidebar.tsx  TopBar.tsx  BottomNav.tsx  LayoutShell.tsx
├── hooks/  contexts/  lib/supabase/  types/  utils/  supabase/migrations/  docs/
├── mobile/  email-templates/  scripts/  public/  next.config.mjs  wrangler.toml
```

---

## 🏗️ Deployment

### Cloudflare Pages

The app is deployed to Cloudflare Pages via `@opennextjs/cloudflare`:

1. Connect your GitHub repo to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npx opennextjs-cloudflare build`
   - **Build output**: `.open-next/assets`
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NODE_VERSION` = `22`
4. Add compatibility flag: `nodejs_compat`

---

## 🤝 Contributing

We welcome contributions! See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure TypeScript check passes (`npm run type-check`)
5. Commit (`git commit -m 'feat: add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

AGPL-3.0 — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ for pets looking for their forever homes** 🐾

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
