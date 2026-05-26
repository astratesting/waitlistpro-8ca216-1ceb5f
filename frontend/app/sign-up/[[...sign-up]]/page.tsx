import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <SignUp appearance={{ elements: { rootBox: 'mx-auto', card: 'bg-white text-slate-900' } }} />
    </main>
  );
}
