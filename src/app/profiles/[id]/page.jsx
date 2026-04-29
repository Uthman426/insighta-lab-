"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { connectapi } from "@/lib/connector";

export default function ProfileDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await connectapi(`/profiles/${id}`);
        setProfile(res.data);
      } catch (err) {
        setMessage(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProfile();
  }, [id]);

  if (loading) {
    return (
      <main className="p-6">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (message) {
    return (
      <main className="p-6">
        <button
          onClick={() => router.back()}
          className="mb-4 border px-3 py-2 rounded"
        >
          Back
        </button>

        <p className="text-red-600">{message}</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="mb-6 border px-3 py-2 rounded"
      >
        Back
      </button>

      <section className="border rounded p-6">
        <h1 className="text-2xl font-semibold mb-1">{profile.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Profile ID: {profile.id}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Detail label="Gender" value={profile.gender} />
          <Detail
            label="Gender probability"
            value={formatPercent(profile.gender_probability)}
          />
          <Detail label="Age" value={profile.age} />
          <Detail label="Age group" value={profile.age_group} />
          <Detail label="Country ID" value={profile.country_id} />
          <Detail label="Country name" value={profile.country_name} />
          <Detail
            label="Country probability"
            value={formatPercent(profile.country_probability)}
          />
          <Detail
            label="Created at"
            value={new Date(profile.created_at).toLocaleString()}
          />
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="border rounded p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value ?? "N/A"}</p>
    </div>
  );
}

function formatPercent(value) {
  if (typeof value !== "number") return "N/A";
  return `${Math.round(value * 100)}%`;
}
