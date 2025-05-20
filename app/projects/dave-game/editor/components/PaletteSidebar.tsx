"use client";

import { Dispatch, SetStateAction } from "react";

type Props = {
  selectedType: string;
  setSelectedType: Dispatch<SetStateAction<string>>;
  selectedVariant: string;
  setSelectedVariant: Dispatch<SetStateAction<string>>;
  inputSize: { width: string; height: string };
  setInputSize: Dispatch<SetStateAction<{ width: string; height: string }>>;
  setLevelSize: Dispatch<SetStateAction<{ width: number; height: number }>>;
  objectSize: { width: string; height: string };
  setObjectSize: Dispatch<SetStateAction<{ width: string; height: string }>>;
  onExport: () => void;
};

const objectTypes: {
  label: string;
  type: string;
  icon: string;
  variants?: string[];
}[] = [
  {
    type: "platform",
    label: "Platform",
    icon: "🟫",
    variants: ["normal", "bridge", "metalbox", "pillar", "small", "small2"],
  },
  { type: "redPotion", label: "Red Potion", icon: "🧪" },
  { type: "yellowPotion", label: "Yellow Potion", icon: "🧴" },
  {
    type: "diamond",
    label: "Diamond",
    icon: "💎",
    variants: ["green", "purple", "blue", "red", "golden"],
  },
  { type: "lava", label: "Lava", icon: "🔥" },
  { type: "water", label: "Water", icon: "💧" },
  { type: "ghost", label: "Ghost", icon: "👻" },
  { type: "dragon", label: "Dragon", icon: "🐉" },
  { type: "trophy", label: "Trophy", icon: "🏆" },
  { type: "door", label: "Door", icon: "🚪" },
];

export default function PaletteSidebar({
  selectedType,
  setSelectedType,
  selectedVariant,
  setSelectedVariant,
  inputSize,
  setInputSize,
  setLevelSize,
  objectSize,
  setObjectSize,
  onExport,
}: Props) {
  return (
    <div className="w-60 bg-gray-900 text-white p-4 flex flex-col gap-4 text-sm">
      <div className="bg-gray-800 p-2 rounded text-white flex flex-col gap-2">
        <h2 className="text-lg font-bold mb-2">Palette</h2>

        {/* Object icons grid */}
        <div className="grid grid-cols-2 gap-2">
          {objectTypes.map((obj) => (
            <div key={obj.type} className="text-center">
              <button
                onClick={() => {
                  setSelectedType(obj.type);
                  if (obj.variants) setSelectedVariant(obj.variants[0]);
                }}
                className={`w-full px-2 py-2 rounded text-lg ${
                  selectedType === obj.type
                    ? "bg-green-700"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {obj.icon}
              </button>
              <div className="text-xs mt-1">{obj.label}</div>
            </div>
          ))}
        </div>

        {/* Variants */}
        {objectTypes.find((obj) => obj.type === selectedType)?.variants && (
          <select
            className="mt-2 bg-gray-700 rounded px-2 py-1 text-sm"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
          >
            {objectTypes
              .find((obj) => obj.type === selectedType)!
              .variants!.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
          </select>
        )}
      </div>

      <div>
        <label>Level Width</label>
        <input
          type="number"
          value={inputSize.width}
          onChange={(e) =>
            setInputSize((prev) => ({ ...prev, width: e.target.value }))
          }
          className="w-full bg-gray-800 px-2 py-1 rounded"
        />
        <label>Level Height</label>
        <input
          type="number"
          value={inputSize.height}
          onChange={(e) =>
            setInputSize((prev) => ({ ...prev, height: e.target.value }))
          }
          className="w-full bg-gray-800 px-2 py-1 rounded mb-2"
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 rounded px-2 py-1"
          onClick={() => {
            const width = parseInt(inputSize.width);
            const height = parseInt(inputSize.height);
            if (isNaN(width) || isNaN(height)) {
              alert("Please provide valid dimensions");
              return;
            }
            setLevelSize({ width, height });
          }}
        >
          Apply Size
        </button>

        <button
          onClick={onExport}
          className="w-full bg-green-600 hover:bg-green-700 rounded px-2 py-1 mt-2"
        >
          Export Level
        </button>
      </div>

      <div>
        <label>Object Width</label>
        <input
          type="number"
          value={objectSize.width}
          onChange={(e) =>
            setObjectSize((prev) => ({ ...prev, width: e.target.value }))
          }
          className="w-full bg-gray-800 px-2 py-1 rounded"
        />
        <label>Object Height</label>
        <input
          type="number"
          value={objectSize.height}
          onChange={(e) =>
            setObjectSize((prev) => ({ ...prev, height: e.target.value }))
          }
          className="w-full bg-gray-800 px-2 py-1 rounded"
        />
      </div>
    </div>
  );
}
