# Tech Stack

L903-Manga leverages modern web technologies to deliver a premium experience.

## Frameworks & Libraries
- **Frontend Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack in dev)
- **UI Logic**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Slider/Carousel**: [Swiper](https://swiperjs.com/)
- **Auth / JWT**: [jose](https://github.com/panva/jose) (RS256 verification in middleware)

## Data Management
- **Server State**: [React Query (TanStack Query)](https://tanstack.com/query/latest) (`refetchOnWindowFocus: false`, query-level `staleTime`)
- **Client Persistence**: `localStorage` (`reading_history`, `readerContext`, `authorDetail`) & HTTP cookies (`accessToken`, `refreshToken`)
- **Legacy Dependencies**: `recoil` and `framer-motion` remain in `package.json` but are avoided in core views/lists to keep runtime overhead low on weak hardware.

## Tools & Utilities
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Progress Bars**: [NProgress](https://ricostacruz.com/nprogress/)
- **TypeScript**: For static typing and better DX.
- **Linting**: ESLint with Next.js configuration.
