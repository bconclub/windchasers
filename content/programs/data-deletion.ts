import type { ProgramContent } from "@/components/ProgramPage";

const content: ProgramContent = {
  kicker: "Legal",
  title: "User Data Deletion",
  accent: "Instructions.",
  intro:
    "Instructions for requesting deletion of personal data associated with WindChasers communication channels.",
  metaTitle: "Data Deletion Request | WindChasers Aviation Academy",
  testimonials: false,
  campus: false,
  heroActions: false,
  cta: false,
  blocks: [
    {
      type: "richtext",
      title: "Who This Applies To",
      paragraphs: [
        "These instructions apply to users who have contacted WindChasers through Instagram, WhatsApp, website chat, forms, or other PROXe-powered communication channels.",
      ],
    },
    {
      type: "richtext",
      title: "What Data May Be Stored",
      paragraphs: [
        "WindChasers may store enquiry and communication data such as name, phone number, email address, Instagram username or account identifier, Instagram comments, Instagram direct messages, WhatsApp messages, website chat messages, timestamps, enquiry details, and follow-up notes.",
      ],
    },
    {
      type: "richtext",
      title: "Why This Data Is Used",
      paragraphs: [
        "This data is used to respond to student enquiries, provide pilot training counselling, manage admissions follow-ups, maintain conversation history, and improve support quality.",
      ],
    },
    {
      type: "richtext",
      title: "PROXe Role",
      paragraphs: [
        "WindChasers uses PROXe as a technology service provider to manage CRM, messaging, automation, and support workflows. PROXe processes data on behalf of WindChasers and does not sell user data.",
      ],
    },
    {
      type: "richtext",
      title: "Instagram / Meta Data",
      paragraphs: [
        "If you interact with WindChasers through Instagram, we may receive data through Meta APIs, including Instagram account identifiers, direct messages, comments, messaging metadata, and related interaction history. This data is used only to respond to your enquiry and manage WindChasers communication workflows.",
      ],
    },
    {
      type: "richtext",
      title: "How To Request Deletion",
      paragraphs: [
        "To request deletion of your data, email aviators@windchasers.in with the subject line: Data Deletion Request.",
      ],
    },
    {
      type: "richtext",
      title: "What To Include In The Email",
      paragraphs: [
        "Please include enough information for us to identify your records, such as your Instagram username, phone number, email address, or the channel through which you contacted WindChasers.",
      ],
    },
    {
      type: "richtext",
      title: "What Happens After Request",
      paragraphs: [
        "After receiving your request, WindChasers will verify the request and delete or anonymize associated records from active systems, including PROXe-powered CRM and messaging records, unless retention is required for legal, security, dispute-resolution, or legitimate business purposes.",
      ],
    },
    {
      type: "richtext",
      title: "Timeline",
      paragraphs: [
        "We aim to process valid deletion requests within 30 days of receiving sufficient identifying information.",
      ],
    },
    {
      type: "richtext",
      title: "Contact",
      paragraphs: [
        "For privacy or data deletion questions, contact: aviators@windchasers.in.",
      ],
    },
  ],
};

export default content;
