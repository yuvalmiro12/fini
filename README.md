# פיני (Fini) — Personal Finance App

A warm, Hebrew-first AI finance assistant. Three implementations sharing one design system.

## Structure

```
fini/
├── packages/design-system/     # Shared tokens, types, seed data, categories
├── apps/web/                   # Next.js 14 — responsive web (primary browser target)
├── apps/mobile/                # Expo SDK 51 — iOS + Android (React Native)
└── apps/ios/                   # SwiftUI — native iOS 17+ (primary mobile target)
```

---

## 🌐 Web App (Next.js)

**Requirements:** Node 18+, pnpm 9+

```bash
cd apps/web
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

The app renders in a 390px phone shell on desktop. On mobile it goes full-width.

**Build for production:**
```bash
pnpm build
pnpm start
```

---

## 📱 Mobile App (Expo)

**Requirements:** Node 18+, pnpm 9+, Expo Go app on your device (or iOS Simulator / Android Emulator)

```bash
cd apps/mobile
pnpm install
pnpm start
```

Scan the QR code with Expo Go (iOS) or the Camera app (Android).

**Run on iOS Simulator:**
```bash
pnpm ios
```

**Run on Android Emulator:**
```bash
pnpm android
```

> RTL is forced at boot via `I18nManager.forceRTL(true)`. On first install on a device, you may need to restart the app once for RTL to apply.

---

## 🍎 iOS App (SwiftUI)

**Requirements:** macOS 14+, Xcode 15+

```bash
open apps/ios/Fini.xcodeproj
```

Then press **⌘R** to build and run on the simulator.

**Target:** iPhone 14 Pro, iOS 17+  
**Fonts:** Rubik weights are loaded as system font fallback. To bundle the actual Rubik .ttf files, add them to `Fini/Resources/` and register in `Info.plist` under `UIAppFonts`.

---

## Design System

All tokens, types, seed data, and category definitions live in `packages/design-system/`.

| File | Contents |
|------|----------|
| `tokens.ts` | Colors, radii, shadows, typography scale |
| `types.ts` | TypeScript interfaces: Transaction, SavingsGoal, Message, User |
| `seed.ts` | Mock data: נועה's transactions, chat history, savings goal, shared budget |
| `cats.ts` | 10 expense categories with Hebrew labels, icons, tint+ink color pairs |

---

## Screens

| Screen | Route (Web) | Tab |
|--------|-------------|-----|
| Onboarding Welcome | `/` (initial) | — |
| Onboarding Goal | state: obGoal | — |
| Onboarding Income | state: obIncome | — |
| Onboarding Plan | state: obPlan | — |
| Chat Main | state: chat | 💬 צ׳אט |
| Chat Daily Brief | state: brief | 💬 צ׳אט |
| Insights | state: insights | 💡 תובנות |
| Savings Goal | state: savings | 💡 תובנות |
| Data Overview | state: data | 📊 נתונים |
| All Transactions | state: transactions | 📊 נתונים |
| Transaction Detail | state: txDetail | sheet |
| Quick Add | state: addTx | modal |
| Couples | state: couples | modal |
| Paywall | state: paywall | modal |

---

## Design Tokens Reference

| Token | Value | Use |
|-------|-------|-----|
| `cream` | `#F7F5E8` | App base background |
| `ink` | `#1F1A15` | Primary text (warm near-black) |
| `rose` | `#FDDDE8` | Chat tab atmosphere |
| `mint` | `#D6EEE0` | Insights tab atmosphere |
| `lavender` | `#E8ECFF` | Data tab atmosphere |
| `pink` | `#C85A8A` | Chat accent, CTAs |
| `green` | `#5B8E6F` | Insights accent, income |
| `blue` | `#5A6FB8` | Data accent |
| `gold` | `#C9A24D` | פיני mascot, Pro badge |
| `expense` | `#D47070` | Negative amounts |

**Font:** Rubik (400/500/600/700) — Hebrew-first. Never Inter, Heebo, or Arial.

---

## RTL Rules

- All layouts use `direction: rtl` (web) / `I18nManager.forceRTL` (RN) / `.environment(\.layoutDirection, .rightToLeft)` (SwiftUI)
- Progress bars fill **right to left**
- Tab bar order left→right: **נתונים | תובנות | צ׳אט** (Chat is rightmost = primary)
- Back arrows point right-to-left (toward "home")
- Amounts: ₪ precedes the number (LTR inside RTL context)

---

## Placeholder User

- **Name:** נועה (Noa)  
- **Partner:** יונתן (Yonatan)  
- **Plan:** Pro+ (couples mode active)  
- **Savings goal:** טיול ליפן — ₪8,420 / ₪15,000 (56%)
