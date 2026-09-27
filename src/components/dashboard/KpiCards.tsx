import React from 'react';
import { Layers, AlertCircle, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const KpiCards: React.FC = () => {
  const { setCurrentView, setFilterStatus, setFilterStage, setFilterPriority } = useApp();

  const handleKpiClick = (type: string) => {
    setCurrentView('queue');
    switch (type) {
      case 'active':
        setFilterStatus('ALL');
        break;
      case 'blocked':
        setFilterStatus('INSURANCE BLOCKED');
        break;
      case 'awaiting_provider':
        setFilterStatus('WAITING FOR PROVIDER');
        break;
      case 'resolved':
        setFilterStatus('RESOLVED');
        break;
      case 'at_risk':
        setFilterPriority('CRITICAL');
        break;
      default:
        break;
    }
  };

  const kpis = [
    {
      id: 'active',
      title: 'ACTIVE REFILLS',
      value: '128',
      change: '+14% from yesterday',
      trend: 'up',
      icon: Layers,
      color: 'text-slate-900',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      borderColor: 'border-slate-200 hover:border-teal-400',
    },
    {
      id: 'blocked',
      title: 'BLOCKED',
      value: '23',
      change: 'Needs operational action',
      trend: 'warning',
      icon: AlertCircle,
      color: 'text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      borderColor: 'border-slate-200 hover:border-rose-300',
    },
    {
      id: 'awaiting_provider',
      title: 'AWAITING PROVIDER',
      value: '11',
      change: 'Avg wait: 3.2 hrs',
      trend: 'neutral',
      icon: Clock,
      color: 'text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      borderColor: 'border-slate-200 hover:border-indigo-300',
    },
    {
      id: 'resolved',
      title: 'RESOLVED TODAY',
      value: '47',
      change: 'Verified with pharmacy',
      trend: 'positive',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      borderColor: 'border-slate-200 hover:border-emerald-300',
    },
    {
      id: 'resolution_time',
      title: 'AVG RESOLUTION',
      value: '4h 18m',
      change: '↓ 58% vs manual phone calls',
      trend: 'positive',
      icon: TrendingUp,
      color: 'text-teal-700',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      borderColor: 'border-slate-200 hover:border-teal-300',
    },
    {
      id: 'at_risk',
      title: 'AT RISK',
      value: '8',
      change: 'High SLA / safety risk',
      trend: 'danger',
      icon: AlertTriangle,
      color: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      borderColor: 'border-slate-200 hover:border-amber-300',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <button
            key={kpi.id}
            onClick={() => handleKpiClick(kpi.id)}
            className={`text-left p-4 bg-white rounded-2xl shadow-[inset_2px_2px_5px_rgba(255,255,255,0.9),inset_-2px_-2px_5px_rgba(190,200,215,0.35),0_10px_25px_rgba(80,100,130,0.08)] hover:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.95),inset_-2px_-2px_5px_rgba(180,190,205,0.4),0_15px_40px_rgba(80,100,130,0.12)] hover:translate-y-[-2px] transition-all duration-300 flex flex-col justify-between group cursor-pointer`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase">
                {kpi.title}
              </span>
              <div className="p-2 rounded-xl bg-[#DCEBFF] text-[#6B9EFF] group-hover:shadow-md transition-all">
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2">
              <div className={`text-2xl font-bold tracking-tight font-mono tabular-nums ${kpi.color}`}>
                {kpi.value}
              </div>
              <div className="text-[11px] text-[#64748B] mt-1 truncate">
                {kpi.change}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
