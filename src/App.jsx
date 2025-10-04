import {AppRoutes} from "./routes";
import {Navbar} from "./components/Navbar";

export const App = () => {
  return (
    <main className="text-gray-300 bg-gray-900 body-font scrollbar-hide">
        <Navbar/>
        <AppRoutes/>
    </main>
  );
}
