"use client";

import { useEffect } from "react";

// Guards against losing in-progress admin edits to an accidental tab close or
// refresh. Doesn't intercept in-app navigation (Next's router has no built-in
// hook for that outside this), but the beforeunload case is the common one.
export function useUnsavedChangesWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    function handler(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
}
