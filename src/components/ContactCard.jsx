"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import GlassCard from "./ui/GlassCard";
import { profile } from "../data/profile";
import "../assets/styles/ContactCard.css";

const TOPICS = [
  {
    id: "project",
    label: "Project",
    icon: "🚀",
    subject: "Project Inquiry / Frontend Build",
    placeholder: "Tell me about your product, scope, or timeline...",
  },
  {
    id: "role",
    label: "Hire / Role",
    icon: "💼",
    subject: "Frontend Role Opportunity (React / Angular)",
    placeholder: "Share role details, team, or tech stack...",
  },
  {
    id: "collab",
    label: "Collab",
    icon: "⚡",
    subject: "Collaboration Idea",
    placeholder: "Let's build something together! What's on your mind?",
  },
  {
    id: "chat",
    label: "Say Hi",
    icon: "☕",
    subject: "Coffee Chat / Hello from Portfolio",
    placeholder: "Say hello or drop your question here...",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: "💡",
    subject: "Feedback on Portfolio",
    placeholder: "What could make this portfolio better?",
  },
];

export default function ContactCard({ className = "" }) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Please enter your name";
    }
    if (!email.trim()) {
      errs.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email";
    }
    if (!message.trim()) {
      errs.message = "Please write a brief note";
    } else if (message.trim().length < 5) {
      errs.message = "Message must be at least 5 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const subject = `[${selectedTopic.label}] From ${name.trim()}: ${selectedTopic.subject}`;
    const body = `Hi ${profile.firstName},\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${selectedTopic.label}\n\nMessage:\n${message.trim()}\n\n---\nSent via portfolio contact widget`;

    const recipient = profile.email || "";
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Slight delay for smooth dispatch animation
    setTimeout(() => {
      window.location.href = mailtoUrl;
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 450);
  };

  const handleCopyDraft = async () => {
    const draftText = `To: ${profile.displayName} ${profile.email ? `<${profile.email}>` : ""}\nSubject: [${selectedTopic.label}] From ${name.trim()}: ${selectedTopic.subject}\n\nHi ${profile.firstName},\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${selectedTopic.label}\n\nMessage:\n${message.trim()}`;

    try {
      await navigator.clipboard.writeText(draftText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
    setCopied(false);
  };

  return (
    <GlassCard
      id="contact-widget"
      as="section"
      aria-label="Get in Touch Contact Widget"
      className={`contact-widget-card p-space-5 ${className}`}
    >
      {/* Ambient Radial Glow */}
      <div className="contact-widget-glow" aria-hidden="true" />

      {/* Header Row: Title & Real-time Availability Signal */}
      <div className="relative z-10 mb-space-3 flex items-center justify-between gap-space-2">
        <div>
          <h2 className="font-display text-h2 text-text-primary leading-tight">
            Get in{" "}
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              Touch
            </span>
          </h2>
          <p className="mt-0.5 text-caption text-text-secondary leading-snug">
            Drop a message or choose a quick topic.
          </p>
        </div>

        {/* Live Availability Badge */}
        <div
          className="contact-status-pill shrink-0"
          title="Open to frontend roles and projects"
        >
          <span className="contact-status-dot" aria-hidden="true" />
          <span className="hidden min-[360px]:inline">Active</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative z-10 space-y-space-3"
            noValidate
          >
            {/* Interactive Topic Pill Switcher */}
            <div>
              <span className="mb-1.5 block text-micro font-semibold uppercase tracking-wider text-text-tertiary">
                Choose Topic
              </span>
              <div
                className="flex flex-wrap gap-1.5"
                role="radiogroup"
                aria-label="Select message topic"
              >
                {TOPICS.map((topic) => {
                  const isActive = selectedTopic.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() => {
                        setSelectedTopic(topic);
                        if (errors.message) {
                          setErrors((prev) => ({ ...prev, message: undefined }));
                        }
                      }}
                      className={`contact-topic-chip ${isActive ? "is-active" : ""
                        }`}
                    >
                      <span aria-hidden="true">{topic.icon}</span>
                      <span>{topic.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Inputs Group: Name & Email */}
            <div className="space-y-2">
              <div>
                <label htmlFor="contact-name" className="sr-only">
                  Your Name
                </label>
                <div className="contact-input-wrap">
                  <User
                    className="contact-input-icon h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors((prev) => ({ ...prev, name: undefined }));
                      }
                    }}
                    placeholder="Your Name"
                    className={`contact-input ${errors.name ? "has-error" : ""}`}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    required
                  />
                </div>
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="mt-1 pl-1 text-micro text-rose-400 font-medium"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="contact-email" className="sr-only">
                  Your Email
                </label>
                <div className="contact-input-wrap">
                  <Mail
                    className="contact-input-icon h-4 w-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    placeholder="Your Email"
                    className={`contact-input ${errors.email ? "has-error" : ""}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    required
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="mt-1 pl-1 text-micro text-rose-400 font-medium"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <div className="relative">
                <textarea
                  id="contact-message"
                  name="message"
                  value={message}
                  maxLength={500}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) {
                      setErrors((prev) => ({ ...prev, message: undefined }));
                    }
                  }}
                  placeholder={selectedTopic.placeholder}
                  className={`contact-textarea ${errors.message ? "has-error" : ""
                    }`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  rows={3}
                  required
                />
                <span className="absolute bottom-2 right-2 text-micro text-text-tertiary select-none">
                  {message.length}/500
                </span>
              </div>
              {errors.message && (
                <p
                  id="message-error"
                  role="alert"
                  className="mt-1 pl-1 text-micro text-rose-400 font-medium"
                >
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className="contact-submit-btn"
              aria-label="Send message"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 -rotate-12 transition-transform group-hover:translate-x-0.5" />
                  <span>Send Note</span>
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          /* Celebratory Confirmation View */
          <motion.div
            key="contact-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="contact-success-box relative z-10"
          >
            <div className="contact-success-icon-wrap" aria-hidden="true">
              <CheckCircle2 className="h-7 w-7" strokeWidth={2.2} />
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-body-lg font-bold text-text-primary">
                Draft Dispatched! 🚀
              </h3>
              <p className="text-caption text-text-secondary max-w-xs mx-auto">
                Your email client was triggered with your note. You can also copy
                the full draft below.
              </p>
            </div>

            {/* Action Buttons: Copy Draft & Send Another */}
            <div className="mt-space-2 w-full space-y-2">
              <button
                type="button"
                onClick={handleCopyDraft}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-surface-secondary border border-border-glass py-2.5 px-3 text-caption font-medium text-text-primary hover:border-accent-primary transition-colors min-h-[44px]"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-text-secondary" />
                    <span>Copy Draft to Clipboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-micro font-medium text-text-secondary hover:text-text-primary transition-colors min-h-[36px]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Send another message</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
