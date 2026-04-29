// export async function connectapi(path, options = {}) {
//   const res = await fetch(`/api/proxy${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(options.headers || {}),
//     },
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "Request failed");
//   }

//   return data;
// }
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

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
