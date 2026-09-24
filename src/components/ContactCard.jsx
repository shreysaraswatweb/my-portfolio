"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
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

// Exponential Inertial 3D Card FLIP Variants
const cardFlipVariants = {
  enter: (direction) => ({
    rotateY: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
    transformPerspective: 1200,
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transformPerspective: 1200,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
      mass: 0.75,
    },
  },
  exit: (direction) => ({
    rotateY: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.94,
    filter: "blur(4px)",
    transformPerspective: 1200,
    transition: {
      duration: 0.24,
      ease: [0.32, 0, 0.67, 0],
    },
  }),
};

export default function ContactCard({ className = "" }) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [flipDirection, setFlipDirection] = useState(1);

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
    setFlipDirection(1);

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
    setFlipDirection(-1);
    setIsSubmitted(false);
    setCopied(false);
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setErrors({});
    }, 180);
  };

  return (
    <div className="contact-flip-viewport">
      <AnimatePresence mode="wait" custom={flipDirection} initial={false}>
        {!isSubmitted ? (
          /* FRONT SIDE: Contact Form View */
          <motion.div
            key="contact-form-face"
            custom={flipDirection}
            variants={cardFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="contact-flip-face"
          >
            <GlassCard
              id="contact-widget"
              as="section"
              aria-label="Get in Touch Contact Widget"
              className={`contact-widget-card p-space-5 ${className}`}
            >
              {/* Specular Light Sweep Effect during Flip */}
              <motion.div
                key={`sheen-form-${flipDirection}`}
                initial={{ opacity: 0.65, x: flipDirection > 0 ? "-120%" : "120%", skewX: -20 }}
                animate={{ opacity: 0, x: flipDirection > 0 ? "120%" : "-120%", skewX: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="contact-flip-sheen"
                aria-hidden="true"
              />

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

              {/* Interactive Form */}
              <form
                onSubmit={handleSubmit}
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
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          /* BACK SIDE: Celebratory Confirmation View with 3D Flip */
          <motion.div
            key="contact-success-face"
            custom={flipDirection}
            variants={cardFlipVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="contact-flip-face"
          >
            <GlassCard
              id="contact-widget"
              as="section"
              aria-label="Message Sent Confirmation"
              className={`contact-widget-card p-space-5 contact-success-card-shell ${className}`}
            >
              {/* Specular Light Sweep Effect during Flip */}
              <motion.div
                key={`sheen-success-${flipDirection}`}
                initial={{ opacity: 0.65, x: flipDirection > 0 ? "-120%" : "120%", skewX: -20 }}
                animate={{ opacity: 0, x: flipDirection > 0 ? "120%" : "-120%", skewX: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="contact-flip-sheen"
                aria-hidden="true"
              />

              {/* Ambient Radial Mesh Glow */}
              <div className="contact-widget-glow contact-success-glow" aria-hidden="true" />

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

              {/* Centered Success View */}
              <div className="contact-success-box relative z-10">
                {/* Signature Animated Emerald Tick Mark */}
                <motion.div
                  className="contact-success-icon-wrap"
                  initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 22,
                    delay: 0.12,
                  }}
                  aria-hidden="true"
                >
                  {/* Expanding Concentric Sonar Ripples */}
                  <span className="contact-success-ripple ripple-1" />
                  <span className="contact-success-ripple ripple-2" />

                  {/* Ambient Core Breathing Glow */}
                  <span className="contact-success-glow-core" />

                  {/* Custom Traced SVG Badge */}
                  <svg
                    viewBox="0 0 52 52"
                    className="contact-success-svg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Soft Emerald Gradient Circle Fill */}
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      className="contact-success-circle-bg"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
                    />

                    {/* Traced Perimeter Circle with Emerald Stroke */}
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      className="contact-success-circle-stroke"
                      initial={{ pathLength: 0, rotate: -90, opacity: 0 }}
                      animate={{ pathLength: 1, rotate: -90, opacity: 1 }}
                      transition={{
                        pathLength: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.16 },
                        opacity: { duration: 0.2, delay: 0.16 },
                      }}
                      style={{ transformOrigin: "center" }}
                    />

                    {/* Crisp Check Tick Path */}
                    <motion.path
                      d="M16 26.5L23 33.5L36 19"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="contact-success-check-path"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        duration: 0.38,
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.38,
                      }}
                    />
                  </svg>
                </motion.div>

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
                    className="contact-reset-btn group w-full flex items-center justify-center gap-2 rounded-lg py-2 text-micro font-medium text-text-secondary hover:text-text-primary transition-all duration-200 min-h-[38px]"
                    aria-label="Send another message"
                  >
                    <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:-rotate-180" />
                    <span>Send another message</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
