import { currentUser } from '@clerk/nextjs/server';
import { Activity, BarChart3, MailCheck, Share2, Trophy, Users } from 'lucide-react';

const metrics = [
  { label: 'Total signups', value: '12,480', change: '+18%', icon: Users },
  { label: 'Referral signups', value: '4,126', change: '+31%', icon: Share2 },
  { label: 'Beta qualified', value: '842', change: '+12%', icon: Trophy },
  { label: 'Emails sent', value: '18,904', change: '99.2% delivered', icon: MailCheck },
];

const segments = [
  { name: 'Founders', count: 4280, width: '84%' },
  { name: 'Marketers', count: 3190, width: '63%' },
  { name: 'Creators', count: 2840, width: '56%' },
  { name: 'Investors', count: 940, width: '18%' },
];

const referrals = [
  { email: 'maya@northstar.so', code: 'MAYA-8472', refs: 18, tier: 'Founder' },
  { email: 'eli@launchlab.ai', code: 'ELI-9021', refs: 11, tier: 'Founder' },
  { email: 'nora@buildfast.dev', code: 'NORA-1180', refs: 7, tier: 'Beta' },
  { email: 'sam@growthops.co', code: 'SAM-4429', refs: 3, tier: 'Beta' },
];

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-blue-300">Analytics dashboard</p>
          <h1 className="mt-2 text-4xl font-black">Welcome{user?.firstName ? `, ${user.firstName}` : ''}.</h1>
          <p className="mt-2 text-slate-300">Monitor capture, referrals, beta tiers, and email sequence health.</p>
        </div>
        <div className="rounded-2xl border border-mint/30 bg-mint/10 px-4 py-3 text-sm text-mint">Launch score: 91/100</div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="card">
            <div className="mb-4 flex items-center justify-between"><metric.icon className="h-6 w-6 text-blue-300" /><span className="text-sm text-mint">{metric.change}</span></div>
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-1 text-3xl font-black">{metric.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="card">
          <div className="mb-6 flex items-center gap-3"><BarChart3 className="text-blue-300" /><h2 className="text-xl font-bold">Segment mix</h2></div>
          <div className="space-y-5">
            {segments.map((segment) => (
              <div key={segment.name}>
                <div className="mb-2 flex justify-between text-sm"><span>{segment.name}</span><span className="text-slate-400">{segment.count.toLocaleString()}</span></div>
                <div className="h-3 rounded-full bg-white/10"><div className="h-3 rounded-full bg-gradient-to-r from-blue-400 to-mint" style={{ width: segment.width }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="mb-6 flex items-center gap-3"><Activity className="text-blue-300" /><h2 className="text-xl font-bold">Top referral advocates</h2></div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/10 text-slate-300"><tr><th className="p-3">Lead</th><th className="p-3">Code</th><th className="p-3">Refs</th><th className="p-3">Tier</th></tr></thead>
              <tbody>
                {referrals.map((row) => (
                  <tr key={row.code} className="border-t border-white/10"><td className="p-3">{row.email}</td><td className="p-3 text-blue-200">{row.code}</td><td className="p-3">{row.refs}</td><td className="p-3"><span className="rounded-full bg-white/10 px-3 py-1">{row.tier}</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-3">
        {['Welcome email sent after signup', 'Referral nudge sent at day 3', 'Beta invite sent when tier unlocks'].map((step) => (
          <div key={step} className="card"><MailCheck className="mb-4 h-6 w-6 text-mint" /><h3 className="font-bold">{step}</h3><p className="mt-2 text-sm text-slate-400">Logged in Supabase email_logs and ready for Resend delivery.</p></div>
        ))}
      </section>
    </main>
  );
}
