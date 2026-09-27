import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Calendar,
  Activity,
  ArrowDownRight,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SystemStatusCard } from '../common/SystemStatusCard';

type TimeFilter = 'TODAY' | '7D' | '30D' | '90D';

export const AnalyticsView: React.FC = () => {
  const { currentOrg, refills, setCurrentView, setFilterBlocker, setFilterStatus } = useApp();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('30D');

  // Multipliers based on time filter
  const filterMultiplier =
    timeFilter === 'TODAY' ? 0.08 : timeFilter === '7D' ? 0.25 : timeFilter === '30D' ? 1 : 2.8;

  const totalVolume = Math.round(1482 * filterMultiplier);
  const avgResolutionTime = timeFilter === 'TODAY' ? '1.8h' : '2.4h';
  const blockedCount = refills.filter((r) => r.status.includes('WAITING') || r.status.includes('BLOCKED')).length;
  const providerResponseHours = '1.2h';
  const pharmacyResponseHours = '48m';
  const resolutionRate = '96.4%';
  const aiAcceptanceRate = '92.8%';

  // Workflow Bottlenecks distribution per requirement 2
  const bottleneckDistribution = [
    {
      category: 'Provider review',
      percentage: 42,
      count: Math.round(totalVolume * 0.42),
      avgTime: '3.4h',
      color: 'bg-indigo-600',
      textColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 border-indigo-200',
      filterKey: 'PROVIDER_AUTHORIZATION',
      statusTarget: 'WAITING FOR PROVIDER',
    },
    {
      category: 'Missing information',
      percentage: 24,
      count: Math.round(totalVolume * 0.24),
      avgTime: '6.8h',
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border-amber-200',
      filterKey: 'MISSING_LAB_WORK',
      statusTarget: 'MISSING INFORMATION',
    },
    {
      category: 'Pharmacy clarification',
      percentage: 17,
      count: Math.round(totalVolume * 0.17),
      avgTime: '1.5h',
      color: 'bg-sky-500',
      textColor: 'text-sky-700',
      badgeBg: 'bg-sky-50 border-sky-200',
      filterKey: 'DOSAGE_CLARIFICATION',
      statusTarget: 'WAITING FOR PHARMACY',
    },
    {
      category: 'Insurance',
      percentage: 11,
      count: Math.round(totalVolume * 0.11),
      avgTime: '14.2h',
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      badgeBg: 'bg-rose-50 border-rose-200',
      filterKey: 'PA_REQUIRED',
      statusTarget: 'INSURANCE BLOCKED',
    },
    {
      category: 'Other',
      percentage: 6,
      count: Math.round(totalVolume * 0.06),
      avgTime: '2.1h',
      color: 'bg-slate-400',
      textColor: 'text-slate-600',
      badgeBg: 'bg-slate-100 border-slate-200',
      filterKey: 'ALL',
      statusTarget: 'ALL',
    },
  ];

  // Cases by status (Donut chart data)
  const statusDistribution = [
    { label: 'Resolved', count: Math.round(totalVolume * 0.68), color: '#10b981', hex: 'bg-emerald-500' },
    { label: 'Provider Review', count: Math.round(totalVolume * 0.14), color: '#6366f1', hex: 'bg-indigo-500' },
    { label: 'Action Required', count: Math.round(totalVolume * 0.09), color: '#f59e0b', hex: 'bg-amber-500' },
    { label: 'Pharmacy Ready', count: Math.round(totalVolume * 0.06), color: '#06b6d4', hex: 'bg-cyan-500' },
    { label: 'Analyzing / New', count: Math.round(totalVolume * 0.03), color: '#64748b', hex: 'bg-slate-500' },
  ];

  // Cases by organization
  const organizationMetrics = [
    { name: 'MetroHealth Physician Group', volume: Math.round(totalVolume * 0.45), resolutionRate: '97.2%', avgTurnaround: '2.1h' },
    { name: 'St. Jude Community Clinic', volume: Math.round(totalVolume * 0.28), resolutionRate: '95.6%', avgTurnaround: '2.6h' },
    { name: 'Valley Family Medicine', volume: Math.round(totalVolume * 0.18), resolutionRate: '94.8%', avgTurnaround: '3.1h' },
    { name: 'Capsule & Retail Partner Sync', volume: Math.round(totalVolume * 0.09), resolutionRate: '98.5%', avgTurnaround: '1.2h' },
  ];

  // Resolution Funnel data
  const funnelSteps = [
    { step: '1. Ingested Refill Requests', count: totalVolume, pct: '100%', drop: '0%' },
    { step: '2. AI Diagnostic Triage', count: Math.round(totalVolume * 0.98), pct: '98%', drop: '2% unmapped' },
    { step: '3. Blocker Resolved & SBAR Generated', count: Math.round(totalVolume * 0.88), pct: '88%', drop: '10% pending telemetry' },
    { step: '4. Provider Electronic Sign-Off', count: Math.round(totalVolume * 0.76), pct: '76%', drop: '12% in clinical review' },
    { step: '5. Surescripts Dispense Verified', count: Math.round(totalVolume * 0.72), pct: '72%', drop: 'Completed loop' },
  ];

  // 14-day line chart trend simulation
  const trendDays = [
    { day: 'Day 1', hours: 4.8, baseline: 18.0 },
    { day: 'Day 2', hours: 4.2, baseline: 18.0 },
    { day: 'Day 3', hours: 3.9, baseline: 18.0 },
    { day: 'Day 4', hours: 3.4, baseline: 18.0 },
    { day: 'Day 5', hours: 3.1, baseline: 18.0 },
    { day: 'Day 6', hours: 2.8, baseline: 18.0 },
    { day: 'Day 7', hours: 2.9, baseline: 18.0 },
    { day: 'Day 8', hours: 2.6, baseline: 18.0 },
    { day: 'Day 9', hours: 2.4, baseline: 18.0 },
    { day: 'Day 10', hours: 2.5, baseline: 18.0 },
    { day: 'Day 11', hours: 2.3, baseline: 18.0 },
    { day: 'Day 12', hours: 2.1, baseline: 18.0 },
    { day: 'Day 13', hours: 2.0, baseline: 18.0 },
    { day: 'Day 14', hours: 1.8, baseline: 18.0 },
  ];

  const handleBottleneckClick = (categoryKey: string, statusTarget: string) => {
    if (categoryKey !== 'ALL') {
      setFilterBlocker(categoryKey);
    }
    if (statusTarget !== 'ALL') {
      setFilterStatus(statusTarget as any);
    }
    setCurrentView('queue');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Time Range Filters and DEMO METRICS badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              {currentOrg.name} · Operational Analytics
            </span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              DEMO METRICS
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            Refill Resolution Throughput & Bottlenecks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time operational cycle times, blocker distribution, and pharmacy partner SLA performance
          </p>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs self-start md:self-auto">
          {(['TODAY', '7D', '30D', '90D'] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
                timeFilter === filter
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'TODAY' ? 'Today' : filter === '7D' ? '7 Days' : filter === '30D' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top-Level KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Refill Volume
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900">
            {totalVolume.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />
            +18.4% YoY
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Avg Resolution Time
          </span>
          <div className="text-2xl font-bold font-mono text-teal-700">
            {avgResolutionTime}
          </div>
          <span className="text-[11px] text-teal-700 font-semibold">
            vs 18.2h Baseline
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Blocked Refills
          </span>
          <div className="text-2xl font-bold font-mono text-rose-700">
            {blockedCount}
          </div>
          <span className="text-[11px] text-slate-500">
            Active in triage
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Provider Response
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-700">
            {providerResponseHours}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold">
            SLA: &lt; 4.0h
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Pharmacy Response
          </span>
          <div className="text-2xl font-bold font-mono text-sky-700">
            {pharmacyResponseHours}
          </div>
          <span className="text-[11px] text-sky-600 font-semibold">
            Surescripts e-ACK
          </span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            AI Acceptance Rate
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-700">
            {aiAcceptanceRate}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Clinician Approved
          </span>
        </div>
      </div>

      {/* 3. Section 2: WORKFLOW BOTTLENECKS (Interactive filter triggers) */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>WORKFLOW BOTTLENECKS</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified blocker categories preventing timely medication dispensing. Click any category to filter the refill worklist.
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded">
            Interactive Filter Active
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {bottleneckDistribution.map((item) => (
            <button
              key={item.category}
              onClick={() => handleBottleneckClick(item.filterKey, item.statusTarget)}
              className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50/50 hover:bg-teal-50/30 text-left transition-all group cursor-pointer shadow-2xs relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {item.percentage}%
                </span>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${item.badgeBg} ${item.textColor}`}>
                  {item.count} cases
                </span>
              </div>

              <span className="block text-xs font-bold text-slate-800 group-hover:text-teal-900 transition-colors">
                {item.category}
              </span>
              <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                Avg stall: {item.avgTime}
              </span>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 group-hover:text-teal-700 font-semibold">
                <span>View matching queue</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Chart Grid: Line Chart (Resolution Trend) & Donut Chart (Status Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Line Chart: Resolution Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Resolution Turnaround Time (Hours) vs Baseline
              </h3>
              <p className="text-xs text-slate-400">
                Automated triage and SBAR routing reduced cycle times from 18h to under 2h.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              -88% Turnaround
            </span>
          </div>

          {/* SVG Line Chart Simulation */}
          <div className="pt-2">
            <div className="h-48 w-full flex items-end justify-between gap-2 px-2 border-b border-slate-200 pb-2">
              {trendDays.map((item, idx) => {
                const heightPct = Math.round((item.hours / 6) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {item.hours}h avg
                    </div>

                    <div className="w-full max-w-[24px] bg-slate-100 rounded-t h-36 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t transition-all group-hover:from-teal-500 group-hover:to-teal-300"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 mt-1">
                      D{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-teal-500" />
                <span>RXRESOLVE Orchestrated Turnaround (1.8h - 4.8h)</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600 font-semibold">
                <span className="w-2.5 h-0.5 bg-rose-500" />
                <span>Legacy Manual Baseline (18.0h)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donut / Pie Chart: Cases by Status (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Cases by Operational Status</h3>
            <span className="font-mono text-xs text-slate-400">{totalVolume} total</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Donut representation */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="18" fill="none" />
                {/* Resolved 68% */}
                <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="18" fill="none" strokeDasharray="170 80" strokeDashoffset="0" />
                {/* Provider Review 14% */}
                <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="18" fill="none" strokeDasharray="35 215" strokeDashoffset="-170" />
                {/* Action Required 9% */}
                <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="18" fill="none" strokeDasharray="22 228" strokeDashoffset="-205" />
                {/* Pharmacy Ready 6% */}
                <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="18" fill="none" strokeDasharray="15 235" strokeDashoffset="-227" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-mono text-lg font-bold text-slate-900">96.4%</span>
                <span className="text-[9px] font-semibold text-slate-400 uppercase">Clearance</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs flex-1 w-full">
              {statusDistribution.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.hex}`} />
                    <span className="font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    {item.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Funnel Chart & Cases by Organization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workflow Funnel (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Refill Resolution Funnel</h3>
            <span className="font-mono text-xs text-teal-700 font-semibold">96.4% Completion</span>
          </div>

          <div className="space-y-2 text-xs">
            {funnelSteps.map((step, idx) => (
              <div key={step.step} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 block">{step.step}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{step.drop}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 block">{step.count.toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-teal-700 font-bold">{step.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cases by Organization (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Performance by Health Organization</h3>
            <span className="font-mono text-xs text-slate-400">4 Active Systems</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {organizationMetrics.map((org) => (
              <div key={org.name} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{org.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Volume: {org.volume} · Avg: {org.avgTurnaround}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {org.resolutionRate} SLA Pass
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Section 7: Reliability & System Status Card */}
      <SystemStatusCard />
    </div>
  );
};
