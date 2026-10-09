import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { authStore } from "../store/userStore";
import "../styles/AuthPage.css";

type Mode = "login" | "register";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 7; // matches the backend check

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, login, register } = authStore();

  const [mode, setMode] = useState<Mode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const isLogin = mode === "login";

  // Where to go after signing in: the page they tried to open, or the home page
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  // Already signed in? Don't show the login page
  if (user) return <Navigate to={from} replace />;

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirm("");
  };

  const validate = (): string | null => {
    if (!isLogin && name.trim().length < 2) return "Enter your full name";
    if (!EMAIL_RE.test(email.trim())) return "Enter a valid email address";
    if (!password) return "Enter your password";
    if (!isLogin) {
      if (password.length < MIN_PASSWORD) return `Password must be at least ${MIN_PASSWORD} characters`;
      if (password !== confirm) return "Passwords don't match";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);
    setError(null);

    try {
      if (isLogin) {
        await login({ email: email.trim().toLowerCase(), password });
      } else {
        await register({ name: name.trim(), email: email.trim().toLowerCase(), password });
      }
      navigate(from, { replace: true });
    } catch {
      setError(authStore.getState().error ?? "Something went wrong");
    }
  };

  return (
    <div className="auth">
      <aside className="auth__brand">
        <div>
          <h1 className="auth__logo">Wedding Desk</h1>
          <p className="auth__tagline">Guests, stays &amp; rides</p>
        </div>

        <ul className="auth__points">
          <li>Track every family's RSVP</li>
          <li>Allocate rooms without double-booking</li>
          <li>Plan pickups and drops for each car</li>
        </ul>

        <p className="auth__foot">Everything for the wedding, family by family.</p>
      </aside>

      <main className="auth__main">
        <div className="auth__card">
          <div className="auth__mobile-logo">Wedding Desk</div>

          <h2 className="auth__title">{isLogin ? "Welcome back" : "Create your account"}</h2>
          <p className="auth__sub">
            {isLogin ? "Sign in to manage your wedding guests." : "Start planning in a minute."}
          </p>

          <div className="auth__tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              className={isLogin ? "auth__tab auth__tab--on" : "auth__tab"}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              className={!isLogin ? "auth__tab auth__tab--on" : "auth__tab"}
              onClick={() => switchMode("register")}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <label className="auth__field">
                <span>Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Khemka"
                  autoComplete="name"
                />
              </label>
            )}

            <label className="auth__field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label className="auth__field">
              <span>Password</span>
              <div className="auth__password">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Your password" : `At least ${MIN_PASSWORD} characters`}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  className="auth__show"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            {!isLogin && (
              <label className="auth__field">
                <span>Confirm password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
              </label>
            )}

            {error && <p className="auth__error" role="alert">{error}</p>}

            <button type="submit" className="auth__submit" disabled={loading}>
              {loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth__switch">
            {isLogin ? "New here?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="auth__link auth__link--btn"
              onClick={() => switchMode(isLogin ? "register" : "login")}
            >
              {isLogin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}