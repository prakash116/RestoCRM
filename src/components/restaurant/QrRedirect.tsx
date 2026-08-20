"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { Container } from "@/components/ui/Container";

/** Client redirect used by statically exported QR entry pages. */
export function QrRedirect({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LoaderCircle className="size-9 animate-spin text-primary-strong" aria-hidden="true" />
      <h1 className="mt-5 text-2xl font-extrabold text-foreground">Opening your menu…</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        If the menu does not open automatically, please{" "}
        <Link href={href} className="font-semibold text-primary-strong underline underline-offset-4">
          continue to the menu
        </Link>
        .
      </p>
    </Container>
  );
}
