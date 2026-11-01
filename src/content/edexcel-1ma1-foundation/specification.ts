import { ExamBoardSpecification, ProductCatalogItem, TopicDefinition } from "@/types/platform";

export const EXAM_BOARD_SPECIFICATIONS: ExamBoardSpecification[] = [
  {
    id: "spec-edexcel-1ma1",
    subjectSlug: "gcse-maths",
    subjectName: "GCSE Mathematics",
    boardCode: "EDEXCEL",
    specCode: "1MA1",
    name: "Pearson Edexcel Level 1/Level 2 GCSE (9–1) in Mathematics (1MA1)",
    supportedTiers: ["FOUNDATION", "HIGHER"],
    grade4PassPercentage: 62, // Typical safe benchmark (~149/240 marks across 3 papers for safe Grade 4)
    formulaSheet: [
      {
        category: "Perimeter, Area and Volume",
        title: "Area of a Trapezium",
        formulaLatex: "A = \\frac{1}{2}(a + b)h",
        notes: "Where a and b are the lengths of the parallel sides and h is their perpendicular separation.",
      },
      {
        category: "Perimeter, Area and Volume",
        title: "Volume of a Prism",
        formulaLatex: "V = \\text{area of cross section} \\times \\text{length}",
      },
      {
        category: "Circles and Cylinders",
        title: "Circumference and Area of a Circle",
        formulaLatex: "C = 2\\pi r = \\pi d \\quad | \\quad A = \\pi r^2",
        notes: "Where r is the radius and d is the diameter.",
      },
      {
        category: "Geometry and Trigonometry",
        title: "Pythagoras' Theorem",
        formulaLatex: "a^2 + b^2 = c^2",
        notes: "For a right-angled triangle with hypotenuse c.",
      },
      {
        category: "Geometry and Trigonometry",
        title: "Trigonometric Ratios (Right-Angled Triangles)",
        formulaLatex: "\\sin A = \\frac{\\text{opp}}{\\text{hyp}}, \\quad \\cos A = \\frac{\\text{adj}}{\\text{hyp}}, \\quad \\tan A = \\frac{\\text{opp}}{\\text{adj}}",
      },
      {
        category: "Compound Growth & Finance",
        title: "Compound Interest",
        formulaLatex: "\\text{Total accrued} = P\\left(1 + \\frac{r}{100}\\right)^n",
        notes: "Where P is the principal amount, r is the interest rate per period, and n is the number of periods.",
      },
      {
        category: "Probability",
        title: "Probability Addition Rule",
        formulaLatex: "P(A \\text{ or } B) = P(A) + P(B) - P(A \\text{ and } B)",
      },
    ],
  },
  {
    id: "spec-aqa-8300",
    subjectSlug: "gcse-maths",
    subjectName: "GCSE Mathematics",
    boardCode: "AQA",
    specCode: "8300",
    name: "AQA GCSE Mathematics (8300) Foundation Tier",
    supportedTiers: ["FOUNDATION", "HIGHER"],
    grade4PassPercentage: 60,
    formulaSheet: [
      {
        category: "Perimeter, Area and Volume",
        title: "Area of a Trapezium",
        formulaLatex: "A = \\frac{1}{2}(a + b)h",
      },
      {
        category: "Geometry and Trigonometry",
        title: "Pythagoras' Theorem",
        formulaLatex: "a^2 + b^2 = c^2",
      },
    ],
  },
  {
    id: "spec-ocr-j560",
    subjectSlug: "gcse-maths",
    subjectName: "GCSE Mathematics",
    boardCode: "OCR",
    specCode: "J560",
    name: "OCR GCSE (9–1) Mathematics (J560) Foundation Tier",
    supportedTiers: ["FOUNDATION", "HIGHER"],
    grade4PassPercentage: 58,
    formulaSheet: [
      {
        category: "Perimeter, Area and Volume",
        title: "Area of a Trapezium",
        formulaLatex: "A = \\frac{1}{2}(a + b)h",
      },
      {
        category: "Geometry and Trigonometry",
        title: "Pythagoras' Theorem",
        formulaLatex: "a^2 + b^2 = c^2",
      },
    ],
  },
];

export const EDEXCEL_FOUNDATION_TOPICS: TopicDefinition[] = [
  {
    id: "topic-num",
    specId: "spec-edexcel-1ma1",
    code: "N1",
    domain: "Number",
    name: "Number Operations, Factors, Powers & Standard Form",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 22,
    prerequisiteTopicIds: [],
    isFreeSample: true,
    description:
      "Master BIDMAS order of operations, prime factorisation (HCF & LCM), laws of indices, rounding & error intervals, and standard form calculations.",
  },
  {
    id: "topic-fdp",
    specId: "spec-edexcel-1ma1",
    code: "FDP1",
    domain: "Fractions, Decimals & Percentages",
    name: "Fractions, Decimals, Percentages & Financial Maths",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 18,
    prerequisiteTopicIds: ["topic-num"],
    isFreeSample: false,
    description:
      "Convert fluently between fractions, decimals and percentages; add, subtract, multiply and divide fractions; calculate percentage change, reverse percentages, and compound interest.",
  },
  {
    id: "topic-ratio",
    specId: "spec-edexcel-1ma1",
    code: "R1",
    domain: "Ratio & Proportion",
    name: "Ratio, Direct Proportion, Speed, Density & Best Buys",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 20,
    prerequisiteTopicIds: ["topic-num", "topic-fdp"],
    isFreeSample: false,
    description:
      "Share quantities in a given ratio, solve part-to-part and part-to-whole ratio problems, scale recipes, compare best value purchases, and apply compound measures (Speed & Density).",
  },
  {
    id: "topic-alg",
    specId: "spec-edexcel-1ma1",
    code: "A1",
    domain: "Algebra",
    name: "Algebraic Expressions, Linear Equations, Sequences & Graphs",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 17,
    prerequisiteTopicIds: ["topic-num"],
    isFreeSample: false,
    description:
      "Simplify expressions, expand and factorise single/quadratic brackets, solve multi-step linear equations and inequalities, find nth terms of linear sequences, and plot straight-line graphs (y = mx + c).",
  },
  {
    id: "topic-geom",
    specId: "spec-edexcel-1ma1",
    code: "G1",
    domain: "Geometry & Measures",
    name: "Angles, Polygons, Area, Volume & Pythagoras' Theorem",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 13,
    prerequisiteTopicIds: ["topic-num", "topic-alg"],
    isFreeSample: false,
    description:
      "Apply angle facts on parallel lines and in polygons, calculate perimeter and area of compound shapes, circles and trapeziums, find volumes of prisms, and use Pythagoras' Theorem.",
  },
  {
    id: "topic-stat",
    specId: "spec-edexcel-1ma1",
    code: "S1",
    domain: "Statistics & Probability",
    name: "Averages, Charts, Venn Diagrams & Probability",
    tier: "FOUNDATION",
    gradeTarget: 4,
    weightPercentage: 10,
    prerequisiteTopicIds: ["topic-fdp"],
    isFreeSample: false,
    description:
      "Calculate mean, median, mode and range from lists and frequency tables, interpret bar/pie charts, complete Venn diagrams and two-way tables, and calculate combined probabilities.",
  },
];

export const PRODUCT_CATALOG: ProductCatalogItem[] = [
  {
    id: "prod-gcse-maths-grade4-pack",
    slug: "gcse-maths-grade-4-preparation-pack",
    name: "GCSE Maths Grade 4 Preparation Pack",
    tagline: "Complete Foundation Tier system to secure your Grade 4 pass",
    description:
      "One-time purchase giving full access to all 6 Edexcel Foundation topic modules, 100% of the step-marked question bank, personalised weakness pathways, 3 full-length Mock Examinations (Non-Calc & Calc), and the Parent Progress Dashboard.",
    type: "ONE_TIME_PACK",
    pricePence: 3999,
    priceFormatted: "£39.99",
    billingLabel: "One-time purchase · Lifetime exam-season access",
    entitlementScope: "FULL_PACK",
    badge: "Most Popular",
    features: [
      "Complete Diagnostic Assessment & Question-by-Question Remediation",
      "All 6 GCSE Maths Foundation Topic Learning Guides & Formulae",
      "Full Step-Marked Question Bank (Method M1 + Accuracy A1 feedback)",
      "Unlimited Weakness-Targeted & Mixed Practice Sessions",
      "3 Full-Length Original Mock Examinations (Paper 1 Non-Calc, Papers 2 & 3 Calc)",
      "Parent/Guardian Linked Progress & Readiness Dashboard",
    ],
  },
  {
    id: "prod-weekly-maths-membership",
    slug: "weekly-gcse-maths-exam-practice-membership",
    name: "Weekly GCSE Maths Exam Practice Membership",
    tagline: "Structured weekly exam challenges and fresh mock papers every month",
    description:
      "Ongoing weekly accountability membership delivering newly released topic challenges, timed 20-minute exam sprints, fresh question variations, and monthly mock papers right up to exam day.",
    type: "SUBSCRIPTION",
    pricePence: 799,
    priceFormatted: "£7.99",
    billingLabel: "per month · Cancel anytime",
    entitlementScope: "WEEKLY_MEMBERSHIP",
    badge: "Continuous Practice",
    features: [
      "New Weekly Topic & Mixed-Topic Exam Challenges released every Monday",
      "Timed 20-Minute Grade 4 Booster Sprints",
      "Fresh Exam-Style Question Variations with Worked Solutions",
      "Monthly Full Mock Examination Drops",
      "Weekly Parent & Student Readiness Progress Digest",
    ],
  },
];
