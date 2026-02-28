# 🐾 Adopt Don't Shop - Pet Adoption Community

A modern, open-source pet adoption platform and community hub connecting shelters, rescues, and potential pet parents. Built with Next.js for SEO-first rendering and deployed on Cloudflare Pages.

🌐 **Live Site:** [adoptdontshop.xyz](https://adoptdontshop.xyz)

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
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

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** ([supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/mouhurtik/adoptdontshop.git
cd adoptdontshop-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
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
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Cloudflare Pages
npm run cf:build     # Build for Cloudflare Workers
npm run cf:dev       # Local Cloudflare dev
npm run cf:deploy    # Build + deploy to Cloudflare
```

---

## 📁 Project Structure

```
adoptdontshop-website/
├── app/                    # Next.js App Router (route pages)
│   ├── layout.tsx          # Root layout (Navbar + Footer + Providers)
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── providers.tsx       # Client providers (QueryClient, Auth, etc.)
│   ├── not-found.tsx       # Custom 404 page
│   ├── browse/page.tsx
│   ├── pet/[slug]/page.tsx # Dynamic pet page (SSR + generateMetadata)
│   ├── about/page.tsx
│   ├── pet-essentials/page.tsx
│   ├── success-stories/page.tsx
│   ├── sponsors/page.tsx
│   ├── list-pet/page.tsx
│   ├── terms/page.tsx
│   └── privacy-policy/page.tsx
├── views/                  # Page-level view components
├── components/             # Reusable UI components
│   ├── ui/                 # shadcn/ui primitives
│   ├── home/               # Home page sections
│   ├── browse/             # Browse components
│   ├── pet-details/        # Pet detail sections
│   ├── pet-listing/        # Listing form sections
│   ├── Navbar.tsx
│   └── Footer.tsx
├── hooks/                  # Custom React hooks
├── contexts/               # React Context providers
├── lib/                    # Utilities
│   ├── supabase/client.ts  # Browser Supabase client
│   ├── supabase/server.ts  # Server Supabase client (SSR)
│   └── imageLoader.ts      # Cloudflare image loader
├── types/                  # TypeScript type definitions
├── constants/              # App constants
├── utils/                  # Utility functions
├── public/                 # Static assets
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── wrangler.toml           # Cloudflare Workers config
└── open-next.config.ts     # OpenNext adapter config
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
   - `NODE_VERSION` = `20`
4. Add compatibility flag: `nodejs_compat`

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Ensure TypeScript check passes (`npm run type-check`)
5. Commit (`git commit -m 'feat: add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

---

## 📄 License

Apache License 2.0 — see [LICENSE](LICENSE) for details.

---

<div align="center">

**Made with ❤️ for pets looking for their forever homes** 🐾

[Report Bug](../../issues) · [Request Feature](../../issues)

</div>
