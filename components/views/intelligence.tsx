"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CircleDollarSign,
  CloudCog,
  Cpu,
  Gauge,
  Leaf,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { CostBars, RingGauge } from "@/components/charts";
import { useNexus } from "@/components/nexus-context";
import { Panel, ProgressBar, StatusPill } from "@/components/ui";
import { clamp, formatCurrency } from "@/lib/utils";

export function Intelligence() {
  const { t } = useNexus();
  const [requestGrowth, setRequestGrowth] = useState(18);
  const [automation, setAutomation] = useState(64);
  const [reservedCapacity, setReservedCapacity] = useState(42);
  const [applied, setApplied] = useState(false);

  const scenario = useMemo(() => {
    const baseline = 184_200;
    const growthCost = baseline * (requestGrowth / 100) * 0.62;
    const automationSavings = baseline * (automation / 100) * 0.18;
    const capacitySavings = baseline * (reservedCapacity / 100) * 0.12;
    const projected = Math.round(baseline + growthCost - automationSavings - capacitySavings);
    const risk = clamp(Math.round(38 + requestGrowth * 1.4 - automation * 0.32 - reservedCapacity * 0.21), 4, 96);
    return { projected, risk, savings: Math.round(automationSavings + capacitySavings) };
  }, [automation, requestGrowth, reservedCapacity]);

  return (
    <div className="view intelligence-view">
      <div className="view-heading">
        <div>
          <span className="eyebrow">COST × RELIABILITY × CARBON × DELIVERY</span>
          <h1>{t.unitEconomics}</h1>
          <p>Model trade-offs before acting. Every recommendation keeps its assumptions, confidence, and reversal path visible.</p>
        </div>
        <StatusPill label="Forecast refreshed" tone="success" pulse />
      </div>

      <div className="intelligence-metrics">
        <article>
          <span className="intelligence-icon violet"><CircleDollarSign size={18} /></span>
          <div><span>{t.monthlySpend}</span><strong>$184.2k</strong><small><ArrowDownRight size={13} /> 6.4% below plan</small></div>
        </article>
        <article>
          <span className="intelligence-icon cyan"><TrendingUp size={18} /></span>
          <div><span>{t.forecast}</span><strong>$196.8k</strong><small><ArrowUpRight size={13} /> 3.1% variance</small></div>
        </article>
        <article>
          <span className="intelligence-icon green"><Sparkles size={18} /></span>
          <div><span>{t.savings}</span><strong>$31.4k</strong><small>7 reversible actions</small></div>
        </article>
        <article>
          <span className="intelligence-icon amber"><Leaf size={18} /></span>
          <div><span>Carbon intensity</span><strong>184 g</strong><small>CO₂e / 1k requests</small></div>
        </article>
      </div>

      <div className="intelligence-grid">
        <Panel className="spend-panel" eyebrow="AUGUST · SYNTHETIC USD" title="Cost trajectory" action={<span className="budget-label">Budget $212k</span>}>
          <div className="spend-chart-wrap">
            <CostBars />
            <div className="spend-axis"><span>Aug 1</span><span>Aug 12</span><span>Aug 24</span><span>Aug 31</span></div>
          </div>
          <div className="cost-legend">
            <span><i className="legend-violet" /> Compute 46%</span>
            <span><i className="legend-cyan" /> AI inference 27%</span>
            <span><i className="legend-amber" /> Data 18%</span>
            <span><i className="legend-green" /> Edge 9%</span>
          </div>
        </Panel>

        <Panel className="budget-health-panel" eyebrow="FORECAST CONFIDENCE 92%" title="Budget health">
          <RingGauge value={87} label="on plan" detail="$15.2k headroom" />
          <div className="budget-breakdown">
            <div><span>Committed</span><strong>$132.4k</strong></div>
            <div><span>Variable</span><strong>$51.8k</strong></div>
            <div><span>Forecast range</span><strong>$191–203k</strong></div>
          </div>
        </Panel>
      </div>

      <div className="scenario-grid">
        <Panel className="scenario-panel" eyebrow="NO EXTERNAL CHANGES" title="What-if simulator" action={<SlidersHorizontal size={17} />}>
          <div className="scenario-controls">
            <label>
              <span><strong>Request growth</strong><b>+{requestGrowth}%</b></span>
              <input type="range" min="0" max="60" value={requestGrowth} onChange={(event) => {
                setRequestGrowth(Number(event.target.value));
                setApplied(false);
              }} />
            </label>
            <label>
              <span><strong>Automation coverage</strong><b>{automation}%</b></span>
              <input type="range" min="0" max="100" value={automation} onChange={(event) => {
                setAutomation(Number(event.target.value));
                setApplied(false);
              }} />
            </label>
            <label>
              <span><strong>Reserved capacity</strong><b>{reservedCapacity}%</b></span>
              <input type="range" min="0" max="80" value={reservedCapacity} onChange={(event) => {
                setReservedCapacity(Number(event.target.value));
                setApplied(false);
              }} />
            </label>
          </div>
          <div className="scenario-result">
            <div><span>Projected spend</span><strong>{formatCurrency(scenario.projected)}</strong><small>{formatCurrency(scenario.savings)} modeled savings</small></div>
            <div><span>Operational risk</span><strong>{scenario.risk}/100</strong><ProgressBar value={scenario.risk} tone={scenario.risk > 60 ? "red" : scenario.risk > 35 ? "amber" : "green"} label="Operational risk" /></div>
            <button type="button" className="button primary" onClick={() => setApplied(true)}>
              {applied ? <CheckCircle2 size={15} /> : <BrainCircuit size={15} />}
              {applied ? "Scenario saved locally" : "Save scenario"}
            </button>
          </div>
        </Panel>

        <Panel eyebrow="RISK-ADJUSTED" title="Optimization frontier">
          <div className="optimization-list">
            {[
              { icon: Cpu, title: "Right-size warm inference pool", saving: "$12.8k", risk: "Low", confidence: 94, tone: "green" },
              { icon: CloudCog, title: "Move replay jobs to flexible compute", saving: "$8.4k", risk: "Low", confidence: 91, tone: "cyan" },
              { icon: Zap, title: "Cache stable embedding responses", saving: "$6.1k", risk: "Medium", confidence: 86, tone: "violet" },
              { icon: Gauge, title: "Reduce preview retention to 14 days", saving: "$4.1k", risk: "Low", confidence: 97, tone: "amber" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="optimization-item">
                  <span className={`optimization-icon tone-${item.tone}`}><Icon size={16} /></span>
                  <div><strong>{item.title}</strong><small>{item.risk} risk · {item.confidence}% confidence</small></div>
                  <b>{item.saving}</b>
                </article>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="risk-grid">
        <Panel eyebrow="MULTI-DIMENSIONAL" title="Risk radar">
          <div className="risk-matrix">
            {[
              ["Reliability", 18, "healthy"],
              ["Security", 9, "healthy"],
              ["Cost", 34, "watch"],
              ["Vendor", 42, "watch"],
              ["Delivery", 21, "healthy"],
              ["Compliance", 12, "healthy"],
            ].map(([label, value, status]) => (
              <div key={String(label)} className="risk-row">
                <span>{label}</span>
                <ProgressBar value={Number(value)} tone={status === "watch" ? "amber" : "green"} label={String(label)} />
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </Panel>
        <Panel eyebrow="EXPLAINABLE SIGNAL" title="Why the forecast changed">
          <div className="explanation-card">
            <TriangleAlert size={20} />
            <div>
              <strong>APAC inference retry rate increased</strong>
              <p>Failover activity added 7.2% compute and 3.8% egress, partially offset by cached model routing.</p>
              <div className="explanation-tags"><span>correlation 0.91</span><span>reversible</span><span>no billing action</span></div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
