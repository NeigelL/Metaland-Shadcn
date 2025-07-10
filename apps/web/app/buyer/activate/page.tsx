// app/activate/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (email && code) {
      setStatus('verifying');

      // Example: Call your API to verify activation
    fetch(`/api/activate-user?email=${encodeURIComponent(email!)}&code=${encodeURIComponent(code!)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        if (res.ok) {
            setStatus('success');
        }
        else throw new Error();
      })
      .catch(() => setStatus('error'));
    }
  }, [email, code]);

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Account Activation</h1>

      {status === 'idle' && <p>Preparing activation...</p>}
      {status === 'verifying' && <p>Verifying your activation code...</p>}
      {status === 'success' && (
        <p className="text-green-600">✅ Your account has been successfully activated! Please login again</p>
      )}
      {status === 'error' && (
        <p className="text-red-600">❌ Invalid or expired activation link.</p>
      )}
    </div>
  );
}
