import { User } from "lucide-react";
import { profile } from "../data/profile";
import GlassCard from "./ui/GlassCard";
import IconChip from "./ui/IconChip";

export default function AboutCard() {
  // return (
  //   <GlassCard as="section" id="about" className="rounded-xl p-space-6">
  //     <div className="mb-space-4 flex items-center justify-between">
  //       <div className="flex items-center gap-space-3">
  //         <IconChip className="h-space-10 w-space-10 shrink-0">
  //           <User className="h-space-5 w-space-5 text-accent-primary" strokeWidth={1.75} />
  //         </IconChip>
  //         <div>
  //           <h2 className="font-display text-h2 text-text-primary">About Me</h2>
  //           <p className="text-caption text-text-secondary">Background &amp; Expertise</p>
  //         </div>
  //       </div>
  //     </div>
  //     <p className="text-body text-text-secondary leading-relaxed">
  //       {profile.about}
  //     </p>
  //   </GlassCard>
  // );
}
