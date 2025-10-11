import GoldComponent from '../components/GoldComponent';
import ShopComponent from '../components/ShopComponent';
import Countdown from '../components/Countdown';
import CasinoState from '../components/CasinoState';
import { useEvents } from "../components/EventsProvider";

export default function Shop() {
  const { refreshTimer } = useEvents();

  return (
    <div className="p-6">
      <CasinoState />
      <h1 className="text-2xl font-bold mb-4">Boutique</h1>
      <GoldComponent />
      <Countdown refreshTimer={refreshTimer} />
      <ShopComponent />
    </div>
  );
}
