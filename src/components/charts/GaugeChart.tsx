"use client";

import { useRef, useEffect } from "react";
import { getScoreStatus, getStatusColor } from "@/lib/utils";

interface GaugeChartProps {
  score: number;
  size?: number;
  label?: string;
}

export function GaugeChart({ score, size = 160, label }: GaugeChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let cancelled = false;

    import("d3").then((d3) => {
      if (cancelled) return;

      const width = size;
      const height = size;
      const radius = Math.min(width, height) / 2 - 10;
      const arcWidth = 12;

      d3.select(svg).selectAll("*").remove();

      const g = d3
        .select(svg)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // 背景アーク
      const bgArc = d3
        .arc<unknown>()
        .innerRadius(radius - arcWidth)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .endAngle(Math.PI * 0.75);

      g.append("path").attr("d", bgArc({}) as string).attr("fill", "#e0e0e0");

      // スコアアーク
      const status = getScoreStatus(score);
      const color = getStatusColor(status);
      const endAngle = -Math.PI * 0.75 + (Math.PI * 1.5 * score) / 100;

      const scoreArc = d3
        .arc<unknown>()
        .innerRadius(radius - arcWidth)
        .outerRadius(radius)
        .startAngle(-Math.PI * 0.75)
        .cornerRadius(arcWidth / 2);

      g.append("path")
        .attr(
          "d",
          scoreArc.endAngle(-Math.PI * 0.75)({}) as string,
        )
        .attr("fill", color)
        .transition()
        .duration(800)
        .attrTween("d", () => {
          const interpolate = d3.interpolate(-Math.PI * 0.75, endAngle);
          return (t: number) => scoreArc.endAngle(interpolate(t))({}) as string;
        });

      // スコアテキスト
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "0.1em")
        .attr("font-size", `${size / 4}px`)
        .attr("font-weight", "bold")
        .attr("fill", color)
        .text(score);
    });

    return () => {
      cancelled = true;
    };
  }, [score, size]);

  return (
    <div className="flex flex-col items-center">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        role="img"
        aria-label={`${label ?? "パフォーマンス"}スコア: 100点中${score}点`}
      />
      {label && <span className="mt-1 text-sm text-muted-foreground">{label}</span>}
    </div>
  );
}
