"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

// Underlined fields; the shadow thickens the line on focus without shifting layout
const field =
  "mt-2 w-full border-0 border-b border-ink/50 bg-transparent px-0 py-2 text-lead text-ink transition-[border-color,box-shadow] focus:border-ink focus:shadow-[0_1px_0_0_var(--ink)] focus:outline-none";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(form);

    // Web3Forms — free service that emails form submissions.
    // Sign up at https://web3forms.com and put your access key in
    // .env.local as NEXT_PUBLIC_WEB3FORMS_KEY, OR replace the literal below.
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "4851c34a-69fb-4760-bbbe-1332076bb4e3"
    );

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message ?? "Something went wrong. Try again?");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Try again?");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="subject" value="New message from neelmallik.com" />
      {/* Honeypot field to deter bots */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-small text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="email" className="text-small text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="text-small text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`${field} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn group"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          {status !== "sending" && (
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          )}
        </button>

        <p role="status" aria-live="polite" className="text-small">
          {status === "sent" && (
            <span className="text-live">Thanks, your message was sent.</span>
          )}
          {status === "error" && (
            <span className="text-danger">{errorMsg}</span>
          )}
        </p>
      </div>
    </form>
  );
}
