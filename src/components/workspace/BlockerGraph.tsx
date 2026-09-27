import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  User,
  Shield,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { BlockerNode } from '../../types';

interface BlockerGraphProps {
  nodes?: BlockerNode[];
}

export const BlockerGraph: React.FC<BlockerGraphProps> = ({ nodes }) => {
  const defaultNodes: BlockerNode[] = [
    {
      id: 'node-1',
      label: 'REFILL REQUEST',
      owner: 'Surescripts Gateway',
      status: 'COMPLETED',
      timestamp: '2026-09-26 14:30',
      dependency: 'Pharmacy e-prescribing transmission',
      nextAction: 'Match active patient & medication record',
    },
    {
      id: 'node-2',
      label: 'PRESCRIPTION',
      owner: 'RXRESOLVE Ingestion Hub',
      status: 'COMPLETED',
      timestamp: '2026-09-26 14:31',
      dependency: 'EHR prescription index match',
      nextAction: 'Count remaining authorized refills',
    },
    {
      id: 'node-3',
      label: '0 REFILLS',
      owner: 'RXRESOLVE Rules Engine',
      status: 'COMPLETED',
      timestamp: '2026-09-26 14:32',
      dependency: 'Refills remaining count = 0',
      nextAction: 'Trigger provider renewal protocol',
    },
    {
      id: 'node-4',
      label: 'PROVIDER AUTHORIZATION',
      owner: 'Dr. Emily Carter',
      status: 'ACTIVE_BLOCKED',
      timestamp: '2026-09-26 14:35',
      dependency: 'Standing order protocol requires prescriber renewal',
      nextAction: 'Request provider review & digital sign-off',
    },
    {
      id: 'node-5',
      label: 'PROVIDER REVIEW',
      owner: 'Dr. Emily Carter',
      status: 'PENDING',
      timestamp: 'Awaiting',
      dependency: 'Physician login & digital signature',
      nextAction: 'Approve 90-day supply x 3 refills order',
    },
    {
      id: 'node-6',
      label: 'PHARMACY NOTIFICATION',
      owner: 'Surescripts Electronic Hub',
      status: 'PENDING',
      timestamp: 'Pending Provider Sign-off',
      dependency: 'Cryptographic prescription token',
      nextAction: 'Transmit approved e-Prescription to CVS Pharmacy',
    },
    {
      id: 'node-7',
      label: 'PATIENT UPDATE',
      owner: 'MetroHealth Patient Portal SMS',
      status: 'PENDING',
      timestamp: 'Pending Dispense',
      dependency: 'Pharmacy receipt acknowledgment',
      nextAction: 'Dispatch automated pickup notification SMS',
    },
    {
      id: 'node-8',
      label: 'RESOLVED',
      owner: 'Closed Loop Audit Engine',
      status: 'PENDING',
      timestamp: 'Pending Final Verification',
      dependency: 'NCPDP 200 Dispense event message',
      nextAction: 'Archive refill record to longitudinal ledger',
    },
  ];

  const graphNodes = nodes && nodes.length > 0 ? nodes : defaultNodes;
  const [selectedNode, setSelectedNode] = useState<BlockerNode>(
    graphNodes.find((n) => n.status === 'ACTIVE_BLOCKED') || graphNodes[3]
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            <span>Workflow Blocker & Dependency Graph</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive multi-stage resolution dependency pathway (Click any node to inspect operational ownership)
          </p>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          8 Sequential Stages
        </span>
      </div>

      {/* Visual Chain of Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {graphNodes.map((node, idx) => {
          const isSelected = selectedNode.id === node.id;
          let badgeStyles = 'border-slate-200 bg-slate-50 text-slate-600';
          let statusDot = 'bg-slate-300';

          if (node.status === 'COMPLETED') {
            badgeStyles = 'border-emerald-200 bg-emerald-50/60 text-emerald-800';
            statusDot = 'bg-emerald-500';
          } else if (node.status === 'ACTIVE_BLOCKED') {
            badgeStyles = 'border-rose-300 bg-rose-50 text-rose-900 ring-2 ring-rose-200';
            statusDot = 'bg-rose-600 animate-pulse';
          }

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${badgeStyles} ${
                isSelected ? 'ring-2 ring-teal-500 shadow-xs' : 'hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">0{idx + 1}</span>
                  <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-tight line-clamp-2">
                  {node.label}
                </div>
              </div>

              <div className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500 truncate">
                {node.status.replace('_', ' ')}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Node Inspector Card */}
      {selectedNode && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-200 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 uppercase">
                Node: {selectedNode.label}
              </span>
              <span
                className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                  selectedNode.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : selectedNode.status === 'ACTIVE_BLOCKED'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {selectedNode.status}
              </span>
            </div>

            <div className="text-slate-500 text-[11px] font-mono">
              Timestamp: {selectedNode.timestamp || 'Pending'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Node Owner
              </span>
              <span className="font-semibold text-slate-800">{selectedNode.owner}</span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Upstream Dependency
              </span>
              <span className="text-slate-700">{selectedNode.dependency}</span>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Next Workflow Action
              </span>
              <span className="font-semibold text-teal-800">{selectedNode.nextAction}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
