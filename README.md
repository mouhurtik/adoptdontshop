# 🐾 Adopt Don't Shop - Pet Adoption Portal

A modern, open-source pet adoption platform connecting shelters, rescues, and potential pet parents. Built with enterprise-grade technologies and designed for scalability and community contributions.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-18%20passing-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Code Quality](https://img.shields.io/badge/code%20quality-A+-brightgreen)]()

---

## ✨ Features

### For Pet Adopters
- 🔍 **Advanced Search & Filtering** - Find pets by type, breed, age, location, and more
- 📱 **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- 🖼️ **Pet Profiles** - Detailed information including photos, medical history, and personality traits
- 💬 **Direct Contact** - Connect directly with shelters and caregivers
- ❤️ **Favorites** - Save and track pets you're interested in

### For Shelters & Caregivers
- 📝 **Easy Pet Listing** - Simple form to list pets for adoption
- 📊 **Dashboard** - Manage your listings and track adoption inquiries
- 🔒 **Secure** - Environment-based configuration with proper authentication

### Technical Features
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🎨 **Modern UI** - Clean, playful design with smooth animations using Framer Motion
- 🔐 **Secure Backend** - Powered by Supabase with Row-Level Security (RLS)
- ✅ **Type-Safe** - Full TypeScript with strict mode enabled
- 🧪 **Well-Tested** - Comprehensive test suite with 18+ tests
- 🚀 **CI/CD Ready** - Automated testing and deployment workflows
- ♿ **Accessible** - Built with accessibility best practices

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### Development & Testing
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint 9
- **Formatting**: Prettier
- **Type Checking**: TypeScript 5 (strict mode)
- **CI/CD**: GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 16.x or higher ([Download](https://nodejs.org/))
- **npm** 7.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Supabase Account** (free tier available at [supabase.com](https://supabase.com))

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/adoptdontshop-website.git
cd adoptdontshop-website
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
# Copy the example environment file
cp .env.example .env
```

4. **Configure your environment** (see [Environment Setup](#-environment-setup) below)

5. **Start the development server**

```bash
npm run dev
```

6. **Open your browser**

Navigate to `http://localhost:5173` to see the application running!

---

## 🔐 Environment Setup

### Required Environment Variables

This project requires Supabase credentials to function. Follow these steps:

#### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be created (~2 minutes)

#### 2. Get Your Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

#### 3. Update Your .env File

Open the `.env` file and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Security Notes

⚠️ **IMPORTANT**:
- The `.env` file is in `.gitignore` and will **NOT** be committed to git
- Never commit real credentials to version control
- The `VITE_SUPABASE_ANON_KEY` is a public key (safe to use client-side)
- Your data is protected by Row-Level Security (RLS) policies in Supabase

---

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check

# Type check
npm run type-check
```

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** for testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

- **Test Files**: 5
- **Total Tests**: 18
- **Coverage**: 35%+

---

## 🏗️ Building for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview the Build

```bash
npm run preview
```

### Deployment

The application can be deployed to various platforms:

#### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

#### Vercel

```bash
npm install -g vercel
vercel
```

#### Other Platforms

The built files in `dist/` can be deployed to any static hosting service like GitHub Pages, AWS S3, Google Cloud Storage, or Azure Static Web Apps.

---

## 📁 Project Structure

```
adoptdontshop-website/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
│
├── public/                     # Static assets
│   ├── favicon.ico
│   └── images/
│
├── src/
│   ├── components/             # React components
│   │   ├── __tests__/         # Component tests
│   │   ├── browse/            # Browse page components
│   │   ├── home/              # Home page sections
│   │   ├── pet-details/       # Pet detail components
│   │   ├── pet-listing/       # Pet listing form
│   │   ├── ui/                # shadcn/ui primitives
│   │   ├── ErrorBoundary.tsx  # Error handling
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   ├── pages/                 # Route pages
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── constants/             # App constants
│   ├── utils/                 # Utility functions
│   ├── integrations/          # Third-party integrations
│   ├── lib/                   # Library utilities
│   ├── test/                  # Test configuration
│   ├── App.tsx                # Main App component
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles
│
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier configuration
├── CHANGELOG.md               # Version history
├── CODE_OF_CONDUCT.md         # Community guidelines
├── CONTRIBUTING.md            # Contribution guide
├── LICENSE                    # MIT License
├── README.md                  # This file
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
└── vitest.config.ts           # Test configuration
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Write or update tests**
5. **Ensure all tests pass** (`npm test`)
6. **Format your code** (`npm run format`)
7. **Commit your changes** (`git commit -m 'feat: add amazing feature'`)
8. **Push to your branch** (`git push origin feature/amazing-feature`)
9. **Open a Pull Request**

### Contribution Guidelines

Please read our [Contributing Guide](CONTRIBUTING.md) for detailed information on:
- Code style and standards
- Commit message conventions
- Pull request process
- Testing requirements

Also review our [Code of Conduct](CODE_OF_CONDUCT.md) to understand our community standards.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies

- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Supabase](https://supabase.com/) - Backend platform
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide](https://lucide.dev/) - Icons

---

## 📞 Support

- 📖 **Documentation**: Check our [Contributing Guide](CONTRIBUTING.md)
- 🐛 **Bug Reports**: [Open an issue](../../issues)
- 💡 **Feature Requests**: [Open an issue](../../issues)
- 💬 **Discussions**: [Join the conversation](../../discussions)

---

## 🌟 Show Your Support

If this project helped you or you believe in its mission, please consider:

- ⭐ **Starring the repository**
- 🐛 **Reporting bugs**
- 💡 **Suggesting features**
- 🤝 **Contributing code**
- 📢 **Sharing with others**

Every contribution, no matter how small, makes a difference!

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

<div align="center">

**Made with ❤️ for pets looking for their forever homes** 🐾

[Report Bug](../../issues) · [Request Feature](../../issues) · [Documentation](CONTRIBUTING.md)

</div>
