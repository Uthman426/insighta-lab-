import { generateCSRF } from "@/lib/csrf";

export async function GET() {
  const token = await generateCSRF();

  return Response.json({
    status: "success",
    csrf_token: token,
  });
}
