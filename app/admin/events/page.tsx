"use client";

import { useState } from "react";
import { events as ALL_EVENTS, type WindEvent } from "@/content/shared/events";

const MODES: WindEvent["mode"][] = [
  "Online Webinar",
  "Open House",
  "Seminar",
  "Workshop",
];

const EMPTY = {
  id: "",
  title: "",
  date: "",
  when: "",
  mode: "Online Webinar" as WindEvent["mode"],
  blurb: "",
  vimeoId: "",
  registerHref: "/webinar",
  registrationOpen: false,
};

export default function EventsAdmin() {
  const [form, setForm] = useState({ ...EMPTY });
  const [showForm, setShowForm] = useState(false);

  const today = new Date();
  const isPast = (e: WindEvent) => new Date(e.date).getTime() < today.getTime();

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-gold text-black text-sm font-semibold px-4 py-2 hover:bg-gold/90 transition-colors"
        >
          {showForm ? "Close" : "+ Add event"}
        </button>
      </div>
      <p className="text-white/55 text-sm mb-6">
        Events shown on the homepage and the webinar / open-house pages. Toggle
        registration open/closed per event.
      </p>

      {/* Scaffold notice */}
      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
        <strong>Scaffold:</strong> events currently live in{" "}
        <code className="text-amber-100">content/shared/events.ts</code>. This
        screen is read-only until it&apos;s wired to a DB/API, then Add / Edit /
        toggle will persist without a code deploy.
      </div>

      {/* Add-event form (structure only) */}
      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: POST to /api/admin/events once persistence is wired.
            alert(
              "Not wired yet, this form is the scaffold. Connect it to an events API/DB to save."
            );
          }}
          className="mb-8 grid gap-4 rounded-xl border border-white/10 bg-[#141414] p-5 sm:grid-cols-2"
        >
          <Field label="Title">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="WindChasers Pilot Career Webinar" />
          </Field>
          <Field label="ID (slug)">
            <input value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className={inputCls} placeholder="pilot-career-webinar" />
          </Field>
          <Field label="Date (YYYY-MM-DD)">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
          </Field>
          <Field label="When (display label)">
            <input value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} className={inputCls} placeholder="Sat, 15 Jul · 6:00 PM IST" />
          </Field>
          <Field label="Mode">
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as WindEvent["mode"] })} className={inputCls} style={{ colorScheme: "dark" }}>
              {MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Register link">
            <input value={form.registerHref} onChange={(e) => setForm({ ...form, registerHref: e.target.value })} className={inputCls} placeholder="/webinar" />
          </Field>
          <Field label="Vimeo ID (optional clip)">
            <input value={form.vimeoId} onChange={(e) => setForm({ ...form, vimeoId: e.target.value })} className={inputCls} placeholder="1160946921" />
          </Field>
          <Field label="Registration">
            <label className="flex items-center gap-2 text-sm text-white/80 h-11">
              <input type="checkbox" checked={form.registrationOpen} onChange={(e) => setForm({ ...form, registrationOpen: e.target.checked })} />
              Registration open
            </label>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Blurb">
              <textarea value={form.blurb} onChange={(e) => setForm({ ...form, blurb: e.target.value })} rows={2} className={inputCls + " resize-none"} placeholder="A free online session on how to plan your route to the cockpit…" />
            </Field>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button type="submit" className="rounded-lg bg-gold text-black text-sm font-semibold px-5 py-2.5 hover:bg-gold/90">Save event</button>
            <button type="button" onClick={() => setForm({ ...EMPTY })} className="rounded-lg border border-white/15 text-white/70 text-sm px-5 py-2.5 hover:border-white/40">Reset</button>
          </div>
        </form>
      )}

      {/* Events table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="bg-white/5 text-white/50 text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Registration</th>
              <th className="px-4 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {ALL_EVENTS.map((e) => (
              <tr key={e.id} className="border-t border-white/5">
                <td className="px-4 py-3 text-white font-medium">{e.title}</td>
                <td className="px-4 py-3 text-white/70">{e.when}</td>
                <td className="px-4 py-3 text-white/70">{e.mode}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isPast(e) ? "bg-white/10 text-white/50" : "bg-blue-500/15 text-blue-300"}`}>
                    {isPast(e) ? "Past" : "Upcoming"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${e.registrationOpen ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {e.registrationOpen ? "Open" : "Closed"}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/50">{e.registerHref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-[#0d0d0d] border border-white/15 rounded-lg px-3 h-11 text-white placeholder-white/30 focus:border-gold focus:outline-none transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-white/50 mb-1.5">{label}</span>
      {children}
    </label>
  );
}
