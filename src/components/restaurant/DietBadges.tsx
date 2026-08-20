import { cn } from "@/lib/utils/cn";

/**
 * FSSAI-style diet marks: a green square for vegetarian, a maroon triangle for
 * non-vegetarian. Indian diners parse these instantly, but the accessible name
 * still spells the meaning out.
 */
export function DietMark({
  type,
  className,
}: {
  type: "veg" | "non-veg" | "egg";
  className?: string;
}) {
  const isVeg = type === "veg";
  const colour = isVeg ? "border-veg" : type === "egg" ? "border-star" : "border-nonveg";
  const fill = isVeg ? "bg-veg" : type === "egg" ? "bg-star" : "bg-nonveg";

  return (
    <span
      className={cn("grid size-4 shrink-0 place-items-center rounded-[3px] border-[1.5px]", colour, className)}
      role="img"
      aria-label={isVeg ? "Vegetarian" : type === "egg" ? "Contains egg" : "Non-vegetarian"}
    >
      {isVeg || type === "egg" ? (
        <span className={cn("size-2 rounded-full", fill)} />
      ) : (
        // Triangle, drawn with borders so it scales with the mark.
        <span
          className={cn(
            "size-0 border-x-[4px] border-b-[7px] border-x-transparent",
            "border-b-nonveg",
          )}
        />
      )}
    </span>
  );
}

/** Availability summary used on restaurant cards. */
export function DietBadges({
  vegAvailable,
  nonVegAvailable,
  className,
}: {
  vegAvailable: boolean;
  nonVegAvailable: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5", className)}>
      {vegAvailable ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <DietMark type="veg" />
          Veg
        </span>
      ) : null}
      {nonVegAvailable ? (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <DietMark type="non-veg" />
          Non-Veg
        </span>
      ) : null}
      {vegAvailable && !nonVegAvailable ? (
        <span className="rounded-control bg-success-soft px-1.5 py-0.5 text-[0.6875rem] font-bold tracking-wide text-success uppercase">
          Pure Veg
        </span>
      ) : null}
    </div>
  );
}
