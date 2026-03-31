"use client";

import { useState, type FormEvent } from "react";

const subjects = [
  { value: "renseignement", label: "Renseignement" },
  { value: "piece", label: "Pi\u00E8ce sp\u00E9cifique" },
  { value: "commande", label: "Commande sur mesure" },
  { value: "autre", label: "Autre" },
];

export function ContactForm() {
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "renseignement",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Veuillez entrer votre nom";
    if (!form.email.trim()) {
      newErrors.email = "Veuillez entrer votre email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    if (!form.message.trim()) newErrors.message = "Veuillez entrer un message";
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "renseignement", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-2xl text-text-primary">
          Merci pour votre message
        </h3>
        <p className="mt-3 text-text-secondary">
          Nous vous répondrons dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot - hidden from users */}
      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm text-text-secondary mb-2">
          Nom *
        </label>
        <input
          type="text"
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-border-custom text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-border-custom text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm text-text-secondary mb-2">
          Sujet
        </label>
        <select
          id="subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-border-custom text-text-primary text-sm focus:outline-none focus:border-accent transition-colors"
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
          Message *
        </label>
        <textarea
          id="message"
          rows={6}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-3 bg-white border border-border-custom text-text-primary text-sm focus:outline-none focus:border-accent transition-colors resize-vertical"
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue. Veuillez réessayer.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 bg-accent text-white text-sm tracking-widest uppercase hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>
  );
}
