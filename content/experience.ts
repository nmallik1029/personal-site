// Shown on /resume. Mirrors the PDF in /public.
export type Role = {
  role: string;
  org: string;
  period: string;
  bullets: string[];
};

export const experience: Role[] = [
  {
    role: "Community Support",
    org: "Gankster.gg",
    period: "October 2024 – Present",
    bullets: [
      "Resolved 600+ user support tickets for a platform serving over 150,000 users, maintaining high response efficiency and user satisfaction.",
      "Collaborated with developers to streamline workflow and improve overall user experience.",
      "Strengthened communication skills by translating technical issues into clear, actionable reports.",
    ],
  },
  {
    role: "Co-Founder",
    org: "ClinicScreen (Next.js, TypeScript, Raspberry Pi)",
    period: "March 2026 – Present",
    bullets: [
      "Designed and built ClinicScreen, a multi-tenant digital-signage platform geared towards allowing doctors to have more control over ad placement, informational tools, and more for patients in their practice in Illinois, Iowa, and California.",
      "Built a drag-and-drop video timeline editor, a Claude API scraper that imports doctor bios, and Raspberry Pi kiosks with encrypted Bluetooth Wi-Fi setup using QuickAuth for all user authentication.",
    ],
  },
  {
    role: "Founder",
    org: "Games Club @ Northeastern University (Oakland)",
    period: "September 2024 – April 2025",
    bullets: [
      "Initiated student organization focused on community-building via video and board games.",
      "Recruited members via campus fairs and outreach, eventually creating a mailing list of 50+ students.",
    ],
  },
];
