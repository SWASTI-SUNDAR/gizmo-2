import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaWind, FaTint, FaCubes, FaChartBar } from "react-icons/fa";

function Navbar() {
  const location = useLocation();
  const [visitedPages, setVisitedPages] = useState({
    conductivity: false,
    evaporation: false,
    dissolving: false,
  });
 
  useEffect(() => {
    // Mark the current page as visited
    const pageMap = {
      "/conductivity": "conductivity",
      "/magnetisim": "magnetisim",
      "/dissolving": "dissolving",
    };

    if (pageMap[location.pathname]) {
      setVisitedPages((prev) => ({
        ...prev,
        [pageMap[location.pathname]]: true,
      }));
    }
  }, [location.pathname]);

  const allVisited =
    visitedPages.conductivity &&
    visitedPages.magnetisim &&
    visitedPages.dissolving;

  return (
    <nav className="fixed w-full z-10 px-4 sm:px-6 md:px-16 lg:px-28 mt-3">
      <div className="px-3 md:px-12 bg-gray-900 rounded-xl mx-auto max-w-screen-2xl">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left Section */}
          <div className="flex gap-0 xl:gap-6 items-center text-white">
            <Link to="/" className="text-xl font-bold text-yellow-400">
              Labby's Labs: Invisible Matter
            </Link>
          </div>
          {/* Navigation Buttons */}
          <div
            className={`gap-2 ${location.pathname === "/" ? "hidden" : "flex"}`}
          >
            <NavButton
              to="/conductivity"
              icon={<FaWind />}
              label="Conductivity"
            />
            <NavButton
              to="/magnetisim"
              icon={<FaTint />}
              label="Magnetisim"
            />
            <NavButton
              to="/dissolving"
              icon={<FaCubes />}
              label="Solubility"
            />
            <NavButton
              to="/result"
              icon={<FaChartBar />}
              label="Result"
              disabled={!allVisited}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

// Component for Nav Buttons
const NavButton = ({ to, icon, label, disabled }) => {
  return (
    <Link
      to={disabled ? "#" : to}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition 
        ${
          disabled
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gray-600 hover:bg-gray-500"
        }`}
    >
      <span className="text-white text-lg">{icon}</span>
      <span className="text-white font-medium">{label}</span>
    </Link>
  );
};

export default Navbar;
