import CasinoStatsComponent from "../components/CasinoStatsComponent";

export default function Stats() {

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 p-4 text-center">📊 Statistiques</h1>
      <div className="mt-6 border-t pt-4"/>
      <CasinoStatsComponent />
    </div>
  );
}