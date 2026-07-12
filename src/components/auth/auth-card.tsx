import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footerText?: string
  footerLinkText?: string
  footerLinkHref?: string
  className?: string
  backHref?: string
  backText?: string
  layout?: "portrait" | "landscape"
  asideContent?: React.ReactNode
}

export function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  className,
  backHref,
  backText,
  layout = "portrait",
  asideContent,
}: AuthCardProps) {
  if (layout === "landscape") {
    return (
      <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center px-4 py-8 md:max-w-4xl lg:max-w-5xl md:py-14">
        {/* Main landscape card */}
        <div
          className={cn(
            "ptsc-card ptsc-reveal relative w-full overflow-hidden rounded-3xl p-6 shadow-2xl transition-all md:grid md:grid-cols-12 md:gap-8 md:p-8 lg:p-10",
            className
          )}
        >
          {/* Left panel on desktop (Top on mobile) */}
          <div className="flex flex-col justify-between border-b border-white/10 pb-6 md:col-span-5 md:border-b-0 md:border-r md:pb-0 md:pr-8">
            <div>
              <Link href="/" className="group mb-6 flex items-center gap-2.5 transition-opacity hover:opacity-80 md:mb-8">
                <Image
                  src="/logo.png"
                  alt="PTSC logo"
                  width={36}
                  height={36}
                  className="size-9 object-contain transition-transform group-hover:scale-105"
                  priority
                />
                <span className="text-base font-semibold tracking-tight">
                  PTSC<span className="text-muted-foreground font-normal"> · KNIT</span>
                </span>
              </Link>

              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {subtitle}
              </p>

              {asideContent ? (
                <div className="mt-6 md:mt-8">{asideContent}</div>
              ) : null}
            </div>

            {/* Footer / Back navigation inside left column */}
            <div className="mt-6 pt-2 md:mt-10">
              {(footerText && footerLinkText && footerLinkHref) ? (
                <div className="text-left text-sm text-muted-foreground">
                  {footerText}{" "}
                  <Link
                    href={footerLinkHref}
                    className="font-medium text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-2 hover:decoration-brand-2"
                  >
                    {footerLinkText}
                  </Link>
                </div>
              ) : null}

              {backHref ? (
                <div className="mt-3 text-left">
                  <Link
                    href={backHref}
                    className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
                  >
                    ← {backText || "Back"}
                  </Link>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right panel on desktop (Form content) */}
          <div className="pt-6 md:col-span-7 md:pt-0 flex flex-col justify-center">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center px-5 py-12 md:py-16">
      {/* Brand header */}
      <Link href="/" className="group mb-8 flex items-center gap-2.5 transition-opacity hover:opacity-80">
        <Image
          src="/logo.png"
          alt="PTSC logo"
          width={36}
          height={36}
          className="size-9 object-contain transition-transform group-hover:scale-105"
          priority
        />
        <span className="text-base font-semibold tracking-tight">
          PTSC<span className="text-muted-foreground font-normal"> · KNIT</span>
        </span>
      </Link>

      {/* Main card */}
      <div
        className={cn(
          "ptsc-card ptsc-reveal relative w-full overflow-hidden rounded-3xl p-6 shadow-2xl transition-all md:p-8",
          className
        )}
      >
        <div className="mb-6 text-center">
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {children}

        {/* Footer navigation */}
        {(footerText && footerLinkText && footerLinkHref) ? (
          <div className="mt-6 border-t border-white/10 pt-5 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-medium text-foreground underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-2 hover:decoration-brand-2"
            >
              {footerLinkText}
            </Link>
          </div>
        ) : null}

        {backHref ? (
          <div className="mt-4 text-center">
            <Link
              href={backHref}
              className="text-xs text-muted-foreground/70 transition-colors hover:text-foreground"
            >
              ← {backText || "Back"}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
