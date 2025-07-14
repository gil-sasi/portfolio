export interface BoardSize {
  width: number;
  height: number;
}

export interface PointPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const calculatePointPosition = (
  pointIndex: number,
  boardSize: BoardSize
): PointPosition => {
  if (!boardSize.width || !boardSize.height) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const boardWidth = boardSize.width;
  const boardHeight = boardSize.height;

  // Improved calculations for better consistency
  const sideMargin = boardWidth * 0.06;
  const centerBarWidth = boardWidth * 0.04;
  const playableWidth = boardWidth - sideMargin * 2 - centerBarWidth;

  // Ensure exact division for consistent triangle widths
  const pointWidth = Math.floor(playableWidth / 12);
  const pointHeight = Math.floor(boardHeight * 0.42);

  // Backgammon board layout:
  // Top row: 13-24 (left to right: 13-18, then bar, then 19-24)
  // Bottom row: 12-1 (left to right: 12-7, then bar, then 6-1)
  const isTop = pointIndex >= 13;
  let localIndex: number;
  let x: number;

  if (isTop) {
    // Top row (points 13-24)
    if (pointIndex <= 18) {
      // Points 13-18 (left side of bar)
      localIndex = pointIndex - 13;
      x = sideMargin + localIndex * pointWidth;
    } else {
      // Points 19-24 (right side of bar)
      localIndex = pointIndex - 19;
      x =
        sideMargin + 6 * pointWidth + centerBarWidth + localIndex * pointWidth;
    }
  } else {
    // Bottom row (points 1-12)
    if (pointIndex <= 6) {
      // Points 1-6 (right side of bar)
      localIndex = 6 - pointIndex;
      x =
        sideMargin + 6 * pointWidth + centerBarWidth + localIndex * pointWidth;
    } else {
      // Points 7-12 (left side of bar)
      localIndex = 12 - pointIndex;
      x = sideMargin + localIndex * pointWidth;
    }
  }

  const y = isTop ? boardHeight * 0.08 : boardHeight * 0.5;
  return { x, y, width: pointWidth, height: pointHeight };
};

export const isRedTriangle = (pointIndex: number): boolean => {
  return (
    (pointIndex >= 1 && pointIndex <= 6 && pointIndex % 2 === 0) ||
    (pointIndex >= 7 && pointIndex <= 12 && pointIndex % 2 === 1) ||
    (pointIndex >= 13 && pointIndex <= 18 && pointIndex % 2 === 0) ||
    (pointIndex >= 19 && pointIndex <= 24 && pointIndex % 2 === 1)
  );
};

// Enhanced triangle colors with smoother gradients
export const getTriangleColors = (pointIndex: number) => {
  const isRed = isRedTriangle(pointIndex);

  if (isRed) {
    return {
      primary: "#8B2323",
      secondary: "#A52A2A",
      accent: "#CD5C5C",
      shadow: "rgba(139, 35, 35, 0.6)",
      glow: "rgba(139, 35, 35, 0.3)",
    };
  } else {
    return {
      primary: "#F5E6C4",
      secondary: "#F0D498",
      accent: "#E8C570",
      shadow: "rgba(245, 230, 196, 0.8)",
      glow: "rgba(232, 197, 112, 0.3)",
    };
  }
};

// Improved triangle styles with better gradients
export const getTriangleStyles = (pointIndex: number, isTop: boolean) => {
  const colors = getTriangleColors(pointIndex);

  return {
    clipPath: isTop
      ? "polygon(50% 100%, 0% 0%, 100% 0%)"
      : "polygon(50% 0%, 0% 100%, 100% 100%)",
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.accent} 100%)`,
    boxShadow: `inset 0 2px 4px ${colors.shadow}, 0 2px 8px ${colors.glow}`,
    border: `1px solid ${colors.shadow}`,
    borderRadius: "2px",
  };
};

// SVG Triangle component properties
export const getSVGTriangleProps = (
  pointIndex: number,
  isTop: boolean,
  width: number,
  height: number
) => {
  const colors = getTriangleColors(pointIndex);

  // Create perfect isosceles triangle points
  const points = isTop
    ? `${width / 2},${height} 0,0 ${width},0` // Point down
    : `${width / 2},0 0,${height} ${width},${height}`; // Point up

  return {
    points,
    fill: `url(#gradient-${pointIndex})`,
    stroke: colors.shadow,
    strokeWidth: 0.5,
    filter: `drop-shadow(0 2px 4px ${colors.glow})`,
  };
};

// Generate SVG gradient definition
export const createSVGGradient = (pointIndex: number) => {
  const colors = getTriangleColors(pointIndex);
  const gradientId = `gradient-${pointIndex}`;

  return {
    id: gradientId,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%",
    stops: [
      { offset: "0%", stopColor: colors.primary },
      { offset: "50%", stopColor: colors.secondary },
      { offset: "100%", stopColor: colors.accent },
    ],
  };
};

export const getNumberStyles = (pointIndex: number, isTop: boolean) => {
  const colors = getTriangleColors(pointIndex);
  const isRed = isRedTriangle(pointIndex);

  return {
    left: "50%",
    top: isTop ? "2px" : undefined,
    bottom: isTop ? undefined : "2px",
    transform: "translateX(-50%)",
    zIndex: 1000,
    pointerEvents: "none" as const,
    textShadow: isRed
      ? "0 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7), 0 1px 2px rgba(255,255,255,0.2)"
      : "0 2px 4px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.7), 0 1px 2px rgba(0,0,0,0.3)",
    fontSize: "14px",
    fontWeight: "800",
    background: isRed
      ? "radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 70%, transparent 100%)"
      : "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 70%, transparent 100%)",
    borderRadius: "50%",
    padding: "2px 4px",
    minWidth: "20px",
    textAlign: "center" as const,
    color: isRed ? "white" : "black",
  };
};

export const getBoardStyles = () => ({
  background:
    "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #D2691E 75%, #8B4513 100%)",
  border: "12px solid #4A2C2A",
  boxShadow:
    "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0, 0, 0, 0.2)",
  aspectRatio: "1.8/1",
  width: "min(90vw, 800px)",
  maxWidth: 800,
  minWidth: 400,
  minHeight: 450,
  position: "relative" as const,
});

export const getWoodGrainStyles = () => ({
  backgroundImage: `repeating-linear-gradient(
    90deg,
    transparent,
    transparent 1px,
    rgba(139, 69, 19, 0.1) 1px,
    rgba(139, 69, 19, 0.1) 2px
  ), repeating-linear-gradient(
    0deg,
    transparent,
    transparent 20px,
    rgba(139, 69, 19, 0.05) 20px,
    rgba(139, 69, 19, 0.05) 40px
  )`,
  borderRadius: "inherit",
});
