# Bundled application fonts

Quicksand and Nunito Latin variable WOFF2 files are the same files emitted by
the successful November 8, 2026 `next/font/google` build. The root layout loads
them with `next/font/local`, retaining the existing CSS variables and configured
weight ranges. No font stylesheet/file is downloaded during future builds.

This avoids the extensionless Google Fonts URL parsing failure observed in
Next.js 16.1.6 on GitHub CI and the automatic Cloudflare build. The failing log
identified `fonts.gstatic.com/l/font?kit=...` and the font import-map error.

Sources and licenses:

- https://github.com/google/fonts/tree/main/ofl/quicksand
- https://github.com/google/fonts/tree/main/ofl/nunito
- See `Quicksand-OFL.txt` and `Nunito-OFL.txt` alongside the files.
- Framework issue: https://github.com/vercel/next.js/issues/99114

Original emitted assets:

- Quicksand: `4a7551bcc3548e67-s.p.717db902.woff2`
- Nunito: `07454f8ad8aaac57-s.p.fc65572f.woff2`
