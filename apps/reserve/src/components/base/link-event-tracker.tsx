"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";

interface LinkEventTrackerProps {
  href: string;
  target?: string;
  eventName: string;
  className?: string;
  location?: string;
  children: React.ReactNode;
}

export const LinkEventTracker = ({
  href,
  target,
  eventName,
  className,
  location,
  children,
}: LinkEventTrackerProps) => {
  const handleClick = () => {
    track(eventName, { location: location || "", page: window.location.pathname });
  };

  return (
    <Link href={href} target={target} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};
