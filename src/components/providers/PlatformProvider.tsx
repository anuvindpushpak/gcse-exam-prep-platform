"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "@/components/auth/AuthModal";
import { CheckoutModal } from "@/components/commerce/CheckoutModal";
import { Footer } from "@/components/layout/Footer";
import { TopNavBar } from "@/components/layout/TopNavBar";
import {
  AssessmentAttempt,
  AssessmentTemplate,
  ContactEnquiryRecord,
  ContentLifecycleStatus,
  CouponRule,
  ExamBoardCode,
  ExamBoardSpecification,
  LearningResource,
  ProductCatalogItem,
  QuestionItem,
  StudentEntitlementState,
  StudentIntelligenceProfile,
  TopicDefinition,
  UserAccount,
} from "@/types/platform";

export interface PlatformContextValue {
  loading: boolean;
  isAuthenticated: boolean;
  activeUser?: UserAccount;
  targetStudent?: UserAccount;
  users: UserAccount[];
  specifications: ExamBoardSpecification[];
  topics: TopicDefinition[];
  learningResources: LearningResource[];
  questions: QuestionItem[];
  assessmentTemplates: AssessmentTemplate[];
  attempts: AssessmentAttempt[];
  products: ProductCatalogItem[];
  coupons: CouponRule[];
  enquiries: ContactEnquiryRecord[];
  entitlements: StudentEntitlementState;
  intelligenceProfile?: StudentIntelligenceProfile;
  integrationStatus?: {
    stripeLive: boolean;
    emailLive: boolean;
    persistentStoragePath: boolean;
  };
  openCheckout: (productId?: string) => void;
  openAuth: (mode?: "SIGN_IN" | "SIGN_UP") => void;
  authenticateUser: (params: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PARENT" | "ADMIN";
    selectedBoard?: ExamBoardCode;
    linkedStudentQuery?: string;
    skipRedirect?: boolean;
  }) => Promise<void>;
  requestEmailCode: (email: string) => Promise<{
    email: string;
    demoPreviewCode?: string;
    sentLiveEmail?: boolean;
    isExistingUser: boolean;
  }>;
  verifyEmailCode: (params: {
    email: string;
    code: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PARENT" | "ADMIN";
    selectedBoard?: ExamBoardCode;
    linkedStudentQuery?: string;
  }) => Promise<void>;
  linkStudent: (studentEmailOrInviteCode: string) => Promise<UserAccount>;
  createCoupon: (params: {
    code: string;
    discountPercent: number;
    description?: string;
  }) => Promise<CouponRule>;
  submitContactEnquiry: (params: {
    fullName: string;
    email: string;
    role: string;
    message: string;
  }) => Promise<ContactEnquiryRecord>;
  signOut: () => Promise<void>;
  switchUser: (userId: string, selectedBoard?: ExamBoardCode) => Promise<void>;
  simulateDiagnostic: () => Promise<AssessmentAttempt | undefined>;
  submitAssessment: (params: {
    templateId: string;
    timeSpentSeconds: number;
    responses: Record<
      string,
      {
        studentFinalAnswer: string;
        studentSteps?: Record<string, string>;
        isFlagged?: boolean;
        timeSpentSeconds?: number;
      }
    >;
  }) => Promise<AssessmentAttempt | undefined>;
  purchaseProduct: (
    productId: string,
    buyerEmail?: string,
    studentFirstName?: string,
    studentLastName?: string,
    couponCode?: string
  ) => Promise<void>;
  generateAiDraft: (params: {
    topicId: string;
    calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
    targetGrade: number;
    autoPublishForPractice?: boolean;
  }) => Promise<QuestionItem | undefined>;
  updateQuestionStatus: (
    questionId: string,
    status: ContentLifecycleStatus
  ) => Promise<void>;
  resetDemo: () => Promise<void>;
  refresh: () => Promise<void>;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    activeUser?: UserAccount;
    targetStudent?: UserAccount;
    users: UserAccount[];
    specifications: ExamBoardSpecification[];
    topics: TopicDefinition[];
    learningResources: LearningResource[];
    questions: QuestionItem[];
    assessmentTemplates: AssessmentTemplate[];
    attempts: AssessmentAttempt[];
    products: ProductCatalogItem[];
    coupons: CouponRule[];
    enquiries: ContactEnquiryRecord[];
    entitlements: StudentEntitlementState;
    intelligenceProfile?: StudentIntelligenceProfile;
    integrationStatus?: {
      stripeLive: boolean;
      emailLive: boolean;
      persistentStoragePath: boolean;
    };
  }>({
    users: [],
    specifications: [],
    topics: [],
    learningResources: [],
    questions: [],
    assessmentTemplates: [],
    attempts: [],
    products: [],
    coupons: [],
    enquiries: [],
    entitlements: {
      hasFreeDiagnostic: true,
      hasFullPack: false,
      hasWeeklyMembership: false,
      purchasedProducts: [],
    },
  });

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutProductId, setCheckoutProductId] = useState<string>(
    "prod-gcse-maths-grade4-pack"
  );
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"SIGN_IN" | "SIGN_UP">("SIGN_IN");

  const fetchState = async () => {
    try {
      const res = await fetch("/api/platform", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const postAction = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json?.error || "Request failed");
    }
    setData(json);
    return json;
  };

  const openCheckout = (productId = "prod-gcse-maths-grade4-pack") => {
    setCheckoutProductId(productId);
    setCheckoutOpen(true);
  };

  const openAuth = (mode: "SIGN_IN" | "SIGN_UP" = "SIGN_IN") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const authenticateUser = async (params: {
    email: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PARENT" | "ADMIN";
    selectedBoard?: ExamBoardCode;
    linkedStudentQuery?: string;
    skipRedirect?: boolean;
  }) => {
    const json = await postAction({
      action: "SIGN_IN_OR_REGISTER",
      ...params,
    });
    if (!params.skipRedirect && json?.activeUser) {
      const role = json.activeUser.role;
      if (role === "PARENT") router.push("/parent");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    }
  };

  const requestEmailCode = async (email: string) => {
    const json = await postAction({
      action: "REQUEST_EMAIL_CODE",
      email,
    });
    return json.emailVerificationChallenge as {
      email: string;
      demoPreviewCode?: string;
      sentLiveEmail?: boolean;
      isExistingUser: boolean;
    };
  };

  const verifyEmailCode = async (params: {
    email: string;
    code: string;
    firstName?: string;
    lastName?: string;
    role?: "STUDENT" | "PARENT" | "ADMIN";
    selectedBoard?: ExamBoardCode;
    linkedStudentQuery?: string;
  }) => {
    const json = await postAction({
      action: "VERIFY_EMAIL_CODE",
      ...params,
    });
    if (json?.activeUser) {
      const role = json.activeUser.role;
      if (role === "PARENT") router.push("/parent");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    }
  };

  const linkStudent = async (studentEmailOrInviteCode: string) => {
    const json = await postAction({
      action: "LINK_STUDENT",
      studentEmailOrInviteCode,
    });
    return json.linkedStudent as UserAccount;
  };

  const createCoupon = async (params: {
    code: string;
    discountPercent: number;
    description?: string;
  }) => {
    const json = await postAction({
      action: "CREATE_COUPON",
      ...params,
    });
    return json.latestCoupon as CouponRule;
  };

  const submitContactEnquiry = async (params: {
    fullName: string;
    email: string;
    role: string;
    message: string;
  }) => {
    const json = await postAction({
      action: "SUBMIT_CONTACT_ENQUIRY",
      ...params,
    });
    return json.latestEnquiry as ContactEnquiryRecord;
  };

  const signOut = async () => {
    await postAction({ action: "SIGN_OUT" });
    router.push("/");
  };

  const switchUser = async (userId: string, selectedBoard?: ExamBoardCode) => {
    const json = await postAction({
      action: "SWITCH_USER",
      userId,
      selectedBoard,
    });
    if (!selectedBoard && json?.activeUser) {
      const role = json.activeUser.role;
      if (role === "PARENT") router.push("/parent");
      else if (role === "ADMIN") router.push("/admin");
      else router.push("/dashboard");
    }
  };

  const simulateDiagnostic = async () => {
    const json = await postAction({ action: "SIMULATE_DIAGNOSTIC" });
    return json.latestSubmittedAttempt as AssessmentAttempt | undefined;
  };

  const submitAssessment = async (params: {
    templateId: string;
    timeSpentSeconds: number;
    responses: Record<
      string,
      {
        studentFinalAnswer: string;
        studentSteps?: Record<string, string>;
        isFlagged?: boolean;
        timeSpentSeconds?: number;
      }
    >;
  }) => {
    const json = await postAction({
      action: "SUBMIT_ASSESSMENT",
      ...params,
    });
    return json.latestSubmittedAttempt as AssessmentAttempt | undefined;
  };

  const purchaseProduct = async (
    productId: string,
    buyerEmail?: string,
    studentFirstName?: string,
    studentLastName?: string,
    couponCode?: string
  ) => {
    const json = await postAction({
      action: "PURCHASE_PRODUCT",
      productId,
      buyerEmail,
      studentFirstName,
      studentLastName,
      couponCode,
    });
    if (json?.stripeCheckoutUrl && typeof window !== "undefined") {
      window.location.href = json.stripeCheckoutUrl;
      return;
    }
    router.push("/dashboard");
  };

  const generateAiDraft = async (params: {
    topicId: string;
    calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
    targetGrade: number;
    autoPublishForPractice?: boolean;
  }) => {
    const json = await postAction({
      action: "GENERATE_AI_DRAFT",
      ...params,
    });
    return json.latestDraft as QuestionItem | undefined;
  };

  const updateQuestionStatus = async (
    questionId: string,
    status: ContentLifecycleStatus
  ) => {
    await postAction({
      action: "UPDATE_QUESTION_STATUS",
      questionId,
      status,
    });
  };

  const resetDemo = async () => {
    await postAction({ action: "RESET_DEMO" });
    router.push("/");
  };

  const isAuthenticated = Boolean(data.activeUser);

  return (
    <PlatformContext.Provider
      value={{
        loading,
        isAuthenticated,
        ...data,
        openCheckout,
        openAuth,
        authenticateUser,
        requestEmailCode,
        verifyEmailCode,
        linkStudent,
        createCoupon,
        submitContactEnquiry,
        signOut,
        switchUser,
        simulateDiagnostic,
        submitAssessment,
        purchaseProduct,
        generateAiDraft,
        updateQuestionStatus,
        resetDemo,
        refresh: fetchState,
      }}
    >
      <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#141413]">
        <TopNavBar
          activeUser={data.activeUser}
          users={data.users}
          entitlements={data.entitlements}
          onSwitchUser={switchUser}
          onSignOut={signOut}
          onOpenAuth={openAuth}
          onOpenCheckout={() => openCheckout("prod-gcse-maths-grade4-pack")}
          onResetDemo={resetDemo}
        />
        <main className="flex-1">{children}</main>
        <Footer />
        <AuthModal
          isOpen={authOpen}
          initialMode={authMode}
          onClose={() => setAuthOpen(false)}
          demoUsers={data.users}
          onQuickSwitchUser={async (userId) => {
            await switchUser(userId);
          }}
          onRequestEmailCode={requestEmailCode}
          onVerifyEmailCode={verifyEmailCode}
        />
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          products={data.products}
          coupons={data.coupons}
          initialProductId={checkoutProductId}
          isAuthenticated={isAuthenticated}
          studentName={
            data.activeUser
              ? `${data.activeUser.firstName} ${data.activeUser.lastName || ""}`.trim()
              : "Student"
          }
          parentInviteCode={data.targetStudent?.parentInviteCode}
          hasFullPack={data.entitlements.hasFullPack}
          hasWeeklyMembership={data.entitlements.hasWeeklyMembership}
          onPurchaseSuccess={purchaseProduct}
        />
      </div>
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) {
    throw new Error("usePlatform must be used within a PlatformProvider");
  }
  return ctx;
}
