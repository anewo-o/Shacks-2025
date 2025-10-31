import React from "react";

const TopBar = () => {
  return (
    <header
      style={{
        width: "100%",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        backgroundColor: "#1069AE",
        color: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: "900",
          letterSpacing: "0.5px",
          color: "#00F6FF",
        }}
      >
        Shacks
      </div>

      {/* Right-side icons or buttons */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* <button
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#00b894")}
          onMouseOut={(e) => (e.target.style.color = "#fff")}
        >
          Home
        </button>
        
        <button
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.color = "#00b894")}
          onMouseOut={(e) => (e.target.style.color = "#fff")}
        >
          Contact
        </button> */}
      </nav>
    </header>
  );
};

export default TopBar;
