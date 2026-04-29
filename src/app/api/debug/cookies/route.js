import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  return Response.json({
    has_access_token: Boolean(cookieStore.get("access_token")?.value),
    has_refresh_token: Boolean(cookieStore.get("refresh_token")?.value),
  });
}
