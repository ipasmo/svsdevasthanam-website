"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";
import { Heart, Shield, CheckCircle, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DONATION_AMOUNTS, DONATION_PURPOSES, TEMPLE_INFO } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { donationsApi } from "@/lib/api";
import { useTranslations } from "next-intl";

const donateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid 10-digit phone required"),
  panCard: z.string().optional(),
  message: z.string().optional(),
});

type DonateForm = z.infer<typeof donateSchema>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PURPOSES = DONATION_PURPOSES.map((p) => ({
  value: p.value,
  labelKey: `purpose_${p.value}`,
}));

export default function DonatePage() {
  const t = useTranslations("donate");
  const searchParams = useSearchParams();
  const [selectedAmount, setSelectedAmount] = useState<number>(501);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>(DONATION_PURPOSES[0]?.value ?? "GENERAL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(false);

  useEffect(() => {
    const amt = searchParams.get("amount");
    const purpose = searchParams.get("purpose");
    if (amt && !isNaN(Number(amt))) setSelectedAmount(Number(amt));
    if (purpose) setSelectedPurpose(purpose);
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonateForm>({ resolver: zodResolver(donateSchema) });

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const onSubmit = async (data: DonateForm) => {
    if (!effectiveAmount || effectiveAmount < 1) {
      toast.error("Please select or enter a donation amount");
      return;
    }
    setIsProcessing(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment gateway failed to load. Please try again.");
        return;
      }

      const order = await donationsApi.create({
        amount: effectiveAmount,
        purpose: selectedPurpose as any,
        donorName: data.name,
        donorEmail: data.email,
        donorPhone: data.phone,
        message: data.message,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: TEMPLE_INFO.name,
        description: `Donation – ${selectedPurpose}`,
        order_id: order.orderId,
        prefill: { name: data.name, email: data.email, contact: data.phone },
        notes: { purpose: selectedPurpose, message: data.message ?? "" },
        theme: { color: "#FB9C1B" },
        handler: async (response: any) => {
          try {
            await donationsApi.verify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            setDonationSuccess(true);
            toast.success("Donation successful! 🙏 Thank you for your generosity.");
          } catch {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Could not initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (donationSuccess) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-golden max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-rust mb-3">{t("successTitle")}</h2>
          <p className="text-gray-600 font-noto mb-2">
            <span className="font-semibold text-saffron">{formatCurrency(effectiveAmount)}</span>{" "}
            {t("successTitle")}
          </p>
          <p className="text-gray-500 font-noto text-sm mb-6">
            {t("successReceiptNote")}
          </p>
          <button
            onClick={() => setDonationSuccess(false)}
            className="btn-primary px-8 py-3 rounded-xl"
          >
            {t("donateAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-golden" />
          </div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
          {[
            { icon: Shield, textKey: "trustSecure" },
            { icon: CheckCircle, textKey: "trustTax" },
            { icon: IndianRupee, textKey: "trustInr" },
          ].map(({ icon: Icon, textKey }) => (
            <div key={textKey} className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-temple-card text-sm font-poppins font-medium text-gray-700">
              <Icon className="w-4 h-4 text-teal" />
              {t(textKey)}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Donation Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Amount Selection */}
              <div className="bg-white rounded-3xl p-6 shadow-temple-card">
                <h2 className="font-cinzel font-bold text-rust text-xl mb-5">{t("selectAmount")}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                  {DONATION_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                      className={`py-3 px-2 rounded-xl font-poppins font-semibold text-sm transition-all border-2 ${
                        selectedAmount === amt && !customAmount
                          ? "border-saffron bg-saffron text-white shadow-md"
                          : "border-gray-200 text-gray-700 hover:border-saffron hover:text-saffron"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-poppins font-semibold">₹</span>
                  <input
                    type="number"
                    min={1}
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(0); }}
                    placeholder="Enter custom amount"
                    className="form-input pl-8"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div className="bg-white rounded-3xl p-6 shadow-temple-card">
                <h2 className="font-cinzel font-bold text-rust text-xl mb-5">{t("purpose")}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PURPOSES.map(({ value, labelKey }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelectedPurpose(value)}
                      className={`px-4 py-3 rounded-xl text-sm font-poppins font-medium text-left transition-all border-2 ${
                        selectedPurpose === value
                          ? "border-saffron bg-saffron/10 text-saffron"
                          : "border-gray-200 text-gray-600 hover:border-saffron/50"
                      }`}
                    >
                      {t(labelKey)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Donor Details */}
              <div className="bg-white rounded-3xl p-6 shadow-temple-card">
                <h2 className="font-cinzel font-bold text-rust text-xl mb-5">{t("yourDetails")}</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Full Name <span className="text-red-400">*</span></label>
                      <input {...register("name")} placeholder="Sri Rama Devi" className="form-input" />
                      {errors.name && <p className="form-error">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">Email <span className="text-red-400">*</span></label>
                      <input {...register("email")} type="email" placeholder="devotee@example.com" className="form-input" />
                      {errors.email && <p className="form-error">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone <span className="text-red-400">*</span></label>
                      <input {...register("phone")} type="tel" placeholder="9876543210" className="form-input" />
                      {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">PAN Card <span className="text-gray-400 text-xs">(for 80G receipt)</span></label>
                      <input {...register("panCard")} placeholder="ABCDE1234F" className="form-input" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Message (Optional)</label>
                    <textarea {...register("message")} rows={3} placeholder="Leave a message for the temple..." className="form-textarea" />
                  </div>
                </div>
              </div>

              {/* Summary + Submit */}
              <div className="bg-golden/10 border border-golden/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-poppins font-semibold text-gray-700">{t("summaryLabel")}</span>
                  <span className="font-cinzel font-bold text-2xl text-rust">
                    {effectiveAmount ? formatCurrency(effectiveAmount) : "—"}
                  </span>
                </div>
                <Button
                  type="submit"
                  isLoading={isProcessing}
                  size="lg"
                  className="w-full"
                  leftIcon={<Heart className="w-4 h-4" />}
                >
                  {isProcessing ? t("processing") : `${t("proceed")} ${effectiveAmount ? formatCurrency(effectiveAmount) : ""}`}
                </Button>
                <p className="text-xs text-gray-500 font-noto text-center mt-3">
                  {t("securedNote")}
                </p>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* 80G info */}
            <div className="bg-white rounded-3xl p-6 shadow-temple-card">
              <h3 className="font-cinzel font-bold text-rust text-lg mb-3">{t("taxTitle")}</h3>
              <p className="text-gray-600 font-noto text-sm leading-relaxed mb-3">
                {t("taxDesc1")}
              </p>
              <p className="text-gray-600 font-noto text-sm leading-relaxed">
                {t("taxDesc2")}
              </p>
            </div>

            {/* How funds are used */}
            <div className="bg-white rounded-3xl p-6 shadow-temple-card">
              <h3 className="font-cinzel font-bold text-rust text-lg mb-4">{t("usageTitle")}</h3>
              <ul className="space-y-3">
                {[
                  { labelKey: "usage_annadanam", pct: 40 },
                  { labelKey: "usage_maintenance", pct: 25 },
                  { labelKey: "usage_festivals", pct: 20 },
                  { labelKey: "usage_charity", pct: 15 },
                ].map(({ labelKey, pct }) => (
                  <li key={labelKey}>
                    <div className="flex justify-between mb-1">
                      <span className="font-noto text-sm text-gray-700">{t(labelKey)}</span>
                      <span className="font-poppins font-semibold text-saffron text-sm">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-saffron to-golden rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact for large donations */}
            <div className="bg-rust/5 border border-rust/20 rounded-3xl p-6">
              <h3 className="font-cinzel font-bold text-rust text-base mb-2">{t("largeTitle")}</h3>
              <p className="text-gray-600 font-noto text-sm mb-3">
                {t("largeDesc")}
              </p>
              <a href={`tel:${TEMPLE_INFO.phone[0]?.replace(/\s/g, "")}`} className="text-saffron font-poppins font-semibold text-sm hover:text-rust transition-colors">
                {TEMPLE_INFO.phone[0]}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
