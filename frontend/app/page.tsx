'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, Gift, Mail, Share2, Shield, Sparkles, Star, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const features = [
  { icon: Mail, title: 'Segmented capture', body: 'Collect email, role, company size, and source so launch messages land with context.' },
  { icon: Share2, title: 'Referral engine', body: 'Every signup gets a unique code and tracked referral URL for viral growth loops.' },
  { icon: Gift, title: 'Milestone rewards', body: 'Unlock beta perks as referrals grow: preview invite, founder badge, and priority access.' },
  { icon: BarChart3, title: 'Launch analytics', body: 'Track signups, conversion, referrals, tier mix, and email sequence status.' },
];

const tiers = [
  { name: 'Preview', refs: '0 referrals', perk: 'Product updates and early demos' },
  { name: 'Beta', refs: '3 referrals', perk: 'Private beta access and feedback calls' },
  { name: 'Founder', refs: '10 referrals', perk: 'Lifetime launch discount and founder badge' },
];

const testimonials = [
  'WaitlistPro gave us a referral loop before our product was public.',
  'The tiered beta access made our launch feel scarce and measurable.',
  'We replaced three spreadsheets with one focused waitlist dashboard.',
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [segment, setSegment] = useState('founder');
  const [message, setMessage] = useState('');
  const progress = useMemo(() => 68, []);

  async function joinWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('Saving your spot...');
    try {
      const response = await fetch(`${apiUrl}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, segment, source: 'landing_page' }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Signup failed');
      setMessage(`You are in. Referral code: ${data.referral_code}`);
      setEmail('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Signup failed');
    }
  }

  return (
    <main className="overflow-hidden">
      <section className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.22),transparent_30%)]" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
            <Sparkles className="h-4 w-4" /> Built for founders launching from zero
          </div>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            Turn waitlist signups into qualified beta users.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            WaitlistPro captures segmented leads, rewards referrals, displays launch momentum, and gives your team a dashboard for beta access decisions.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
            {['Clerk auth', 'Supabase data', 'Referral codes', 'Email sequence logs'].map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-mint" /> {item}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }} className="card">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Live waitlist</p>
              <p className="text-3xl font-black">12,480 builders</p>
            </div>
            <div className="rounded-2xl bg-mint/15 p-3 text-mint"><Users /></div>
          </div>
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm text-slate-300">
              <span>Beta capacity</span><span>{progress}% filled</span>
            </div>
            <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-mint" style={{ width: `${progress}%` }} /></div>
          </div>
          <form onSubmit={joinWaitlist} className="space-y-3">
            <input className="input" type="email" required placeholder="founder@startup.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            <select className="input" value={segment} onChange={(event) => setSegment(event.target.value)}>
              <option value="founder">Founder</option>
              <option value="marketer">Marketer</option>
              <option value="creator">Creator</option>
              <option value="investor">Investor</option>
            </select>
            <button className="btn w-full" type="submit">Join waitlist <ArrowRight className="ml-2 h-4 w-4" /></button>
          </form>
          {message && <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm text-slate-200">{message}</p>}
        </motion.div>
      </section>

      <section id="features" className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="card">
            <feature.icon className="mb-4 h-7 w-7 text-blue-300" />
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{feature.body}</p>
          </div>
        ))}
      </section>

      <section id="tiers" className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div><p className="text-sm uppercase tracking-[0.3em] text-blue-300">Access tiers</p><h2 className="mt-2 text-3xl font-black">Reward momentum with beta access.</h2></div>
          <p className="max-w-xl text-slate-300">Milestones keep users sharing and show where every lead sits in launch priority.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="card">
              <Star className="mb-4 h-6 w-6 text-yellow-300" />
              <h3 className="text-2xl font-black">{tier.name}</h3>
              <p className="mt-1 text-blue-200">{tier.refs}</p>
              <p className="mt-4 text-slate-300">{tier.perk}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-12 md:grid-cols-3">
        {testimonials.map((quote, index) => (
          <div key={quote} className="card">
            <p className="text-slate-200">“{quote}”</p>
            <p className="mt-4 text-sm text-slate-400">Launch operator #{index + 1}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="card flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div><h2 className="text-3xl font-black">Ready for first 1,000 signups?</h2><p className="mt-2 text-slate-300">Launch with capture, referrals, social proof, tiers, emails, and analytics from day one.</p></div>
          <a href="#" className="btn">Start building <Shield className="ml-2 h-4 w-4" /></a>
        </div>
      </section>
    </main>
  );
}
