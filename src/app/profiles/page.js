"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { connectapi } from "@/lib/connector";

export default function Profiles() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    connectapi("/profiles?page=1&limit=10")
      .then((res) => setData(res.data || []))
      .catch((err) => setMessage(err.message || "Failed to load profiles"));
  }, []);

  return (
    <main className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Profiles</h1>

        <Link
          href="/profiles/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Profile
        </Link>
      </div>

      {message && <p className="mb-4 text-red-600">{message}</p>}

      <table className="w-full border">
        <thead>
          <tr>
            <th className="text-left p-2 border">Name</th>
            <th className="text-left p-2 border">Gender</th>
            <th className="text-left p-2 border">Age</th>
            <th className="text-left p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((profile) => {
            const profileId = profile.id || profile._id;

            return (
              <tr key={profileId}>
                <td className="p-2 border">{profile.name}</td>
                <td className="p-2 border">{profile.gender}</td>
                <td className="p-2 border">{profile.age}</td>
                <td className="p-2 border">
                  <Link
                    href={`/profiles/${profileId}`}
                    className="text-blue-600 underline"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
