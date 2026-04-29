import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  const res = await fetch(
    `${process.env.BACKEND_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.user;
}
