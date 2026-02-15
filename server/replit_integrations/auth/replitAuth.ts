import session from "express-session";
import type { Express, RequestHandler } from "express";
import { authStorage } from "./storage";

const LOCAL_USER_ID = "local-dev-user";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  return session({
    secret: "local-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Auto-create the local dev user
  await authStorage.upsertUser({
    id: LOCAL_USER_ID,
    email: "dev@localhost",
    firstName: "Local",
    lastName: "Developer",
    profileImageUrl: null,
  });

  // Auto-authenticate every request as the local dev user
  app.use((req: any, _res, next) => {
    req.user = {
      claims: { sub: LOCAL_USER_ID },
      expires_at: Math.floor(Date.now() / 1000) + 86400,
    };
    req.isAuthenticated = () => true;
    next();
  });

  app.get("/api/login", (_req, res) => res.redirect("/"));
  app.get("/api/callback", (_req, res) => res.redirect("/"));
  app.get("/api/logout", (_req, res) => res.redirect("/"));
}

export const isAuthenticated: RequestHandler = (req, _res, next) => {
  next();
};
