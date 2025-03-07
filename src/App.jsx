import "./App.css";
import Navbar from "./components/PrimaryNav";
// import EvaporationSimulation from "./pages/Evaporation";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Dissolving from "./pages/Dissolving";
import Result from "./pages/Result";
import ElectricalConductivityTester from "./pages/ElectricalConductivity";
import Magnetisim from "./pages/Magnetisim";
import MagneticPropertiesLab from "./pages/Testing";
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
          <Route path="/magnetisi" element={<Magnetisim />} />
          <Route path="/magnetisim" element={<MagneticPropertiesLab />} />
          <Route path="/dissolving" element={<Dissolving />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
