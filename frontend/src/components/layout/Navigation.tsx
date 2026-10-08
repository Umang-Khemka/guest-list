import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/", label: "Dashboard", short: "Home" },
  { to: "/families", label: "Families", short: "Families" },
  { to: "/travel", label: "Travel", short: "Travel" },
  { to: "/rooms", label: "Rooms", short: "Rooms" },
  { to: "/vehicles", label: "Vehicles", short: "Cars" },
  { to: "/whatsapp", label: "WhatsApp", short: "WhatsApp" },
  { to: "/history", label: "Messages / History", short: "History" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

// Desktop: sidebar. Mobile: bottom bar. CSS decides which one is visible.
export default function Navigation() {
  return (
    <>
      <aside className="sidebar">
        <h2 className="sidebar__brand">Wedding Desk</h2>
        <p className="sidebar__tagline">Guests, stays &amp; rides</p>
        <nav>
          {ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <nav className="bottom-nav">
        {ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
            {item.short}
          </NavLink>
        ))}
      </nav>
    </>
  );
}