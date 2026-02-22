"use client";

const colorMap: Record<string, { bg: string; dot: string }> = {
  blue: { bg: "bg-blue-500/20", dot: "bg-blue-500" },
  green: { bg: "bg-green-500/20", dot: "bg-green-500" },
  red: { bg: "bg-red-500/20", dot: "bg-red-500" },
  yellow: { bg: "bg-yellow-500/20", dot: "bg-yellow-500" },
  purple: { bg: "bg-purple-500/20", dot: "bg-purple-500" },
};

export const Indicator = ({ color = "blue" }: { color?: string }) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className={`h-5 w-5 rounded-full ${colors.bg} flex items-center justify-center`}>
      <div className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
    </div>
  );
};
