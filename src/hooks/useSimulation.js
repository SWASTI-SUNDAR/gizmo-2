import { useState, useRef, useEffect } from "react";

export const useSimulation = () => {
  const [state, setState] = useState({
    stirringSpeed: 1,
    temperature: 25,
    isSugar: true,
    dissolved: 0,
    isResetting: false,
    rotationAngle: 0,
    isStirring: false,
    activeTab: "description",
    data: [],
  });

  const refs = {
    animation: useRef(null),
    startTime: useRef(Date.now()),
  };

  const actions = {
    startStirringAnimation: () => {
      setIsStirring(true);
      let startTime = Date.now();

      const animate = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        // Update rotation continuously
        setRotationAngle((prevAngle) => prevAngle + stirringSpeed * 0.05);

        // Continue animation loop
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    },
    resetSimulation: () => {
      setIsResetting(true);
      setTimeout(() => {
        setDissolved(0);
        setIsResetting(false);
        startTimeRef.current = Date.now();
      }, 2000);
    },
    recordDataPoint: () => {
      const currentTime = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
      const newDataPoint = {
        time: currentTime.toFixed(1),
        concentration: (dissolved * 100).toFixed(2),
        temperature,
        stirringSpeed,
      };
      setData((prevData) => [...prevData, newDataPoint]);
    },
    clearData: () => {
      setData([]);
      startTimeRef.current = Date.now();
    },
    handleStirringSpeedChange: () => {
      resetSimulation();
      setStirringSpeed(newSpeed);
    },
    handleTemperatureChange: () => {
      resetSimulation();
      setTemperature(newTemp);
    },
    handleSugarToggle: () => {
      setIsSugar(!isSugar);
      resetSimulation();
    },
  };

  useEffect(() => {
    let interval;
    if (!isResetting && !dissolutionCompleted) {
      interval = setInterval(() => {
        const dissolutionRate =
          (stirringSpeed * 0.1 + temperature * 0.01) * (isSugar ? 1 : 0.8);

        setDissolved((prev) => {
          const newValue = Math.min(1, prev + dissolutionRate * 0.01);
          return newValue;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [
    dissolved,
    stirringSpeed,
    temperature,
    isSugar,
    isResetting,
    dissolutionCompleted,
  ]);

  return { state, actions, refs };
};
