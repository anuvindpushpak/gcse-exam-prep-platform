"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CheckoutModal } from "@/components/commerce/CheckoutModal";
import { TopNavBar } from "@/components/layout/TopNavBar";
import {
  AssessmentAttempt,
  AssessmentTemplate,
  ContentLifecycleStatus,
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
  entitlements: StudentEntitlementState;
  intelligenceProfile?: StudentIntelligenceProfile;
  openCheckout: (productId?: string) => void;
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
  purchaseProduct: (productId: string, buyerEmail?: string) => Promise<void>;
  generateAiDraft: (params: {
    topicId: string;
    calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
    targetGrade: number;
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
    entitlements: StudentEntitlementState;
    intelligenceProfile?: StudentIntelligenceProfile;
  }>({
    users: [],
    specifications: [],
    topics: [],
    learningResources: [],
    questions: [],
    assessmentTemplates: [],
    attempts: [],
    products: [],
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
    if (res.ok) {
      setData(json);
    }
    return json;
  };

  const openCheckout = (productId = "prod-gcse-maths-grade4-pack") => {
    setCheckoutProductId(productId);
    setCheckoutOpen(true);
  };

  const switchUser = async (userId: string, selectedBoard?: ExamBoardCode) => {
    await postAction({ action: "SWITCH_USER", userId, selectedBoard });
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

  const purchaseProduct = async (productId: string, buyerEmail?: string) => {
    await postAction({
      action: "PURCHASE_PRODUCT",
      productId,
      buyerEmail,
    });
  };

  const generateAiDraft = async (params: {
    topicId: string;
    calculatorPolicy: "NON_CALCULATOR" | "CALCULATOR_ALLOWED";
    targetGrade: number;
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
  };

  return (
    <PlatformContext.Provider
      value={{
        loading,
        ...data,
        openCheckout,
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
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <TopNavBar
          activeUser={data.activeUser}
          users={data.users}
          entitlements={data.entitlements}
          onSwitchUser={switchUser}
          onOpenCheckout={() => openCheckout("prod-gcse-maths-grade4-pack")}
          onResetDemo={resetDemo}
        />
        <main className="flex-1">{children}</main>
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          products={data.products}
          initialProductId={checkoutProductId}
          studentName={
            data.targetStudent
              ? `${data.targetStudent.firstName} ${data.targetStudent.lastName || ""}`
              : "Leo Carter"
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

