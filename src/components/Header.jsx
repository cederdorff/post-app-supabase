import { NavLink } from "react-router";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
          Create Post
        </NavLink>
      </nav>
    </header>
  );
}
