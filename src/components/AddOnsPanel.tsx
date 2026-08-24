import { ADD_ONS } from "@/lib/pricing";

/**
 * Every add-on and its price, laid out in full. Prices behind a toggle were a
 * click between an agent and the number they came for.
 */
export default function AddOnsPanel() {
  return (
    /* Flex rather than grid so a final odd card centres instead of stranding
       itself in the left column. */
    <ul className="flex flex-wrap justify-center gap-5 text-left">
      {ADD_ONS.map((addOn) => (
        <li
          key={addOn.name}
          className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)] rounded-2xl border border-re-stone-light bg-white p-6 transition-all duration-500 hover:border-re-blue-accent/40 hover:shadow-[0_18px_44px_rgba(30,98,224,0.1)]"
        >
          <p className="font-serif text-3xl text-re-blue">{addOn.price}</p>
          <p className="mt-2 text-re-ink font-medium">{addOn.name}</p>
          {addOn.detail && <p className="mt-1 text-sm text-re-stone">{addOn.detail}</p>}
        </li>
      ))}
    </ul>
  );
}
