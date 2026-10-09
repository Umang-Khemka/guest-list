import { NavLink, useNavigate } from "react-router-dom";
import { authStore } from "../../store/userStore";

const ITEMS = [
  { to: "/", label: "Dashboard", short: "Home" },
  { to: "/families", label: "Families", short: "Families" },
  { to: "/travel", label: "Travel", short: "Travel" },
  { to: "/rooms", label: "Rooms", short: "Rooms" },
  { to: "/vehicles", label: "Vehicles", short: "Cars" },
  { to: "/whatsapp", label: "WhatsApp", short: "WhatsApp" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "nav-link nav-link--active" : "nav-link";

// Desktop: sidebar. Mobile: bottom bar. CSS decides which one is visible.
export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = authStore();

  const handleLogout = async () => {
    await logout().catch(() => {});
    navigate("/login", { replace: true });
  };

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

        <div className="sidebar__user">
          <span className="sidebar__avatar">{user?.name?.charAt(0).toUpperCase()}</span>
          <span className="sidebar__name">{user?.name}</span>
          <button className="sidebar__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="topbar">
        <span className="topbar__name">{user?.name}</span>
        <button className="btn" onClick={handleLogout}>
          Log out
        </button>
      </div>

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