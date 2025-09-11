# GitHub Next TSX Template

A ready-to-use **Next.js 15 + TypeScript** template with **Tailwind**, **Theming**, **i18n via middleware**, **SWR**, and **Recharts**.
Includes a full **GitHub setup**: CI workflow, issue templates, PR template, Dependabot, and sensible configs.

## Quickstart
```bash
npx degit your-org/github-next-tsx-template my-app
cd my-app
npm i
npm run dev
# open http://localhost:3000 (auto-redirects to /fr or /en)
```

## Features
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- Theme switcher (light/dark/system) via `next-themes`
- i18n with locale detection in `middleware.ts`
- Example chart with Recharts, example SWR API usage
- GitHub CI: install → lint → type-check → build
- Dependabot, issue/PR templates, CODEOWNERS scaffold
- Prettier + ESLint configs
- Node version pinned via `.nvmrc`

## Envs
See `.env.example` and duplicate to `.env.local` as needed.

## Mark as Template
On GitHub, enable **"Use this template"** in repo settings.
