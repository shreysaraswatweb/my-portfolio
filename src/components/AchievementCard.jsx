import { Briefcase, Heart, Star, Users } from "lucide-react";
import { achievements } from "../data/profile";
import GlassCard from "./ui/GlassCard";
import IconChip from "./ui/IconChip";

const icons = {
  users: Users,
  briefcase: Briefcase,
  star: Star,
  heart: Heart,
};

const chipColors = {
  users: "text-accent-violet",
  briefcase: "text-accent-primary",
  star: "text-accent-primary",
  heart: "text-accent-end",
};

export default function AchievementCard() {
  return (
    <GlassCard className="rounded-xl p-space-5">
      <div className="grid grid-cols-4 gap-space-2 text-center">
        {achievements.map((item) => {
          const Icon = icons[item.icon];
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-space-2"
            >
              <IconChip className="h-space-10 w-space-10">
                <Icon
                  className={[
                    "h-space-5 w-space-5",
                    chipColors[item.icon],
                  ].join(" ")}
                  strokeWidth={1.75}
                />
              </IconChip>
              <p className="text-body-lg font-bold text-text-primary">
                {item.value}
              </p>
              <p className="text-micro text-text-secondary">{item.label}</p>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
