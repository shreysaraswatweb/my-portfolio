import GitCalendarCubes from "./ui/GitCalendarCubes";

/**
 * GitHubActivity Component
 * Displays live, real-time GitHub contributions for shreysaraswatweb
 * with 3D interactive WebGL2 cubes, lighting, and ripple effects.
 */
export default function GitHubActivity({
  username = "shreysaraswatweb",
  className = "",
}) {
  return (
    <section className={`github-activity flex flex-col justify-between ${className}`}>
      <div>
        <h2 className="text-caption sm:text-body font-bold text-text-primary leading-tight">
          GitHub Contributions
        </h2>
        <p className="text-micro text-text-secondary leading-tight mt-0.5">
          Building, learning, and shipping consistently.
        </p>
      </div>

      <div className="mt-3 relative w-full h-[115px] overflow-hidden rounded-md">
        <GitCalendarCubes username={username} />
      </div>
    </section>
  );
}

export { GitCalendarCubes as GitHubCalendar };
