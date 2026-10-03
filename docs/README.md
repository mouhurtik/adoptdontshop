# AdoptDontShop — Documentation

Welcome to the project documentation. This folder is organized by topic for easy navigation.

## 📁 Structure

```
docs/
├── README.md                           # This file
├── AUDIT_Aug2026.md                    # Full codebase audit + phased improvement plan (Aug 2026)
├── SECURITY_AUDIT.md                   # Security posture (recent fixes + open items)
├── architecture/
│   └── ARCHITECTURE_OVERVIEW.md        # Tech stack, structure, data flow
├── archive/                            # Previous reviews preserved for history
│   ├── CODE_QUALITY_REVIEW_Feb2026.md
│   └── FEATURE_ROADMAP_v2.md
└── ...                                 # SEO guides, deployment fixes, contributing docs
```

## 📖 Quick Links

| Document | Description |
|----------|-------------|
| [Full Audit (Aug 2026)](AUDIT_Aug2026.md) | 60+ findings across 9 categories + phased roadmap; §0 lists fixes already applied |
| [Security Audit](SECURITY_AUDIT.md) | Security posture (recent fixes + open items) |
| [Architecture Overview](architecture/ARCHITECTURE_OVERVIEW.md) | Tech stack, project structure, DB schema, provider hierarchy |
| [Archived — Code Quality Review (Feb 2026)](archive/CODE_QUALITY_REVIEW_Feb2026.md) | Scored review across 7 categories — superseded by Aug 2026 audit |
| [Archived — Feature Roadmap v2](archive/FEATURE_ROADMAP_v2.md) | Earlier roadmap — superseded by ROADMAP.md |

## 🤝 Contributing

When adding new documentation:
- **Architecture decisions** → `docs/architecture/`
- **Feature specs & plans** → `docs/features/`
- Keep documents focused and under 300 lines
- Update this README when adding new files
