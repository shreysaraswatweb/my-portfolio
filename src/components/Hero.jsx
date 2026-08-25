import { ArrowRight, Cake, MapPin, User } from "lucide-react";
import { bioLines, profile } from "../data/profile";
import heroWorkstation from "../assets/hero-workstation.png";
import GlassCard from "./ui/GlassCard";
import PillButton from "./ui/PillButton";
import AvatarFrame from "./AvatarFrame";

export function IdentityHeader({ align = "center" }) {
  return (
    <div className={align === "left" ? "text-left" : "text-center"}>
      <h1 className="font-display text-h1 text-text-primary">
        {profile.displayName}
      </h1>
      <p className="mt-space-1 text-body text-text-secondary">
        {profile.handle}
      </p>
    </div>
  );
}

export function BioList() {
  return (
    <ul className="mt-space-5 space-y-space-2 text-center">
      {bioLines.map((line) => (
        <li
          key={line.text}
          className="flex items-center justify-center gap-space-2 text-body-lg text-text-primary"
        >
          <span aria-hidden>{line.emoji}</span>
          <span>{line.text}</span>
        </li>
      ))}
    </ul>
  );
}

export function MetaRow() {
  return (
    <div className="mt-space-6 flex items-start justify-between gap-space-3 text-caption text-text-secondary">
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <MapPin className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.location}</span>
      </span>
      <span className="inline-flex min-w-0 items-center gap-space-2">
        <Cake className="h-space-4 w-space-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">{profile.joinedOn}</span>
      </span>
    </div>
  );
}

function DashboardHero() {
  const lastName = profile.lastName || profile.firstName;

  return (
    <div
      id="home"
      className="hero-card glass-edge relative overflow-hidden rounded-lg border px-space-6 py-space-8 tablet:overflow-visible tablet:px-space-8 tablet:py-space-10 desktop:min-h-[28rem] desktop:overflow-visible desktop:px-space-10 desktop:py-space-12"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-space-6 top-space-6 grid grid-cols-6 gap-[6px] opacity-25 tablet:opacity-35"
      >
        {Array.from({ length: 36 }).map((_, index) => (
          <span
            key={index}
            className="h-[4px] w-[4px] rounded-full bg-accent-end"
          />
        ))}
      </div>

      <div className="relative z-10 grid items-center gap-space-8 tablet:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] tablet:gap-space-4 desktop:min-h-[22rem] desktop:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-space-2 rounded-full border border-border-hairline bg-surface-secondary px-[14px] py-[6px] text-body-lg text-text-secondary">
            <span aria-hidden>👋</span>
            {profile.greeting}
          </span>

          <h1 className="mt-space-5 font-display text-display text-text-primary">
            {profile.lastName ? (
              <>
                {profile.firstName}{" "}
                <span className="bg-accent-gradient bg-clip-text text-transparent">
                  {profile.lastName}
                </span>
              </>
            ) : (
              <span className="bg-accent-gradient bg-clip-text text-transparent">
                {lastName}
              </span>
            )}
          </h1>

          <p className="mt-space-3 text-h2 text-text-secondary">{profile.role}</p>

          <p className="mt-space-5 max-w-md text-body leading-relaxed text-text-secondary">
            {profile.description}
          </p>

          <div className="mt-space-8 flex flex-wrap gap-space-3">
            <PillButton href="#projects">
              View My Work
              <ArrowRight className="h-space-4 w-space-4" strokeWidth={2} />
            </PillButton>
            <PillButton href="#about" variant="ghost">
              <User className="h-space-4 w-space-4" strokeWidth={1.75} />
              About Me
            </PillButton>
          </div>
        </div>

        <div className="relative hidden min-h-[17rem] tablet:block desktop:min-h-[22rem]">
          <div
            aria-hidden
            className="hero-visual-glow pointer-events-none absolute -top-[8%] left-[8%] h-[70%] w-[80%] rounded-full"
          />
          <img
            src={heroWorkstation}
            alt=""
            aria-hidden
            className="relative z-10 -mb-[8%] -mr-[6%] h-[118%] w-[118%] max-w-none object-contain object-right-bottom"
          />
        </div>
      </div>

      <div className="relative mt-space-6 flex justify-center tablet:hidden">
        <div
          aria-hidden
          className="hero-visual-glow pointer-events-none absolute inset-[8%] rounded-full opacity-70"
        />
        <img
          src={heroWorkstation}
          alt=""
          aria-hidden
          className="relative z-10 h-[13rem] w-full max-w-sm object-contain object-bottom"
        />
      </div>
    </div>
  );
}

export default function Hero({ variant = "dashboard" }) {
  if (variant === "identity") {
    return (
      <div className="relative pt-avatar-lift">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
          <AvatarFrame size="mobile" />
        </div>
        <GlassCard className="rounded-xl px-space-6 pb-space-6 pt-avatar-sink">
          <IdentityHeader />
          <BioList />
          <MetaRow />
        </GlassCard>
      </div>
    );
  }

  return <DashboardHero />;
}
