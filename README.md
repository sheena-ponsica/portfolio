# Sheena Ponsica — Portfolio Website

A modern, responsive personal portfolio built from Sheena Ponsica's resume. Static HTML/CSS/JS — no build step, no framework required.

## 1. Site Structure

```
portfolio/
├── index.html          → all page markup (semantic, single page)
├── style.css            → design tokens + all styling
├── script.js             → theme toggle, nav, scroll reveal, form, back-to-top
├── assets/
│   ├── profile-000.png            → profile photo (extracted from resume)
│   └── Sheena_Ponsica_Resume.pdf  → downloadable resume (linked to "Download Resume")
└── README.md
```

Sections, in order: Sticky Nav → Hero → About → Skills → Experience (timeline) →
Featured Work → Education → Certifications → Achievements → Contact → Footer.

## 2. Wireframe (text description)

- **Header**: logo mark + name, left. Center nav links. Right: dark-mode toggle,
  mobile hamburger. A thin "ruler" strip with tick marks runs under the header —
  the page's signature motif, echoing Sheena's Figma-to-code precision.
- **Hero**: two columns on desktop (text left, photo right; stacks on mobile).
  Coordinate readout (`X: 24 Y: 88 ZOOM: 100%`) and a light dot-grid background
  reinforce the "design tool" theme. Two CTAs: Download Resume / Contact Me.
- **About**: left column = 3 stat rows; right column = narrative copy + skill
  pills.
- **Skills**: 6 cards in a 3-column grid (2 on tablet, 1 on mobile), each with a
  labeled chip group. No fabricated percentage bars — chips only.
- **Experience**: vertical timeline with a connecting rail; each role is a card
  with a role/company header, a date pill, a bulleted list of responsibilities
  (rewritten from the resume), and tag chips.
- **Featured Work**: since the resume lists no named "projects," this section
  surfaces eight live pages from the NativeCamp platform as cards — each with a
  screenshot, a short intro, and a "Visit site" link to the real URL. Drop your
  screenshots into `assets/images/works/` using the filenames below and they'll
  appear automatically; until then, each card shows a clearly labeled
  placeholder telling you which file to add.
- **Education**: two cards, one per school, with year, degree/track, and any
  listed honors.
- **Certifications**: an explicit *empty state* card — the resume lists none,
  so nothing is invented; the card explains this plainly.
- **Achievements**: 3 cards for the three named honors/awards.
- **Contact**: left = email/phone/LinkedIn (GitHub shown as "not listed" since
  it wasn't in the resume); right = a front-end contact form.
- **Footer**: name, copyright, social icons. A floating back-to-top button
  appears after scrolling.

## 3. Design System

| Token | Value | Use |
|---|---|---|
| `--paper` | `#F5F6F3` (dark: `#14171A`) | page background |
| `--ink` | `#14181C` (dark: `#F2F1EC`) | primary text |
| `--accent` | `#2F6F5E` (dark: `#57B79B`) | links, highlights, ruler ticks |
| `--gold` | `#B8925A` | achievement/award accents only |
| Display type | Space Grotesk | headings |
| Body type | Inter | paragraph text |
| Mono type | JetBrains Mono | labels, tags, coordinates, dates |

**Signature element**: a Figma/design-tool "ruler & grid" motif (tick-mark
header strip, dot-grid hero background, coordinate readout, corner-bracket
hover states on cards) — a deliberate nod to Sheena's specialty of converting
Figma files into pixel-accurate interfaces.

## 4. Setup Instructions

No build tools needed.

1. Unzip/copy the `portfolio/` folder anywhere.
2. Open `index.html` directly in a browser, **or** serve it locally:
   ```bash
   cd portfolio
   python3 -m http.server 8000
   # visit http://localhost:8000
   ```
3. To deploy: upload the folder as-is to any static host (Netlify, Vercel,
   GitHub Pages, Cloudflare Pages, etc.) — `index.html` is the entry point.

### Customizing

- **Work screenshots**: add these 8 files to `assets/images/works/` (any
  standard image dimensions work — 16:10 crops look best):

  | File | Page |
  |---|---|
  | `corporate_landing_page.png` | nativecamp.net/corporate |
  | `study_abroad_sections.png` | nativecamp.net/study_abroad |
  | `dumaguete_page.png` | nativecamp.net/study_abroad/countries/philippines-dumaguete |
  | `kids_landing_page.png` | nativecamp.net/kids |
  | `registration_page.png` | nativecamp.net/register |
  | `sitemap_page.png` | nativecamp.net/study_abroad/sitemap |
  | `textbook.png` | nativecamp.net/textbook/page-detail/2/26145 |
  | `usage_pages.png` | nativecamp.net/usage |

- **Photo**: replace `assets/profile-000.png` with a higher-resolution or more
  informal headshot if desired — the resume photo is a formal/graduation-style
  portrait, extracted as-is from the PDF.
- **Resume file**: replace `assets/Sheena_Ponsica_Resume.pdf` to update the
  "Download Resume" button target.
- **GitHub / portfolio links**: not present in the source resume. Search
  `index.html` for `Not listed yet` (Contact section) to add a real link once
  available.
- **Contact form**: `script.js`'s submit handler currently only shows a
  confirmation message — it is not wired to a backend. Connect it to a service
  like Formspree, Netlify Forms, or your own endpoint to actually receive
  messages (see the note printed under the form).
- **Colors/fonts**: all defined as CSS custom properties at the top of
  `style.css` under `:root` and `[data-theme="dark"]`.

## 5. Accessibility & Performance Notes

- Semantic landmarks (`header`, `main`, `nav`, `footer`), skip-to-content link,
  visible focus states, and `prefers-reduced-motion` support are all built in.
- Color pairs were chosen for WCAG AA contrast in both light and dark themes.
- The hero photo uses `loading="eager"` (above the fold); no other images are
  used, keeping the page lightweight. Fonts are loaded via `<link rel="preconnect">`
  + Google Fonts `display=swap` to avoid blocking render.
- No external JS frameworks — vanilla JS keeps the payload minimal.

## 6. Content Accuracy

All copy is derived directly from the uploaded resume and reworded for clarity
and tone. Nothing has been invented: certifications and standalone projects
were not present in the resume, so those sections state that plainly instead
of fabricating entries; the "Languages" (spoken) skill category was omitted
for the same reason.
