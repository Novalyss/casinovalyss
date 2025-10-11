import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="">
      <div className="container mx-auto flex items-center justify-center">
        {/* Logo */}
        <Link to="/shop">
          <img src="/assets/logo.png" alt="CasiNovalyss Logo" className="h-10 w-auto" />
        </Link>

        {/* Logo */}
        <Link to="https://www.twitch.tv/novalyss" target="_blank" >
          <img src="/assets/twitch-logo.png" alt="Twitch" className="h-10 w-auto" />
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/inventory" className="hover:underline">Inventaire</Link>
          <Link to="/armory" className="hover:underline">Armurerie</Link>
          <Link to="/quest" className="hover:underline">Quêtes</Link>
          <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
          <Link to="/stats" className="hover:underline">Stats</Link>
        </nav>

        {/* Menu mobile */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Dropdown mobile */}
      {open && (
        <nav className="md:hidden p-4 space-y-2">
          <Link onClick={() => setOpen(!open)} to="/" className="block hover:underline">Accueil</Link>
          <Link onClick={() => setOpen(!open)} to="/shop" className="block hover:underline">Shop</Link>
          <Link onClick={() => setOpen(!open)} to="/inventory" className="block hover:underline">Inventaire</Link>
          <Link onClick={() => setOpen(!open)} to="/quest" className="block hover:underline">Quêtes</Link>
          <Link onClick={() => setOpen(!open)} to="/leaderboard" className="block hover:underline">Leaderboard</Link>
          <Link onClick={() => setOpen(!open)} to="/stats" className="block hover:underline">Stats</Link>
        </nav>
      )}
    </header>
  );
}