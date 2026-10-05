// Colors are CSS variables in app/globals.css; edit them there. color-mix()
// keeps Tailwind's opacity modifiers (e.g. bg-ink/10) working with them.
const token = (name) =>
  `color-mix(in srgb, var(--${name}) calc(<alpha-value> * 100%), transparent)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: token("paper"),
        surface: token("surface"),
        ink: token("ink"),
        muted: token("muted"),
        rule: token("rule"),
        "on-ink": token("on-ink"),
        live: token("live"),
        danger: token("danger"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      // Text sizes scale with the window, with floors so they stay readable
      // on smaller screens. Display sizes are the .type-* classes in
      // app/globals.css.
      fontSize: {
        micro: ["clamp(0.6875rem, 0.8vw, 0.875rem)", { lineHeight: "1.2" }],
        small: ["clamp(0.875rem, 1vw, 1rem)", { lineHeight: "1.35" }],
        body: ["clamp(1rem, 1.25vw, 1.25rem)", { lineHeight: "1.45" }],
        lead: ["clamp(1.125rem, 1.55vw, 1.5rem)", { lineHeight: "1.35" }],
      },
      spacing: {
        gutter: "var(--gutter)",
      },
    },
  },
  plugins: [],
};
