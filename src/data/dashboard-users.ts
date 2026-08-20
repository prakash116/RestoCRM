/**
 * Dashboard sign-in directory.
 *
 * ⚠️ These are demonstration credentials checked in the browser. This is a
 * convenience gate for a static demo, **not authentication** — the list ships
 * in the client bundle and anyone can read it or skip the check entirely.
 *
 * Before this dashboard controls anything real, replace `authenticate()` with
 * a call to an identity provider and move the session to an httpOnly cookie.
 * Nothing outside this file assumes how the check is performed.
 */

export interface DashboardUser {
  /** The login ID. */
  email: string;
  password: string;
  name: string;
  role: string;
}

export const dashboardUsers: DashboardUser[] = [
  {
    email: "admin@dineboard.in",
    password: "dineboard",
    name: "Studio Admin",
    role: "Owner",
  },
  {
    email: "design@dineboard.in",
    password: "dineboard",
    name: "Design Lead",
    role: "Theme editor",
  },
];

export interface DashboardSession {
  email: string;
  name: string;
  role: string;
}

export function authenticate(email: string, password: string): DashboardSession | null {
  const match = dashboardUsers.find(
    (user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password,
  );

  if (!match) return null;
  return { email: match.email, name: match.name, role: match.role };
}
