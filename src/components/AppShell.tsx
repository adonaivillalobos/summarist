"use client";

import { useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="shell__overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="shell__main">
        <header className="shell__header">
          <button
            className="shell__menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <AiOutlineMenu />
          </button>
          <SearchBar />
        </header>
        <main className="shell__content">{children}</main>
      </div>
    </div>
  );
}