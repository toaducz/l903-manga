# Directory Structure

The project follows a modular structure, separating the presentation layer from the core logic.

## Root Directory
- `src/`: Main source code.
- `public/`: Static assets.
- `planning/`: Project documentation and planning files (this directory).
- `config files`: `.prettierrc.js`, `eslint.config.mjs`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`.

## Source Directory (`src/`)
- `app/`: Next.js App Router routes and layouts.
- `codebase/`: Core application logic (independent of UI).
- `components/`: Reusable UI components.
- `assets/`: Image, gif, and icon assets.
- `styles/`: Global styles (`globals.css`).
- `middleware.tsx`: Next.js middleware for JWT verification and `/self-host` redirects.

## Codebase Directory (`src/codebase/`)
This directory contains the "brain" of the application:
- `api/`: API service definitions (`author/`, `cover/`, `manga/`, `tag/`) and `queryOptions` fetchers.
- `constants/`: Global constants (`enums.ts`, `static.ts`).
- `store/`: Legacy Recoil atom (`state.ts`).
- `utils/`: Helper functions and utility logic (`request.ts`, `manga.ts`, `local-storage.ts`, `reader-context.ts`, `format.ts`, `translate.ts`, `copy-to-clipboard.ts`).

## App Router Structure (`src/app/`)
- `page.tsx`: Main homepage with server prefetching.
- `homepage/`: Landing/notice page.
- `login/`: User login page.
- `manga-detail/[id]/` & `manga-detail/components/`: Responsive manga detail view (`manga-detail-responsive.tsx`, `manga-detail-mobile.tsx`).
- `manga-page/[id]/`, `genres/`, `demographics/[id]/`, `recommendation/`, `random/`: Discovery routes.
- `reader/[id]/`: Core vertical manga reading interface.
- `reading-history/`: User's reading progress tracking.
- `search/` & `filter-search/`: Search and multi-filter discovery routes.
- `author-detail/`: Author information view.
- `self-host/`: Self-hosting landing page.
- `api/`: Server-side API routes (`image/`, `proxy/`, `translate/`).

## Naming Convention Note
Directories, logic files, and components follow **kebab-case** (e.g., `get-manga-by-id.tsx`, `manga-items.tsx`, `loading.tsx`). See [naming_conventions.md](file:///d:/Personal%20Project/L903-Manga/planning/naming_conventions.md) for details.
