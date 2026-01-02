"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-[2.5rem] font-bold text-white mb-4">Something went wrong!</h1>
        <p className="text-white/70 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-gold text-dark px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-dark border-2 border-gold text-white px-6 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

