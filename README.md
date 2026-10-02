# TimeWorkCalc

Free online time and work-hours calculators.

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript** (strict mode)
- **Tailwind CSS 4**
- **ESLint** (next + typescript configs)
- **Vitest** (unit testing)

## Getting Started

```bash
npm install
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests (single run) |
| `npm run test:watch` | Run tests in watch mode |

## Architecture

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Header, Footer)
│   ├── page.tsx                # Homepage
│   ├── sitemap.ts              # Dynamic sitemap
│   ├── robots.ts               # Robots.txt
│   └── globals.css             # Global styles
├── components/
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── PageContainer.tsx
│   └── calculator/             # Calculator UI components
│       ├── CalculatorShell.tsx
│       ├── ResultPanel.tsx
│       └── RelatedCalculators.tsx
├── lib/
│   ├── seo/                    # SEO utilities
│   │   ├── metadata.ts
│   │   └── structured-data.ts
│   ├── time/                   # Calculation engine (pure TypeScript)
│   │   ├── clock-time.ts       # Clock time parse/validate/convert
│   │   ├── duration.ts         # Duration arithmetic (add/subtract/multiply/divide)
│   │   ├── conversions.ts      # Bidirectional unit conversions
│   │   ├── calculations.ts     # Time difference, work hours
│   │   ├── work-hours.ts       # Multi-break, multi-day totals
│   │   ├── formatting.ts       # Human-readable duration formatting
│   │   ├── validation.ts       # Structured input validation
│   │   └── index.ts            # Public API
│   └── utils/                  # Shared utilities
│       ├── formatting.ts
│       └── validation.ts
├── types/
│   ├── calculator/             # Calculator UI types
│   │   └── index.ts
│   └── time/                   # Time data model types
│       └── index.ts
└── tests/
    ├── setup.ts
    └── unit/
        ├── utils.test.ts
        └── time/
            ├── clock-time.test.ts
            ├── duration.test.ts
            ├── conversions.test.ts
            ├── calculations.test.ts
            ├── work-hours.test.ts
            ├── formatting.test.ts
            └── validation.test.ts
```

## Calculation Engine

The engine in `src/lib/time/` is a pure-TypeScript layer with zero React, Next.js, or browser dependencies. All functions are pure and independently testable.

### Canonical Representation

- **Clock time**: Minutes since midnight (0-1439) for arithmetic; `ClockTime` interface for public API
- **Duration**: Total seconds internally to avoid floating-point issues; `Duration` interface (hours/minutes/seconds) for public API

### ClockTime vs Duration

| Concept | Interface | Example | Use Case |
|---------|-----------|---------|----------|
| Time of day | `ClockTime` | 9:30 AM | Start/end of a shift |
| Elapsed time | `Duration` | 8 hours 30 minutes | Work hours, breaks |

These types must never be mixed. A `ClockTime` is not a `Duration`.

### Overnight Semantics

`timeDifference(start, end, overnight)`:

- **Same-day mode** (`overnight=false`): Returns error if end < start
- **Overnight mode** (`overnight=true`): If end < start, assumes end is next day (+24h). If end === start, returns 0 duration.

### Same-Start/End Behavior

`09:00 → 09:00` always returns 0 duration in both modes. This prevents accidental 24h results.

### Negative Duration Behavior

`subtractDuration` can produce negative results when a < b. The caller decides how to present this in the UI. The engine provides `isNegativeDuration()` and `negateDuration()` helpers.

### Work Hours & Breaks

- Accepts `clockIn`, `clockOut`, and `breaks: number[]` (minutes)
- Returns `elapsed`, `totalBreak`, `worked`, `decimalHours`
- Rejects if total breaks exceed elapsed time

### Multi-Day / Time Card

`calculateMultiDayTotals(entries)` processes each `DayEntry` independently and sums totals across all days.

### Decimal Hours Conversion

- `durationToDecimalHours({ hours: 7, minutes: 30 })` → `7.5`
- `decimalHoursToDuration(7.5)` → `{ hours: 7, minutes: 30, seconds: 0 }`
- **Never** confuse 7.30 with 7h 30m. 7h 30m = 7.5 decimal hours.

### Precision / Rounding

- All arithmetic uses integer seconds internally
- `Math.round` applied to final seconds to eliminate floating-point artifacts
- `durationToDecimalHours` rounds to 4 decimal places
- No silent precision loss

### Validation

All engine functions return `EngineResult<T>`:
- `{ ok: true, value: T }` on success
- `{ ok: false, error: { code, message } }` on failure

No exceptions for normal validation errors. Typed error codes enable programmatic handling.

## Design Principles

- **Separation of concerns**: Calculation logic is independent of UI
- **Server components by default**: Only use `"use client"` where interactivity requires it
- **Mobile-first**: Responsive design starting from small screens
- **Accessible**: Semantic HTML, keyboard navigation, ARIA labels
- **Privacy-first**: All calculations run locally in the browser
- **No unnecessary dependencies**: Only add what's needed

## Planned Calculator Routes

- `/time-calculator`
- `/hours-calculator`
- `/time-duration-calculator`
- `/time-difference-calculator`
- `/hours-between-times`
- `/work-hours-calculator`
- `/time-card-calculator`
- `/timesheet-calculator`
- `/overtime-calculator`
- `/decimal-hours-calculator`
- `/hours-to-minutes`
- `/minutes-to-hours`
- `/time-converter`
- `/military-time-converter`
