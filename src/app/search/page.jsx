"use client";

import Link from "next/link";
import { useState } from "react";
import { connectapi } from "@/lib/connector";

export default function Search() {
  const [q, setQ] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const search = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await connectapi(
        `/profiles/search?q=${encodeURIComponent(q)}`
      );

      setData(res.data || []);
    } catch (err) {
      setData([]);
      setMessage(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Search</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search profiles..."
          className="border p-2 rounded w-full max-w-md"
        />

        <button
          onClick={search}
          disabled={loading || !q.trim()}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && <p className="text-red-600 mb-4">{message}</p>}

      <div className="space-y-3">
        {data.map((profile) => (
          <Link
            key={profile.id}
            href={`/profiles/${profile.id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <div className="font-medium">{profile.name}</div>
            <div className="text-sm text-gray-500">
              {profile.gender} · {profile.age_group} · {profile.country_id}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
