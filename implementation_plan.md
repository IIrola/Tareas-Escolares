# Implementation Plan - Academic Management System Frontend (Glassmorphism Edition)

This plan outlines the steps for creating a premium, modern, and responsive frontend application using a dark glassmorphism (Apple-style) aesthetic.

## User Review Required

> [!IMPORTANT]
> The backend URL must be configured in `.env` as `VITE_API_URL=http://localhost:3000/api`.
>
> **Design System**: I will use Tailwind CSS with custom glassmorphism utilities to achieve the Apple-style look on top of Shadcn/ui.
>
> **State Management**: TanStack Query (React Query) will be the primary tool for server state management.

## Proposed Changes

### Setup & Infrastructure

#### [NEW] [.env](file:///e:/servicios/frontend/.env)
Define `VITE_API_URL`.

#### [NEW] [frontend/src/api/apiClient.ts](file:///e:/servicios/frontend/src/api/apiClient.ts)
Axios instance with interceptors for JWT.

#### [NEW] [frontend/src/providers/QueryProvider.tsx](file:///e:/servicios/frontend/src/providers/QueryProvider.tsx)
TanStack Query configuration.

#### [NEW] [frontend/src/contexts/AuthContext.tsx](file:///e:/servicios/frontend/src/contexts/AuthContext.tsx)
JWT-based authentication state.

### UI & Design (Apple Glass Style)

#### [MODIFY] [frontend/src/index.css](file:///e:/servicios/frontend/src/index.css)
Global styles for dark mode and glassmorphism (backdrop-blur, translucent borders).

#### [NEW] [frontend/src/components/layout/DashboardLayout.tsx](file:///e:/servicios/frontend/src/components/layout/DashboardLayout.tsx)
Sidebar and Navbar with glass effect over a dynamic dark background.

#### [NEW] [frontend/src/components/ui/Toast.tsx](file:///e:/servicios/frontend/src/components/ui/Toast.tsx)
Integration of Sonner or Shadcn toast for notifications.

### Feature Modules (TanStack Query + Forms)

#### [NEW] [frontend/src/pages/Periods/](file:///e:/servicios/frontend/src/pages/Periods/)
Management with optimistic updates using React Query.

#### [NEW] [frontend/src/pages/Subjects/](file:///e:/servicios/frontend/src/pages/Subjects/)
CRUD for materias.

#### [NEW] [frontend/src/pages/Tasks/](file:///e:/servicios/frontend/src/pages/Tasks/)
Advanced task tracking with status transitions.

#### [NEW] [frontend/src/pages/Calendars/](file:///e:/servicios/frontend/src/pages/Calendars/)
Integration with `react-big-calendar` for scheduling.

## Verification Plan

### Automated Tests
- Manual verification of API connectivity via DevTools.

### Manual Verification
- Test glassmorphism responsiveness on mobile/desktop.
- Verify JWT persistence in localStorage.
- Validate success/error toast popups on CRUD operations.
- Ensure calendar renders events fetched via React Query.
