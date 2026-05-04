"use client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function LoginPage() {
  const login = () => {
    if (!BACKEND_URL) {
      alert("NEXT_PUBLIC_BACKEND_URL is missing. Add it in your web deployment environment variables.");
      return;
    }

    window.location.href = `${BACKEND_URL}/api/auth/github`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <section className="w-full max-w-sm border bg-white rounded p-6">
        <h1 className="text-2xl font-semibold mb-2">Insighta Labs+</h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in to access profiles, search, and analytics.
        </p>

        <button
          onClick={login}
          className="w-full bg-black text-white px-6 py-3 rounded"
        >
          Continue with GitHub
        </button>
      </section>
    </main>
  );
}
