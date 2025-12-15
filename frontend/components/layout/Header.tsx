"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-legal-darker/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/20">
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-slate-100 group-hover:text-primary-400 transition-colors">
                AI Legal Assistant
              </span>
              <span className="text-xs text-slate-400">Қазақстан</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-slate-300 hover:text-primary-400 transition-colors"
            >
              Басты бет
            </Link>
            <Link
              href="/chat"
              className="text-sm text-slate-300 hover:text-primary-400 transition-colors"
            >
              AI Консультация
            </Link>
            <Link
              href="/documents"
              className="text-sm text-slate-300 hover:text-primary-400 transition-colors"
            >
              Құжаттар
            </Link>
            <Link
              href="/lawyers"
              className="text-sm text-slate-300 hover:text-primary-400 transition-colors"
            >
              Заңгерлер
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <button className="legal-button text-sm">
              Бастау
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
