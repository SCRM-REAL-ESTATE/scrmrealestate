import { SITE } from "@/lib/site";

export default function WhatsAppFab() {
  const message = encodeURIComponent(
    "Hi SCRM Media, I'd like to chat about real estate marketing for my agency."
  );
  const href = `https://wa.me/${SITE.whatsappIntl}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-40 inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:scale-105 transition-transform"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.05 4.91A10.05 10.05 0 0 0 12 2C6.5 2 2.04 6.46 2.04 11.96c0 1.76.46 3.48 1.34 5L2 22l5.18-1.36a9.94 9.94 0 0 0 4.82 1.23h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.0zM12 20.13a8.13 8.13 0 0 1-4.14-1.13l-.3-.18-3.07.81.82-3-.19-.31a8.14 8.14 0 1 1 6.88 3.81zm4.46-6.1c-.24-.12-1.43-.71-1.65-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.29.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.27.36-.41.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42l-.47-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}
