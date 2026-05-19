import ContactForm from "@/components/ContactForm";
import LocalTime from "@/components/LocalTime";

export const metadata = {
  title: "Contact — Neel Mallik",
};

const channels = [
  {
    label: "Email",
    value: "nmallik1029@gmail.com",
    href: "mailto:nmallik1029@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/nmallik1029",
    href: "https://github.com/nmallik1029",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/neel-mallik",
    href: "https://linkedin.com/in/neel-mallik",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-4">
          Contact
        </p>
        <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
          Let&apos;s talk.
        </h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-2xl mb-16">
          I&apos;m always interested in new opportunities, collaboration, or
          just a good conversation about software, finance, or anything in
          between. Drop me a message below or reach out to me directly through one of the channels listed on the right. </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-16 gap-12">
          {/* Form column (2/3 width) */}
          <div className="lg:col-span-2">
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
              Send a message
            </p>
            <ContactForm />
          </div>

          {/* Channels column (1/3 width) */}
          <aside>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6">
              Direct
            </p>
            <ul className="space-y-5">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      c.href.startsWith("http") ? "noopener noreferrer" : undefined
                    }
                    className="group block"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                      {c.label}
                    </p>
                    <p className="text-sm font-mono text-gray-900 underline underline-offset-4 decoration-gray-200 group-hover:decoration-gray-900 transition-colors break-all">
                      {c.value}
                    </p>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
                Based
              </p>
              <p className="text-sm font-mono text-gray-700">
                Boston, MA{" "}
                <span className="text-gray-400">
                  · Local time <LocalTime />
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
