import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

/**
 * Extensible Theme configuration.
 * Each entry represents a color palette preset. The actual theme CSS variables
 * will be wired up per-preset in a future iteration.
 */
export const AVAILABLE_THEMES = [
  {
    id: "default",
    name: "Default",
    color: "#F5A623",
    description: "Glassmorphic Amber Dark",
  },
  {
    id: "stranger-things",
    name: "Stranger Things",
    color: "#E50914",
    description: "Hawkins Upside Down",
  },
  {
    id: "breaking-bad",
    name: "Breaking Bad",
    color: "#1E5E3A",
    description: "Heisenberg Emerald",
  },
  {
    id: "dark",
    name: "DARK",
    color: "#3B82F6",
    description: "Winden Time Travel",
  },
  {
    id: "chernobyl",
    name: "Chernobyl",
    color: "#4E7356",
    description: "Pripyat Reactor",
  },
  {
    id: "noir",
    name: "Noir",
    color: "#9CA3AF",
    description: "Monochrome Shadows",
  },
];

/* Spring-based open/close animations for the dropdown panel */
const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: -6,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.8,
    },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 28,
      mass: 0.8,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: -6,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.8,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
};

export default function ThemeDropdown({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState("default");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedTheme =
    AVAILABLE_THEMES.find((t) => t.id === selectedThemeId) ||
    AVAILABLE_THEMES[0];

  // Compute dropdown position from trigger button's bounding rect
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6, // 6px gap below trigger
      right: window.innerWidth - rect.right, // align right edges
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();

    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScrollResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollResize, true);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollResize, true);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (themeId) => {
    setSelectedThemeId(themeId);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger pill button — reduced border-radius to match design */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Theme preset: ${selectedTheme.name}`}
        className="group flex h-7 items-center gap-1.5 rounded-md border border-border-hairline bg-surface-elevated/70 px-2 text-caption text-text-primary transition-all duration-200 hover:border-border-glass hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent-primary"
      >
        {/* Glowing Theme Dot */}
        <span
          className="h-2 w-2 shrink-0 rounded-full shadow-[0_0_8px_rgba(245,166,35,0.7)]"
          style={{ backgroundColor: selectedTheme.color }}
        />
        <span className="font-medium text-caption text-text-primary hidden sm:inline">
          {selectedTheme.name}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu — portaled to body to escape stacking contexts */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="listbox"
              aria-label="Theme Presets"
              style={{
                position: "fixed",
                top: dropdownPos.top,
                right: dropdownPos.right,
              }}
              className="z-[9999] w-52 overflow-hidden rounded-lg border border-border-glass bg-surface-elevated/95 p-1.5 shadow-card backdrop-blur-glass"
            >
              <div className="px-2.5 py-1.5 text-micro font-medium text-text-tertiary">
                Theme Palette
              </div>
              {AVAILABLE_THEMES.map((theme) => {
                const isSelected = theme.id === selectedTheme.id;
                return (
                  <motion.button
                    key={theme.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                    whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 500, damping: 30 } }}
                    onClick={() => handleSelect(theme.id)}
                    className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-caption ${
                      isSelected
                        ? "bg-surface-pill text-text-primary"
                        : "text-text-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: theme.color,
                          boxShadow: `0 0 6px ${theme.color}88`,
                        }}
                      />
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-accent-primary" />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
