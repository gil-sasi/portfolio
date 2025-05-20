"use client";

type PaletteProps = {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedVariant: string;
  setSelectedVariant: (variant: string) => void;
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

export default function Palette({
  selectedType,
  setSelectedType,
  selectedVariant,
  setSelectedVariant,
}: PaletteProps) {
  return (
    <div className="bg-gray-800 p-2 rounded text-white h-full flex flex-col gap-2">
      <h2 className="text-lg font-bold mb-2">Palette</h2>

      {/* Grid of object icons */}
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

      {/* Variant dropdown if applicable */}
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
  );
}
