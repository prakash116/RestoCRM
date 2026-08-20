"use client";

import { useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldAlert, TriangleAlert } from "lucide-react";

import { authenticate, dashboardUsers } from "@/data/dashboard-users";
import { signIn } from "@/lib/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { cn } from "@/lib/utils/cn";
import { routes } from "@/lib/utils/routes";

/**
 * Dashboard sign-in.
 *
 * Credentials are checked against a list in the client bundle, so this is a
 * demo gate rather than authentication — the banner says so plainly rather
 * than implying a security guarantee the build cannot make.
 */
export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { session, hydrated } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();

  // Someone already signed in has no business on the login screen.
  useEffect(() => {
    if (hydrated && session) router.replace(routes.dashboard());
  }, [hydrated, session, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = authenticate(email, password);

    if (!result) {
      setError("That login ID and password combination was not recognised.");
      return;
    }

    setError(null);
    dispatch(signIn(result));
    router.replace(routes.dashboard());
  }

  const demo = dashboardUsers[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <label htmlFor={emailId} className="block text-sm font-semibold text-foreground">
          Login ID
        </label>
        <input
          id={emailId}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError(null);
          }}
          placeholder="admin@dineboard.in"
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-12 w-full rounded-control border bg-card px-4 text-[0.9375rem] text-foreground",
            "placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            error ? "border-danger" : "border-input focus:border-primary",
          )}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor={passwordId} className="block text-sm font-semibold text-foreground">
          Password
        </label>
        <input
          id={passwordId}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setError(null);
          }}
          placeholder="••••••••"
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-12 w-full rounded-control border bg-card px-4 text-[0.9375rem] text-foreground",
            "placeholder:text-muted-foreground/70 transition-[border-color,box-shadow] duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            error ? "border-danger" : "border-input focus:border-primary",
          )}
        />
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-start gap-2.5 rounded-control border border-danger/25 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary px-6 text-[0.9375rem] font-semibold text-primary-foreground shadow-soft transition-[background-color,box-shadow] duration-200 hover:bg-primary-strong hover:shadow-glow"
      >
        <KeyRound className="size-4" aria-hidden="true" />
        Sign in
      </button>

      <div className="rounded-control border border-border bg-muted/60 px-4 py-3.5">
        <p className="text-xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
          Demo credentials
        </p>
        <dl className="mt-2 space-y-0.5 text-sm">
          <div className="flex gap-2">
            <dt className="text-muted-foreground">ID</dt>
            <dd className="font-semibold text-foreground">{demo.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Password</dt>
            <dd className="font-semibold text-foreground">{demo.password}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setEmail(demo.email);
            setPassword(demo.password);
            setError(null);
          }}
          className="mt-3 text-xs font-semibold text-primary-strong hover:underline"
        >
          Fill these in
        </button>
      </div>

      <p className="flex items-start gap-2.5 rounded-control border border-warning/25 bg-warning-soft px-4 py-3 text-xs leading-relaxed text-warning">
        <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          This check runs entirely in your browser and the credential list ships in the JavaScript
          bundle. It keeps the console tidy for a demo — it is not authentication, and must be
          replaced with a server-side session before the dashboard controls anything real.
        </span>
      </p>
    </form>
  );
}
