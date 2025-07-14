import React from "react";
import { getSVGTriangleProps, createSVGGradient } from "../utils/boardUtils";

interface SVGTriangleProps {
  pointIndex: number;
  isTop: boolean;
  width: number;
  height: number;
  className?: string;
}

const SVGTriangle: React.FC<SVGTriangleProps> = ({
  pointIndex,
  isTop,
  width,
  height,
  className = "",
}) => {
  const triangleProps = getSVGTriangleProps(pointIndex, isTop, width, height);
  const gradientDef = createSVGGradient(pointIndex);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`transition-all duration-200 ${className}`}
      style={{ display: "block" }}
    >
      <defs>
        {/* Main gradient */}
        <linearGradient
          id={gradientDef.id}
          x1={gradientDef.x1}
          y1={gradientDef.y1}
          x2={gradientDef.x2}
          y2={gradientDef.y2}
        >
          {gradientDef.stops.map((stop, index) => (
            <stop
              key={index}
              offset={stop.offset}
              stopColor={stop.stopColor}
              stopOpacity={1}
            />
          ))}
        </linearGradient>

        {/* Enhanced radial gradient for depth */}
        <radialGradient
          id={`radial-${pointIndex}`}
          cx="50%"
          cy={isTop ? "80%" : "20%"}
          r="60%"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
        </radialGradient>

        {/* Enhanced shadow filter with multiple layers */}
        <filter
          id={`shadow-${pointIndex}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="rgba(0,0,0,0.4)"
          />
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="1"
            floodColor="rgba(0,0,0,0.3)"
          />
          <feDropShadow
            dx="0"
            dy="0.5"
            stdDeviation="0.5"
            floodColor="rgba(0,0,0,0.2)"
          />
        </filter>

        {/* Inner glow filter */}
        <filter
          id={`glow-${pointIndex}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle inner shadow */}
        <filter
          id={`inner-shadow-${pointIndex}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1" result="offset-blur" />
          <feFlood floodColor="rgba(0,0,0,0.2)" />
          <feComposite in2="offset-blur" operator="in" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base triangle with shadow */}
      <polygon
        points={triangleProps.points}
        fill={triangleProps.fill}
        stroke={triangleProps.stroke}
        strokeWidth={triangleProps.strokeWidth}
        filter={`url(#shadow-${pointIndex})`}
        className="transition-all duration-200"
      />

      {/* Overlay for depth effect */}
      <polygon
        points={triangleProps.points}
        fill={`url(#radial-${pointIndex})`}
        className="transition-all duration-200"
      />

      {/* Inner highlight for 3D effect */}
      <polygon
        points={triangleProps.points}
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth={0.5}
        filter={`url(#glow-${pointIndex})`}
        className="transition-all duration-200"
      />

      {/* Subtle inner edge */}
      <polygon
        points={triangleProps.points}
        fill="none"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth={0.3}
        strokeDasharray="1,1"
        filter={`url(#inner-shadow-${pointIndex})`}
        className="transition-all duration-200"
      />
    </svg>
  );
};

export default SVGTriangle;
