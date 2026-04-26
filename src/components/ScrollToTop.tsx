"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        const scrollY = window.scrollY;
        setVisible(scrollY > 200); // muncul setelah scroll 200px
      }, 100); // debounce 100ms
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        background: "#1e1b4b",
        color: "#fff",
        border: "none",
        borderRadius: "999px",
        width: "44px",
        height: "44px",
        cursor: "pointer",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#4338ca";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#1e1b4b";
      }}>
      ↑
    </button>
  );
}
