import { Link } from "react-router-dom";

const ACTIONS = [
  { to: "/families", label: "Add family", primary: true },
  { to: "/whatsapp", label: "Send WhatsApp" },
  { to: "/rooms", label: "Add room" },
  { to: "/vehicles", label: "Add vehicle" },
];

export default function QuickActions() {
  return (
    <div className="quick-actions">
      {ACTIONS.map((a) => (
        <Link key={a.to} to={a.to} className={a.primary ? "btn btn--primary" : "btn"}>
          {a.label}
        </Link>
      ))}
    </div>
  );
}