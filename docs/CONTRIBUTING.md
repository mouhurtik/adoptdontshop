# Contributing to Adopt Don't Shop

Thank you for considering contributing to Adopt Don't Shop! This document provides guidelines for contributing to the project.

## 🎯 Project Vision

Adopt Don't Shop is an open-source pet adoption portal designed to connect shelters, rescues, and potential pet parents. Our goal is to make pet adoption accessible, transparent, and joyful for everyone involved.

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- A code editor (VS Code recommended)

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd adoptdontshop-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 📋 How to Contribute

### 1. Find an Issue or Create One
- Browse existing [issues](../../issues)
- Create a new issue for bugs or feature requests
- Comment on an issue you'd like to work on

### 2. Fork and Branch
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/adoptdontshop-website.git

# Create a feature branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 3. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Write tests for new features
- Update documentation as needed

### 4. Test Your Changes
```bash
# Run tests
npm test

# Run linter
npm run lint

# Test the build
npm run build
```

### 5. Commit Your Changes
We use conventional commits for clear history:
```bash
git commit -m "feat: add pet filtering by age"
git commit -m "fix: resolve navbar mobile menu issue"
git commit -m "docs: update installation instructions"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

### 6. Push and Create Pull Request
```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title describing the change
- Description of what changed and why
- Reference to related issues (e.g., "Closes #123")
- Screenshots/videos for UI changes

## 🎨 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Enable strict mode compliance
- Define proper types and interfaces
- Avoid `any` type

### React Components
- Use functional components with hooks
- Keep components focused and small
- Use descriptive prop names
- Add PropTypes or TypeScript interfaces

### File Naming
- Components: `PascalCase.tsx` (e.g., `PetCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `*.types.ts` (e.g., `pet.types.ts`)
- Tests: `*.test.tsx` (e.g., `PetCard.test.tsx`)

### Code Organization
```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
├── lib/            # Third-party integrations
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── test/           # Test setup and utilities
```

## 🧪 Testing Guidelines

### Writing Tests
- Write tests for all new features
- Test user interactions, not implementation
- Use React Testing Library
- Aim for meaningful test coverage

```typescript
describe('PetCard', () => {
  it('displays pet information correctly', () => {
    render(<PetCard name="Buddy" breed="Golden Retriever" />);
    expect(screen.getByText('Buddy')).toBeInTheDocument();
  });
});
```

## 📝 Documentation

- Update README.md for major changes
- Add JSDoc comments for complex functions
- Update API documentation if applicable
- Include examples in documentation

## 🐛 Reporting Bugs

### Before Submitting
1. Check existing issues
2. Test on latest version
3. Verify it's reproducible

### Bug Report Should Include
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, Node version)

## 💡 Suggesting Features

We welcome feature suggestions! Please:
1. Check if it's already suggested
2. Explain the problem it solves
3. Describe proposed solution
4. Consider alternative approaches

## ⚠️ Important Notes

- **Do not commit** sensitive data (API keys, passwords)
- **Do commit** `.env.example` with dummy values
- **Write clear commit messages**
- **Keep Pull Requests focused** (one feature/fix per PR)
- **Be respectful** in all interactions

## 🎓 Learning Resources

New to open source? Check out:
- [First Timers Only](https://www.firsttimersonly.com/)
- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📞 Getting Help

- Join our [Discord/Slack] (if available)
- Ask in issue comments
- Tag maintainers in complex questions

## 🙏 Thank You!

Every contribution, big or small, makes a difference. Thank you for helping make pet adoption more accessible! 🐾

---

**Questions?** Open an issue or reach out to maintainers.
