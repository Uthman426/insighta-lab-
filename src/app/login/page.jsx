"use client";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <button
        onClick={() => {
          window.location.href = `${BACKEND_URL}/api/auth/github`;
        }}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Continue with GitHub
      </button>
    </main>
  );
}
