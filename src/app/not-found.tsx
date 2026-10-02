import Link from "next/link";

const SITE_NAME = "TimeWorkCalc";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-2 max-w-xl text-base text-zinc-600">
          The page you are looking for does not exist or has been moved. Check
          the address, or go back to the homepage.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to {SITE_NAME}
      </Link>
    </main>
  );
}
