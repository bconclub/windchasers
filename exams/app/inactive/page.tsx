import { SignOutButton } from "@/components/SignOutButton";

export const metadata = { title: "Account inactive" };

export default function InactivePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dark px-4">
      <div className="w-full max-w-md rounded-lg bg-surface p-8 text-center">
        <h1 className="text-lg font-semibold text-dark">Account inactive</h1>
        <p className="mt-2 text-sm text-dark-400">
          Your account has been deactivated or is not set up yet. Contact your instructor or the
          academy office to have it enabled.
        </p>
        <div className="mt-6 flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
