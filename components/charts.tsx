"use client";

import { memo, useMemo } from "react";
import { networkNodes, telemetry } from "@/lib/seed";
import type { NetworkNode } from "@/lib/types";

function linePath(values: number[], width: number, height: number, padding: number): string {
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = Math.max(maximum - minimum, 1);
  return values
    .map((value, index) => {
      const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
      const y = height - padding - ((value - minimum) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export const TelemetryChart = memo(function TelemetryChart({ tick }: { tick: number }) {
  const chart = useMemo(() => {
    const points = telemetry.map((point, index) => ({
      ...point,
      requests: point.requests + ((tick + index * 3) % 7),
      latency: point.latency + ((tick + index) % 5),
    }));
    return {
      points,
      requestPath: linePath(points.map((point) => point.requests), 720, 220, 24),
      latencyPath: linePath(points.map((point) => point.latency), 720, 220, 24),
    };
  }, [tick]);

  return (
    <div className="telemetry-chart">
      <div className="chart-legend">
        <span><i className="legend-cyan" /> Requests</span>
        <span><i className="legend-violet" /> Latency</span>
        <strong>98.4k req/min</strong>
      </div>
      <svg viewBox="0 0 720 220" role="img" aria-label="24 hour request and latency trend">
        <defs>
          <linearGradient id="request-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.34" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0" />
          </linearGradient>
          <filter id="line-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[40, 80, 120, 160, 200].map((y) => (
          <line key={y} x1="24" x2="696" y1={y} y2={y} className="chart-grid" />
        ))}
        <path d={`${chart.requestPath} L 696 196 L 24 196 Z`} fill="url(#request-area)" />
        <path d={chart.requestPath} className="chart-line request-line" filter="url(#line-glow)" />
        <path d={chart.latencyPath} className="chart-line latency-line" />
        {chart.points.map((point, index) => (
          <text key={point.label} x={24 + index * 112} y="216" className="chart-label">
            {point.label}:00
          </text>
        ))}
      </svg>
    </div>
  );
});

export function RingGauge({
  value,
  label,
  detail,
}: {
  value: number;
  label: string;
  detail: string;
}) {
  const radius = 70;
  const circumference = Math.PI * 2 * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="ring-gauge">
      <svg viewBox="0 0 180 180" role="img" aria-label={`${label}: ${value}`}>
        <circle cx="90" cy="90" r={radius} className="gauge-track" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          className="gauge-value"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-copy">
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function Node({ node }: { node: NetworkNode }) {
  return (
    <g className={`network-node node-${node.status}`}>
      <circle cx={node.x} cy={node.y} r="7" className="node-halo" />
      <circle cx={node.x} cy={node.y} r="3.2" className="node-core" />
      <text x={node.x} y={node.y + 13} textAnchor="middle">
        {node.label}
      </text>
    </g>
  );
}

export function NetworkMap() {
  return (
    <div className="network-map">
      <svg viewBox="0 0 100 96" role="img" aria-label="Global service topology">
        <path d="M12 46 C 25 22, 43 22, 57 42 S 76 70, 88 28" className="network-link" />
        <path d="M12 46 C 24 72, 33 79, 43 78 S 68 67, 79 64" className="network-link secondary" />
        <path d="M34 31 C 46 50, 66 52, 79 64" className="network-link" />
        {networkNodes.map((node) => <Node key={node.id} node={node} />)}
      </svg>
      <div className="network-summary">
        <span><i className="health-dot healthy" /> 4 healthy</span>
        <span><i className="health-dot degraded" /> 1 degraded</span>
        <span><i className="health-dot critical" /> 1 contained</span>
      </div>
    </div>
  );
}

export function CostBars() {
  const bars = [44, 61, 53, 76, 69, 88, 72, 94, 83, 78, 91, 86];
  return (
    <div className="cost-bars" aria-label="Monthly cost trend">
      {bars.map((value, index) => (
        <span key={index} style={{ height: `${value}%` }} className={index === 7 ? "peak" : ""}>
          <i>{index + 1}</i>
        </span>
      ))}
    </div>
  );
}
