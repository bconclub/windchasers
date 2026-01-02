"use client";

import { useTracking } from "@/hooks/useTracking";
import { useEffect } from "react";

export default function TrackingProvider({ children }: { children: React.ReactNode }) {
  // #region agent log
  try {
    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/TrackingProvider.tsx:6',message:'TrackingProvider rendering',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  } catch(e) {
    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/TrackingProvider.tsx:7',message:'TrackingProvider render error',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  }
  // #endregion
  try {
    useTracking();
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/TrackingProvider.tsx:10',message:'useTracking called successfully',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
  } catch(e) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6e6eb0a4-7766-4439-bd69-47eda092beb1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/TrackingProvider.tsx:13',message:'useTracking error',data:{error:String(e),stack:(e as Error).stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
  }
  
  return <>{children}</>;
}


