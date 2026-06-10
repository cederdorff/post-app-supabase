import { NavLink } from "react-router";
import { StatusDot } from "performative-ui";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" className="site-brand" aria-label="Post Lab home">
          <span className="site-brand-mark">P</span>
          <span>
            <span className="site-brand-name">Post Lab</span>
            <span className="site-brand-status">
              <StatusDot static /> Supabase live
            </span>
          </span>
        </NavLink>

        <div className="site-nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/create" className="nav-link">
            Create Post
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
