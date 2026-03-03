# Tailwind + shadcn/ui Migration Guide

## ✅ Completed Setup

The foundation for React + Tailwind + shadcn/ui is in place:

### Installed & Configured
- **Tailwind CSS v3** – `tailwind.config.js`, `postcss.config.js`
- **shadcn/ui** – Button, Dialog, Input in `src/components/ui/`
- **CRACO** – Enables `@/` path alias (e.g. `@/lib/utils`)
- **cn() utility** – `src/lib/utils.js` for merging Tailwind classes

### Converted Components
| Component | Status |
|-----------|--------|
| `App.js` | ✅ Removed App.css, uses Tailwind |
| `Navigation.js` | ✅ Tailwind classes |
| `Modal.js` | ✅ Uses shadcn Dialog |
| `SelectScreen.js` | ✅ Full Tailwind conversion |

### Theme Support
- `data-theme="light"` and `data-theme="dark"` still work
- CSS variables in `src/index.css` for light/dark
- Tailwind `darkMode: ['selector', '[data-theme="dark"]']` for `dark:` variants

---

## 📋 Remaining Migration (77 CSS files)

Convert screens incrementally. For each component:

1. **Remove** the CSS import
2. **Replace** `className="old-class"` with Tailwind utilities
3. **Use** shadcn components where applicable (Button, Input, Dialog, etc.)
4. **Delete** the CSS file when done

### Suggested Order
1. **Shared/Common** – HomeScreen, NotFound, Login, Register
2. **Auth** – ProfileScreen, SettingsScreen
3. **Admin** – AdminHome, AdminAnalytics, etc.
4. **Feature screens** – Budget, Quiz, Finance Quest, etc.

### Adding More shadcn Components
```bash
npx shadcn@latest add card
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
# etc.
```

### Tailwind Patterns
- **Layout**: `flex`, `grid`, `gap-4`, `p-4`, `m-4`
- **Colors**: `bg-primary`, `text-foreground`, `border-border`
- **Theme-aware**: `[data-theme=light]:bg-gray-100` for light mode overrides
- **Responsive**: `md:flex-row`, `sm:text-2xl`

---

## 🚀 Commands

```bash
npm start    # Dev server (uses CRACO)
npm run build
```

## 📁 Key Files

- `tailwind.config.js` – Tailwind + theme config
- `src/index.css` – Tailwind directives + shadcn CSS variables
- `src/lib/utils.js` – `cn()` helper
- `src/components/ui/` – shadcn components
- `components.json` – shadcn CLI config
