# Features & Roadmap

## Current Features
- **Cinematic Experience**: Manga Detail page with hero banner, responsive switcher (`MangaDetailResponsive` mounting only Desktop or Mobile view), metadata, and chapter/related tabs.
- **Bento Collections**: Homepage layout (`src/app/page.tsx`) with server-side `Promise.allSettled` prefetching, genre collection cards, and demographic tabs.
- **Manga Discovery**: Browse by categories (`/genres`, `/genres/[id]`), demographics (`/demographics/[id]`), recommendations (`/recommendation`), and random manga (`/random`).
- **Advanced Search**: Search (`/search`) and debounced filter search (`/filter-search`) by tags, demographic, year, follow count, and latest chapter.
- **Manga Reader**: Vertical-scrolling reader (`/reader/[id]`) with lightweight dimmer-based brightness control, GPU-composited scroll progress bar (`ReaderScrollProgress`), and chapter navigation.
- **Reading History**: Automatically tracks reading progress in `localStorage` (`/reading-history`).
- **Social & Sharing**: Integrated "Copy to Clipboard" sharing feature with instant UI feedback.
- **Authentication & Self-Host Gate**: `/login` and `/self-host` routes integrated with JWT middleware.

## Planned Features / Roadmap
- **Webtoon / Horizontal Reader Mode**: Currently marked as upcoming (`Webtoon (sắp có?)`) in the reader settings panel.
- **User Accounts & Library**: Profile management and bookmarks (Heart / Library buttons currently disabled).
- **Offline Reading**: Support for downloading chapters for offline access (PWA features).
- **Multi-language Support**: Interface and content in multiple languages.
