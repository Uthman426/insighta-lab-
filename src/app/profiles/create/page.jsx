"use client";

import { useState } from "react";
import { connectapi } from "@/lib/connector";

export default function CreateProfilePage() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const createProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setProfile(null);

    try {
      const res = await connectapi("/profiles", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      setProfile(res.data);
      setName("");
      setMessage("Profile created successfully.");
    } catch (err) {
      setMessage(err.message || "Failed to create profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-2">Create Profile</h1>
      <p className="text-sm text-gray-600 mb-6">
        Admin-only page for creating new profile intelligence records.
      </p>

      <form onSubmit={createProfile} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Harriet Tubman"
            className="border rounded p-2 w-full"
            required
          />
        </div>

        <button
          disabled={loading || !name.trim()}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Profile"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}

      {profile && (
        <section className="mt-6 border rounded p-4">
          <h2 className="font-semibold mb-3">{profile.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>Gender: {profile.gender}</p>
            <p>Gender Probability: {profile.gender_probability}</p>
            <p>Age: {profile.age}</p>
            <p>Age Group: {profile.age_group}</p>
            <p>Country: {profile.country_name}</p>
            <p>Country ID: {profile.country_id}</p>
          </div>
        </section>
      )}
    </main>
  );
}
