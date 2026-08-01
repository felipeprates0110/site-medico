"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode, MouseEvent } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: AnalyticsEventName;
  children: ReactNode;
};

/** Link interno (Next.js) que também registra um evento de analytics. */
export function TrackedLink({ event, onClick, children, ...props }: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(event);
    onClick?.(e);
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}

type TrackedAnchorProps = ComponentProps<"a"> & {
  event: AnalyticsEventName;
  children: ReactNode;
};

/** Link externo (WhatsApp, tel, mailto) com tracking de clique. */
export function TrackedAnchor({
  event,
  onClick,
  children,
  ...props
}: TrackedAnchorProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(event);
    onClick?.(e);
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
