# פיני — מסמך אסטרטגיה (v1)

*עדכון אחרון: 22 באפריל 2026*

סיכום של ישיבת המנהלים — ההחלטות שמנחות את הפיתוח ל־8 השבועות הבאים.

---

## 1. פוזיציה

**מה אנחנו בונים:** הצ'אט הכספי ה־AI־first בעברית לזוגות צעירים, מחובר ישירות לבנק.

**מה אנחנו *לא* בונים:** עוד דשבורד של גרפים; עוד אפליקציה לסינגלים; עוד כלי לרואי חשבון. פיני נשמע, מבין, ומדבר עברית טבעית.

**מה המבדיל:** Riseup זה טבלאות ורשימות. Bilty זה ריכוזי ולא זוגי. פיני זה דמות שמדברת איתך על הכסף שלכם כזוג, בעברית, בטון טבעי וחם.

---

## 2. קהל יעד

**Persona עיקרי:** זוג צעיר 25–35, ישראלי, שני השותפים חיים ברמת iPhone, מצב זוגי רציני (נשואים / חברים בדירה משותפת / הורים טריים), עובדים שניהם, הכנסה משותפת 20–40K ברוטו, חוסכים למשהו מוחשי (טיול, דירה, ילד ראשון).

**לא קהל יעד (לע"ע):** סטודנטים סינגלים, משפחות עם ילדים מעל 3, גמלאים, עצמאיים, B2B.

**מייצג בדמו:** נועה + יונתן, חוסכים לטיול ליפן (₪8,420 מתוך ₪15,000, 56%).

---

## 3. המסר (Wedge)

**משפט אחד:** "שאל את הכסף שלך כמו חבר — בעברית."

המסר עובד גם על ואטסאפ, גם על TikTok, גם על App Store screenshot אחד.

Hero shot: מסך צ'אט של פיני עם שאלה בעברית ("כמה הוצאנו על אוכל בחוץ החודש?") ותשובה טבעית ("יחד הוצאתם ₪1,240 — קצת פחות מהממוצע שלכם. רוצה שאציג פילוח?").

---

## 4. Tech Stack

| שכבה | בחירה | הערה |
|------|-------|------|
| Backend | **Convex** | Postgres־like, reactive queries, TypeScript end-to-end, SDK לכל הפלטפורמות |
| DB מקומי / cache | Convex client cache + optimistic updates | אם נצטרך אופליין אמיתי נוסיף IndexedDB/SQLite ב־v1.1 |
| Web | Next.js 14 (קיים) | RTL, phone-shell desktop, full width mobile |
| Mobile | Expo SDK 51 (קיים) | iOS+Android אחר כך, iOS ראשון |
| iOS | SwiftUI (קיים) | ConvexMobile SPM |
| LLM | **Claude Sonnet 4.6 (API) כ־primary, DictaLM 3.0 24B-Thinking כ־Phase 2 track** | Hybrid עם abstraction layer pluggable מיום אחד |
| Bank ingestion | **CSV upload ידני** ב־MVP | Open-Finance.co.il ב־v1.1 |
| Auth ב־MVP | Mock user | Convex Auth (email OTP) ב־v1.1 |

---

## 5. MVP Scope — Full Experience

כל המסכים שכבר קיימים ב־UI ייכנסו ל־MVP. שום מסך לא נדחה.

**המסכים (כולם — Web + iOS במקביל):**

- Onboarding (5 שלבים: Welcome → Goal → Income → Plan → Trial)
- Chat Main + Daily Brief
- Insights + Savings Goal
- Data Overview + Transactions List + Transaction Detail
- Quick Add Transaction (sheet)
- Couples (modal + shared view)
- Paywall (free / Pro / Pro+)
- Settings + Notifications

**מה נדחה ל־v1.1:** Auth אמיתי, Open Banking, SMS parsing, ייצוא נתונים, יועץ פיננסי אמיתי (ב־Pro+), Apple Pay.

---

## 6. Monetization

הטירים שכבר קיימים ב־`onboarding.tsx` מתאימים — לא משנים:

- **חינמי** — ₪0: 3 קטגוריות, דוח חודשי, מעקב הוצאות בסיסי
- **Pro** — ₪29/חודש: ללא הגבלה, צ'אט AI מלא, סריקת קבלות, תקציב חכם
- **Pro+** — ₪49/חודש: הכל ב־Pro, תשבון זוגי, יעוץ פיננסי, ייצוא נתונים

**7 ימי ניסיון ללא אשראי.** ההמרה קורית במסך Paywall אחרי 7 ימים או אחרי תקרת שימוש ב־free.

---

## 7. לוח זמנים — 8 שבועות ל־Soft Launch

| שבוע | נושא | Deliverable |
|------|------|--------------|
| 1 | Convex setup + schema + `LLMProvider` interface | Backend חי, AnthropicProvider מחובר, 20-question eval set |
| 2 | Core mutations + Web wiring + CSV importer | Web מחובר ל־Convex, upload + parse עובד |
| 3 | Chat pipeline + compute layer | צ'אט עם tool use על עסקאות, Sonnet 4.6 פרימרי |
| 4 | Insights + Savings Goals | חישובים ב־backend, UI מחובר |
| 5 | Couples + sharing | זוגיות עובדת ב־Web |
| 6 | iOS — ConvexMobile + מסכים | iOS feature-parity עם Web |
| 7 | Paywall + polish + QA | Free→Pro→Pro+ flow מלא |
| 8 | Soft launch prep | TestFlight, waitlist, 50–100 beta users |

**סוף שבוע 8:** Closed beta ל־50–100 זוגות מוכרים. מטרה: 30% DAU/MAU ו־15% החלפה ל־Pro בתום trial.

---

## 8. סיכונים — הכי חשוב לקרוא

### סיכון 1: Vendor concentration ב־Claude

MVP רץ על Claude Sonnet 4.6 API. אם Anthropic יש להם outage / מעלים מחיר / משנים מדיניות — פוגע במוצר. 

**Mitigation:** `LLMProvider` interface מיום אחד. קוד אפליקטיבי מדבר עם interface, לא עם Anthropic SDK ישירות. החלפה ל־GPT-5.4 / Gemini / DictaLM = החלפת קובץ אחד. 

**מוחלט critical** — בלי זה אנחנו לא יכולים להפעיל את מסלול Phase 2 ל־DictaLM סוברני כשיגיע Open Banking.

### סיכון 1.5: דחיית Sovereign Infrastructure

בחרנו לדחות DictaLM self-host עד Phase 2 (post-launch). הסיכון: אם Open Banking regulation חורגת מהלו"ז המשוער ודורשת data residency ישראלית תוך 6 חודשים — נצטרך לעבוד בלחץ.

**Mitigation:** בשבוע 6–7 לתכנן את ה־DictaLM spike במקביל (POC של inference + latency על L4 GPU). כך שאם הרגולציה מחייבת — אנחנו יכולים לעבור תוך 2–3 שבועות במקום 6–8.

**Go/No-Go Criteria לשבוע 8:** 
- מודד לבד — האם הגעתי ל־MVP שעובד על Claude?
- האם יש לי רשימת 20 שאלות real-world שאני יודע איך להעביר ל־DictaLM בשלב 2?

### סיכון 2: Timeline

Full scope ב־8 שבועות עם מפתח אחד זה צפוף. כל עיכוב של שבוע דוחף את ההשקה בשבוע. Buffer ריאליסטי: +2 שבועות = 10 שבועות סה"כ. אל תתחייב כלפי חוץ על פחות מ־10.

### סיכון 3: Open Banking ישראל

דחינו את זה ל־v1.1 — אבל המשתמשים הראשונים יתלוננו. ה־CSV ידני מסתיר את הערך של "חיבור בזמן אמת". הפיתוח ל־Open-Finance.co.il צריך להתחיל בשבוע 6–7 במקביל, כדי שיהיה מוכן ב־v1.1 שבוע 12.

### סיכון 4: Couples UX complexity

זוגיות = שני משתמשים, query filtering מורכב, "מי רואה מה", invite/accept flow. קל לפספס edge cases (משתמש עוזב זוגיות, משתמש מוזמן לזוגיות שנייה, transaction שנוצר לפני ההצטרפות). לתכנן בזהירות בשבוע 5.

---

## 9. הצעד הבא

1. לאשר את המסמך הזה (או לתקן).
2. שבוע 1: יצירת פרויקט Convex + schema בסיסי + `LLMProvider` interface + AnthropicProvider + 20-question eval set.
3. לקבוע checkpoint שבועי לבדוק התקדמות vs roadmap.

---

## 10. Week 1 — Concrete Checklist

מטרת השבוע: להעמיד backend חי + מחובר ל־Claude + דרך מדידה לאיכות תשובות. בלי UI changes השבוע.

**יום 1–2: Convex bootstrap**
- [ ] יצירת פרויקט Convex חדש (`npx convex dev`) וחיבור ל־monorepo.
- [ ] הגדרת `apps/web/convex/` כתיקייה המרכזית; `packages/convex-shared/` לסכמות.
- [ ] הגדרת ENV: `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`, `ANTHROPIC_API_KEY` (ב־Convex dashboard בלבד, לא בקוד).

**יום 2–3: Schema v0**
- [ ] `users` — `{ _id, name, email?, createdAt, currency: "ILS" }` (email optional ב־MVP).
- [ ] `couples` — `{ _id, memberIds: Id<"users">[], inviteCode?, status: "pending"|"active"|"ended", createdAt }`.
- [ ] `transactions` — `{ _id, userId, coupleId?, amount, currency, merchant, category, txDate, source: "csv"|"manual", rawRow?, createdAt }`.
- [ ] `savingsGoals` — `{ _id, ownerId (user|couple), title, targetAmount, currentAmount, targetDate?, createdAt }`.
- [ ] `messages` — `{ _id, userId, coupleId?, role: "user"|"assistant"|"tool", content, toolCalls?, createdAt }`.
- [ ] `evalRuns` — `{ _id, questionId, model, response, latencyMs, cost, rating?, createdAt }`.

**יום 3–4: LLMProvider interface**
- [ ] `packages/llm/src/provider.ts`:
  ```ts
  export interface LLMProvider {
    name: string;
    chat(params: {
      messages: ChatMessage[];
      tools?: ToolDef[];
      system?: string;
    }): Promise<ChatResponse>;
  }
  ```
- [ ] `packages/llm/src/anthropic.ts` — `AnthropicProvider` ממומש מול `@anthropic-ai/sdk`, מודל `claude-sonnet-4-6`.
- [ ] `packages/llm/src/registry.ts` — `getProvider(name: "anthropic" | "dicta" | "openai")` עם factory.
- [ ] בדיקת ping: Convex action שקוראת ל־provider עם "שלום" ומחזירה תשובה.

**יום 4–5: CSV importer spike (לא מחובר עדיין ל־UI)**
- [ ] Convex action `importCsv(fileContent: string, userId)` — פרסור CSV של בנק ישראלי (Leumi/Poalim/Discount — פורמטים נפוצים), המרה ל־transactions.
- [ ] קטגוריזציה בסיסית: regex rules על `merchant` (מכולת/דלק/מסעדה/תחבורה).
- [ ] בדיקה עם קובץ CSV אמיתי (anonymized).

**יום 5: Eval set**
- [ ] יצירת `packages/llm/evals/hebrew-finance-v1.json` עם 20 שאלות (ראה נספח A).
- [ ] סקריפט `pnpm eval` שמריץ את כל השאלות מול AnthropicProvider, שומר ל־`evalRuns`.
- [ ] הרצה ראשונה, דירוג ידני של התשובות (1–5), תיעוד baseline.

**Definition of Done לשבוע 1:**
1. אפשר לפתוח Convex dashboard ולראות את כל הטבלאות.
2. Action `chat.ping()` מחזירה תשובה מ־Claude בעברית.
3. `pnpm eval` רץ ומייצר 20 תשובות עם latency + cost.
4. קובץ CSV אחד מיובא בהצלחה ל־`transactions` (30+ עסקאות).

---

## 11. נספח A — 20-Question Hebrew Finance Eval Set

סט בסיסי למדידת איכות תשובות. כל שאלה מקבלת rubric של 1–5 (נכונות, טבעיות עברית, שימושיות). המטרה ב־baseline: ממוצע ≥ 3.8.

**קטגוריה 1: שאילתות ישירות על נתונים (תשובה דורשת tool use)**
1. "כמה הוצאנו על אוכל בחוץ החודש?"
2. "מה ההוצאה הכי גדולה שלנו השבוע?"
3. "כמה נשאר לנו עד סוף החודש לפי הקצב הנוכחי?"
4. "כמה הוצאנו על דלק מתחילת השנה?"
5. "מה הממוצע החודשי שלנו על סופר ב־3 חודשים אחרונים?"

**קטגוריה 2: השוואה וטרנדים (MoM / YoY)**
6. "הוצאנו החודש יותר או פחות על בילויים לעומת חודש שעבר?"
7. "איפה הוצאנו יותר השנה בלי לשים לב?"
8. "מה השתנה בהרגלי הקנייה שלנו מאז ינואר?"
9. "הקטגוריה שגדלה הכי הרבה ב־3 חודשים אחרונים?"
10. "האם אנחנו בקצב להגיע ליעד החיסכון שלנו?"

**קטגוריה 3: המלצות ותובנות (רזון generative)**
11. "מה ההמלצה שלך לחסוך ₪500 בחודש בלי להרגיש?"
12. "איפה אנחנו יכולים לצמצם בלי לפגוע באיכות החיים?"
13. "מה אתה רואה בהוצאות שלנו שיכול להדאיג?"
14. "האם חכם עכשיו להגדיל את החיסכון או להחזיר הלוואה קודם?"

**קטגוריה 4: Couples (דורש coupleId + הבנה של שני המשתמשים)**
15. "מי מאיתנו מוציא יותר החודש?"
16. "כמה כל אחד מאיתנו תרם לחיסכון של הטיול ליפן?"
17. "איזו הוצאה משותפת גדלה הכי הרבה?"
18. "תראה לי את החלוקה בהוצאות ביני לבין יונתן החודש."

**קטגוריה 5: Edge cases / שפה טבעית לא־פורמלית**
19. "כמה בזבזנו אתמול סה״כ?"
20. "יא פיני תגיד לי כמה יש לנו פנוי החודש באמת?"

**Scoring rubric:**
- 5: נכון עובדתית + טון עברי טבעי + שימושי + יש actionable insight אם רלוונטי.
- 4: נכון אבל חסר משהו קטן (טון, פרט אחד).
- 3: נכון אבל יבש או עברית לא זורמת.
- 2: תשובה חלקית או לא ברורה.
- 1: שגוי עובדתית או לא ענה על השאלה.

---

## 12. נספח B — Decision Log

תיעוד ההחלטות המרכזיות ותאריך קבלתן. כל החלטה חדשה — שורה חדשה כאן.

| תאריך | החלטה | אלטרנטיבות שנדחו | רציונל |
|-------|--------|-------------------|---------|
| 2026-04-20 | Convex כ־backend יחיד | Supabase, Firebase, custom Postgres | Reactive queries + TS end-to-end + SDK ל־Swift = zero friction מול UI הקיים |
| 2026-04-20 | Claude Sonnet 4.6 כ־primary LLM | GPT-5.4, Gemini 2.5, DictaLM 3.0 immediate | איכות עברית + tool use + מהירות time-to-market |
| 2026-04-20 | DictaLM 3.0 כ־Phase 2 track | להישאר על Claude, FinGPT self-host | Sovereignty כשיגיע Open Banking; DictaLM בשל מספיק לרזון MoM |
| 2026-04-20 | `LLMProvider` interface מיום 1 | קוד ישיר מול Anthropic SDK | Vendor lock-in risk mitigation — החלפה = קובץ אחד |
| 2026-04-20 | CSV ידני ב־MVP | Open-Finance.co.il, SMS parsing | רישוי רגולטורי לוקח חודשים; CSV מוכיח ערך מיידית |
| 2026-04-20 | Mock user ב־MVP | Convex Auth email OTP | להוריד chrome — auth לא חלק מה־core value proposition |
| 2026-04-20 | Full scope ב־8 שבועות | 4 שבועות (scope מצומצם) | המסכים כבר קיימים ב־UI; חבל לגמד |
| 2026-04-20 | Couples ב־MVP (Pro+) | לדחות ל־v1.1 | Couples זה ה־wedge המבדיל מ־Riseup/Bilty |
| 2026-04-22 | Responsive desktop web כ־v1.2 (הרחבת `apps/web` הקיים) | אפליקציית דסקטופ נפרדת (`apps/desktop`), Tauri/Electron native shell, redesign ל־power users | לשמור feature-parity עם mobile, zero drift, לא לבלבל את ה־wedge; דסקטופ הוא secondary surface לאותו קהל |

---

## 13. v1.2 — Desktop Web (Responsive)

**סטטוס:** מתוכנן ל־v1.2, אחרי soft launch.
**Owner:** TBD
**משך מוערך:** 4 שבועות עבודה (שבועות 12–15 מתחילת הפרויקט, או 4 שבועות אחרי launch).
**תלות:** Soft launch מוצלח (שבוע 8) + החלטת Go/No-Go לפי הקריטריונים בסעיף 13.9.

### 13.1 פוזיציה

**מה אנחנו בונים:** את פיני שכבר קיים — רק שעכשיו הוא נפתח גם על המסך הגדול בבית.

**קהל:** אותם זוגות 25–35 שכבר משתמשים ב־iPhone. ה־persona לא משתנה. דסקטופ הוא surface משני שנכנס לחיים שלהם במומנטים ספציפיים: סוף שבוע, תכנון תקציב, שיחת זוג על הכסף שאחד מהם קורא מהלפטופ.

**מה אנחנו *לא* בונים:** לא dashboard לרואי חשבון. לא B2B. לא power users עם bulk operations. לא desktop-exclusive features. פיני בדסקטופ = פיני במובייל, רק עם יותר מקום לנשום.

### 13.2 עקרונות עיצוב

1. **Feature parity מוחלטת** — אותם מסכים, אותו flow, אותם tokens. אין מסך חדש. אין state חדש. רק layout.
2. **Mobile-first נשאר הדיפולט** — ה־phone-shell של 390px ממשיך לעבוד בדיוק כמו שהוא מתחת ל־1024px. שום regression.
3. **חמימות שורדת** — לא הופכים את פיני ל־spreadsheet. אותה דמות, אותו טון, אותה עברית טבעית. הקריירה של ה־mascot ב־cream background מתרחבת, היא לא מוחלפת.
4. **Chat נשאר הכוכב** — בדסקטופ הצ'אט של פיני הוא pane קבוע מימין, תמיד נגיש. "שאל את הכסף שלך כמו חבר" הופך ל־"החבר תמיד יושב לידך".

### 13.3 Layout Paradigm

**≥1024px (laptop/desktop):** שלושה panes, RTL:

| Pane | רוחב | תוכן |
|------|------|------|
| **Right — Chat persistent** | 380px | צ'אט פיני תמיד פתוח. הודעות, input, פיני mascot למעלה. זה מה שעושה את המוצר שונה מ־Riseup. |
| **Center — Main content** | flexible (min 600px) | המסך שבחרת: Data / Insights / Transactions List. full-width tables, wider charts. |
| **Left — Nav rail** | 64px | Icon-only: 📊 נתונים, 💡 תובנות, ⚙ הגדרות, 🔔 התראות. hover מראה label. |

**768–1023px (tablet):** שני panes. Nav rail 64px + Main content. הצ'אט *לא* persistent — נפתח כ־tab רגיל. הסיבה: 380px של chat × 768 מסך = המרכז נשאר עם 324px, פחות מ־phone. לא שווה.

**<768px (mobile):** אין שינוי. Phone shell 390px כמו היום.

### 13.4 Scope — מה מקבל desktop treatment

| מסך | Desktop treatment | רציונל |
|-----|-------------------|---------|
| **Chat** | הופך ל־persistent right pane. מרכז ריק או תצוגה נלווית. | ה־wedge של המוצר. |
| **Data overview** | Grid של cards 3×N במקום stack. charts ב־full width. | desktop מוסיף כאן ערך אמיתי — יותר מידע ב־glance אחד. |
| **Transactions list** | Table view עם sortable columns (תאריך, סוחר, קטגוריה, סכום). Filters ב־sidebar שמאלי של ה־main pane. | זה המקום שבו "חלונות" באמת עוזרים. |
| **Insights** | Charts side-by-side במקום stacked. Month-over-month השוואות גלויות. | יותר קנבס = יותר comparisons מתגלות. |
| **Savings goal** | Full-width card עם progress ברוחב כפול. | flair. |
| **Onboarding** | נשאר מרוכז במרכז, `maxWidth: 480px`. לא נפרש. | Onboarding זה רגע אינטימי, לא dashboard. |
| **Modals (add-tx, paywall, couples, tx-detail)** | נשארים phone-sized (420px) מרוכזים על overlay. | modal דסקטופ בגודל של מסך = גרוע. |
| **Settings / Notifications** | `maxWidth: 640px` במרכז. | lists של toggles לא צריכים 1920px. |

### 13.5 Technical Approach

- **Tailwind breakpoints** — כבר קיים ב־`apps/web/tailwind.config.ts`. להוסיף `md:` (≥768) ו־`lg:` (≥1024) לקומפוננטים הרלוונטיים. לא מוסיפים custom breakpoints חדשים.
- **Layout wrapper ב־`apps/web/app/page.tsx`** — ה־`<div style={{ maxWidth: 390 }}>` הקיים הופך ל־conditional. ב־`lg` ומעלה: grid של 3 columns (64px + 1fr + 380px בסדר RTL).
- **Screen files נשארים כמו שהם** — כל `apps/web/components/screens/*.tsx` ממשיך להיות אותו קוד. רק wrapper layout משתנה. זה שומר על iOS parity (כי הקומפוננטים לא משתנים).
- **Chat pane component חדש אחד** — `ChatPane.tsx` שעוטף את `chat.tsx` הקיים ב־sticky positioning. ה־chat עצמו לא משתנה.
- **Design tokens** — אפס שינויים. אותם `cream`, `ink`, `rose`, `pink`, `gold`. Font scale נשאר (Rubik 400/500/600/700).
- **RTL** — נבדק ב־Chrome, Safari, Firefox. ה־grid הופך אוטומטית עם `direction: rtl` על ה־container.
- **Visual regression tests** — להוסיף Playwright snapshot tests על 3 breakpoints (390, 1024, 1440) לפני ה־launch של v1.2. מונע drift.

### 13.6 Timeline (4 שבועות אחרי soft launch)

| שבוע | נושא | Deliverable |
|------|------|--------------|
| 12 | Layout shell + breakpoints | Root layout עם 3 panes ב־≥1024px. Playwright snapshot baseline ב־3 breakpoints. 0 regressions ב־mobile. |
| 13 | Data + Transactions desktop | Grid layout ל־Data overview. Sortable table ל־Transactions. Filters ב־sidebar. |
| 14 | Chat persistent + Insights | Chat pane integrated as right rail. Charts side-by-side ב־Insights. |
| 15 | QA + polish + launch | Cross-browser (Chrome, Safari, Firefox, Edge). Accessibility audit (keyboard nav, focus rings). Internal dogfooding עם 5 זוגות beta. Release. |

### 13.7 Success Metrics (90 יום אחרי v1.2 release)

- ≥20% מה־DAU נכנסים גם מ־desktop לפחות פעם בשבוע.
- 0 drop ב־mobile DAU/MAU (feature parity אומרת feature parity).
- ≥15% מה־chat sessions מתקיימות ב־desktop pane (validation ש־persistent chat עובד).
- 0 regressions חזותיים ב־mobile לפי ה־snapshot suite.

### 13.8 סיכונים

**סיכון 1: Scope creep ל־power-user features.** הפיתוי להוסיף bulk edit, CSV export מ־table, keyboard shortcuts. *לא.* v1.2 = layout only. כל feature חדש נכנס ל־v1.3 עם justification נפרד.

**סיכון 2: Drift בין mobile/desktop.** 2 layouts = 2× surface ל־QA. Mitigation: Playwright snapshots on CI; כל PR שנוגע ב־screen רץ snapshot על 3 breakpoints אוטומטית.

**סיכון 3: Chat pane UX — מסיח דעת?** persistent chat יכול להרגיש בולט מדי, או להתחרות בתוכן המרכזי על תשומת הלב. Mitigation: שבוע 14 כולל test עם 5 zugot beta; אם 2+ מהם אומרים "זה מפריע", להוסיף collapse toggle.

**סיכון 4: iOS app נשאר מאחור.** אם בדסקטופ יש layout טוב יותר ל־Data, המשתמשים יעדיפו דסקטופ והאייפון יהפוך לשניוני. זה בסדר — אבל feature parity אומרת שאסור שמשהו יתחיל להיות exclusive לדסקטופ. אם מתפתים, מחזירים ל־iOS לפני ה־release.

**סיכון 5: Tablet (768–1023) נופל בין הכיסאות.** לא phone ולא desktop. Mitigation: למדוד ב־analytics כמה מה־users בכלל על tablet. אם <3% — להחליט שהם מקבלים את ה־phone layout בלבד ולחסוך את ה־2-pane breakpoint.

### 13.9 Go/No-Go ל־v1.2

**Go אם:**
- ✅ Soft launch (שבוע 8) הצליח — ≥50 זוגות active, DAU/MAU ≥25%.
- ✅ יש ≥5 בקשות קונקרטיות מ־beta users לגירסת דסקטופ (לא ספקולציות).
- ✅ Open Banking (v1.1) שוחרר או לפחות feature-complete — אחרת נתעדף אותו קודם.
- ✅ אין incident פתוח ב־backend/LLM שדורש attention.

**No-Go אם:**
- ❌ Retention ב־mobile מתחת ל־target — קודם מתקנים את זה.
- ❌ DictaLM phase 2 נדחף קדימה (רגולציית Open Banking מואצת) — sovereignty קודם ל־desktop.
- ❌ אין capacity — 4 שבועות של מפתח אחד. אם הוא עסוק ב־v1.1, v1.2 מחכה.

---

*הערה: המסמך הזה הוא living doc. מעדכנים אותו בכל פעם שהחלטה משתנה. כל החלטה חדשה → שורה בסעיף 12.*
