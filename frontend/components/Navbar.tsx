import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Rocket } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Rocket className="h-5 w-5 text-blue-400" />
          WaitlistPro
        </Link>
        <div className="flex items-center gap-4 text-sm text-slate-300">
          <a href="/#features" className="hover:text-white">Features</a>
          <a href="/#tiers" className="hover:text-white">Tiers</a>
          <SignedOut>
            <Link href="/sign-in" className="hover:text-white">Sign in</Link>
            <Link href="/sign-up" className="btn px-4 py-2">Start free</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
