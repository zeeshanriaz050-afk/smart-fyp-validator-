import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, Sparkles, ArrowRight, AlertTriangle, Flame } from 'lucide-react';
import { CuratedClicheItem } from '../types';

interface HallOfClichesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topic: string) => void;
}

export const HallOfClichesModal: React.FC<HallOfClichesModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
}) => {
  const [cliches, setCliches] = useState<CuratedClicheItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/cliche-hall-of-fame')
        .then((res) => res.json())
        .then((data) => {
          setCliches(data.cliches || []);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200">
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                The FYP Hall of Clichés ("Ghisa-Pita Database")
              </h3>
              <p className="text-xs text-slate-500">
                The 8 most commonly rejected project proposals worldwide and the exact twists that rescue them.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 font-mono">
              Loading curated university rejection records...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cliches.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    {/* Top Row: Category and Rejection Rate */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono text-slate-500">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold font-mono text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        {item.rejectionRate}% Rejection Rate
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.topic}
                    </h4>

                    {/* Fatal Flaw */}
                    <div className="mt-2.5 text-xs text-rose-900 bg-rose-50/60 p-2.5 rounded-lg border border-rose-100/80">
                      <strong className="block text-rose-950 mb-0.5">Fatal Committee Flaw:</strong>
                      {item.flaw}
                    </div>

                    {/* Rescue Twist */}
                    <div className="mt-2.5 text-xs text-emerald-950 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80">
                      <div className="flex items-center gap-1 font-bold text-emerald-900 mb-0.5">
                        <Sparkles className="h-3 w-3 text-emerald-600" />
                        A+ Modern Breakthrough Twist:
                      </div>
                      <p className="leading-snug">{item.rescueUpgrade}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                      onClick={() => {
                        onSelectTopic(item.topic);
                        onClose();
                      }}
                      className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <span>Test &amp; Upgrade in Validator</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
