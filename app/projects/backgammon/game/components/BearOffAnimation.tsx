import React, { useEffect, useState } from "react";
import GamePiece from "./GamePiece";

interface BearOffAnimationProps {
  isActive: boolean;
  player: 0 | 1;
  fromPosition: { x: number; y: number };
  onComplete: () => void;
}

const BearOffAnimation: React.FC<BearOffAnimationProps> = ({
  isActive,
  player,
  fromPosition,
  onComplete,
}) => {
  const [animationStage, setAnimationStage] = useState<
    "start" | "moving" | "complete"
  >("start");

  useEffect(() => {
    if (!isActive) return;

    // Start animation sequence
    setAnimationStage("start");

    const startTimer = setTimeout(() => {
      setAnimationStage("moving");
    }, 100);

    const completeTimer = setTimeout(() => {
      setAnimationStage("complete");
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive || animationStage === "complete") return null;

  const getAnimationStyles = () => {
    const baseStyles = {
      position: "absolute" as const,
      pointerEvents: "none" as const,
      zIndex: 1000,
      transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
    };

    if (animationStage === "start") {
      return {
        ...baseStyles,
        left: fromPosition.x,
        top: fromPosition.y,
        transform: "scale(1) rotate(0deg)",
        opacity: 1,
      };
    }

    // Moving stage - animate off the board
    const targetX =
      player === 0
        ? window.innerWidth + 100 // White pieces move to the right
        : -100; // Black pieces move to the left

    const targetY = fromPosition.y - 50; // Slight upward movement

    return {
      ...baseStyles,
      left: targetX,
      top: targetY,
      transform: "scale(0.8) rotate(360deg)",
      opacity: 0,
    };
  };

  return (
    <div style={getAnimationStyles()}>
      <GamePiece
        player={player}
        index={0}
        isTop={false}
        isOwnPiece={true}
        disabled={false}
        size="normal"
      />
      {/* Sparkle effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            player === 0
              ? "radial-gradient(circle, rgba(255,215,0,0.6) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(192,192,192,0.6) 0%, transparent 70%)",
          borderRadius: "50%",
          width: "120%",
          height: "120%",
          left: "-10%",
          top: "-10%",
          animation:
            animationStage === "moving" ? "sparkle 1.2s ease-out" : "none",
        }}
      />
    </div>
  );
};

export default BearOffAnimation;
