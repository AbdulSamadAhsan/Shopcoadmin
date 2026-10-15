import { useState, useRef, useEffect, useCallback } from "react";
export default function useToast() {
  const [toast, setToast] = useState("");
  const timer = useRef(null);
  const clearToast = useCallback(() => {
    clearTimeout(timer.current);
    setToast("");
  }, []);
  const notify = useCallback((message) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(""), 3500);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, notify, clearToast };
}
