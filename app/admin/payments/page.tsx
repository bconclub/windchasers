"use client";

import { useState } from "react";

type PaymentLink = {
  id: string;
  description: string;
  amount: number;
  currency: string;
  customer: string;
  status: "draft" | "sent" | "paid";
  url: string;
};

const PURPOSES = [
  "Demo class fee",
  "Enrollment deposit",
  "DGCA ground classes",
  "Program fee",
  "Other",
];

export default function PaymentsAdmin() {
  // Local-only scaffold state. Replace with a provider (Razorpay/Stripe) + API.
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [form, setForm] = useState({
    purpose: PURPOSES[0],
    description: "",
    amount: "",
    currency: "INR",
    customer: "",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Payments</h1>
      <p className="text-white/55 text-sm mb-6">
        Create shareable payment links (deposits, demo fees, program fees) and
        track which are paid.
      </p>

      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
        <strong>Scaffold:</strong> not connected to a payment provider yet. Wire
        this to <em>Razorpay</em> or <em>Stripe</em> Payment Links (server route{" "}
        <code className="text-amber-100">/api/admin/payments</code>) + a webhook
        to flip links to <em>paid</em>. The form below is the structure.
      </div>

      {/* Create link */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const amount = parseFloat(form.amount);
          if (!form.description.trim() || !(amount > 0)) return;
          // TODO: POST to /api/admin/payments → provider creates the link → return url.
          setLinks((prev) => [
            {
              id: `tmp_${prev.length + 1}`,
              description: form.description.trim(),
              amount,
              currency: form.currency,
              customer: form.customer.trim(),
              status: "draft",
              url: "(link created after provider is connected)",
            },
            ...prev,
          ]);
          setForm({ ...form, description: "", amount: "", customer: "" });
        }}
        className="mb-8 grid gap-4 rounded-xl border border-white/10 bg-[#141414] p-5 sm:grid-cols-2"
      >
        <Field label="Purpose">
          <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className={inputCls} style={{ colorScheme: "dark" }}>
            {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Description (shown to customer)">
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Demo class fee — Sri" />
        </Field>
        <Field label="Amount">
          <input type="number" min="1" step="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputCls} placeholder="500" />
        </Field>
        <Field label="Currency">
          <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className={inputCls} style={{ colorScheme: "dark" }}>
            <option value="INR">INR ₹</option>
            <option value="USD">USD $</option>
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Customer (name / phone — optional)">
            <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className={inputCls} placeholder="Sri · +91 96634 94784" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-lg bg-gold text-black text-sm font-semibold px-5 py-2.5 hover:bg-gold/90">Create payment link</button>
        </div>
      </form>

      {/* Links table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="bg-white/5 text-white/50 text-left text-xs uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/40">
                  No payment links yet. Create one above.
                </td>
              </tr>
            ) : (
              links.map((l) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="px-4 py-3 text-white">{l.description}</td>
                  <td className="px-4 py-3 text-white/80">
                    {l.currency === "INR" ? "₹" : "$"}
                    {l.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-white/70">{l.customer || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      l.status === "paid" ? "bg-green-500/15 text-green-400"
                      : l.status === "sent" ? "bg-blue-500/15 text-blue-300"
                      : "bg-white/10 text-white/50"
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/40 truncate max-w-[220px]">{l.url}</td>
                </tr>
              ))
            )}
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
