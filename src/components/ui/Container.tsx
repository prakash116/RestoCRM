import { cn } from "@/lib/utils/cn";

/**
 * Page gutter. Caps at 1408px so 1920px displays get comfortable margins
 * instead of an over-stretched 4-column grid.
 */
export function Container({
  className,
  children,
  as: Component = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "section" | "header" | "footer" | "nav";
}) {
  return (
    <Component className={cn("mx-auto w-full max-w-[88rem] px-5 sm:px-6 lg:px-8", className)}>
      {children}
    </Component>
  );
}
