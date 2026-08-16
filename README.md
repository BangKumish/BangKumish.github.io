# Astro portfolio retrofit

The repository is now an Astro static site using Tailwind CSS, Astro content collections, Lucide icons, React/Framer Motion islands, and GitHub Pages Actions deployment.

## Local development

```sh
npm install
npm run dev
npm test
```

Production output is generated in `dist/`.

## Content

- Projects: `src/content/projects/*.md`
- Experience: `src/content/experiences/*.md`
- Collection schemas: `src/content.config.ts`
- Static media: `public/images/` and `public/icons/`

Add or edit Markdown frontmatter to update cards without changing component code.

## External services

GitHub stars and forks load client-side through the unauthenticated public REST API. Public API limits apply and the cards degrade to `n/a` when unavailable.

The contact form uses `PUBLIC_FORMSPREE_ENDPOINT`. Add a GitHub Actions repository secret with that name and a value such as `https://formspree.io/f/your-id`. Without it, the form opens the visitor's email client.

Place the real resume at `public/resume.pdf` to activate the hero download without changing code.

## GitHub Pages deployment

1. In the GitHub repository, open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Add the optional `PUBLIC_FORMSPREE_ENDPOINT` Actions secret.
4. Push to `main`; `.github/workflows/deploy.yml` builds and deploys the static output.

The user-site repository publishes at `https://bangkumish.github.io/`, so `astro.config.mjs` intentionally has no `base` path.

## Retrofit sequence

The existing repository can be transitioned with these git operations:

```sh
git checkout -b feat/astro-portfolio
npm install
npm test
git add astro.config.mjs tailwind.config.mjs tsconfig.json package.json package-lock.json
git add src public .github/workflows/deploy.yml README.md
git rm index.html stye.css tailwind.config.js
git rm -r dist src/css
git commit -m "refactor: migrate portfolio to Astro"
git push -u origin feat/astro-portfolio
```

Review the generated site before merging. The implementation does not require a history rewrite.
