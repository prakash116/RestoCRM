import Link from "next/link";
import { CircleCheck, Mail } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/ui/GlowCard";
import { siteConfig } from "@/lib/seo/site";
import { routes } from "@/lib/utils/routes";

import { PageHeader } from "./PageHeader";
import type { Crumb } from "./Breadcrumbs";

/**
 * Honest pre-launch state for pages whose content is still being finalised
 * (legal documents, careers, the journal).
 *
 * Deliberately not filled with placeholder prose: publishing invented policy
 * text would be worse than saying plainly what the document will contain and
 * who to contact for the current draft.
 */
export function PendingPage({
  eyebrow,
  title,
  description,
  breadcrumbs,
  covers,
  contactEmail = siteConfig.contact.supportEmail,
  contactLabel = "Request the current draft",
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  /** What this document or section will cover. */
  covers: string[];
  contactEmail?: string;
  contactLabel?: string;
}) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div>
            <h2 className="text-xl font-bold text-foreground">What this will cover</h2>
            <ul className="mt-5 space-y-3.5">
              {covers.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-primary-strong" aria-hidden="true" />
                  <span className="text-[0.9375rem] leading-relaxed text-muted-foreground">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <GlowCard interactive={false} className="h-fit rounded-panel p-6">
            <h2 className="text-lg font-bold text-foreground">Need this now?</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              This page is being finalised ahead of the {siteConfig.launchCity.region} launch. Write
              to us and we will send the current version directly.
            </p>

            <a
              href={`mailto:${contactEmail}`}
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-strong"
            >
              <Mail className="size-4" aria-hidden="true" />
              {contactLabel}
            </a>

            <Link
              href={routes.contact()}
              className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-pill border border-border text-[0.9375rem] font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary-strong"
            >
              Contact the team
            </Link>
          </GlowCard>
        </div>
      </Container>
    </>
  );
}
