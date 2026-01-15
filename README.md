# DVRP Simulation Application

Aplikasi simulasi **Dynamic Vehicle Routing Problem (DVRP)** yang dirancang untuk mensimulasikan dan mengoptimalkan rute kendaraan secara dinamis.

## Tech Stack

- Next.js 16 dengan App Router
- React 19
- TypeScript
- TailwindCSS 4
- shadcn/ui
- TanStack Query
- Zod
- Jest

## Prerequisites

- **Node.js**: 22 (gunakan [NVM](https://github.com/nvm-sh/nvm) untuk management)
- **pnpm**: Enabled via corepack
- **Docker** (opsional)

## Project Structure

```
.
├── app
│   ├── (authenticated)
│   ├── _components
│   │   └── ui
│   ├── _hooks
│   └── (public)
├── common
├── lib
├── public
├── server
├── services
├── tests
└── types
```

### Folder Descriptions

- `app/`: Folder utama untuk Next.js App Router
- `_components/`: Reusable UI components (shadcn/ui based)
- `_hooks/`: Custom React hooks
- `common/`: Shared utilities and helpers
- `lib/`: Library functions
- `server/`: Server-side logic
- `services/`: External service integrations
- `tests/`: Unit and integration tests
- `types/`: TypeScript global type definitions

## Key Features

- ✅ Simulasi _real-time_ routing
- ✅ Visual route mapping
- ✅ Performance analytics
- ✅ Responsive design dengan TailwindCSS
- ✅ Type-safe dengan TypeScript & Zod

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev)
