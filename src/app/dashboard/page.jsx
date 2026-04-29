import { getUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await getUser();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {user ? (
        <div className="mt-4">
          <p>Welcome @{user.username}</p>
          <p>Role: {user.role}</p>
          <p>id: {user.id}</p>

        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
  );
}
