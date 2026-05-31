import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Legal",
  title: "Refund",
  accent: "Policy.",
  intro:
    "Our cancellation and refund terms, including timeframes for reporting issues and processing approved refunds.",
  metaTitle: "Refund Policy | WindChasers Aviation Academy",
  testimonials: false,
  blocks: [
    {
      type: "richtext",
      title: "Cancellation & Refund Policy",
      paragraphs: [
        "WindChasers believes in helping its customers as far as possible, and has therefore a liberal cancellation policy.",
      ],
    },
    {
      type: "richtext",
      title: "Cancellations",
      paragraphs: [
        "Cancellations will be considered only if the request is made immediately after placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.",
        "WindChasers does not accept cancellation requests for perishable items like flowers, eatables etc. However, refund/replacement can be made if the customer establishes that the quality of product delivered is not good.",
      ],
    },
    {
      type: "richtext",
      title: "Damaged or Defective Items",
      paragraphs: [
        "In case of receipt of damaged or defective items please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at his own end. This should be reported within 2 Days of receipt of the products.",
        "In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2 Days of receiving the product. The Customer Service Team after looking into your complaint will take an appropriate decision.",
      ],
    },
    {
      type: "richtext",
      title: "Warranty Items & Refund Processing",
      paragraphs: [
        "In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.",
        "In case of any Refunds approved by WindChasers, it’ll take 3-5 Days for the refund to be processed to the end customer.",
        "For any refund-related queries, contact us at aviators@windchasers.in. WindChasers is based in Bangalore, India.",
      ],
    },
  ],
  ctaTitle: "Need help with a refund?",
  ctaText:
    "Contact our team at aviators@windchasers.in and we’ll guide you through the process.",
};

export default content;
