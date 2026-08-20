"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { routes } from "@/lib/utils/routes";

/**
 * Route-level error boundary.
 *
 * Shows a recovery path rather than a stack trace — the digest is surfaced so
 * a support conversation can be tied back to a specific server log entry
 * without exposing the underlying message.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with the platform's error reporter when observability is wired up.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-panel bg-danger-soft">
        <TriangleAlert className="size-8 text-danger" aria-hidden="true" />
      </span>

      <h1 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
        Something went wrong
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        We hit an unexpected error loading this page. Trying again usually clears it.
      </p>

      {error.digest ? (
        <p className="mt-3 text-xs text-muted-foreground/80">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="primary" size="lg">
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
        <Button href={routes.home()} variant="secondary" size="lg">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
