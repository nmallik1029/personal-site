// Personal details used across the site.
// `education` and `resumeSkills` are shown on /resume and mirror the PDF in
// /public, so update both together.

export const profile = {
  name: "Neel Mallik",
  description:
    "Computer science student at Northeastern. I build web apps that work with stock market data.",
  // Shown on the intro screen when the home page first loads, then in the hero
  welcome: "Welcome to my site!",
  location: "Boston, MA",
  availability: "January – August 2027",
  email: "nmallik1029@gmail.com",
  phone: "(563) 340-8972",
  github: {
    label: "github.com/nmallik1029",
    href: "https://github.com/nmallik1029",
  },
  linkedin: {
    label: "linkedin.com/in/neel-mallik",
    href: "https://linkedin.com/in/neel-mallik",
  },
  resumePdf: "/Neel_Mallik_Resume.pdf",
};

export const education = {
  school: "Northeastern University",
  degree:
    "Candidate for B.S. Computer Science, Minor in Mathematics, Concentration in Artificial Intelligence",
  graduation: "Expected May 2028",
  courses: "Computer Systems, Artificial Intelligence, Machine Learning",
  gpa: "3.5/4.0",
};

export type SkillGroup = { label: string; items: string[] };

// Shown on /resume.
export const resumeSkills: SkillGroup[] = [
  { label: "Languages", items: ["Python", "SQL", "Java", "HTML", "JS", "CSS", "TypeScript"] },
  { label: "Frameworks", items: ["REST APIs", "React", "Next.js", "Prisma"] },
  { label: "Software", items: ["Docker", "VS Code", "Cloudflare", "Git/Github"] },
  { label: "Databases", items: ["SQLite", "Supabase"] },
];
