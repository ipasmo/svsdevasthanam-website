"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Send, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { TEMPLE_INFO } from "@/lib/constants";
import { useTranslations } from "next-intl";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // In production, call the API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("success"));
      reset();
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-offwhite">
      {/* Hero */}
      <div className="bg-temple-gradient text-white py-20 clip-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">{t("title")}</h1>
          <p className="text-white/70 font-noto max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-cinzel font-bold text-rust text-2xl mb-6">{t("getInTouch")}</h2>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-temple-card">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-700 mb-1">{t("address")}</h3>
                  <p className="text-gray-600 font-noto text-sm leading-relaxed">{TEMPLE_INFO.address}</p>
                </div>
              </div>
            </div>

            {/* Phones */}
            <div className="bg-white rounded-2xl p-6 shadow-temple-card">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-700 mb-2">{t("phone")}</h3>
                  <div className="space-y-1">
                    {TEMPLE_INFO.phone.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="block text-saffron hover:text-rust font-poppins text-sm font-medium transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 shadow-temple-card">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-700 mb-1">{t("email")}</h3>
                  <a
                    href={`mailto:${TEMPLE_INFO.email}`}
                    className="text-saffron hover:text-rust font-poppins text-sm font-medium transition-colors"
                  >
                    {TEMPLE_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-temple-card">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-gray-700 mb-2">{t("officeHours")}</h3>
                  <p className="text-xs text-gray-600 font-noto">Mon–Sat: 9:00 AM – 1:00 PM & 4:00 PM – 7:00 PM</p>
                  <p className="text-xs text-gray-600 font-noto">Sunday: 9:00 AM – 12:00 PM</p>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-temple-card h-48">
              <iframe
                title="Sri Venkata Sai Devasthanam Location"
                src={`https://maps.google.com/maps?q=Yemmiganur+Kurnool+Andhra+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-temple-card">
              <h2 className="font-cinzel font-bold text-rust text-2xl mb-6">{t("sendMessage")}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">
                      Your Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Sri Rama"
                      className="form-input"
                    />
                    {errors.name && <p className="form-error">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="devotee@example.com"
                      className="form-input"
                    />
                    {errors.email && <p className="form-error">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      {...register("subject")}
                      placeholder="Seva booking enquiry"
                      className="form-input"
                    />
                    {errors.subject && <p className="form-error">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    rows={6}
                    placeholder="Write your message here..."
                    className="form-textarea"
                  />
                  {errors.message && <p className="form-error">{errors.message.message}</p>}
                </div>

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? `${t("submit")}...` : t("submit")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
