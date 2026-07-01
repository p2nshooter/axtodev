import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MAX_LANGUAGE_DOWNLOADS_PER_BOOK } from "@/lib/constants";

export const metadata = { title: "FAQ" };

const FAQS = [
  {
    q: "Is every e-book on AXTO.dev legal to sell?",
    a: "Yes. Every title is either 100% original, public domain, or distributed under a license that explicitly permits commercial redistribution (PLR/MRR/royalty-free). We never publish pirated or copyrighted material without permission.",
  },
  {
    q: "How many languages can I download per e-book?",
    a: `You can download up to ${MAX_LANGUAGE_DOWNLOADS_PER_BOOK} language versions per purchased e-book, enforced automatically on our servers.`,
  },
  {
    q: "What payment methods are supported?",
    a: "PayPal and several major cryptocurrencies (BTC, ETH, BNB, SOL, USDT, DOGE), quoted at a live exchange rate at checkout.",
  },
  {
    q: "How does crypto payment confirmation work?",
    a: "We show you an exact amount and address with a 20-minute live-rate quote. After sending, you can submit your transaction hash — our team verifies it on-chain and confirms your order, usually within a few hours.",
  },
  {
    q: "Can I get a refund?",
    a: "See our Refund Policy — we review refund requests case by case within 7 days of purchase.",
  },
];

export default function FaqPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="font-serif text-3xl font-bold">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className="mt-8">
        {FAQS.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{item.q}</AccordionTrigger>
            <AccordionContent>{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
