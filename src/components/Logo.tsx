import Image from "next/image";
import Link from "next/link";

export default function Logo({
  variant = "dark",
  className = "",
}: {
  /**
   * "dark" = used on light/ivory backgrounds (renders compact text mark in re-ink)
   * "light" = used on navy/black backgrounds (renders full PNG with white "media" + REAL ESTATE)
   */
  variant?: "dark" | "light";
  className?: string;
}) {
  if (variant === "light") {
    return (
      <Link
        href="/"
        aria-label="SCRM Media Real Estate. Home"
        className={`inline-flex items-center ${className}`}
      >
        <Image
          src="/logo.png"
          alt="SCRM Media Real Estate"
          width={3120}
          height={1779}
          priority
          className="h-12 md:h-14 w-auto"
        />
      </Link>
    );
  }

  // Dark variant: the brand PNG recoloured for light backgrounds.
  return (
    <Link
      href="/"
      aria-label="SCRM Media Real Estate. Home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/logo-dark.png"
        alt="SCRM Media Real Estate"
        width={2726}
        height={1245}
        priority
        className="h-10 md:h-11 w-auto"
      />
    </Link>
  );
}
