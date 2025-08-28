// src/components/Header.tsx
import { useState } from "react";
import {
  SpadeIcon,
  MoonIcon,
  SunIcon,
  DotsThreeVerticalIcon,
  UserCircleIcon,
  CopyIcon,
  PlusCircleIcon,
} from "@phosphor-icons/react";

type NavItem = { label: string; href?: string; onClick?: () => void; active?: boolean };

export default function Header({
  appName = "Forvis Mazars",
  leftActionLabel = "Create game",
  onLeftAction,
  // No "Rooms" here
  nav = [
    { label: "Home", href: "#", active: true },
    { label: "Settings", href: "#settings" },
  ],
  meName,
  roomCode,
  onToggleTheme,         // if supplied, shows a theme toggle
  theme = "dark",        // 'light' | 'dark' (for icon state only)
}: {
  appName?: string;
  leftActionLabel?: string;
  onLeftAction?: () => void;
  nav?: NavItem[];
  meName?: string;
  roomCode?: string | null;
  onToggleTheme?: () => void;
  theme?: "light" | "dark";
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  async function copyRoom() {
    if (!roomCode) return;
    try { await navigator.clipboard.writeText(roomCode); } catch {}
  }

  return (
    <header className="w-full bg-slate-900 text-slate-100 border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="h-14 flex items-center justify-between gap-3">
          {/* Left: Brand + primary action */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 hover:opacity-90 no-underline">
              <SpadeIcon className="w-5 h-5 text-blue-400" weight="fill" />
              <span className="font-semibold tracking-tight">{appName}</span>
            </a>

            {onLeftAction && (
              <button
                onClick={onLeftAction}
                className="hidden md:inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-3 py-1.5 text-sm font-medium text-white transition-colors"
              >
                <PlusCircleIcon className="w-4 h-4" weight="bold" />
                {leftActionLabel}
              </button>
            )}
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) =>
              n.href ? (
                <a
                  key={n.label}
                  href={n.href}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors no-underline ${
                    n.active
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {n.label}
                </a>
              ) : (
                <button
                  key={n.label}
                  onClick={n.onClick}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    n.active
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {n.label}
                </button>
              )
            )}
          </nav>

          {/* Right: room chip, theme toggle (optional), user identity (no dropdown) */}
          <div className="flex items-center gap-2">
            {roomCode && (
              <button
                onClick={copyRoom}
                title="Copy room code"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:bg-slate-700"
              >
                <span className="font-mono">{roomCode}</span>
                <CopyIcon className="w-3.5 h-3.5" />
              </button>
            )}

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 h-9 w-9"
              >
                {theme === "dark" ? (
                  <SunIcon className="w-5 h-5 text-amber-300" weight="bold" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-slate-300" weight="bold" />
                )}
              </button>
            )}

            {/* User identity (icon + name only) */}
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 h-9 px-2.5">
              <UserCircleIcon className="w-5 h-5 text-slate-300" weight="duotone" />
              <span className="hidden sm:inline text-sm text-slate-200">{meName ?? "Guest"}</span>
            </div>

            {/* Mobile toggle (only for center nav) */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-800 hover:bg-slate-700 h-9 w-9"
              onClick={() => setMobileOpen((s) => !s)}
              aria-label="Toggle navigation"
            >
              <DotsThreeVerticalIcon className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {mobileOpen && (
          <div className="md:hidden pb-3">
            <div className="mt-2 grid gap-1">
              {onLeftAction && (
                <button
                  onClick={() => {
                    onLeftAction?.();
                    setMobileOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-3 py-2 text-sm font-medium text-white"
                >
                  <PlusCircleIcon className="w-4 h-4" weight="bold" />
                  {leftActionLabel}
                </button>
              )}
              {nav.map((n) =>
                n.href ? (
                  <a
                    key={n.label}
                    href={n.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm no-underline ${
                      n.active
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </a>
                ) : (
                  <button
                    key={n.label}
                    onClick={() => {
                      n.onClick?.();
                      setMobileOpen(false);
                    }}
                    className={`px-3 py-2 rounded-md text-sm ${
                      n.active
                        ? "bg-slate-800 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {n.label}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
