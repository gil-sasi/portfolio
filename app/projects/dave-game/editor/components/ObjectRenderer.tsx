"use client";
import { LevelObject } from "../types";
import { getImagePath } from "../utils";

type Props = {
  objects: LevelObject[];
  selectedObjectIndex: number | null;
  setSelectedObjectIndex: (index: number | null) => void;
};

export default function ObjectRenderer({
  objects,
  selectedObjectIndex,
  setSelectedObjectIndex,
}: Props) {
  return (
    <>
      {objects.map((obj, i) => {
        const path = getImagePath(obj.type, obj.variant);
        const isTiled = obj.type === "water" || obj.type === "lava";

        if (isTiled) {
          const tileWidth = 100;
          const tileCount = Math.ceil(obj.width / tileWidth);
          return Array.from({ length: tileCount }).map((_, j) => (
            <img
              key={`${i}-${j}`}
              src={path}
              alt={obj.type}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedObjectIndex(i);
              }}
              style={{
                position: "absolute",
                left: obj.x + j * tileWidth,
                top: obj.y,
                width: tileWidth,
                height: obj.height,
                pointerEvents: "auto",
                border: selectedObjectIndex === i ? "2px solid yellow" : "none",
              }}
            />
          ));
        }

        return (
          <img
            key={i}
            src={path}
            alt={obj.type}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedObjectIndex(i);
            }}
            style={{
              position: "absolute",
              left: obj.x,
              top: obj.y,
              width: obj.width,
              height: obj.height,
              pointerEvents: "auto",
              border: selectedObjectIndex === i ? "2px solid yellow" : "none",
            }}
          />
        );
      })}
    </>
  );
}
