import { useEffect, type ReactNode } from "react";
import "./Modal.css";

interface Props {
  onClose: () => void;
  children: ReactNode;
}

// Bottom sheet on mobile, centered dialog on desktop. Closes on Esc or backdrop click.
export default function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}