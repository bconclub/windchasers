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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/error.tsx:13',message:'Error boundary caught error',data:{error:error.message,stack:error.stack?.substring(0,200),digest:error.digest},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">Something went wrong!</h1>
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

