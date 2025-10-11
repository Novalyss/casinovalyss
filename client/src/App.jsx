import { BrowserRouter, Routes, Route } from "react-router-dom";
import Shop from "./pages/Shop";
import Inventory from "./pages/Inventory";
import Armory from "./pages/Armory";
import Quest from "./pages/Quest";
import Leaderboard from "./pages/Leaderboard";
import Auth from "./pages/Auth";
import Stats from "./pages/Stats";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import {EventsProvider} from "./components/EventsProvider";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route element={<EventsProvider />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/armory" element={<Armory />} />
                  <Route path="/quest" element={<Quest />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/stats" element={<Stats />} />
                </Route>
              </Route>
            </Routes>
          </main>
          <Footer />
      </div>
    </BrowserRouter>
  );
}
