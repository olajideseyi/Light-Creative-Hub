"use client";

import { FormEvent, useState } from "react";

const serviceOptions = ["Branding & graphic design", "Printing & document services", "Photography", "Videography", "Content production", "Other / not sure"];

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      company: String(data.get("company") ?? ""),
      details: String(data.get("details") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? "")
    };
    try {
      const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Something went wrong.");
      form.reset();
      setStatus("success");
      setMessage("Thank you — your enquiry has been received. We will get back to you.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your enquiry right now.");
    }
  }

  return <form className="quote-form" onSubmit={handleSubmit}>
    <div className="form-grid">
      <label>Your name *<input name="name" required minLength={2} maxLength={120} autoComplete="name" /></label>
      <label>Email address *<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      <label>Phone number<input name="phone" type="tel" maxLength={40} autoComplete="tel" /></label>
      <label>Company / organisation<input name="company" maxLength={160} autoComplete="organization" /></label>
      <label className="full-field">What do you need? *<select name="service" required defaultValue=""><option value="" disabled>Select a service</option>{serviceOptions.map(option => <option key={option}>{option}</option>)}</select></label>
      <label className="full-field">Tell us about the project *<textarea name="details" required minLength={10} maxLength={5000} rows={6} placeholder="Your idea, quantity, preferred timeline, or other details..." /></label>
    </div>
    <label className="consent"><input type="checkbox" name="consent" required /> I agree that Light Creative Hub may use these details to respond to my enquiry.</label>
    <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <button className="button button-blue" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send enquiry ↗"}</button>
    {message && <p role="status" className={status === "error" ? "form-error" : "form-message"}>{message}</p>}
  </form>;
}
