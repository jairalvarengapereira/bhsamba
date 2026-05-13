'use client';

import { useState } from 'react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  async function handleClick() {
    setError('');
    setStatus(' Fazendo login...');
    
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setStatus(' Login OK! Redirecionando...');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);
    } else {
      setError('Senha incorreta');
      setStatus('');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm p-8 bg-zinc-900 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin BHSamba</h1>
        
        {status && (
          <p className="text-green-500 text-sm mb-4">{status}</p>
        )}
        
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha Admin"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white mb-4"
        />
        
        <button
          type="button"
          onClick={handleClick}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}