async function getCSRFToken() {
  const res = await fetch("/api/csrf", {
    cache: "no-store",
  });

  const data = await res.json();
  return data.csrf_token;
}

export async function connectapi(path, options = {}) {
  const method = options.method || "GET";

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase())) {
    headers["x-csrf-token"] = await getCSRFToken();
  }

  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    method,
    headers,
  });

  if (res.status === 204) {
    return { status: "success" };
  }

  const contentType = res.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw new Error(
      typeof data === "object" ? data.message || "Request failed" : data
    );
  }

  return data;
}
