# Design System — Panel Admin

## Direction
Editorial / content management tool. Clean, structured, professional.
Not playful. Not generic SaaS. Calm like a writing environment.

## Palette
- **Canvas:** `zinc-100` / `#f4f4f5` — page background
- **Surface:** `#ffffff` — cards, sidebar, panels
- **Text primary:** `zinc-900` / `#18181b`
- **Text secondary:** `zinc-600` / `#52525b`
- **Text muted:** `zinc-400` / `#a1a1aa`
- **Accent (primary CTA):** `zinc-900` — black primary buttons
- **Action (interactive):** `blue-600` / `#2563eb` — focus rings, links, active states
- **Destructive:** `red-500` / `#ef4444`

## Depth strategy
**Borders only** for layout surfaces. Subtle `shadow-sm` on floating cards only.
- Cards: `border border-zinc-100` (10% zinc-900 alpha) — CSS var `--border`
- Inputs: `border border-zinc-200` (18% alpha) — CSS var `--border-md`
- Sidebar: `border-r border-zinc-200` separating from canvas
- Modals: `shadow-xl` + `backdrop-blur` overlay

## Spacing base
Tailwind default (4px grid). Use `gap-2`, `gap-4`, `gap-6` for component spacing.
Section padding: `px-5 py-5` (cards), `px-5 py-4` (sidebar nav sections).

## Signature
Thin left-border accent (`.5rem wide`, `bg-zinc-800`) on active sidebar nav item.
The editorial "cursor" — shows exactly where you are.

## Button hierarchy
Defined as CSS utility classes in `globals.css`:
- `.btn-primary` — black bg, for primary CTA (Crear, Guardar)
- `.btn-action` — blue-600, for secondary interactive actions
- `.btn-outline` — transparent + zinc border, for cancel/secondary
- `.btn-ghost` — transparent, muted text, for icon actions
- `.btn-ghost-destructive` — ghost that turns red on hover (delete icons)
- `.btn-destructive` — red bg, for confirm-delete in modals
- `.btn-pill` — border-radius modifier (border-radius: 9999px)
- `.btn-sm`, `.btn-lg` — size modifiers

All buttons share `.btn` base: `height: 2.25rem`, `padding: 0 1.25rem`, `font-size: 0.875rem`.

## Typography
- **Font:** Geist Sans (loaded via `next/font/google` in layout.tsx, CSS var `--font-geist-sans`)
- **Page title** (`TitleSec`): `text-2xl font-semibold text-zinc-900 tracking-tight`
- **Section title** (`TitleSubSec`): `text-base font-semibold text-zinc-900`
- **Card title:** `text-base font-semibold text-zinc-900`
- **Body / label:** `text-sm text-zinc-700`
- **Meta / secondary:** `text-xs text-zinc-400` or `text-sm text-zinc-500`

## Cards
`.card` utility class: `bg-white border border-zinc-100 rounded-xl`
Use `hover-btn` for lift effect on interactive cards.

## Forms (floating label pattern)
All inputs use floating label pattern (`peer` + translate).
**Critical:** Label MUST have `bg-white px-2` so it masks the border when floating.
Focus state: `focus:border-blue-600` + `peer-focus:text-blue-600`.
`input-art.tsx` and `textarea.tsx` use transparent input background (for use inside white cards).
`input.tsx` (login form) uses same pattern.

## Navigation (NavbarAdmin)
- Sidebar: `w-[280px]`, `bg-white border-r border-zinc-200`, fixed
- Content area offset: `md:ml-[280px]`
- Active detection: `usePathname()` — check exact match or `startsWith()`
- Active item: `bg-zinc-100 text-zinc-900` + absolute left-border `w-0.5 h-6 bg-zinc-800`
- Inactive item: `text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50`

## Modals (confirmation)
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeModal} />
  <div className="relative card p-6 w-full max-w-sm shadow-xl">
    ...
    <div className="flex justify-end gap-2">
      <button className="btn btn-outline">Cancelar</button>
      <button className="btn btn-destructive">Eliminar</button>
    </div>
  </div>
</div>
```

## Layout components (shared)
- `ContSubSec` — white card wrapper with `shadow-sm border border-zinc-100 rounded-xl`. Uses inline styles for variable `width`/`height` props (dynamic Tailwind classes don't work in JIT).
- `HeadSubSec` — flex row, `justify-between items-center`. Uses inline style for `minHeight`.
- `TitleSec` — page heading, no `width` prop (removed — was unused)
- `TitleSubSec` — section heading inside panels, no `width` prop

## Key bugs fixed (2026-03-14)
- `sm:w-[80%` missing `]` in `container.tsx` — fixed
- `border-1` not valid Tailwind → `border` in `input.tsx`
- `focus:border-primary` / `peer-focus:text-primary` (undefined color) → `blue-600`
- Floating labels in `input-art.tsx` and `textarea.tsx` missing `bg-white px-2` — fixed
- Login submit button missing `text-white` — fixed
- `body` font was `Arial` overriding Geist — fixed to `var(--font-geist-sans)`
- `hover-btn` had `transition: 0.9s` as default (slow exit) — fixed to `0.15s`
- Dynamic Tailwind classes `w-[${width}]` in shared layout components → replaced with inline styles
