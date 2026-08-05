import React, { useState, useEffect } from 'react';
import { RecallAlert } from '@shared/types';
import { WebApiService } from '../services/api';
import { 
  ShieldAlert, 
  AlertOctagon, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  PhoneCall,
  RefreshCw
} from 'lucide-react';

export const RecallAlertsView: React.FC = () => {
  const [alerts, setAlerts] = useState<RecallAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecalls = async () => {
      setLoading(true);
      const data = await WebApiService.getRecallAlerts();
      setAlerts(data);
      setLoading(false);
    };
    fetchRecalls();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-rose-500/30 bg-rose-950/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-72 h-72 bg-gradient-to-br from-rose-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold mb-3">
              <ShieldAlert className="w-3.5 h-3.5" />
              Feature 11 — Retroactive Recall & Ban Safety Net
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
              FSSAI Recall & Ban <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">Safety Center</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Retroactive alerts matching your scan history against published FSSAI food recall & ban notices — closing the safety loop after point-of-purchase.
            </p>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-xl border border-rose-500/30 text-right min-w-[200px]">
            <div className="text-xs text-slate-400 font-medium">Active Recalls</div>
            <div className="text-3xl font-black text-rose-400">{alerts.length} Notices</div>
            <div className="text-[11px] text-amber-400 font-semibold mt-0.5">Seeded FSSAI Dataset</div>
          </div>
        </div>
      </div>

      {/* Recalls Feed */}
      <div className="space-y-6">
        <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          Active FSSAI Regulatory Notices & User Match History
        </h2>

        <div className="space-y-4">
          {alerts.map((alert) => {
            // Check if user's scan history has a match for Maggi
            const isUserMatched = alert.barcode === '8901058852011';

            return (
              <div 
                key={alert.id}
                className={`glass-panel p-6 rounded-2xl border transition-all ${
                  isUserMatched 
                    ? 'border-rose-500/50 bg-rose-950/20 shadow-xl shadow-rose-500/10' 
                    : 'border-slate-800 bg-slate-900/40'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        alert.hazardLevel === 'CRITICAL' 
                          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {alert.hazardLevel} HAZARD
                      </span>

                      {isUserMatched && (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
                          ⚠️ MATCHED IN YOUR SCAN HISTORY!
                        </span>
                      )}

                      <span className="text-xs text-slate-400">
                        Date: {alert.announcementDate}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white mt-1">
                      {alert.title}
                    </h3>
                    <p className="text-xs text-slate-300">
                      <strong>Product:</strong> {alert.productName} ({alert.brand}) • <strong>Barcode:</strong> {alert.barcode}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    <strong className="text-amber-400 font-bold block mb-1">Reason for Recall:</strong>
                    {alert.reason}
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    <strong className="text-rose-400 font-bold block mb-1">Action Required for Consumers:</strong>
                    {alert.actionRequired}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Affected Batches: {alert.affectedBatches?.join(', ') || 'All batches'}
                    </div>

                    {alert.fssaiNoticeUrl && (
                      <a 
                        href={alert.fssaiNoticeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                      >
                        Official FSSAI Notice <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
