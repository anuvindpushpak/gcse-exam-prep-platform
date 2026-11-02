import { NextRequest, NextResponse } from "next/server";
import {
  createOrUpdateCoupon,
  generateValidatedAiQuestionDraft,
  getStudentEntitlements,
  linkStudentToParent,
  readDb,
  recordProductPurchase,
  requestEmailVerificationCode,
  resetDemoDatabase,
  signInOrRegisterUser,
  signOutUser,
  submitAndGradeAssessment,
  switchActiveUser,
  updateQuestionLifecycleStatus,
  validateCouponCode,
  verifyEmailConfirmationCode,
} from "@/lib/db/store";
import { buildStudentIntelligenceProfile } from "@/lib/engine/intelligence";
import {
  ContentLifecycleStatus,
  ExamBoardCode,
  StudentEntitlementState,
} from "@/types/platform";

const SESSION_COOKIE_NAME = "examora_uid";

function resolveSessionUserId(req?: NextRequest, explicitUserId?: string): string {
  const db = readDb();
  if (explicitUserId !== undefined) {
    return explicitUserId;
  }
  const cookieVal = req?.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookieVal === "VISITOR") {
    return "";
  }
  if (cookieVal && db.users.some((u) => u.id === cookieVal)) {
    return cookieVal;
  }
  return db.activeUserId || "";
}

function buildFullPayload(sessionUserId: string) {
  const db = readDb();
  const activeUser = sessionUserId
    ? db.users.find((u) => u.id === sessionUserId)
    : undefined;

  const targetStudentId = activeUser
    ? activeUser.role === "STUDENT"
      ? activeUser.id
      : activeUser.linkedStudentIds?.[0] || "user-student-leo"
    : "user-student-leo";

  // Non-logged-in visitors never get access to paid product entitlements
  const entitlements: StudentEntitlementState = activeUser
    ? getStudentEntitlements(db, targetStudentId)
    : {
        hasFreeDiagnostic: true,
        hasFullPack: false,
        hasWeeklyMembership: false,
        purchasedProducts: [],
      };

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
    coupons: db.coupons,
    entitlements,
    intelligenceProfile,
  };
}

function jsonWithSessionCookie(
  payload: Record<string, unknown>,
  sessionCookieVal?: string
) {
  const res = NextResponse.json(payload);
  if (sessionCookieVal !== undefined) {
    res.cookies.set(SESSION_COOKIE_NAME, sessionCookieVal, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return res;
}

export async function GET(req: NextRequest) {
  const sessionUserId = resolveSessionUserId(req);
  return NextResponse.json(buildFullPayload(sessionUserId));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    const currentSessionUserId = resolveSessionUserId(req);

    switch (action) {
      case "SWITCH_USER": {
        const switched = switchActiveUser(
          body.userId,
          body.selectedBoard as ExamBoardCode | undefined
        );
        const newUid = switched?.id || "";
        return jsonWithSessionCookie(
          buildFullPayload(newUid),
          newUid || "VISITOR"
        );
      }

      case "SIGN_OUT": {
        signOutUser();
        return jsonWithSessionCookie(buildFullPayload(""), "VISITOR");
      }

      case "REQUEST_EMAIL_CODE": {
        const result = requestEmailVerificationCode(body.email || "");
        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId),
          emailVerificationChallenge: {
            email: result.email,
            demoPreviewCode: result.code,
            isExistingUser: Boolean(result.existingUser),
          },
        });
      }

      case "VERIFY_EMAIL_CODE": {
        const isValid = verifyEmailConfirmationCode(body.email || "", body.code);
        if (!isValid) {
          return NextResponse.json(
            {
              error:
                "Invalid or expired confirmation code. Please check the 6-digit code and try again.",
            },
            { status: 400 }
          );
        }
        const user = signInOrRegisterUser({
          email: body.email || "student@demo.uk",
          firstName: body.firstName,
          lastName: body.lastName,
          role: body.role,
          selectedBoard: body.selectedBoard,
          linkedStudentQuery: body.linkedStudentQuery,
        });
        return jsonWithSessionCookie(buildFullPayload(user.id), user.id);
      }

      case "SIGN_IN_OR_REGISTER": {
        const user = signInOrRegisterUser({
          email: body.email || "student@demo.uk",
          firstName: body.firstName,
          lastName: body.lastName,
          role: body.role,
          selectedBoard: body.selectedBoard,
          linkedStudentQuery: body.linkedStudentQuery,
        });
        return jsonWithSessionCookie(buildFullPayload(user.id), user.id);
      }

      case "LINK_STUDENT": {
        const db = readDb();
        const activeUser = currentSessionUserId
          ? db.users.find((u) => u.id === currentSessionUserId)
          : undefined;
        const parentId = body.parentUserId || activeUser?.id;
        if (!parentId) {
          return NextResponse.json(
            { error: "Please sign in as a Parent/Guardian first." },
            { status: 400 }
          );
        }
        const linkedStudent = linkStudentToParent({
          parentUserId: parentId,
          studentEmailOrInviteCode: body.studentEmailOrInviteCode || "",
        });
        return NextResponse.json({
          ...buildFullPayload(parentId),
          linkedStudent,
        });
      }

      case "VALIDATE_COUPON": {
        const coupon = validateCouponCode(body.couponCode);
        if (!coupon) {
          return NextResponse.json(
            {
              error: "Coupon code not recognised or inactive.",
              validCoupon: null,
            },
            { status: 404 }
          );
        }
        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId),
          validCoupon: coupon,
        });
      }

      case "CREATE_COUPON": {
        const coupon = createOrUpdateCoupon({
          code: body.code || "",
          discountPercent: Number(body.discountPercent || 100),
          description: body.description,
        });
        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId),
          latestCoupon: coupon,
        });
      }

      case "SUBMIT_ASSESSMENT": {
        const db = readDb();
        const activeUser = currentSessionUserId
          ? db.users.find((u) => u.id === currentSessionUserId)
          : undefined;
        const studentId =
          body.studentId ||
          (activeUser?.role === "STUDENT"
            ? activeUser.id
            : activeUser?.linkedStudentIds?.[0] || "user-student-leo");

        const attempt = submitAndGradeAssessment({
          studentId,
          templateId: body.templateId,
          timeSpentSeconds: body.timeSpentSeconds || 420,
          rawResponses: body.responses || {},
        });
        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId || studentId),
          latestSubmittedAttempt: attempt,
        });
      }

      case "SIMULATE_DIAGNOSTIC": {
        const db = readDb();
        const activeUser = currentSessionUserId
          ? db.users.find((u) => u.id === currentSessionUserId)
          : undefined;
        const targetId =
          body.studentId ||
          (activeUser?.role === "STUDENT"
            ? activeUser.id
            : activeUser?.linkedStudentIds?.[0] || "user-student-leo");

        const simulatedResponses = {
          "q-num-1": {
            studentFinalAnswer: "-4",
            studentSteps: { "q-num-1-s1": "8" },
          },
          "q-num-2": {
            studentFinalAnswer: "90",
            studentSteps: { "q-num-2-s1": "2*3*3" },
          },
          "q-fdp-1": { studentFinalAnswer: "1/-1", studentSteps: {} },
          "q-fdp-2": {
            studentFinalAnswer: "586.5",
            studentSteps: { "q-fdp-2-s1": "0.85" },
          },
          "q-rat-1": {
            studentFinalAnswer: "80",
            studentSteps: { "q-rat-1-s1": "20" },
          },
          "q-rat-3": {
            studentFinalAnswer: "54.4",
            studentSteps: {},
          },
          "q-alg-1": {
            studentFinalAnswer: "10x + 20",
            studentSteps: { "q-alg-1-s1": "8x + 12" },
          },
          "q-alg-2": {
            studentFinalAnswer: "3",
            studentSteps: { "q-alg-2-s1": "4x - 4 = 16" },
          },
          "q-geom-1": {
            studentFinalAnswer: "169",
            studentSteps: { "q-geom-1-s1": "169" },
          },
          "q-geom-2": {
            studentFinalAnswer: "65",
            studentSteps: {},
          },
          "q-stat-1": {
            studentFinalAnswer: "18/30",
            studentSteps: { "q-stat-1-s1": "18/30" },
          },
          "q-stat-2": {
            studentFinalAnswer: "5",
            studentSteps: {},
          },
        };

        const attempt = submitAndGradeAssessment({
          studentId: targetId,
          templateId: "diag-edexcel-foundation",
          timeSpentSeconds: 940,
          rawResponses: simulatedResponses,
        });

        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId),
          latestSubmittedAttempt: attempt,
        });
      }

      case "PURCHASE_PRODUCT": {
        let db = readDb();
        let activeUser = currentSessionUserId
          ? db.users.find((u) => u.id === currentSessionUserId)
          : undefined;

        // If visitor is not logged in when purchasing, sign them in or create their Student account automatically
        if (!activeUser) {
          activeUser = signInOrRegisterUser({
            email: body.buyerEmail || "student@demo.uk",
            firstName: body.studentFirstName || "Leo",
            lastName: body.studentLastName || "Carter",
            role: "STUDENT",
          });
          db = readDb();
        }

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
          couponCode: body.couponCode,
        });

        return jsonWithSessionCookie(
          {
            ...buildFullPayload(activeUser.id),
            latestPurchase: purchase,
          },
          activeUser.id
        );
      }

      case "GENERATE_AI_DRAFT": {
        const draft = generateValidatedAiQuestionDraft({
          topicId: body.topicId || "topic-ratio",
          calculatorPolicy: body.calculatorPolicy || "NON_CALCULATOR",
          targetGrade: Number(body.targetGrade || 4),
          autoPublishForPractice: Boolean(body.autoPublishForPractice),
        });
        return NextResponse.json({
          ...buildFullPayload(currentSessionUserId),
          latestDraft: draft,
        });
      }

      case "UPDATE_QUESTION_STATUS": {
        updateQuestionLifecycleStatus(
          body.questionId,
          body.status as ContentLifecycleStatus
        );
        return NextResponse.json(buildFullPayload(currentSessionUserId));
      }

      case "RESET_DEMO": {
        resetDemoDatabase();
        return jsonWithSessionCookie(buildFullPayload(""), "VISITOR");
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
