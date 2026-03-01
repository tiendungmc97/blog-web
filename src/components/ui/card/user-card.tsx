"use client";

import Image from "next/image";
import { useState } from "react";

export interface UserCardProps {
  name: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
  avatarAlt?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  gmailUrl?: string;
  copyUrl?: string;
}

function TwitterIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.025 10.125 11.927v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.956.927-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.098 24 18.1 24 12.073z" />
    </svg>
  );
}

function GmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.548l8.073-6.055C21.692 2.28 24 3.434 24 5.457z" />
    </svg>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        ry="2"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      />
    </svg>
  );
}

export function UserCard({
  name,
  role,
  bio,
  avatarUrl,
  avatarAlt,
  twitterUrl,
  facebookUrl,
  gmailUrl,
  copyUrl,
}: UserCardProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = copyUrl ?? window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex flex-row justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={avatarAlt ?? name}
            width={60}
            height={60}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-600">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-col gap-1">
          <p className="truncate text-sm font-semibold">{name}</p>
          {role && <p className="truncate text-xs text-neutral-500">{role}</p>}
          {bio && <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{bio}</p>}
          {twitterUrl && (
            <LinkSocialIcon
              url={twitterUrl}
              size="small"
            >
              <TwitterIcon />
            </LinkSocialIcon>
          )}
        </div>
      </div>

      <div className="flex hidden items-center gap-2 lg:flex">
        {twitterUrl && (
          <LinkSocialIcon url={twitterUrl}>
            <TwitterIcon />
          </LinkSocialIcon>
        )}
        {facebookUrl && (
          <LinkSocialIcon url={facebookUrl}>
            <FacebookIcon />
          </LinkSocialIcon>
        )}
        {gmailUrl && (
          <LinkSocialIcon url={gmailUrl}>
            <GmailIcon />
          </LinkSocialIcon>
        )}
        <button
          onClick={handleCopy}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-neutral-100 text-neutral-600 transition"
          aria-label={copied ? "Copied!" : "Copy link"}
          title={copied ? "Copied!" : "Copy link"}
        >
          <CopyIcon copied={copied} />
        </button>
      </div>
    </div>
  );
}

function LinkSocialIcon({
  url,
  children,
  size = "medium",
}: {
  url: string;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}) {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-10 w-10",
  };

  return (
    <button className={`rounded-full border ${sizeClasses[size]}`}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-full w-full items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition hover:bg-black hover:text-white"
      >
        {children}
      </a>
    </button>
  );
}
