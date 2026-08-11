export type FaqItem = {
  question: string;
  answer: string;
};

/* Verbatim Q&A set — the FAQ page, the homepage preview, and the FAQPage
   JSON-LD schema all read from this single source so the structured data
   matches the visible text word-for-word. */
export const faqs: FaqItem[] = [
  {
    question: "Is Cash on Delivery available?",
    answer:
      "Yes, COD is available nationwide across Bangladesh. A COD fee applies — 70 Tk within Chattogram, 120 Tk for delivery anywhere else in Bangladesh. Orders are delivered via Steadfast Courier, who calls before delivery.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders within Chattogram are delivered within 3 days. Deliveries to Dhaka and the rest of Bangladesh take within a week.",
  },
  {
    question: "Do you ship outside Bangladesh?",
    answer: "Not currently. Cologne Noir ships within Bangladesh only.",
  },
  {
    question: "Are these original, authentic fragrances?",
    answer:
      "Yes. Cologne Noir sources directly from a trusted international supplier with direct access to authentic retail stock, ensuring every bottle is genuine before decanting. Batch code verification and video proof of the original bottle are available on request.",
  },
  {
    question: "Are these decants or full bottles?",
    answer:
      "Both. You can order a 5ml decant or request a full, sealed bottle. Full bottle requests depend on current availability and may take slightly longer than a week to fulfill.",
  },
  {
    question: "What's the minimum order size?",
    answer: "5ml.",
  },
  {
    question: "What if my order arrives damaged?",
    answer: "Full refund if a decant or bottle arrives damaged.",
  },
  {
    question: "How do I place an order?",
    answer:
      "Directly through the Cologne Noir website checkout, or via WhatsApp, Facebook, or Instagram DM.",
  },
];

/* The three most common questions, shown on the homepage as a preview. */
export const faqPreview = faqs.slice(0, 3);