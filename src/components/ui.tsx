import Link from "next/link";

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-7xl px-5 md:px-8 ${className}`}>{children}</div>
  );
}

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`label-eyebrow ${light ? "!text-white/70" : ""}`}>{children}</span>
  );
}

export function H2({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <h2 className={`h-display text-3xl md:text-5xl ${light ? "text-white" : "text-re-ink"} ${className}`}>
      {children}
    </h2>
  );
}

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "outline" | "outline-light";
  className?: string;
  external?: boolean;
};

export function CTAButton({
  href,
  children,
  variant = "solid",
  className = "",
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-7 py-3.5 text-sm tracking-tight rounded-full transition-all duration-300 min-h-[44px] hover:-translate-y-0.5 active:translate-y-0";
  const styles = {
    solid: "bg-re-blue text-white hover:bg-re-blue-accent hover:shadow-[0_10px_30px_rgba(28,58,94,0.3)]",
    outline: "border border-re-ink text-re-ink hover:bg-re-ink hover:text-white hover:shadow-[0_10px_30px_rgba(26,26,26,0.18)]",
    "outline-light": "border border-white/70 text-white hover:bg-white hover:text-re-blue hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]",
  } as const;

  const content = (
    <>
      {children}
      <span aria-hidden>→</span>
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${base} ${styles[variant]} ${className}`}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {content}
    </Link>
  );
}

export function Section({
  children,
  className = "",
  dark = false,
  panel,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  /** Floating rounded panel instead of a full-bleed band. */
  panel?: "white" | "blue";
  id?: string;
}) {
  if (panel) {
    return (
      <section id={id} className={`py-6 md:py-10 ${className}`}>
        <div className="mx-auto max-w-[1440px] px-3 md:px-6">
          <div
            className={`rounded-[2rem] md:rounded-[3rem] py-16 md:py-24 ${
              panel === "blue"
                ? "bg-re-blue text-white shadow-[0_30px_80px_rgba(28,58,94,0.25)]"
                : "bg-white border border-re-stone-light shadow-[0_20px_60px_rgba(28,58,94,0.06)]"
            }`}
          >
            {children}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${dark ? "bg-re-blue text-white" : ""} ${className}`}
    >
      {children}
    </section>
  );
}
