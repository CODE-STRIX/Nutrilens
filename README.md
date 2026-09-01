# NutriLens

### AI-Powered Food Label & Ingredient Intelligence Platform

> *The label, made legible.*

NutriLens turns a five-second barcode or label scan into plain-language, personalised food-safety intelligence — explaining not just **what** is in a product, but **why** it is there, and what it means for the person scanning it.

![Status](https://img.shields.io/badge/status-production--ready%20rebuild-green)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20Mobile%20(React%20Native)%20%7C%20Backend%20(Express)-blue)
![Theme](https://img.shields.io/badge/theme-FoodTech%20%2F%20Public%20Health-green)
![Event](https://img.shields.io/badge/Smart%20India%20Hackathon-2026-orange)

**Team:** CODESTRIX

---

## Table of Contents

1. [Overview](#overview)
2. [What's New in v2 Rebuild](#whats-new-in-v2-rebuild)
3. [System Architecture & Stack Breakdown](#system-architecture--stack-breakdown)
4. [Single Scoring Engine Specification](#single-scoring-engine-specification)
5. [Complete Monorepo File Structure](#complete-monorepo-file-structure)
6. [Frontend, Backend & Database Status Summary](#frontend-backend--database-status-summary)
7. [How to Access and Use Each Layer](#how-to-access-and-use-each-layer)
8. [Real vs. Simulated Data Strategy](#real-vs-simulated-data-strategy)
9. [90-Second Demonstration Script](#90-second-demonstration-script)
10. [Attribution & Licences](#attribution--licences)

---

## Overview

India's packaged food market has grown far faster than public food literacy. Ingredient lists printed on packages are dense, small, and written in regulatory jargon (such as "INS 211" or "Acidity Regulator 330") that shoppers cannot decode. Furthermore, existing nutrition apps score products identically for everyone, ignoring medical conditions like Hypertension or Diabetes.

**NutriLens** bridges this gap across **Web**, **Mobile**, and **REST API** backend layers:
- **Plain-language verdicts** explaining every ingredient, its manufacturing purpose, and its health impact.
- **Personalised scoring engine** that recalculates scores based on user health profiles, conditions, and allergies.
- **Side-by-side comparison** highlighting superior nutritional choices without misleading generic scores.
- **Safety centre & pantry inspector** matching scan histories against active FSSAI recall notices.

---

## What's New in v2 Rebuild

The v2 rebuild resolved visual, architectural, and data consistency defects:

| # | Defect | Solution in v2 Rebuild | Status |
|---|--------|------------------------|--------|
| 1 | Inconsistent scores across views | Created single `scoreProduct()` engine ([`src/utils/scoring.ts`](file:///c:/Codestrix/NutriLens/web/src/utils/scoring.ts)). | Verified |
| 2 | Text overlapped progress ring | Rebuilt Dashboard in strict CSS Grid. Dial & text are separated. | Verified |
| 3 | Identical ingredient lists in comparison | Sourced real per-product ingredient lists in [`AlternativesComparisonPage.tsx`](file:///c:/Codestrix/NutriLens/web/src/pages/AlternativesComparisonPage.tsx). | Verified |
| 4 | Muesli product labelled "Instant Noodles" | Sourced product category exclusively from each product's own record. | Verified |
| 5 | Dashboard patterns contradicted Patterns page | Both views read the same computed `PatternReport` object from one service. | Verified |
| 6 | Section labels clipped at card edge | Applied 8px grid tokens with proper padding scale (`--sp-4`, `--sp-6`). | Verified |
| 7 | Buttons near-invisible against dark bg | Applied `--action` (`#16191A`) and high-contrast tokens in light and dark themes. | Verified |
| 8 | Emoji used as status indicators | Removed ALL emoji from seed data and UI copy; replaced with Lucide React SVG icons. | Verified |
| 9 | 8 cramped pills + "AV" avatar chip | Replaced top navbar with a 240px collapsable [`Sidebar`](file:///c:/Codestrix/NutriLens/web/src/components/Sidebar.tsx). | Verified |
| 10 | Persona name mismatch across screens | Created global [`persona.ts`](file:///c:/Codestrix/NutriLens/web/src/store/persona.ts) store to synchronize active persona. | Verified |

---

## System Architecture & Stack Breakdown

### 1. Frontend (Web Application)
- **Framework:** Next.js / Vite + React 18 + TypeScript
- **Design System:** Custom CSS tokens (`--paper`, `--surface`, `--ink`, `--verdict-*`) with **Archivo** (display headings) & **Public Sans** (body/UI).
- **Navigation:** 240px collapsable desktop sidebar & responsive mobile bottom nav bar.
- **Visualisations:** Recharts for trend charts, custom SVG arc gauge dials, and interactive 2D SVG topology network graph for ingredient interaction mapping.

### 2. Backend (REST API Service)
- **Runtime:** Node.js + Express + TypeScript
- **Authentication:** JWT access tokens with Argon2id password hashing
- **Endpoints:**
  - `POST /api/v1/auth/login` & `POST /api/v1/auth/register`
  - `GET /api/v1/products/:barcode` & `GET /api/v1/products/search`
  - `POST /api/v1/personalize` (runs personalisation engine against user conditions)
  - `GET /api/v1/recalls` & `POST /api/v1/recalls/report`
  - `GET /api/v1/community` & `POST /api/v1/community/:id/vote`
  - `GET /api/v1/dashboard/patterns`

### 3. Database & Datasets
- **Database Engine:** PostgreSQL 16 (with ORM models) + Redis cache layer for Open Food Facts response caching.
- **Seeded Knowledge Bases:**
  - **`additive-knowledge-base.json`**: 60+ INS codes with 6-facet explanations (what it is, why added, body impact, caution for conditions, typical products, FSSAI status).
  - **`indian-food-products.json`**: 20 real Indian packaged food products with verified Open Food Facts barcodes.
  - **`fssai-recall-seed.json`**: Sample FSSAI advisories and affected batch numbers.
  - **`learning-lessons.json`**: Food literacy learning modules with interactive knowledge checks.

---

## Single Scoring Engine Specification

Located at `src/utils/scoring.ts` (pure function, zero side effects):

```ts
scoreProduct(product: Product, persona: UserProfile): ScoreResult
```

- **Base Computation (100 pts start):**
  - **Sodium:** Free up to 120mg; −1 per extra 40mg (max −30).
  - **Total Sugars:** Free up to 5g; −1 per extra 1.5g (max −25).
  - **Saturated Fat:** Free up to 1.5g; −1.5 per extra 1g (max −20).
  - **Energy:** Free up to 200kcal; −1 per extra 60kcal (max −10).
- **Bonuses:** Fibre (+2 per g above 3g, max +12), Protein (+1 per g above 5g, max +8), Zero Additives (+4 flat).
- **NOVA & Additive Penalties:** NOVA Group 4 deducts 12 pts. Additives penalised by concern level (high: −6, medium: −3, low: −1, capped at −24).
- **Personalisation & Hard Stops:**
  - **Allergen Match:** Score 0 ("Avoid" band, `blocked: true`).
  - **Hypertension:** Sodium > 500mg/serving caps score at 25.
  - **Type 2 Diabetes:** Added sugars > 10g/100g or rapid-glucose ingredients cap score at 30.
  - **High Cholesterol:** Saturated fat > 6g/100g or palm oil cap score at 35.
  - **GERD:** Citric acid / chilli content caps score at 50.
  - **Kidney Support:** Phosphate additives (INS 338–452) cap score at 40.

---

## Complete Monorepo File Structure

```
NutriLens/
├── web/                           # Frontend Web Application (Vite + React + TS)
│   ├── src/
│   │   ├── components/            # UI components
│   │   │   ├── FoodPatternIntelligence.tsx  # Patterns analytics & simulator
│   │   │   ├── LearningLibraryView.tsx      # Learning modules & 60+ INS glossary
│   │   │   ├── ProductIntelligence.tsx      # 6-facet ingredient cards & SVG topology map
│   │   │   ├── ProgressDashboard.tsx        # Personal nutrition index & recent scans
│   │   │   ├── RecallAlertsView.tsx         # FSSAI safety centre & pantry inspector
│   │   │   └── Sidebar.tsx                  # 240px collapsable desktop sidebar & mobile nav
│   │   ├── pages/                 # Full routes
│   │   │   ├── AboutPage.tsx                # Data sources, methodology & limitations
│   │   │   ├── AlternativesComparisonPage.tsx # Side-by-side comparison table
│   │   │   ├── CommunityBrowsePage.tsx       # Regional product consensus submission
│   │   │   ├── ProfilePage.tsx              # Health conditions & allergen configuration
│   │   │   └── ScanPage.tsx                 # 3-tab camera/photo/text scanner & reveal
│   │   ├── services/
│   │   │   └── api.ts             # Service layer with fast offline fallbacks
│   │   ├── store/
│   │   │   └── persona.ts         # Global active health persona state store
│   │   ├── utils/
│   │   │   └── scoring.ts         # Pure single scoring engine
│   │   ├── App.tsx                # App shell, router & toast system
│   │   └── index.css              # CSS token design system & typography
│   ├── index.html
│   └── package.json
│
├── backend/                       # REST API Server (Node.js + Express + TS)
│   ├── src/
│   │   ├── controllers/           # Auth, product, scan, recall & pattern controllers
│   │   ├── middleware/            # JWT authentication & rate limiter
│   │   ├── routes/                # Express API routes (/api/v1/...)
│   │   ├── services/              # Open Food Facts client, scoring & caching
│   │   └── server.ts              # Express application server entry point
│   └── package.json
│
├── mobile/                        # Mobile Client (React Native)
│   ├── src/                       # Screens, navigation & camera hooks
│   └── package.json
│
├── data/                          # Shared Seed Datasets
│   ├── additive-knowledge-base.json # 60+ INS code entries with 6-facet explanations
│   ├── fssai-recall-seed.json     # Sample FSSAI recall advisories
│   ├── indian-food-products.json  # 20 real Indian food products with OFF barcodes
│   └── learning-lessons.json      # Literacy modules & quizzes
│
├── shared/                        # Shared TypeScript Definitions
│   ├── types/                     # Product, ScoreResult, UserProfile interfaces
│   └── constants/                 # FSSAI & NOVA threshold constants
└── README.md
```

---

## Frontend, Backend & Database Status Summary

### 🟢 Frontend (Web Application)
- **Status:** **100% Production-Ready & Built Cleanly**.
- **Completed:**
  - Full design system implemented with light/dark theme support.
  - Desktop sidebar + mobile bottom navigation bar.
  - All 10 visual & numerical defects fixed.
  - Interactive SVG topology network graph for ingredient interactions.
  - 3 input scanner tabs (Type/Photo/Camera) with sample chips for instant offline demo.
  - Instant offline fallbacks enabled via `fastFetch()` helper (zero loading delays even if backend is offline).

### 🟢 Backend (REST API)
- **Status:** **Completed Express Architecture**.
- **Completed:**
  - API routes created for products, personalisation, recalls, community voting, patterns, and user profiles.
  - JWT auth middleware and Open Food Facts resolution service.
  - Integrated with local seed datasets for fallback handling.

### 🟢 Database & Datasets
- **Status:** **Seeded & Schema Defined**.
- **Completed:**
  - Relational schema defined for users, personas, scans, products, recalls, community submissions, and learning modules.
  - 60+ INS additives seeded with 6-facet explanations.
  - 20 real Indian products cached locally for offline demonstration.

---

## How to Access and Use Each Layer

### 1. How to Access and Run the Web Application
```bash
# Navigate to the web directory
cd c:\Codestrix\NutriLens\web

# Install dependencies (if not already installed)
npm install

# Start the Vite development server
npm run dev

# Open in browser:
# Navigate to http://localhost:5173
```
- **Usage:** Use the left sidebar to navigate between **Scan**, **Product Intelligence**, **Dashboard**, **Patterns**, **Alternatives**, **Recalls**, **Learn**, **Community**, **Profile**, and **About**. Switch active health personas at any time from the bottom-left sidebar card.

### 2. How to Access and Run the Backend API
```bash
# Navigate to the backend directory
cd c:\Codestrix\NutriLens\backend

# Install dependencies
npm install

# Start the backend server
npm run dev

# Server runs on http://localhost:5000/api
```
- **API Endpoints:**
  - `GET http://localhost:5000/api/products` — Product catalog
  - `GET http://localhost:5000/api/recalls` — Active recall advisories
  - `POST http://localhost:5000/api/personalize` — Score computation endpoint

### 3. How to Test Production Web Build
```bash
cd c:\Codestrix\NutriLens\web
npm run build
npm run preview
```

---

## Real vs. Simulated Data Strategy

| Component | Status | Source / Mechanism |
|---|---|---|
| **Product Data** | **Real Data / Seeded** | Sourced from Open Food Facts India catalog under the Open Database License (ODbL). |
| **Additive Knowledge Base** | **Real Data** | 60+ INS code entries with 6-facet explanations compiled from FSSAI Food Safety Regulations. |
| **Recall Advisories** | **Simulated / Seeded** | Modelled on published FSSAI safety notices. Clearly badged as *"Seeded dataset"* in the interface. |
| **Barcode Scanner** | **Simulated & Type** | Supports direct text/barcode lookup and one-tap demo chips for reliable presentation under stage lighting. |
| **Community Submissions** | **Interactive Local** | Local consensus voting model (3 votes promote to verified status). |

---

## 90-Second Demonstration Script

Use this sequence for live panel evaluation:

1. **Step 1: Scan a High-Sodium Product**
   - Go to **Scan and lookup**. Click **Maggi Noodles** sample chip.
   - Observe the 900ms reveal: product title → score dial (17/100) → Hypertension alert → score breakdown table.
2. **Step 2: Inspect Additive Manufacturing Rationale & Interaction Map**
   - Click **View full ingredient intelligence**.
   - Open **Interaction map** tab to view the SVG network graph.
   - Open **Manufacturing rationale** tab to see why MSG (INS 621) and Sodium Benzoate (INS 211) were added.
3. **Step 3: Switch Health Persona & Watch Scores Recalculate**
   - Click persona card in bottom-left sidebar. Switch from **Rahul Sharma** (Hypertension) to **Priya Nair** (Type 2 Diabetes).
   - See toast notification and watch scores & alerts recalculate dynamically.
4. **Step 4: Check Recall Safety Centre**
   - Click **Recall centre** in sidebar. Point out the clear *"Seeded dataset"* label and search pantry items.
5. **Step 5: Execute a Quantified Health Swap**
   - Open **Alternatives**. Compare **Maggi Noodles** vs **TrueElements Muesli**.
   - Review side-by-side table highlighting the 650mg sodium reduction and fibre gain.

---

## Attribution & Licences

- **Product Data:** Product details and barcodes are sourced from [Open Food Facts](https://world.openfoodfacts.org), licensed under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1-0/).
- **Typography:** Archivo and Public Sans variable fonts loaded via [Google Fonts](https://fonts.google.com).
- **Iconography:** Lucide React icons ([MIT License](https://lucide.dev/license)).
- **Medical Disclaimer:** NutriLens provides general nutrition guidance based on published label data and saved user profiles. It is not medical advice. Users should consult a qualified physician or dietitian for personal dietary decisions.
