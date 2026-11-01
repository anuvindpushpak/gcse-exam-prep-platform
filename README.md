# GradeFour.ai — AI-Powered Digital Examination Preparation Platform

A digital-first, self-service examination preparation platform starting with **GCSE Mathematics Foundation Tier (Edexcel 1MA1, AQA 8300, OCR J560)** targeting the **Grade 4 Standard Pass**.

## Core Architecture: One Platform, Three Interconnected Engines

1. **Content Engine (`src/content/` & `src/app/admin/`)**
   - Decoupled exam board specifications (`Edexcel 1MA1`, `AQA 8300`, `OCR J560`), Official GCSE Foundation Formulae Sheets, 6 syllabus topic modules, non-video written learning guides, declarative JSON-to-SVG diagrams (`src/components/diagrams/DeclarativeDiagram.tsx`), and a 6-Agent AI Content Factory with mandatory symbolic validation (`AI_DRAFT → AUTO_VALIDATED → REVIEW_PENDING → PUBLISHED`).
2. **Assessment Engine (`src/lib/engine/grader.ts` & `src/app/exam/[slug]/`)**
   - Powers the Free Baseline Diagnostic (Lead Magnet), Topic Practice Engine, Timed Weekly Sprints, and 3 Full-Length Mock Examinations (`Paper 1F Non-Calculator`, `Paper 2F Calculator`, `Paper 3F Calculator`).
   - Deterministic `mathjs` symbolic & numeric grader supporting partial **Method Marks (`M1`)** from intermediate working steps, **Accuracy Marks (`A1`/`B1`)**, fraction simplification checks, numerical tolerances, and misconception detection.
3. **Intelligence Engine (`src/lib/engine/intelligence.ts` & `src/app/dashboard/`)**
   - Computes live Topic Mastery RAG status, overall Grade 4 Readiness Score, distance-to-Grade-4 mark tracker, Non-Calculator vs. Calculator accuracy, Method Mark capture rate, and highest-ROI Next-Best-Action recommendations.
4. **Commerce, Accounts & Parent Portal (`src/components/commerce/` & `src/app/parent/`)**
   - Supports Free Diagnostic Lead Magnet gating, **£39.99 GCSE Maths Grade 4 Preparation Pack** (one-time unlock), **£7.99/mo Weekly Practice Membership**, and linked Parent Progress Dashboard with UK GDPR & ICO Children's Code safeguards.

## Quick Start (Local Development)

```bash
npm install
npm test
npm run dev
```

Open `http://localhost:3000`.

