# Naming Conventions

To ensure consistency and maintainability, the project follows a strict naming convention for all files and directories.

## Core Standard: Kebab-Case
All files and directories should follow the **kebab-case** convention unless specified otherwise (e.g., React Components).

### 1. API Services & Data Fetchers
Files that "get" or fetch data must use the `get-something` pattern in kebab-case.
- **Current**: `getChapter.tsx`, `getMangaById.tsx`, `searchManga.tsx`
- **Standard**: `get-chapter.tsx`, `get-manga-by-id.tsx`, `search-manga.tsx`

### 2. Directories
All directories should be in kebab-case.
- **Current**: `src/codebase/api/Manga`, `src/app/manga-detail`
- **Standard**: `src/codebase/api/manga`, `src/app/manga-detail`

### 3. Utility & Logic Files
Helper functions and logic-only files should be in kebab-case.
- **Current**: `format.ts`, `localStorage.ts`
- **Standard**: `format.ts`, `local-storage.ts`

### 4. React Components
Component filenames in `src/components/` and `src/app/*/components/` follow **kebab-case** (e.g., `manga-items.tsx`, `manga-chapter-list.tsx`, `reader-scroll-progress.tsx`, `loading.tsx`), while exported symbol names use **PascalCase** (`MangaItems`, `MangaChaptersList`, `Loading`).

### 5. Styles
Global styles and CSS files follow **kebab-case** (`globals.css`).

## Migration Status
The `src/codebase/api/` directories and files have been migrated to lowercase directories and kebab-case filenames (`author/`, `cover/`, `manga/`, `tag/`, `get-chapter.tsx`, `get-manga-by-id.tsx`, `search-manga.tsx`, `local-storage.ts`).
