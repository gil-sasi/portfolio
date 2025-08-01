import React, { useState, useEffect } from "react";
import GamePiece from "./GamePiece";

interface PieceMovementAnimationProps {
  isActive: boolean;
  player: 0 | 1;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  onComplete: () => void;
  isMobile?: boolean;
}

const PieceMovementAnimation: React.FC<PieceMovementAnimationProps> = ({
  isActive,
  player,
  fromPosition,
  toPosition,
  onComplete,
  isMobile = false,
}) => {
  const [animationPosition, setAnimationPosition] = useState(fromPosition);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    setIsAnimating(true);

    // Create smooth animation from source to destination
    const startTime = performance.now();
    const duration = isMobile ? 400 : 300; // Slightly longer animation on mobile

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth movement
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      // Calculate current position
      const currentX =
        fromPosition.x + (toPosition.x - fromPosition.x) * easedProgress;
      const currentY =
        fromPosition.y + (toPosition.y - fromPosition.y) * easedProgress;

      setAnimationPosition({ x: currentX, y: currentY });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        onComplete();
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, fromPosition, toPosition, onComplete, isMobile]);

  if (!isActive && !isAnimating) return null;

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: animationPosition.x - 16,
        top: animationPosition.y - 16,
        filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))",
        transform: `scale(${isMobile ? 1.2 : 1.1})`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <GamePiece
        player={player}
        index={0}
        isTop={false}
        isOwnPiece={true}
        disabled={false}
      />
    </div>
  );
};

export default PieceMovementAnimation;
