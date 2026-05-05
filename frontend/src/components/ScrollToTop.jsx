import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // A small timeout ensures the page has rendered before attempting to scroll.
    // 'auto' or 'instant' behavior works better than 'smooth' for route transitions.
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
