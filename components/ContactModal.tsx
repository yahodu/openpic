import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { useState } from "react";

import emailjs from "@emailjs/browser";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  title = "Let's Connect! 📧",
  subtitle = "Share your requirements and we'll reach out within 24 hours",
}: ContactModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
  });
  const [budgetValue, setBudgetValue] = useState(4000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setBudgetValue(value);
    setForm({ ...form, budget: `₹${value.toLocaleString()}` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      budget: form.budget,
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
      );

      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset and close modal
      setTimeout(() => {
        setIsSubmitted(false);
        setForm({ name: "", email: "", message: "", budget: "" });
        setBudgetValue(1000);
        onClose();
      }, 10000);
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message.");
      setIsSubmitting(false);
    }
  };

  const formatBudget = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden border-0 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto rounded-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-5">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                {title}
              </DialogTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form content */}
        <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg"
                />
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg"
                />
              </div>

              {/* Budget range slider */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Budget Range
                  </Label>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatBudget(budgetValue)}
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="4000"
                    max="100000"
                    step="4000"
                    value={budgetValue}
                    onChange={handleBudgetChange}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>₹4K</span>
                    <span>₹100K</span>
                  </div>
                </div>
                <p className="hidden md:block text-xs text-gray-500 dark:text-gray-400 text-center">
                  Adjust to match your requirements
                </p>
              </div>

              {/* Message field */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Requirements
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your needs, event details, or specific requirements..."
                  className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg resize-none h-20 sm:h-24"
                  rows={3}
                />
              </div>

              {/* Trust indicators */}
              <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      Your Privacy is Protected
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Information is confidential and never shared
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={
                  isSubmitting || !form.name.trim() || !form.email.trim()
                }
                className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Request
                  </div>
                )}
              </Button>
            </form>
          ) : (
            /* Success state */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 dark:bg-green-400 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white dark:text-gray-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Thank You! 🎉
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                We&apos;ve received your request and will contact you within 24
                hours.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
