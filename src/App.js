import React from "react";
import {AppRoutes} from "./routes";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <main className="text-gray-400 bg-gray-900 body-font scrollbar-hide">
        <Navbar/>
        <AppRoutes/>
    </main>
  );
}
