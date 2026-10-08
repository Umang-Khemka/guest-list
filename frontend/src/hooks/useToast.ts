import { useCallback, useRef, useState } from "react";

// const { toast, showToast } = useToast();   then:   {toast && <Toast message={toast} />}
export function useToast() {
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  return { toast, showToast };
}