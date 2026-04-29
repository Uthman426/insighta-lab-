// import { cookies } from "next/headers";
// import { verifyCSRF } from "@/lib/csrf";

// const BASE = process.env.BACKEND_URL || "http://localhost:3000/api";

// async function proxy(req, context, method) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("access_token")?.value;

//   if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
//     const valid = await verifyCSRF(req);

//     if (!valid) {
//       return Response.json(
//         { status: "error", message: "Invalid CSRF token" },
//         { status: 403 }
//       );
//     }
//   }

//   const params = await context.params;
//   const path = params.path.join("/");

//   const url = new URL(req.url);
//   const query = url.search;

//   const body = method === "GET" ? undefined : await req.text();

//   const res = await fetch(`${BASE}/${path}${query}`, {
//     method,
//     body,
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "X-API-Version": "1",
//       "Content-Type": "application/json",
//     },
//     cache: "no-store",
//   });

//   const contentType = res.headers.get("content-type") || "";

//   if (contentType.includes("application/json")) {
//     const data = await res.json();
//     return Response.json(data, { status: res.status });
//   }

//   const text = await res.text();

//   return new Response(text, {
//     status: res.status,
//     headers: {
//       "Content-Type": contentType,
//     },
//   });
// }

// export async function GET(req, context) {
//   return proxy(req, context, "GET");
// }

// export async function POST(req, context) {
//   return proxy(req, context, "POST");
// }

// export async function DELETE(req, context) {
//   return proxy(req, context, "DELETE");
// }
import { cookies } from "next/headers";
import { verifyCSRF } from "@/lib/csrf";

const BASE = process.env.BACKEND_URL ;

async function sendBackendRequest({ req, path, query, method, token }) {
  const body = method === "GET" ? undefined : await req.clone().text();

  return fetch(`${BASE}/${path}${query}`, {
    method,
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Version": "1",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

async function makeResponse(res, tokens = null) {
  const contentType = res.headers.get("content-type") || "";

  let response;

  if (contentType.includes("application/json")) {
    const data = await res.json();
    response = Response.json(data, { status: res.status });
  } else {
    const text = await res.text();
    response = new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  }

  if (tokens?.access_token && tokens?.refresh_token) {
    response.headers.append(
      "Set-Cookie",
      `access_token=${tokens.access_token}; HttpOnly; Path=/; Max-Age=180; SameSite=Lax`
    );

    response.headers.append(
      "Set-Cookie",
      `refresh_token=${tokens.refresh_token}; HttpOnly; Path=/; Max-Age=300; SameSite=Lax`
    );
  }

  return response;
}

async function clearAuthCookies(message) {
  const response = Response.json(
    { status: "error", message },
    { status: 401 }
  );

  response.headers.append(
    "Set-Cookie",
    "access_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );

  response.headers.append(
    "Set-Cookie",
    "refresh_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
  );

  return response;
}

async function proxy(req, context, method) {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return Response.json(
      { status: "error", message: "Not logged in" },
      { status: 401 }
    );
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const valid = await verifyCSRF(req);

    if (!valid) {
      return Response.json(
        { status: "error", message: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  const params = await context.params;
  const path = params.path.join("/");

  const url = new URL(req.url);
  const query = url.search;

  let res = await sendBackendRequest({
    req,
    path,
    query,
    method,
    token: accessToken,
  });

  if (res.status !== 401) {
    return makeResponse(res);
  }

  if (!refreshToken) {
    return clearAuthCookies("Access token expired. Please log in again.");
  }

  const refreshRes = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!refreshRes.ok) {
    const data = await refreshRes.json().catch(() => null);

    return clearAuthCookies(
      data?.message || "Refresh token expired. Please log in again."
    );
  }

  const tokenData = await refreshRes.json();

  if (!tokenData.access_token || !tokenData.refresh_token) {
    return clearAuthCookies("Refresh failed. Please log in again.");
  }

  res = await sendBackendRequest({
    req,
    path,
    query,
    method,
    token: tokenData.access_token,
  });

  return makeResponse(res, tokenData);
}

export async function GET(req, context) {
  return proxy(req, context, "GET");
}

export async function POST(req, context) {
  return proxy(req, context, "POST");
}

export async function DELETE(req, context) {
  return proxy(req, context, "DELETE");
}
