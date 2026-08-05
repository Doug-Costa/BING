import { Header } from "./header";
import { AuthModal } from "./auth-modal";
import { SiteFooter } from "./site-footer";
export function InnerShell({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return <><div className={live ? "ambient live-ambient" : "ambient"}><i /><i /><i /></div><main className="site-shell"><Header />{children}<SiteFooter /></main><AuthModal /></>;
}
