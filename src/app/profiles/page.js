"use client";

import { useEffect, useState } from "react";
import { connectapi } from "@/lib/connector";

export default function Profiles() {
  const [data, setData] = useState([]);

  useEffect(() => {
    connectapi("/profiles?page=1&limit=10")
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Profiles</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Age</th>
          </tr>
        </thead>

        <tbody>
          {data.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.gender}</td>
              <td>{p.age}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}