import { LearningResource } from "@/types/platform";

export const EDEXCEL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: "lr-topic-num",
    topicId: "topic-num",
    summaryMarkdown:
      "Number underpins 22% of the Foundation Tier paper and is heavily tested on Paper 1 (Non-Calculator). Securing full marks on BIDMAS, Prime Factor Trees (HCF & LCM), Laws of Indices, and Standard Form builds the foundation for every other topic.",
    keyRules: [
      "BIDMAS Hierarchy: Brackets first, then Indices (powers/roots), then Division & Multiplication (left to right), then Addition & Subtraction (left to right).",
      "Prime Factor Decomposition: Break any composite integer into prime factors ($2, 3, 5, 7, 11, \\dots$). Use a Venn diagram of prime factors to find the HCF (multiply the intersection) and LCM (multiply all numbers in both circles).",
      "Index Laws: When multiplying powers with the same base, add the indices ($a^m \\times a^n = a^{m+n}$). When dividing, subtract ($a^m \\div a^n = a^{m-n}$). For brackets, multiply ($(a^m)^n = a^{mn}$). Anything to the power $0$ equals $1$ ($a^0 = 1$).",
      "Standard Form: Always written as $A \\times 10^n$ where $1 \\le A < 10$ and $n$ is an integer.",
    ],
    formulae: [
      {
        label: "Product Rule for Indices",
        expression: "x^a \\times x^b = x^{a+b}",
        note: "Base must be identical before adding powers.",
      },
      {
        label: "Standard Form Constraint",
        expression: "A \\times 10^n \\quad (1 \\le A < 10)",
        note: "e.g., 45 × 10³ is NOT in standard form; rewrite as 4.5 × 10⁴.",
      },
      {
        label: "Error Interval for Rounded Value x",
        expression: "\\text{Lower Bound} \\le x < \\text{Upper Bound}",
        note: "Always use ≤ on the left and strictly < on the right.",
      },
    ],
    workedExamples: [
      {
        title: "Finding HCF and LCM using Prime Factors",
        questionText: "Find the Lowest Common Multiple (LCM) of 24 and 60.",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 3,
        steps: [
          {
            markCode: "M1",
            working: "24 = 2 × 2 × 2 × 3  and  60 = 2 × 2 × 3 × 5",
            explanation: "Write both numbers as products of their prime factors using factor trees.",
          },
          {
            markCode: "M1",
            working: "Shared factors (HCF) = 2 × 2 × 3 = 12; Remaining factors = 2 and 5",
            explanation: "Identify the overlapping prime factors (2, 2, 3) and the outer factors.",
          },
          {
            markCode: "A1",
            working: "LCM = 12 × 2 × 5 = 120",
            explanation: "Multiply all factors in the Venn diagram together to get 120.",
          },
        ],
        finalAnswer: "120",
      },
      {
        title: "Converting & Calculating in Standard Form",
        questionText: "Work out (3 × 10⁴) × (4 × 10⁵). Give your answer in standard form.",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 2,
        steps: [
          {
            markCode: "M1",
            working: "(3 × 4) × (10⁴ × 10⁵) = 12 × 10⁹",
            explanation: "Multiply the front numbers (3 × 4 = 12) and add the powers of 10 (4 + 5 = 9). Earns M1.",
          },
          {
            markCode: "A1",
            working: "1.2 × 10¹⁰",
            explanation: "Adjust 12 to 1.2 (since 1 ≤ A < 10) and increase the power of 10 by 1.",
          },
        ],
        finalAnswer: "1.2 * 10^10",
      },
    ],
    commonMistakes: [
      {
        trap: "Evaluating 2³ as 2 × 3 = 6.",
        correction: "2³ means 2 × 2 × 2 = 8. Multiply the base by itself three times.",
      },
      {
        trap: "Leaving a standard form answer as 12 × 10⁹.",
        correction: "The first number must be between 1 and 10 (1 ≤ A < 10). Convert 12 × 10⁹ to 1.2 × 10¹⁰ to secure the final A1 mark.",
      },
    ],
  },
  {
    id: "lr-topic-fdp",
    topicId: "topic-fdp",
    summaryMarkdown:
      "Fractions, Decimals & Percentages (FDP) appear on all three papers and bridge directly into Ratio, Probability, and Finance. Mastering common denominators, multipliers for percentage change, and reverse percentages is one of the fastest ways to gain 10–15 marks.",
    keyRules: [
      "Adding & Subtracting Fractions: You MUST find a common denominator first. Never add denominators together.",
      "Multiplying & Dividing Fractions: Multiply numerators together and denominators together. For division, Keep the first fraction, Flip the second (reciprocal), and Multiply (KFC).",
      "Percentage Multipliers: On a calculator paper, use decimal multipliers: a 15% increase uses × 1.15; a 15% decrease uses × 0.85.",
      "Reverse Percentages: When given the price AFTER a percentage change, divide by the multiplier (Original = New Value ÷ Multiplier). Never calculate the percentage of the new value!",
    ],
    formulae: [
      {
        label: "Percentage Change",
        expression: "\\text{Percentage Change} = \\frac{\\text{Change}}{\\text{Original}} \\times 100",
        note: "Always divide by the ORIGINAL value, not the new value.",
      },
      {
        label: "Compound Interest",
        expression: "\\text{Final Value} = \\text{Principal} \\times \\left(1 + \\frac{r}{100}\\right)^n",
      },
    ],
    workedExamples: [
      {
        title: "Adding Fractions with Different Denominators",
        questionText: "Work out 2/5 + 1/4. Give your answer as a fraction in its simplest form.",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 2,
        steps: [
          {
            markCode: "M1",
            working: "8/20 + 5/20",
            explanation: "Convert both fractions to a common denominator of 20 (5 × 4 = 20).",
          },
          {
            markCode: "A1",
            working: "13/20",
            explanation: "Add the numerators (8 + 5 = 13) and keep the denominator as 20.",
          },
        ],
        finalAnswer: "13/20",
      },
      {
        title: "Reverse Percentage Problem",
        questionText: "In a 20% off sale, a jacket costs £64. Work out the normal price of the jacket before the sale.",
        calculatorPolicy: "CALCULATOR_ALLOWED",
        marks: 3,
        steps: [
          {
            markCode: "M1",
            working: "100% - 20% = 80% (or multiplier = 0.80)",
            explanation: "Recognise that £64 represents 80% of the original price.",
          },
          {
            markCode: "M1",
            working: "64 ÷ 0.80 (or 1% = 64 ÷ 80 = 0.80)",
            explanation: "Divide the sale price by 0.80 (or find 1% and multiply by 100).",
          },
          {
            markCode: "A1",
            working: "£80",
            explanation: "State the original price clearly as £80.",
          },
        ],
        finalAnswer: "80",
      },
    ],
    commonMistakes: [
      {
        trap: "Adding numerators and denominators directly: 2/5 + 1/4 = 3/9.",
        correction: "Always rewrite over a common denominator first (8/20 + 5/20 = 13/20).Simply finding the common denominator earns M1!",
      },
      {
        trap: "Finding 20% of £64 (£12.80) and adding it on in a reverse percentage question.",
        correction: "20% was taken off the ORIGINAL price, not £64. Divide £64 by 0.80 to get £80.",
      },
    ],
  },
  {
    id: "lr-topic-ratio",
    topicId: "topic-ratio",
    summaryMarkdown:
      "Ratio and Proportion accounts for 20% of the Edexcel Foundation paper. Many Grade 4 boundary questions combine Ratio with Fractions or Percentages, or test Compound Measures (Speed, Distance, Time and Density, Mass, Volume).",
    keyRules: [
      "Sharing in a Ratio (Total Given): Add the ratio parts, divide the total amount by the sum of parts to find the value of 1 part (earns M1), then multiply by each ratio number.",
      "Ratio When Given Difference or One Part: Read carefully! If told 'Alice gets £18 more than Ben' in ratio 5 : 2, the difference is 5 - 2 = 3 parts. So 1 part = £18 ÷ 3 = £6.",
      "Unitary Method for Direct Proportion: Find the cost or weight of 1 item first, then multiply by the required number of items.",
      "Compound Measures: Check that units match before dividing (e.g., convert 30 minutes to 0.5 hours before calculating speed in mph).",
    ],
    formulae: [
      {
        label: "Speed, Distance, Time",
        expression: "\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}",
        note: "30 minutes = 0.5 hours (NOT 0.3 hours!). 15 minutes = 0.25 hours.",
      },
      {
        label: "Density, Mass, Volume",
        expression: "\\text{Density} = \\frac{\\text{Mass}}{\\text{Volume}}",
      },
    ],
    workedExamples: [
      {
        title: "Sharing an Amount in a Given Ratio",
        questionText: "Share £140 in the ratio 3 : 4. Work out the larger share.",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 2,
        steps: [
          {
            markCode: "M1",
            working: "3 + 4 = 7 parts;  140 ÷ 7 = £20 per part",
            explanation: "Find the total number of parts (7) and divide £140 by 7 to find 1 part.",
          },
          {
            markCode: "A1",
            working: "4 × £20 = £80",
            explanation: "Multiply the value of 1 part (£20) by 4 to find the larger share.",
          },
        ],
        finalAnswer: "80",
      },
    ],
    commonMistakes: [
      {
        trap: "Entering 1 hour 30 minutes into a calculator as 1.3 hours.",
        correction: "There are 60 minutes in an hour, so 30 minutes = 30/60 = 0.5 hours. Use 1.5 hours.",
      },
      {
        trap: "Always adding ratio parts even when the question gives the difference between two shares.",
        correction: "Underline whether the number in the question is the TOTAL, ONE SHARE, or the DIFFERENCE.",
      },
    ],
  },
  {
    id: "lr-topic-alg",
    topicId: "topic-alg",
    summaryMarkdown:
      "Algebra makes up 17% of Foundation Maths and is essential for securing Grade 4 and Grade 5 marks. Focus on collecting like terms, expanding & factorising brackets, solving two-step linear equations, and finding the nth term of arithmetic sequences.",
    keyRules: [
      "Collecting Like Terms: Only combine terms with the exact same letter AND power (e.g., $3x$ and $5x$ combine to $8x$, but $x^2$ and $x$ stay separate). The sign in front of a term belongs to that term.",
      "Expanding Brackets: Multiply the term outside the bracket by EVERY term inside the bracket: $3(2x - 5) = 6x - 15$.",
      "Solving Linear Equations: Perform the inverse operation equally to both sides of the equation to isolate $x$.",
      "Arithmetic Sequences (nth term): Find the common difference $d$ between terms, write $dn$, and adjust by comparing with the 0th term (the term before the 1st term).",
    ],
    formulae: [
      {
        label: "Straight Line Equation",
        expression: "y = mx + c",
        note: "m is the gradient (steepness: rise ÷ run) and c is the y-intercept.",
      },
      {
        label: "Difference of Two Squares",
        expression: "x^2 - a^2 = (x + a)(x - a)",
      },
    ],
    workedExamples: [
      {
        title: "Solving a Linear Equation with Unknowns on Both Sides",
        questionText: "Solve 5x - 3 = 2x + 12",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 3,
        steps: [
          {
            markCode: "M1",
            working: "3x - 3 = 12",
            explanation: "Subtract 2x from both sides to collect the x terms on the left.",
          },
          {
            markCode: "M1",
            working: "3x = 15",
            explanation: "Add 3 to both sides to isolate the 3x term.",
          },
          {
            markCode: "A1",
            working: "x = 5",
            explanation: "Divide both sides by 3 to find x = 5.",
          },
        ],
        finalAnswer: "5",
      },
    ],
    commonMistakes: [
      {
        trap: "Multiplying only the first term when expanding brackets: 4(x + 3) = 4x + 3.",
        correction: "Multiply BOTH terms inside the bracket by 4: 4(x + 3) = 4x + 12.",
      },
      {
        trap: "Sign errors when moving terms across the equals sign.",
        correction: "Write the inverse operation (+3 or -2x) underneath both sides of the equation on every line.",
      },
    ],
  },
  {
    id: "lr-topic-geom",
    topicId: "topic-geom",
    summaryMarkdown:
      "Geometry & Measures tests visual reasoning, angle rules, mensuration (area, perimeter, volume), and Pythagoras' Theorem. Showing clear working steps on geometry problems reliably earns M1 marks even if a final rounding slip occurs.",
    keyRules: [
      "Core Angle Facts: Angles on a straight line add to $180^\\circ$; angles around a point add to $360^\\circ$; angles in a triangle add to $180^\\circ$; vertically opposite angles are equal.",
      "Angles on Parallel Lines: Alternate angles ('Z' angles) are equal; Corresponding angles ('F' angles) are equal; Co-interior angles ('C' or 'U' angles) add up to $180^\\circ$.",
      "Polygons: Exterior angles of any polygon always add up to $360^\\circ$. For a regular $n$-sided polygon, each exterior angle is $360^\\circ \\div n$, and each interior angle is $180^\\circ - \\text{exterior angle}$.",
      "Pythagoras' Theorem: Use $a^2 + b^2 = c^2$ on right-angled triangles when you know two sides and want the third. Add squares to find the hypotenuse; subtract squares to find a shorter side.",
    ],
    formulae: [
      {
        label: "Pythagoras' Theorem",
        expression: "a^2 + b^2 = c^2",
        note: "c is always the hypotenuse (longest side, opposite the right angle).",
      },
      {
        label: "Area of a Trapezium",
        expression: "A = \\frac{1}{2}(a + b)h",
      },
      {
        label: "Area & Circumference of a Circle",
        expression: "A = \\pi r^2 \\quad | \\quad C = \\pi d",
      },
    ],
    workedExamples: [
      {
        title: "Using Pythagoras' Theorem to Find the Hypotenuse",
        questionText: "A right-angled triangle has base 6 cm and perpendicular height 8 cm. Calculate the length of the hypotenuse.",
        calculatorPolicy: "CALCULATOR_ALLOWED",
        marks: 3,
        steps: [
          {
            markCode: "M1",
            working: "6² + 8² = 36 + 64 = 100",
            explanation: "Square both shorter sides and add them together.",
          },
          {
            markCode: "M1",
            working: "c = √100",
            explanation: "Take the square root of the sum of the squares.",
          },
          {
            markCode: "A1",
            working: "10 cm",
            explanation: "Evaluate √100 = 10.",
          },
        ],
        finalAnswer: "10",
      },
    ],
    commonMistakes: [
      {
        trap: "Using the diameter instead of the radius in Area = πr².",
        correction: "Always halve the diameter first to write down r = ... before using Circle Area.",
      },
      {
        trap: "Forgetting to take the square root at the end of Pythagoras' Theorem (leaving answer as 100).",
        correction: "Check if your answer looks sensible compared to the other two sides of the triangle!",
      },
    ],
  },
  {
    id: "lr-topic-stat",
    topicId: "topic-stat",
    summaryMarkdown:
      "Statistics & Probability provides high-scoring, structured marks on Foundation papers. Questions frequently feature Venn diagrams, two-way tables, frequency tables, and combined probability.",
    keyRules: [
      "The Four Averages & Spread: Mode = most common; Median = middle value WHEN ORDERED; Mean = Total ÷ Count; Range = Highest − Lowest (measures spread, not average).",
      "Probability Scale: All probabilities lie between $0$ and $1$ (written as fractions, decimals, or percentages — NEVER as a ratio like $1:4$). Mutually exclusive outcomes add up to $1$.",
      "Venn Diagrams: Start by filling in the intersection overlap ($A \\cap B$) first! Subtract the overlap from the group totals to find the 'only A' and 'only B' regions, and ensure all regions sum to the universal set $\\xi$.",
    ],
    formulae: [
      {
        label: "Complementary Probability",
        expression: "P(\\text{not } A) = 1 - P(A)",
      },
      {
        label: "Expected Frequency",
        expression: "\\text{Expected Outcomes} = \\text{Probability} \\times \\text{Number of Trials}",
      },
    ],
    workedExamples: [
      {
        title: "Completing & Using a Venn Diagram",
        questionText: "In a class of 30 students, 18 study French, 15 study Spanish, and 7 study both French and Spanish. Find the probability that a randomly chosen student studies ONLY French.",
        calculatorPolicy: "NON_CALCULATOR",
        marks: 3,
        steps: [
          {
            markCode: "M1",
            working: "Only French = 18 - 7 = 11",
            explanation: "Subtract the 7 students who study both from the 18 who study French.",
          },
          {
            markCode: "A1",
            working: "11/30",
            explanation: "Write the probability as a fraction out of the total 30 students.",
          },
        ],
        finalAnswer: "11/30",
      },
    ],
    commonMistakes: [
      {
        trap: "Forgetting to subtract the overlap when filling in a Venn diagram.",
        correction: "If 18 study French and 7 study both, put 7 in the middle and 18 - 7 = 11 in 'French only'.",
      },
      {
        trap: "Finding the median without putting the numbers in ascending order first.",
        correction: "Always rewrite the list from smallest to largest and tick off values from each end.",
      },
    ],
  },
];
