# Sheena Ponsica — Portfolio

A responsive, single-page portfolio built with semantic HTML, CSS, and vanilla JavaScript. No build step or runtime dependencies are required.

The site fills the viewport without an outer gutter. It opens in dark mode, with a persistent header toggle for switching to a light theme; the selection is remembered in the browser.

Readable interface text uses a 14px minimum size across desktop and mobile layouts.

## Run locally

From the project directory, serve the files with any static web server:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Site structure

- `index.html` — hero, about and career timeline, services, skills, projects, contact form, and footer
- `style.css` — dark identity/hero, light portfolio sections, responsive layouts, technology carousel, and motion styles
- `script.js` — navigation, scroll progress, reveals, counters, technology carousel, service cards, project expansion, pointer effects, and contact form submission
- `api/contact.js` — Vercel serverless endpoint that validates contact requests and sends them via Resend
- `assets/images/Sheena-ID.webp` — existing portrait used in the hero
- `assets/attachments/Sheena_Ponsica-RESUME.pdf` — downloadable resume

The project section groups existing work under NativeCamp, Virtual Staffing Solutions, and Personal created projects. Expand each group to see its related project pages. Existing screenshots and video assets are used; no project or image placeholders are currently needed.

The contact form posts to `/api/contact`, which sends submissions to `sheenaponsica1125@gmail.com` through Resend. Configure these environment variables in the Vercel project before deploying:

- `RESEND_API_KEY` — secret API key from Resend
- `CONTACT_FROM_EMAIL` — sender address verified with Resend
- `CONTACT_TO_EMAIL` — optional recipient override; defaults to `sheenaponsica1125@gmail.com`

For local development, use `vercel dev` after linking the project to Vercel and configuring the variables locally; the Python static server does not run serverless functions. The API key must only be stored in environment variables, never in browser code.

## Updating content

- Keep the resume at `/assets/attachments/Sheena_Ponsica-RESUME.pdf`, or update its link in `index.html`.
- Replace the hero portrait at `assets/images/Sheena-ID.webp` to use a different photo.
- Project titles, descriptions, images, and links are in the three project groups in `index.html`.
- Service and technology names, hover descriptions, and carousel content are maintained directly in `index.html`.

The page respects `prefers-reduced-motion`, includes a skip link and visible focus states, and disables pointer effects on touch devices.
