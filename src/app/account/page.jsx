import { getUser } from "@/lib/auth";

export default async function Account() {
  const user = await getUser();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Account</h1>

      {user ? (
        <div className="mt-4 space-y-2">
          <p>Username: @{user.username}</p>
          <p>Email: {user.email || "Not available"}</p>
          <p>Role: {user.role}</p>
          <p>User ID: {user?.id}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
  );
}
