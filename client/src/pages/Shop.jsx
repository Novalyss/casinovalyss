import GoldComponent from '../components/GoldComponent';
import ShopComponent from '../components/ShopComponent';
import Countdown from '../components/Countdown';
import { useConfig } from "../components/ConfigProvider";

export default function Shop() {
  const { refreshTimer } = useConfig();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Boutique</h1>
      <GoldComponent />
      <Countdown refreshTimer={refreshTimer} />
      <ShopComponent />
    </div>
  );
}
