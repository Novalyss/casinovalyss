import GoldComponent from '../components/GoldComponent';
import ShopComponent from '../components/ShopComponent';

export default function Shop() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Boutique</h1>
      <GoldComponent />
      <ShopComponent />
    </div>
  );
}
