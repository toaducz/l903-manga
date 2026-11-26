# Core Logic & State Management

The application's core logic is decoupled from the UI, resides in `src/codebase/`, and is managed through several layers.

## Data Fetching (API Layer)
Located in `src/codebase/api/`, this layer handles all external communication.
- **Service Pattern**: API calls are grouped by domain (`author`, `cover`, `manga`, `tag`).
- **Fetchers**: Uses `src/codebase/utils/request.ts`, which calls `https://api.mangadex.org/` directly on the server (with `next: { revalidate: 3600 }`) and routes client-side requests through `/api/proxy` (`src/app/api/proxy/route.ts`).
- **Image Proxy**: Cover and chapter cover assets go through `/api/image` (`src/app/api/image/route.ts`), which validates allowed MangaDex domains (`uploads.mangadex.org`, `mangadex.network`), adds `Referer`, and streams responses with long-lived `Cache-Control` headers.
- **Hooks & Caching**: React Query `queryOptions` factories (`src/codebase/api/**`) paired with `src/app/provider.tsx` (`refetchOnWindowFocus: false`, `retry: 1`).

## Client Persistence & Legacy Store
- **localStorage Handlers**:
  - `reading_history` via `src/codebase/utils/local-storage.ts` (capped at 20 latest entries).
  - `readerContext` via `src/codebase/utils/reader-context.ts` for chapter navigation state.
  - `authorDetail` to pass author payloads between Manga Detail and Author Detail pages.
- **Legacy Store (`src/codebase/store/state.ts`)**: Contains an unused `offsetState` Recoil atom retained for compatibility.

## Utility Logic
Located in `src/codebase/utils/`:
- **Formatting**: Date formatting, key formatting (`formatKey`), and text chunking (`splitTextIntoChunks`).
- **Manga Specific**: `getMangaInfo` (`src/codebase/utils/manga.ts`) for resolving localized titles, descriptions, and MangaDex `.256.jpg` cover URLs.
- **Translate**: Dynamic translation service via `/api/translate` (`src/app/api/translate/route.ts`).
- **Clipboard**: `copy-to-clipboard` utility for sharing functionality.

## Middleware
Implemented in `src/middleware.tsx`:
- **Bypass Flag**: When `DISABLE_MIDDLEWARE === 'true'`, all requests pass through immediately.
- **Auth Verification**: Verifies `accessToken` cookie with `RS256` public key (`JWT_PUBLIC`) via `jose`.
- **Token Refresh**: If `accessToken` is missing/invalid and `refreshToken` exists, calls `${ENDPOINT_URL}/auth/refresh` (with `x-api-key`) to issue a new `accessToken` cookie.
- **Bypasses & Redirect**: `/self-host`, `/login`, `/favicon.ico`, `/robots.txt`, `/_next/`, and `/api/` are bypassed; unauthenticated requests to other routes redirect to `/self-host`.
