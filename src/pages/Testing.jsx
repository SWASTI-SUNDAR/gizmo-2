import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Plane, Html } from "@react-three/drei";
import * as THREE from "three";
import { Line } from "react-chartjs-2";
import { Button } from "../components/ui/Button";

function WaterMolecule({ speed }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x += (Math.random() - 0.5) * speed;
    ref.current.position.y += (Math.random() - 0.5) * speed;
    ref.current.position.z += (Math.random() - 0.5) * speed;
  });
  return (
    <Sphere ref={ref} args={[0.1, 16, 16]}>
      <meshStandardMaterial color="blue" />
    </Sphere>
  );
}

function EvaporationSimulation() {
  const [temperature, setTemperature] = useState(25);
  const [recordedData, setRecordedData] = useState([]);
  const [recording, setRecording] = useState(false);
  const speed = temperature / 100;

  useEffect(() => {
    if (recording) {
      const interval = setInterval(() => {
        setRecordedData((prev) => [
          ...prev,
          { temp: temperature, rate: speed },
        ]);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [recording, temperature]);

  return (
    <div className="flex flex-col items-center p-6 bg-blue-200 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">
        Evaporation: The Hidden World of Particles
      </h1>
      <Canvas className="w-full h-96 bg-blue-500 rounded-lg shadow-lg">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Plane
          args={[3, 3]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -0.5, 0]}
        >
          <meshStandardMaterial color="lightblue" />
        </Plane>
        {[...Array(20)].map((_, i) => (
          <WaterMolecule key={i} speed={speed} />
        ))}
      </Canvas>

      <div className="flex items-center gap-4 mt-4">
        <label>Temperature (°C): {temperature}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="w-40"
        />
      </div>
      <div className="flex gap-4 mt-4">
        <Button onClick={() => setRecording(!recording)}>
          {recording ? "Stop Recording" : "Record"}
        </Button>
      </div>

      {recordedData.length > 0 && (
        <div className="w-1/2 mt-6">
          <Line
            data={{
              labels: recordedData.map((_, i) => i),
              datasets: [
                {
                  label: "Evaporation Rate",
                  data: recordedData.map((d) => d.rate),
                  borderColor: "red",
                  backgroundColor: "rgba(255,0,0,0.5)",
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}

export default EvaporationSimulation;
