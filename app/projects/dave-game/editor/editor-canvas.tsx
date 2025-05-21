"use client";

import { useEffect, useRef, useState } from "react";
import { GRID_SIZE, LevelObject } from "./types";
import { drawGrid } from "./utils";
import PaletteSidebar from "./components/PaletteSidebar";
import ObjectRenderer from "./components/ObjectRenderer";
import { useCanvasSetup } from "./hooks/useCanvasSetup";

export default function LevelEditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<LevelObject[]>([]);
  const [selectedType, setSelectedType] = useState("platform");
  const [selectedVariant, setSelectedVariant] = useState("normal");
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [inputSize, setInputSize] = useState({ width: "1000", height: "1000" });
  const [levelSize, setLevelSize] = useState({ width: 1000, height: 1000 });
  const [objectSize, setObjectSize] = useState({ width: "100", height: "100" });
  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(
    null
  );
  useCanvasSetup(canvasRef, levelSize);

  const handlePlace = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();

    const x =
      Math.floor((e.clientX - rect.left + container.scrollLeft) / GRID_SIZE) *
      GRID_SIZE;
    const y =
      Math.floor((e.clientY - rect.top + container.scrollTop) / GRID_SIZE) *
      GRID_SIZE;

    const width = parseInt(objectSize.width) || 100;
    const height = parseInt(objectSize.height) || 100;

    if (
      x < 0 ||
      y < 0 ||
      x + width > levelSize.width ||
      y + height > levelSize.height
    )
      return;

    if (e.type === "contextmenu") {
      setObjects((prev) => prev.filter((obj) => !(obj.x === x && obj.y === y)));
      return;
    }

    if (objects.some((obj) => obj.x === x && obj.y === y)) return;

    setObjects((prev) => [
      ...prev,
      {
        type: selectedType as LevelObject["type"],
        variant: selectedVariant as LevelObject["variant"],
        x,
        y,
        width,
        height,
      },
    ]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x =
      Math.floor((e.clientX - rect.left + container.scrollLeft) / GRID_SIZE) *
      GRID_SIZE;
    const y =
      Math.floor((e.clientY - rect.top + container.scrollTop) / GRID_SIZE) *
      GRID_SIZE;

    const index = objects.findIndex(
      (obj) =>
        x >= obj.x &&
        x < obj.x + obj.width &&
        y >= obj.y &&
        y < obj.y + obj.height
    );

    if (index !== -1 && e.button === 0) {
      e.preventDefault();
      setDraggingIndex(index);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (draggingIndex === null) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x =
      Math.floor((e.clientX - rect.left + container.scrollLeft) / GRID_SIZE) *
      GRID_SIZE;
    const y =
      Math.floor((e.clientY - rect.top + container.scrollTop) / GRID_SIZE) *
      GRID_SIZE;

    setObjects((prev) => {
      const copy = [...prev];
      copy[draggingIndex] = { ...copy[draggingIndex], x, y };
      return copy;
    });
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const exportLevel = () => {
    const levelData = JSON.stringify(objects, null, 2);
    navigator.clipboard.writeText(levelData);
    alert("Level copied to clipboard!");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const snapW = Math.ceil((levelSize.width + 1) / GRID_SIZE) * GRID_SIZE;
    const snapH = Math.ceil((levelSize.height + 1) / GRID_SIZE) * GRID_SIZE;

    canvas.width = snapW;
    canvas.height = snapH;

    ctx.clearRect(0, 0, snapW, snapH);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, snapW, snapH);

    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = "white";
      ctx.fillRect(Math.random() * snapW, Math.random() * snapH, 2, 2);
    }

    const moon = new Image();
    moon.src = "/assets/images/moon.png";
    moon.onload = () => ctx.drawImage(moon, snapW - 200, 100, 100, 100);

    drawGrid(ctx, snapW, snapH);
  }, [levelSize]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white p-4 flex flex-col gap-3 text-sm">
        <PaletteSidebar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          inputSize={inputSize}
          setInputSize={setInputSize}
          setLevelSize={setLevelSize}
          objectSize={objectSize}
          setObjectSize={setObjectSize}
          onExport={exportLevel}
        />
      </div>

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto bg-black relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handlePlace}
        onClick={handlePlace}
      >
        <canvas
          ref={canvasRef}
          style={{ imageRendering: "pixelated", cursor: "crosshair" }}
        />

        {/* Render all placed objects */}
        <ObjectRenderer
          objects={objects}
          selectedObjectIndex={selectedObjectIndex}
          setSelectedObjectIndex={setSelectedObjectIndex}
        />

        {/* Delete button overlay for selected object */}
        {selectedObjectIndex !== null && (
          <div className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded shadow-lg z-50">
            <p className="mb-2 text-sm">
              Selected: {objects[selectedObjectIndex].type}
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
              onClick={() => {
                setObjects((prev) =>
                  prev.filter((_, i) => i !== selectedObjectIndex)
                );
                setSelectedObjectIndex(null);
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
