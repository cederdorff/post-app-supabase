import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function PageHeading({ title }) {
  const headingRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${title} | Post App`;
    headingRef.current?.focus();
  }, [title, pathname]);

  return (
    <h1 ref={headingRef} className="page-title" tabIndex={-1}>
      {title}
    </h1>
  );
}
