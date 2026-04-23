import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>
        <NavLink to="/create" className="nav-link">
          Create Post
        </NavLink>
      </nav>
    </header>
  );
}
