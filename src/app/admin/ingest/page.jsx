"use client";

import { useMemo, useState } from "react";
import { connectapi } from "@/lib/connector";

export default function CsvIngestPage() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fileMeta = useMemo(() => {
    if (!file) return null;

    return {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type || "text/csv",
    };
  }, [file]);

  const uploadCsv = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setSummary(null);

    try {
      const result = await connectapi("/profiles/ingest", {
        method: "POST",
        headers: {
          "Content-Type": "text/csv",
        },
        body: file,
      });

      setSummary(result);
      setMessage("CSV ingestion completed.");
      setFile(null);

      const input = document.getElementById("csv-file");
      if (input) input.value = "";
    } catch (err) {
      setMessage(err.message || "CSV ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = [
      "name,gender,age,country_id,country_name,gender_probability,country_probability",
      "Ada,female,32,NG,Nigeria,0.98,0.87",
      "Tunde,male,27,NG,Nigeria,0.96,0.91",
      "Ama,female,41,GH,Ghana,0.94,0.89",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "profiles-template.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">CSV Ingestion</h1>
        <p className="text-sm text-gray-600">
          Admin-only upload for importing profile records in bulk.
        </p>
      </div>

      <section className="border rounded p-4 mb-6">
        <h2 className="font-semibold mb-3">Required CSV Header</h2>

        <pre className="bg-gray-100 border rounded p-3 text-sm overflow-x-auto">
{`name,gender,age,country_id,country_name,gender_probability,country_probability`}
        </pre>

        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-3 border px-4 py-2 rounded text-sm"
        >
          Download Template
        </button>
      </section>

      <form onSubmit={uploadCsv} className="space-y-4">
        <div>
          <label htmlFor="csv-file" className="block text-sm font-medium mb-1">
            CSV File
          </label>

          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border rounded p-2 w-full"
          />
        </div>

        {fileMeta && (
          <div className="border rounded p-3 text-sm bg-gray-50">
            <p>
              <span className="font-medium">File:</span> {fileMeta.name}
            </p>
            <p>
              <span className="font-medium">Size:</span> {fileMeta.size}
            </p>
            <p>
              <span className="font-medium">Type:</span> {fileMeta.type}
            </p>
          </div>
        )}

        <button
          disabled={loading || !file}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm">
          {message}
        </p>
      )}

      {summary && (
        <section className="mt-6 border rounded p-4">
          <h2 className="font-semibold mb-4">Ingestion Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm mb-5">
            <div className="border rounded p-3">
              <p className="text-gray-500">Status</p>
              <p className="font-semibold">{summary.status}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-gray-500">Total Rows</p>
              <p className="font-semibold">{summary.total_rows}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-gray-500">Inserted</p>
              <p className="font-semibold text-green-700">{summary.inserted}</p>
            </div>

            <div className="border rounded p-3">
              <p className="text-gray-500">Skipped</p>
              <p className="font-semibold text-red-700">{summary.skipped}</p>
            </div>
          </div>

          <h3 className="font-medium mb-2">Skipped Reasons</h3>

          {summary.reasons && Object.keys(summary.reasons).length > 0 ? (
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-2 border-b">Reason</th>
                    <th className="text-left p-2 border-b">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(summary.reasons).map(([reason, count]) => (
                    <tr key={reason}>
                      <td className="p-2 border-b">{reason}</td>
                      <td className="p-2 border-b">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No skipped rows.</p>
          )}
        </section>
      )}
    </main>
  );
}
