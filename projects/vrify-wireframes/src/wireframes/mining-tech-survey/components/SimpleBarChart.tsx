interface SimpleBarChartProps {
  className?: string;
}

export const SimpleBarChart = ({ className = "" }: SimpleBarChartProps) => {
  const bars = [
    { height: 60 },
    { height: 85 },
    { height: 45 },
    { height: 70 },
    { height: 90 },
    { height: 35 },
    { height: 55 }
  ];

  return (
    <div className={`w-full h-full flex items-end justify-between gap-1 p-2 ${className}`}>
      {bars.map((bar, index) => (
        <div
          key={index}
          className="bg-wireframe-300 w-full flex-1"
          style={{ height: `${bar.height}%` }}
        />
      ))}
    </div>
  );
};