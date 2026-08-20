import Image from "next/image";
import Link from "next/link";
import { CircleCheck } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { BLUR_DARK, editorialImages } from "@/data/images";
import { siteConfig } from "@/lib/seo/site";

/**
 * Two-column shell for the restaurant console entry points.
 *
 * The marketing column is hidden below `lg` so phones get the form
 * immediately — an owner opening this on a phone is trying to sign in, not
 * read the pitch again.
 */
export function AuthShell({
  title,
  description,
  highlights,
  footer,
  children,
}: {
  title: string;
  description: string;
  highlights: string[];
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1fr_1.05fr]">
      <div className="flex items-center justify-center px-5 py-14 sm:px-8 lg:px-14">
        <div className="w-full max-w-md">
          <Logo className="lg:hidden" />

          <h1 className="mt-8 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl lg:mt-0">
            {title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>

      <aside className="relative isolate hidden overflow-hidden bg-ink text-ink-foreground lg:block">
        <Image
          src={editorialImages.finalCta}
          alt=""
          fill
          sizes="55vw"
          placeholder="blur"
          blurDataURL={BLUR_DARK}
          className="-z-20 object-cover opacity-30"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-24 -z-10 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(214,58,40,0.5),transparent_65%)] blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(150deg,rgba(20,14,11,0.9),rgba(20,14,11,0.65))]"
        />

        <div className="flex h-full flex-col justify-between p-12 xl:p-16">
          <Link href="/" aria-label={`${siteConfig.name} home`} className="w-fit rounded-control">
            <Logo tone="inverse" />
          </Link>

          <div className="max-w-md">
            <p className="text-3xl leading-tight font-extrabold tracking-[-0.03em] xl:text-4xl">
              One platform for discovery, bookings and daily operations.
            </p>

            <ul className="mt-8 space-y-3.5">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-[0.9375rem]">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary-soft" aria-hidden="true" />
                  <span className="text-ink-muted">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-ink-muted">
            Launching across {siteConfig.launchCity.region} · {siteConfig.contact.salesEmail}
          </p>
        </div>
      </aside>
    </div>
  );
}
