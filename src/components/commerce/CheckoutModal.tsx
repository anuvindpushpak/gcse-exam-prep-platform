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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="checkout-modal-title"
                className="text-base font-bold text-slate-900"
              >
                Unlock GCSE Maths Grade 4 Preparation
              </h2>
              <p className="text-xs text-slate-500">
                Instant digital entitlement activation for {studentName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
            aria-label="Close checkout modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
          {/* Product Selection Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              1. Choose Preparation Package
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
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    isSelected
                      ? "border-sky-600 bg-sky-50/40 shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {prod.name}
                        </span>
                        {prod.badge && (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-800">
                            {prod.badge}
                          </span>
                        )}
                        {isOwned && (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        {prod.tagline}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-slate-900">
                        {prod.priceFormatted}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {prod.type === "ONE_TIME_PACK"
                          ? "One-time"
                          : "per month"}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1.5 border-t border-slate-200/80 pt-2.5">
                    {prod.features.slice(0, 4).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {/* Student-to-Parent Payment Invite Link */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-amber-900">
                    Asking a parent or guardian to pay?
                  </div>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Send them your linked invite code ({parentInviteCode}) to
                    unlock your account and connect their Parent Progress
                    Dashboard automatically.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyParentLink}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  {copiedParentLink ? "Invite Link Copied!" : "Copy Parent Link"}
                </button>
              </div>
            </div>
          </div>

          {/* Checkout Form Column */}
          <div className="md:col-span-5">
            <form
              onSubmit={handleCheckout}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  2. Express Stripe Checkout
                </span>
                <Lock className="h-4 w-4 text-slate-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent / Buyer Email (for Receipt & Progress Link)
                </label>
                <input
                  type="email"
                  required
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Simulated Card Details (Sandbox Mode)
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 font-mono">
                  <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>•••• •••• •••• 4242</span>
                  <span className="ml-auto text-xs text-slate-400">11/29 · 424</span>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-slate-200 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Beneficiary Student:</span>
                  <span className="font-semibold text-slate-900">
                    {studentName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Selected Plan:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedProduct.priceFormatted}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5 font-bold text-slate-900 text-sm">
                  <span>Total Due Now:</span>
                  <span>{selectedProduct.priceFormatted}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-700 disabled:opacity-50 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                {isProcessing
                  ? "Activating Entitlement..."
                  : `Pay ${selectedProduct.priceFormatted} & Unlock Instantly`}
              </button>

              <p className="text-[11px] text-center text-slate-500">
                UK GDPR & ICO Children&apos;s Code compliant · Instant access
                to all locked topics and 3 Mock Exams.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
