import NewsFeed from "../components/NewsFeed";

export default function Home() {
  return (
    
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Bienvenue sur mon site !</h1>
      <p className="mb-4">
        Retrouvez ici toutes mes dernières actus, vidéos et lives.
      </p>
      <NewsFeed />
    </div>
  );
}