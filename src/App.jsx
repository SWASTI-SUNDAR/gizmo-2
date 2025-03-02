import "./App.css";
import GasSimulation from "./pages/GasSimulation";
import Navbar from "./components/PrimaryNav";
// import EvaporationSimulation from "./pages/Evaporation";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dissolving from "./pages/Dissolving";
import Result from "./pages/Result";
import EvaporationSimulation from "./pages/New-Evaporation";
import ElectricalConductivityTester from "./pages/ElectricalConductivity";
function App() {
  return (
    <>
      <div className="overflow-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/conductivity"
            element={<ElectricalConductivityTester />}
          />
          <Route path="/evaporation" element={<EvaporationSimulation />} />
          <Route path="/simulation" element={<GasSimulation />} />
          <Route path="/dissolving" element={<Dissolving />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
