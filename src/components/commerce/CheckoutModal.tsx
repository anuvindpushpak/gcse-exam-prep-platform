"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { ProductCatalogItem } from "@/types/platform";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductCatalogItem[];
  initialProductId?: string;
  studentName: string;
  parentInviteCode?: string;
  hasFullPack: boolean;
  hasWeeklyMembership: boolean;
  onPurchaseSuccess: (productId: string, buyerEmail: string) => Promise<void>;
}

export function CheckoutModal({
  isOpen,
  onClose,
  products,
  initialProductId = "prod-gcse-maths-grade4-pack",
  studentName,
  parentInviteCode = "PARENT-LEO-2027",
  hasFullPack,
  hasWeeklyMembership,
  onPurchaseSuccess,
}: CheckoutModalProps) {
  const [selectedId, setSelectedId] = useState(initialProductId);
  const [buyerEmail, setBuyerEmail] = useState("parent@demo.uk");
  const [cardHolder, setCardHolder] = useState("Sarah Carter");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedParentLink, setCopiedParentLink] = useState(false);

  if (!isOpen) return null;

  const selectedProduct =
    products.find((p) => p.id === selectedId) || products[0];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await onPurchaseSuccess(selectedProduct.id, buyerEmail);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyParentLink = () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/parent?unlock=${selectedProduct.id}&invite=${parentInviteCode}`
        : `https://grade4maths.uk/parent?invite=${parentInviteCode}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setCopiedParentLink(true);
    setTimeout(() => setCopiedParentLink(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/45 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF9F5] border border-[#E8E4DB] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DB] px-7 py-5 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0F4C3A] text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="checkout-modal-title"
                className="font-serif text-lg font-semibold text-[#141413]"
              >
                Unlock GCSE Maths Grade 4 Preparation
              </h2>
              <p className="text-xs text-[#78756E]">
                Instant digital entitlement activation for {studentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#78756E] hover:bg-[#F3F1EA] hover:text-[#141413] transition-colors"
            aria-label="Close checkout modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-7">
          {/* Product Selection Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-widest text-[#78756E]">
              1. Select Preparation Edition
            </div>
            {products.map((prod) => {
              const isSelected = prod.id === selectedProduct.id;
              const isOwned =
                (prod.id === "prod-gcse-maths-grade4-pack" && hasFullPack) ||
                (prod.id === "prod-weekly-maths-membership" &&
                  hasWeeklyMembership);

              return (
                <div
                  key={prod.id}
                  onClick={() => setSelectedId(prod.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    isSelected
                      ? "border-[#0F4C3A] bg-white shadow-sm ring-1 ring-[#0F4C3A]"
                      : "border-[#E8E4DB] bg-white/70 hover:bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-base font-semibold text-[#141413]">
                          {prod.name}
                        </span>
                        {prod.badge && (
                          <span className="rounded-full bg-[#EDF3F0] px-2.5 py-0.5 text-[10px] font-semibold text-[#0F4C3A]">
                            {prod.badge}
                          </span>
                        )}
                        {isOwned && (
                          <span className="rounded-full bg-[#EDF3F0] px-2.5 py-0.5 text-[10px] font-semibold text-[#0F4C3A]">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#575550]">
                        {prod.tagline}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-serif text-xl font-semibold text-[#141413]">
                        {prod.priceFormatted}
                      </div>
                      <div className="text-[10px] text-[#78756E]">
                        {prod.type === "ONE_TIME_PACK"
                          ? "One-time"
                          : "per month"}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3.5 space-y-1.5 border-t border-[#E8E4DB] pt-3">
                    {prod.features.slice(0, 4).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-[#575550]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#0F4C3A] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Student-to-Parent Payment Invite Link */}
            <div className="rounded-2xl border border-[#E8E4DB] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-[#141413]">
                    Asking a parent or guardian to unlock?
                  </div>
                  <p className="text-[11px] text-[#575550] mt-0.5">
                    Share your invite code ({parentInviteCode}) to link their
                    Parent Progress Report automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyParentLink}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#F3F1EA] transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {copiedParentLink ? "Link Copied" : "Share Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Form Column */}
          <div className="md:col-span-5">
            <form
              onSubmit={handleCheckout}
              className="rounded-2xl border border-[#E8E4DB] bg-white p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#78756E]">
                  2. Express Checkout
                </span>
                <Lock className="h-4 w-4 text-[#78756E]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#575550] mb-1.5">
                  Parent / Buyer Email
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#575550] mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] focus:border-[#0F4C3A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#575550] mb-1.5">
                  Card Details (Sandbox Demonstration)
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-[#E8E4DB] bg-[#FAF9F5] px-3.5 py-2.5 text-sm text-[#141413] font-mono">
                  <CreditCard className="h-4 w-4 text-[#78756E] shrink-0" />
                  <span>•••• •••• •••• 4242</span>
                  <span className="ml-auto text-xs text-[#78756E]">11/29</span>
                </div>
              </div>

              <div className="rounded-xl bg-[#FAF9F5] border border-[#E8E4DB] p-3.5 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#575550]">
                  <span>Student Account:</span>
                  <span className="font-semibold text-[#141413]">
                    {studentName}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#E8E4DB] pt-2 font-semibold text-[#141413] text-sm">
                  <span>Total Due:</span>
                  <span className="font-serif">{selectedProduct.priceFormatted}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0F4C3A] px-5 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-[#19634D] disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                {isProcessing
                  ? "Activating Entitlement..."
                  : `Unlock for ${selectedProduct.priceFormatted}`}
              </button>

              <p className="text-[11px] text-center text-[#78756E] leading-relaxed">
                UK GDPR & ICO Children&apos;s Code compliant · Instant access to
                all 6 syllabus modules and 3 full mock papers.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
