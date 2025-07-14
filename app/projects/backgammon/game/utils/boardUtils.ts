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

// Enhanced triangle colors with realistic wood tones
export const getTriangleColors = (pointIndex: number) => {
  const isRed = isRedTriangle(pointIndex);

  if (isRed) {
    // Dark wood (mahogany/walnut tones)
    return {
      primary: "#4A2C2A",
      secondary: "#6B3E3E",
      accent: "#8B4513",
      darkAccent: "#3E2723",
      lightAccent: "#A0522D",
      shadow: "rgba(74, 44, 42, 0.8)",
      glow: "rgba(139, 69, 19, 0.4)",
      grain: "rgba(62, 39, 35, 0.6)",
    };
  } else {
    // Light wood (birch/maple tones)
    return {
      primary: "#DEB887",
      secondary: "#F5DEB3",
      accent: "#D2B48C",
      darkAccent: "#CD853F",
      lightAccent: "#F0E68C",
      shadow: "rgba(210, 180, 140, 0.8)",
      glow: "rgba(222, 184, 135, 0.4)",
      grain: "rgba(205, 133, 63, 0.4)",
    };
  }
};

// Enhanced triangle styles with realistic wood grain texture
export const getTriangleStyles = (pointIndex: number, isTop: boolean) => {
  const colors = getTriangleColors(pointIndex);

  return {
    clipPath: isTop
      ? "polygon(50% 100%, 0% 0%, 100% 0%)"
      : "polygon(50% 0%, 0% 100%, 100% 100%)",
    background: `
      linear-gradient(
        ${isTop ? "180deg" : "0deg"}, 
        ${colors.primary} 0%, 
        ${colors.secondary} 30%, 
        ${colors.accent} 60%, 
        ${colors.lightAccent} 80%, 
        ${colors.darkAccent} 100%
      ),
      repeating-linear-gradient(
        ${isTop ? "45deg" : "135deg"},
        transparent 0px,
        transparent 1px,
        ${colors.grain} 1px,
        ${colors.grain} 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        ${isTop ? "135deg" : "45deg"},
        transparent 0px,
        transparent 8px,
        ${colors.grain} 8px,
        ${colors.grain} 10px,
        transparent 10px,
        transparent 20px
      )
    `,
    backgroundBlendMode: "multiply, overlay, normal",
    boxShadow: `
      inset 0 2px 8px ${colors.shadow},
      inset 0 -2px 4px ${colors.darkAccent},
      0 2px 12px ${colors.glow},
      0 1px 3px rgba(0, 0, 0, 0.3)
    `,
    border: `1px solid ${colors.darkAccent}`,
    borderRadius: "2px",
    position: "relative" as const,
    overflow: "hidden",
  };
};

// SVG Triangle component properties with enhanced wood effects
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
    stroke: colors.darkAccent,
    strokeWidth: 1,
    filter: `drop-shadow(0 2px 6px ${colors.shadow}) drop-shadow(0 1px 2px rgba(0,0,0,0.3))`,
    style: {
      mixBlendMode: "multiply",
    },
  };
};

// Generate SVG gradient definition with wood grain effect
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
      { offset: "25%", stopColor: colors.secondary },
      { offset: "50%", stopColor: colors.accent },
      { offset: "75%", stopColor: colors.lightAccent },
      { offset: "100%", stopColor: colors.darkAccent },
    ],
  };
};

export const getNumberStyles = (pointIndex: number, isTop: boolean) => {
  const isRed = isRedTriangle(pointIndex);
  const colors = getTriangleColors(pointIndex);

  return {
    left: "50%",
    top: isTop ? "2px" : undefined,
    bottom: isTop ? undefined : "2px",
    transform: "translateX(-50%)",
    zIndex: 1000,
    pointerEvents: "none" as const,
    textShadow: isRed
      ? "0 1px 2px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.2)"
      : "0 1px 2px rgba(0,0,0,0.7), 0 0 4px rgba(0,0,0,0.4), 0 1px 1px rgba(255,255,255,0.8)",
    fontSize: "14px",
    fontWeight: "800",
    background: isRed
      ? `linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)`
      : `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.8) 100%)`,
    border: isRed
      ? `1px solid ${colors.darkAccent}`
      : `1px solid ${colors.darkAccent}`,
    borderRadius: "50%",
    padding: "2px 4px",
    minWidth: "20px",
    textAlign: "center" as const,
    color: isRed ? "#F0E68C" : "#2C1810",
    backdropFilter: "blur(1px)",
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
  backgroundImage: `
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(139, 69, 19, 0.15) 2px,
      rgba(139, 69, 19, 0.15) 4px,
      transparent 4px,
      transparent 6px
    ), 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 15px,
      rgba(139, 69, 19, 0.08) 15px,
      rgba(139, 69, 19, 0.08) 35px,
      transparent 35px,
      transparent 50px
    ),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 25px,
      rgba(160, 82, 45, 0.06) 25px,
      rgba(160, 82, 45, 0.06) 30px,
      transparent 30px,
      transparent 60px
    )
  `,
  backgroundBlendMode: "multiply, overlay, normal",
  borderRadius: "inherit",
});
