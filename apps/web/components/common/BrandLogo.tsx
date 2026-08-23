"use client";

import Link from "next/link";
import Image from "next/image";
import { trpcReact } from "@/lib/trpc-client";

interface BrandLogoProps {
  href?: string;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  imgClassName?: string;
  isDark?: boolean;
}

export default function BrandLogo({
  href = "/",
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  imgClassName = "",
  isDark = false,
}: BrandLogoProps) {
  const { data: settings } = trpcReact.admin.getStoreSettings.useQuery(undefined, {
    staleTime: 60 * 1000 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const storeName = settings?.storeName || "HIMMEL";
  const storeTagline = settings?.storeTagline ?? "fatima zahrae derkaoui";
  const logoUrl = settings?.logoUrl;
  const logoMode = settings?.logoMode || "TEXT_ONLY";

  const renderContent = () => {
    // Mode 1: IMAGE_ONLY
    if (logoMode === "IMAGE_ONLY" && logoUrl) {
      return (
        <div className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={storeName}
            className={`h-9 w-auto max-h-12 object-contain transition-transform hover:scale-105 ${imgClassName}`}
          />
        </div>
      );
    }

    // Mode 2: IMAGE_AND_TEXT
    if (logoMode === "IMAGE_AND_TEXT" && logoUrl) {
      return (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt={storeName}
            className={`h-8 w-auto max-h-10 object-contain ${imgClassName}`}
          />
          <div className="flex flex-col">
            <span
              className={`font-heading text-lg font-bold tracking-widest text-gold-dark transition-colors hover:text-gold sm:text-xl ${titleClassName}`}
            >
              {storeName}
            </span>
            {storeTagline && (
              <span
                className={`font-semibold text-[10px] uppercase tracking-wider ${
                  isDark ? "text-stone-400" : "text-black"
                } ${subtitleClassName}`}
              >
                {storeTagline}
              </span>
            )}
          </div>
        </div>
      );
    }

    // Mode 3 (Default): TEXT_ONLY
    return (
      <div className="flex flex-col">
        <span
          className={`font-heading text-xl font-bold tracking-widest text-gold-dark transition-colors hover:text-gold sm:text-2xl ${titleClassName}`}
        >
          {storeName}
        </span>
        {storeTagline && (
          <span
            className={`font-semibold text-xs uppercase tracking-wide ml-8 w-fit ${
              isDark ? "text-stone-400" : "text-black"
            } ${subtitleClassName}`}
          >
            {storeTagline}
          </span>
        )}
      </div>
    );
  };

  if (!href) {
    return <div className={`flex items-center ${className}`}>{renderContent()}</div>;
  }

  return (
    <Link href={href} className={`flex items-center ${className}`}>
      {renderContent()}
    </Link>
  );
}
