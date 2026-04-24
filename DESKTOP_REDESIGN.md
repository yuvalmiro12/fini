# Desktop Redesign — v1.2.1

תחליף ל־v1.2 MVP (sidebar צר + phone stretched + chat pane). גישה חדשה:
**שני עצי לייאאוט נפרדים** — mobile shell נשאר נקי, desktop shell נבנה מחדש.

## Decisions

- **Reference:** Monarch Money. למה: מתאים לרגש של "זוגות + אנושי", מתעקש על poleness בלי להישטח ל־SaaS סטרילי.
- **Chat:** Floating button ⟶ drawer 420px (slide-in). לא pane קבוע. משחרר מסך.
- **Identity:** שומר קרם `#F7F5E8` / ורוד `#FDDDE8` / פיני. משנה *מבנה*, לא צבעים.

## Architecture

```
page.tsx
├── <MobileShell>   (rendered always; visible <1024px)
│   └── phone-shell 390px + StatusBar + screen + TabBar  (unchanged)
│
└── <DesktopShell>  (rendered always; visible ≥1024px)
    ├── <Sidebar>        240px right   —  labeled nav
    ├── <div>             fluid center
    │   ├── <TopBar>                   —  breadcrumb, search, avatar
    │   └── <screen>                    —  desktop-specific layout
    └── <ChatDrawer>     floating LB, 420px drawer
```

**CSS rule:** `.fini-mobile-shell { display: contents }` at <1024px, `display: none` at ≥1024px (and inverse for `.fini-desktop-shell`). Each shell owns its own layout — no shared grid.

## File Plan

### New (desktop)
- `apps/web/components/desktop/desktop-shell.tsx` — grid wrapper, owns sidebar/topbar/drawer
- `apps/web/components/desktop/sidebar.tsx`       — 240px, labeled, user card bottom
- `apps/web/components/desktop/top-bar.tsx`       — search + date-range + avatar
- `apps/web/components/desktop/chat-drawer.tsx`   — floating FAB + slide-in panel
- `apps/web/components/desktop/dashboard.tsx`     — replaces DataMain at desktop
- `apps/web/components/desktop/transactions-desktop.tsx` — table view at desktop
- `apps/web/components/desktop/insights-desktop.tsx`    — analysis layout

### Updated
- `apps/web/app/page.tsx`       — render both shells side by side
- `apps/web/app/globals.css`    — shell switching rules
- `apps/web/components/screens/chat.tsx` — no change (already exports primitives)

### Retired
- `apps/web/components/ui/nav-rail.tsx`  — thin rail replaced by Sidebar
- `apps/web/components/ui/chat-pane.tsx` — pane replaced by ChatDrawer

## Breakpoint Contract

```
<1024px : MobileShell visible,  DesktopShell display:none
≥1024px : MobileShell display:none, DesktopShell visible (grid: 240px 1fr)
```

Mobile code path **is not touched**. Zero risk to phone UX.
