import Link from "next/link";
import { getUser } from "@/lib/auth";

export default async function Dashboard() {
  const user = await getUser();
  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">Insighta Labs+</p>
              <h1 className="mt-1 text-3xl font-semibold text-gray-950">
                Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back{user?.username ? `, @${user.username}` : ""}.
              </p>
            </div>

            <div className="rounded border bg-gray-50 px-4 py-3">
              <p className="text-xs uppercase text-gray-500">Current role</p>
              <p className="mt-1 font-semibold capitalize text-gray-950">
                {user?.role || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-950">
              Quick navigation
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Jump into the main Insighta workflows.
            </p>
          </div>

          <Link
            href="/account"
            className="w-fit rounded border bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            View account
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            href="/profiles"
            title="Profiles"
            description="Browse all saved profiles with filters, pagination, and detail views."
            action="Open profiles"
          />

          <DashboardCard
            href="/search"
            title="Search"
            description="Search by name or natural language queries like young males from Nigeria."
            action="Start search"
          />

          <DashboardCard
            href="/account"
            title="Account"
            description="View your GitHub account details, current role, and access status."
            action="Open account"
          />

          {isAdmin ? (
            <DashboardCard
              href="/profiles/create"
              title="Create profile"
              description="Create a new profile by name using the external intelligence APIs."
              action="Create profile"
              emphasis
            />
          ) : (
            <LockedCard
              title="Create profile"
              description="Only admins can create new profile records."
            />
          )}

          <DashboardCard
            href="/login"
            title="Login"
            description="Return to the GitHub login screen if you need to refresh your session."
            action="Go to login"
          />

          <DashboardCard
            href="/profiles"
            title="Profile details"
            description="Open a profile from the profiles list or search results to view full details."
            action="Find profile"
          />
        </div>

        <div className="mt-8 rounded border bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-950">
            Platform access
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <StatusItem label="Authentication" value="GitHub OAuth" />
            <StatusItem label="Session" value="HTTP-only cookies" />
            <StatusItem
              label="Permissions"
              value={isAdmin ? "Full access" : "Read-only access"}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ href, title, description, action, emphasis = false }) {
  return (
    <Link
      href={href}
      className={`block rounded border p-5 transition hover:-translate-y-0.5 hover:shadow-sm ${
        emphasis
          ? "border-gray-950 bg-gray-950 text-white"
          : "border-gray-200 bg-white text-gray-950 hover:bg-gray-50"
      }`}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p
        className={`mt-2 min-h-12 text-sm ${
          emphasis ? "text-gray-200" : "text-gray-600"
        }`}
      >
        {description}
      </p>
      <p
        className={`mt-5 text-sm font-medium ${
          emphasis ? "text-white" : "text-blue-700"
        }`}
      >
        {action}
      </p>
    </Link>
  );
}

function LockedCard({ title, description }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-5 opacity-70">
      <h3 className="text-lg font-semibold text-gray-950">{title}</h3>
      <p className="mt-2 min-h-12 text-sm text-gray-600">{description}</p>
      <p className="mt-5 text-sm font-medium text-gray-500">Admin only</p>
    </div>
  );
}

function StatusItem({ label, value }) {
  return (
    <div className="rounded border bg-gray-50 p-4">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-950">{value}</p>
    </div>
  );
}
