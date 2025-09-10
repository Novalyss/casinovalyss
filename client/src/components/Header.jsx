import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Novalyss</h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Accueil</Link>
          <Link to="/shop" className="hover:underline">Shop</Link>
          <Link to="/inventory" className="hover:underline">Inventaire</Link>
          <Link to="/quest" className="hover:underline">Quêtes</Link>
          <Link to="/leaderboard" className="hover:underline">Leaderboard</Link>
          <Link to="/stats" className="hover:underline">Stats</Link>
          <Link to="/about" className="hover:underline">À propos</Link>
        </nav>
      </div>
    </header>
  );
}