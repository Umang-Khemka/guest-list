export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// register and login both return this
export interface AuthResponse {
  message: string;
  user: AuthUser;
}

// GET /check returns only the user
export interface CheckAuthResponse {
  user: AuthUser;
}

export interface AuthState {
  user: AuthUser | null;
  checking: boolean; // true until the first checkAuth finishes
  loading: boolean; // true while login / register / logout is running
  error: string | null;

  register: (input: RegisterInput) => Promise<AuthUser>;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  // restores the session on page load; a 401 just means "not logged in"
  checkAuth: () => Promise<void>;
}