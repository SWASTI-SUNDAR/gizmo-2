import React from "react";

function Navbar() {
  return (
    <nav className="fixed w-full z-10 px-4 sm:px-6 md:px-16 lg:px-28 pt-3">
      <div className="px-4 sm:px-6 md:px-12 bg-gray-800 rounded-xl mx-auto max-w-screen-2xl">
        <div className="flex flex-wrap items-center justify-between h-16">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-10 text-center">
            <a href="/" className="text-white text-xl sm:text-2xl font-bold">
              Labby’s Labs: Unleashing the Power of Discovery!
            </a>
            <span className="text-base sm:text-lg text-slate-300 font-semibold">
              Compression & Expansion
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
