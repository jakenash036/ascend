import { SHOPIFY_CHECKOUT_URL } from "@/lib/constants";

interface CTAButtonProps {
  label?: string;
  className?: string;
}

export default function CTAButton({
  label = "Ascend",
  className = "",
}: CTAButtonProps) {
  return (
    <a
      href={SHOPIFY_CHECKOUT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block px-8 py-4 bg-[#e8e8e3] text-[#0a0a0a] font-semibold tracking-widest uppercase text-sm rounded-none transition-all duration-200 hover:bg-white hover:shadow-[0_0_24px_rgba(232,232,227,0.15)] ${className}`}
    >
      {label}
    </a>
  );
}
