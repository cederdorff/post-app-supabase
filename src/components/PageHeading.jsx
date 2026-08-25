import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

export default function PageHeading({ children, documentTitle = children }) {
  const headingRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = `${documentTitle} | Post App`;
    headingRef.current?.focus();
  }, [documentTitle, pathname]);

  return (
    <h1 ref={headingRef} className="page-title" tabIndex="-1">
      {children}
    </h1>
  );
}
