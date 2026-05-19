"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="subject" value="New message from neelmallik.com" />
      {/* Honeypot field to deter bots */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label
          htmlFor="name"
          className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none py-2 text-base text-gray-900 placeholder:text-gray-300 transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none py-2 text-base text-gray-900 placeholder:text-gray-300 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block text-xs font-mono uppercase tracking-widest text-gray-400 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full bg-transparent border-b border-gray-200 focus:border-gray-900 outline-none py-2 text-base text-gray-900 placeholder:text-gray-300 transition-colors resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      <div className="flex items-center gap-6 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-mono uppercase tracking-widest border border-gray-900 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {status === "sending" ? "Sending…" : "Send Message"}
          {status !== "sending" && (
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        {status === "sent" && (
          <span className="text-xs font-mono uppercase tracking-widest text-green-600">
            Sent! I&apos;ll be in touch
          </span>
        )}
        {status === "error" && (
          <span className="text-xs font-mono uppercase tracking-widest text-red-600">
            {errorMsg || "Error — try again"}
          </span>
        )}
      </div>
    </form>
  );
}
