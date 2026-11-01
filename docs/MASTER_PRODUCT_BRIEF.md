# Master Product Brief (v2.0): AI-Powered Digital Examination Preparation Platform

## 1. The Problem We Are Solving

Build a scalable digital examination preparation platform that helps school students prepare for important examinations through structured, interactive, and measurable practice.

The initial target market is the **UK GCSE market**, starting with **GCSE Mathematics (Edexcel / Pearson 1MA1 initially, expanding rapidly to AQA 8300 and OCR J560)**, specifically students preparing for **Foundation Tier with the objective of achieving Grade 4 (Standard Pass)**.

Many students struggle with examination preparation because:
- They don't know which topics they are weak in.
- They don't know what to practise or in what order.
- Existing resources are fragmented across websites, books, PDFs, and videos.
- They practise questions but don't always understand why their answers are wrong or where they lost method marks.
- They lack a structured way to measure improvement and examination readiness.
- Parents struggle to understand whether their children are making progress.
- Generic revision resources don't provide a sufficiently personalised learning and practice experience.

We solve this through a **digital-first, self-service product**.

**We are NOT building an online tutoring business.**
The platform must not depend on:
- Live classes or tutors.
- One-to-one or scheduled teaching sessions.
- Passive video lessons.

Instead, we are building a digital preparation system combining original learning resources, intelligent assessments, examination simulations, detailed method-mark feedback, and personalised practice recommendations.

---

## 2. Core Architectural Vision: One Platform, Three Interconnected Engines

The platform is architected around **three interconnected engines** supported by a unified **Commerce, Accounts & Administration Layer**:

```
                     ┌───────────────────────────────────────────┐
                     │   COMMERCE, ACCOUNTS & ADMINISTRATION     │
                     │  (Auth, Parent Linking, Stripe, Entitlements,│
                     │   CMS, AI Governance & Audit Workflows)   │
                     └──────┬──────────────┬──────────────┬──────┘
                            │              │              │
            ┌───────────────▼──┐    ┌──────▼───────────┐  ▼──────────────────┐
            │ 1. CONTENT ENGINE│    │ 2. ASSESSMENT    │  │ 3. INTELLIGENCE  │
            │                  │    │    ENGINE        │  │    ENGINE        │
            │ • Curriculum &   │───▶│ • Free Diagnostic│─▶│ • Topic Mastery  │
            │   Specs (JSON)   │    │ • Practice Engine│  │ • Weakness Graph │
            │ • Question Bank  │    │ • Timed Tests    │  │ • Exam Readiness │
            │ • Declarative    │    │ • Full Mock Sims │  │   Score & Grade  │
            │   Diagrams (SVG) │    │ • Multi-Step &   │  │ • Next-Best-Step │
            │ • Topic Guides   │    │   Symbolic Grader│  │   Recommender    │
            │ • AI Factory     │◀───│ • Error Taxonomy │◀─│ • Parent Reports │
            └──────────────────┘    └──────────────────┘  └──────────────────┘
```

### Strategic Mandates (Non-Negotiable Principles)
1. **Build the examination engine first, not the content library:** Prove the end-to-end student spine (Diagnostic → Weak Topic Practice → Mock Exam → Performance Report) with high-precision grading before scaling content volume.
2. **Keep content strictly separate from application code:** All specifications, topics, learning guides, questions, mark schemes, diagram definitions, and exam templates must live in structured database/JSON schemas—never hardcoded in UI components.
3. **Never let AI publish unvalidated educational content:** Enforce a strict pipeline (`AI Draft → Symbolic/Deterministic Validation → Human Specialist Approval → Versioned Publication`).
4. **Build commercial infrastructure from day one:** Entitlements, free-tier lead magnet gating, one-time pack unlocks, recurring weekly memberships, and parent-child payment linking are first-class citizens.
5. **Make the platform measurable at every step:** Track question-level telemetry (time spent, calculator usage, method vs. accuracy errors, mark gains from baseline) to prove tangible progress toward Grade 4.

---

## 3. Product Vision & Core Loop

**Core Product Philosophy:** `Diagnose → Understand → Practise → Assess → Improve → Repeat.`

A student can:
1. Select their examination, subject, exam board (starting with **Edexcel**), and tier (**Foundation**).
2. Take a **Free Initial Diagnostic Assessment** (acting as a high-converting lead magnet).
3. View their baseline Strengths & Weaknesses profile and estimated distance to Grade 4.
4. Unlock the full **GCSE Maths Grade 4 Preparation Pack (£39.99)** (directly or via a "Send to Parent to Unlock" payment link).
5. Follow a personalised preparation pathway targeting their highest-leverage mark gaps.
6. Learn or refresh a weak topic using concise, structured written/interactive resources.
7. Practise questions organised by topic, difficulty, and calculator policy (`Non-Calculator` vs `Calculator Allowed`).
8. Input multi-step working using a built-in **Mathematical Keypad** and scaffolded step inputs to earn partial **Method Marks (`M1`)** as well as **Accuracy Marks (`A1`/`B1`)**.
9. Complete timed assessments and **3 full-length Mock Examinations** in a distraction-free simulator complete with an official **GCSE Formulae Sheet** reference modal.
10. Receive detailed line-by-line mark breakdowns, error diagnostics, and updated readiness metrics.

---

## 4. Business Model & Entitlement Tiers

### Tier 0: Free Lead Magnet Tier
- **Price:** Free (requires basic account or guest-to-account conversion).
- **Includes:**
  - Full or Mini Baseline Diagnostic Assessment.
  - Headline Readiness Score & Topic RAG (Red/Amber/Green) summary.
  - 1 Free Sample Topic Resource & Practice Set to experience the engine.
- **Paywall Trigger:** Unlocking detailed question-by-question remediation, the full personalised pathway, all 6 topic question banks, and the 3 full Mock Examinations requires **Product 1**.

### Product 1: GCSE Maths Grade 4 Preparation Pack
- **Price:** £39.99 (one-time purchase).
- **Target audience:** GCSE Mathematics Foundation Tier students aiming for Grade 4 (initially Edexcel, extensible to AQA/OCR).
- **Includes:** Complete diagnostic remediation breakdown, all 6 Foundation topic learning modules, full structured question bank with variations, unlimited topic/weakness practice, 3 original full-length Mock Examinations (Paper 1 Non-Calc, Paper 2 Calc, Paper 3 Calc), detailed worked solutions, and parent/student progress dashboards.

### Product 2: Weekly GCSE Maths Exam Practice Membership
- **Price:** £7.99 / month (recurring subscription).
- **Includes:** Newly released weekly topic challenges, timed mini-assessments, fresh exam-style question variations, monthly mock papers, and automated progress email digests.

---

## 5. Additional Requirements Filling Critical Domain Gaps

### 5.1 Calculator vs. Non-Calculator Paper Fidelity
- Every question, practice set, diagnostic section, and mock examination paper must specify a `calculatorPolicy`: `NON_CALCULATOR` or `CALCULATOR_ALLOWED`.
- Mock exams for GCSE Maths Foundation mirror the real structure: **Paper 1 (Non-Calculator)** and **Papers 2 & 3 (Calculator Allowed)**.
- The Examination Simulator displays a prominent visual indicator of calculator policy and tracks performance separately across Non-Calculator and Calculator questions (since many Foundation students lose Grade 4 due to non-calculator arithmetic or poor calculator fluency).

### 5.2 Official Exam Aids (Formula Sheet & Mathematical Keypad)
- **Formula Sheet Modal:** Timed exams and mock examinations include a toggleable, exam-board-accurate **GCSE Foundation Formulae Sheet** modal (e.g., area of a trapezium, volume of a prism, compound interest, trigonometry ratios).
- **On-Screen Mathematical Keypad:** All mathematical input fields provide a touch- and keyboard-friendly math palette supporting fractions ($\frac{a}{b}$), powers ($x^2, x^n$), square roots ($\sqrt{x}$), $\pi$, inequalities ($\le, \ge, \neq$), standard form ($\times 10^n$), and coordinate pairs $(x, y)$.

### 5.3 Multi-Step Marking & Method Marks (`M1`, `A1`, `B1`)
- GCSE Maths awards marks for **Method (`M1`)**, **Accuracy (`A1`)**, and **Independent Correct Statements (`B1`)**.
- Questions worth $\ge 2$ marks support **Scaffolded Working Steps** (either presented upfront or offered as a structured step-check) alongside the final answer box.
- The **Symbolic & Equivalence Marking Engine** evaluates:
  - Exact & equivalent numeric forms (e.g., `0.5`, `1/2`, `50%`, `0.50` according to question constraints).
  - Numerical tolerances (e.g., $\pm 0.05$ for rounding questions or graphical readings).
  - Algebraic equivalence (e.g., `2x + 6`, `6 + 2x`, `2(x + 3)` depending on whether expansion/factorisation is required).
  - Partial method marks (`M1`) when intermediate steps are correct even if the final arithmetic (`A1`) slips.
  - Known misconception matching (mapping specific wrong answers to targeted feedback, e.g., answering `9` instead of `6` or `8` for $2^3$, or adding denominators when adding fractions).

### 5.4 Declarative Diagram & Graph Engine
- LLMs must never generate raw raster images for geometry or statistics questions.
- Questions requiring visuals use a **Declarative Diagram Schema (JSON → Deterministic SVG Renderer)** supporting:
  - Coordinate grids & plotted lines/curves.
  - Geometric polygons, parallel lines & angle arcs (properly labelled "NOT accurately drawn").
  - Bar charts, pie charts, pictograms, Venn diagrams, frequency trees, and probability tree diagrams.
  - Number lines and inequalities.

### 5.5 Parent-Child Account Linking & UK Age-Appropriate Design
- **Data Minimization (UK GDPR & ICO Children's Code):** Collect minimal personal data from students (First Name/Display Name, Email, Exam Year, Target Grade). No public profiles, no geolocation, no behavioral ad tracking.
- **Dual Purchase & Linking Flows:**
  1. **Student-First Flow:** Student registers and completes the Free Diagnostic → clicks *"Unlock Full Grade 4 Pack (£39.99)"* → can either check out directly or generate a **Parent Checkout & Link Invite URL** so the parent pays and automatically gets a linked Parent Dashboard.
  2. **Parent-First Flow:** Parent creates a Parent Account, purchases the £39.99 pack, and creates/links their child's Student Account via a secure invite code.
- **Privacy Controls:** Parents see preparation telemetry (time spent, topic mastery, assessment scores, readiness trend) without intrusive surveillance.

---

## 6. Agentic AI Content Factory & Governance

AI operates strictly in the **Content Engine** and **Personalisation/Explanation layer** with deterministic guardrails:

1. **Agent 1: Curriculum & Specification Agent** — Parses exam board specifications (Edexcel 1MA1, AQA 8300, OCR J560) into structured topic/subtopic/assessment-objective trees (`AO1`, `AO2`, `AO3`).
2. **Agent 2: Question & Variation Generator Agent** — Generates parameterized question templates, declarative SVG diagram specs, multi-step mark schemes (`M1`/`A1`/`B1`), and misconception distractors.
3. **Agent 3: Deterministic Answer Validation Agent** — Uses symbolic/programmatic math evaluation (`mathjs` / Python `SymPy`) to independently compute answers, verify step equations, confirm single-unambiguous correctness, and reject invalid drafts automatically.
4. **Agent 4: Learning Explanation & Remediation Agent** — Generates clear, age-appropriate worked solutions, "Common Trap" callouts, and step-by-step error explanations.
5. **Agent 5: Personalisation & Pathway Agent** — Combines transparent rule-based mastery scoring with performance history to sequence the highest-ROI topics needed to cross the Grade 4 threshold (~55–65% mark target on Foundation).
6. **Agent 6: Content QA & Coverage Agent** — Audits question bank balance across topics, tiers, calculator policies, and assessment objectives.

**Lifecycle Enforcement:** `AI_DRAFT` → `AUTO_VALIDATED` → `REVIEW_PENDING` → `PUBLISHED` (with immutable version snapshots and audit trails).

