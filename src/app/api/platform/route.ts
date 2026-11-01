import { NextRequest, NextResponse } from "next/server";
import {
  generateValidatedAiQuestionDraft,
  getStudentEntitlements,
  readDb,
  recordProductPurchase,
  resetDemoDatabase,
  submitAndGradeAssessment,
  switchActiveUser,
  updateQuestionLifecycleStatus,
} from "@/lib/db/store";
import { buildStudentIntelligenceProfile } from "@/lib/engine/intelligence";
import { ContentLifecycleStatus, ExamBoardCode } from "@/types/platform";

function buildFullPayload() {
  const db = readDb();
  const activeUser =
    db.users.find((u) => u.id === db.activeUserId) || db.users[0];

  const targetStudentId =
    activeUser.role === "STUDENT"
      ? activeUser.id
      : activeUser.linkedStudentIds?.[0] || "user-student-leo";

  const entitlements = getStudentEntitlements(db, targetStudentId);
  const publishedQuestions = db.questions.filter(
    (q) => q.lifecycleStatus === "PUBLISHED"
  );

  const intelligenceProfile = buildStudentIntelligenceProfile(
    targetStudentId,
    db.topics,
    publishedQuestions,
    db.attempts,
    entitlements
  );

  return {
    activeUser,
    targetStudent: db.users.find((u) => u.id === targetStudentId),
    users: db.users,
    specifications: db.specifications,
    topics: db.topics,
    learningResources: db.learningResources,
    questions: db.questions,
    assessmentTemplates: db.assessmentTemplates,
    attempts: db.attempts.filter((a) => a.studentId === targetStudentId),
    products: db.products,
    entitlements,
    intelligenceProfile,
  };
}

export async function GET() {
  return NextResponse.json(buildFullPayload());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case "SWITCH_USER": {
        switchActiveUser(
          body.userId,
          body.selectedBoard as ExamBoardCode | undefined
        );
        return NextResponse.json(buildFullPayload());
      }

      case "SUBMIT_ASSESSMENT": {
        const attempt = submitAndGradeAssessment({
          studentId: body.studentId || "user-student-leo",
          templateId: body.templateId,
          timeSpentSeconds: body.timeSpentSeconds || 420,
          rawResponses: body.responses || {},
        });
        return NextResponse.json({
          ...buildFullPayload(),
          latestSubmittedAttempt: attempt,
        });
      }

      case "SIMULATE_DIAGNOSTIC": {
        // Creates a realistic baseline diagnostic attempt where Leo scores 48% (Grade 3 Borderline): strong in Number & Statistics, weak in FDP, Ratio & Algebra (with partial M1 method marks earned!)
        const simulatedResponses = {
          "q-num-1": { studentFinalAnswer: "-4", studentSteps: { "q-num-1-s1": "8" } }, // 2/2
          "q-num-2": { studentFinalAnswer: "90", studentSteps: { "q-num-2-s1": "2*3*3" } }, // 3/3
          "q-fdp-1": { studentFinalAnswer: "1/-1", studentSteps: {} }, // 0/2 (Misconception: subtracted denominators)
          "q-fdp-2": {
            studentFinalAnswer: "586.5",
            studentSteps: { "q-fdp-2-s1": "0.85" },
          }, // 0/3 (Misconception: reverse percentage taken of sale price)
          "q-rat-1": {
            studentFinalAnswer: "80",
            studentSteps: { "q-rat-1-s1": "20" },
          }, // 1/2 (M1 A0: found 1 part = 20, gave Ben's share instead of Chloe's)
          "q-rat-3": {
            studentFinalAnswer: "54.4",
            studentSteps: {},
          }, // 0/3 (Misconception: 2h 15m entered as 2.15)
          "q-alg-1": {
            studentFinalAnswer: "10x + 20",
            studentSteps: { "q-alg-1-s1": "8x + 12" },
          }, // 1/2 (M1 A0: sign error on second bracket)
          "q-alg-2": {
            studentFinalAnswer: "3",
            studentSteps: { "q-alg-2-s1": "4x - 4 = 16" },
          }, // 1/3 (M1 A0: subtracted 4 instead of adding)
          "q-geom-1": {
            studentFinalAnswer: "169",
            studentSteps: { "q-geom-1-s1": "169" },
          }, // 1/3 (M1 A0: forgot square root in Pythagoras)
          "q-geom-2": {
            studentFinalAnswer: "65",
            studentSteps: {},
          }, // 2/2
          "q-stat-1": {
            studentFinalAnswer: "18/30",
            studentSteps: { "q-stat-1-s1": "18/30" },
          }, // 1/2 (M1 A0: unsimplified fraction)
          "q-stat-2": {
            studentFinalAnswer: "5",
            studentSteps: {},
          }, // 2/2
        };

        const attempt = submitAndGradeAssessment({
          studentId: body.studentId || "user-student-leo",
          templateId: "diag-edexcel-foundation",
          timeSpentSeconds: 940,
          rawResponses: simulatedResponses,
        });

        return NextResponse.json({
          ...buildFullPayload(),
          latestSubmittedAttempt: attempt,
        });
      }

      case "PURCHASE_PRODUCT": {
        const db = readDb();
        const activeUser =
          db.users.find((u) => u.id === db.activeUserId) || db.users[0];
        const beneficiaryStudentId =
          body.beneficiaryStudentId ||
          (activeUser.role === "STUDENT"
            ? activeUser.id
            : activeUser.linkedStudentIds?.[0] || "user-student-leo");

        const purchase = recordProductPurchase({
          buyerUserId: activeUser.id,
          buyerEmail: body.buyerEmail || activeUser.email,
          beneficiaryStudentId,
          productId: body.productId,
        });

        return NextResponse.json({
          ...buildFullPayload(),
          latestPurchase: purchase,
        });
      }

      case "GENERATE_AI_DRAFT": {
        const draft = generateValidatedAiQuestionDraft({
          topicId: body.topicId || "topic-ratio",
          calculatorPolicy: body.calculatorPolicy || "NON_CALCULATOR",
          targetGrade: Number(body.targetGrade || 4),
        });
        return NextResponse.json({
          ...buildFullPayload(),
          latestDraft: draft,
        });
      }

      case "UPDATE_QUESTION_STATUS": {
        updateQuestionLifecycleStatus(
          body.questionId,
          body.status as ContentLifecycleStatus
        );
        return NextResponse.json(buildFullPayload());
      }

      case "RESET_DEMO": {
        resetDemoDatabase();
        return NextResponse.json(buildFullPayload());
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
