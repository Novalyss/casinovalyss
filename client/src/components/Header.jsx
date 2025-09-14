import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <img src="/assets/logo.png" alt="Novalyss Logo" className="h-10 w-auto" />
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-4">
          <Link to="/" className="hover:underline">Accueil</Link>
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/inventory" className="hover:underline">Inventaire</Link>
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
        <nav className="md:hidden bg-gray-800 p-4 space-y-2">
          <Link to="/" className="block hover:underline">Accueil</Link>
          <Link to="/shop" className="block hover:underline">Shop</Link>
          <Link to="/inventory" className="block hover:underline">Inventaire</Link>
          <Link to="/quest" className="block hover:underline">Quêtes</Link>
          <Link to="/leaderboard" className="block hover:underline">Leaderboard</Link>
          <Link to="/stats" className="block hover:underline">Stats</Link>
        </nav>
      )}
    </header>
  );
}