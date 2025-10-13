import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="py-2 bg-white rounded-lg shadow">
      <div className="container mx-auto flex items-center justify-between px-1">
        {/* Logo gauche */}
        <Link to="/shop" className="flex-shrink-0">
          <img
            src="/assets/logo.png"
            alt="CasiNovalyss Logo"
            className="max-h-12 w-auto"
          />
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-2 text-lg font-small">
          <Link to="/shop" className="inline-flex items-center gap-1 hover:underline">
            🛍️ <span>Boutique</span>
          </Link>
          <Link to="/character" className="inline-flex items-center gap-1 hover:underline">
            ⚔️ <span>Personnage</span>
          </Link>
          <Link to="/armory" className="inline-flex items-center gap-1 hover:underline">
            🛡️ <span>Armurerie</span>
          </Link>
          <Link to="/quest" className="inline-flex items-center gap-1 hover:underline">
            📜 <span>Quêtes</span>
          </Link>
          <Link to="/leaderboard" className="inline-flex items-center gap-1 hover:underline">
            🏆 <span>Leaderboard</span>
          </Link>
          <Link to="/stats" className="inline-flex items-center gap-1 hover:underline">
            📊 <span>Stats</span>
          </Link>
        </nav>

        {/* Logo Twitch à droite */}
        <Link to="https://www.twitch.tv/novalyss" target="_blank" className="flex-shrink-0">
          <img
            src="/assets/twitch-logo.png"
            alt="Twitch"
            className="max-h-12 w-auto"
          />
        </Link>

        {/* Menu mobile */}
        <button
          className="md:hidden ml-4"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Dropdown mobile */}
      {open && (
        <nav className="md:hidden p-4 space-y-2 text-center bg-white shadow-inner">
          <Link
            onClick={() => setOpen(false)}
            to="/shop"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              🛍️ <span>Boutique</span>
            </span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/character"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              ⚔️ <span>Personnage</span>
            </span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/armory"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              🛡️ <span>Armurerie</span>
            </span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/quest"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              📜 <span>Quêtes</span>
            </span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/leaderboard"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              🏆 <span>Leaderboard</span>
            </span>
          </Link>

          <Link
            onClick={() => setOpen(false)}
            to="/stats"
            className="block hover:underline"
          >
            <span className="inline-flex items-center gap-1 justify-center w-full">
              📊 <span>Stats</span>
            </span>
          </Link>
        </nav>
      )}
    </header>
  );
}