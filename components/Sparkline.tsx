type SparklineProps = {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
  className?: string;
};

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  positive = true,
  className = "",
}: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <svg width={width} height={height} className={className}>
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="2 2"
          opacity="0.3"
        />
      </svg>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;

  const points = data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  // Build area fill polygon (closing back along the bottom)
  const areaPoints = `${points} ${(width).toFixed(2)},${height} 0,${height}`;

  const stroke = positive ? "#16a34a" : "#dc2626";
  const fill = positive ? "rgba(22,163,74,0.12)" : "rgba(220,38,38,0.12)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      <polygon points={areaPoints} fill={fill} />
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
