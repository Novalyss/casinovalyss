export default function NewsFeed() {
  // plus tard tu remplaceras ça par un appel d'API Twitch/Youtube
  const news = [
    { title: "Nouvelle vidéo YouTube", link: "#" },
    { title: "Prochain live Twitch", link: "#" },
    { title: "Concours en cours", link: "#" }
  ];

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4">Actualités</h2>
      <ul className="space-y-2">
        {news.map((item, index) => (
          <li key={index}>
            <a href={item.link} className="text-blue-500 hover:underline">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}