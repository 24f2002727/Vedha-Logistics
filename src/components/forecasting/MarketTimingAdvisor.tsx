import React from 'react';
import {
  Sparkles,
  Calendar,
  ArrowRight,
  Target
} from 'lucide-react';
import { MARKET_TIMING_SIGNALS } from '../../data/freightRatesData';

interface MarketTimingAdvisorProps {
  onActionClick?: () => void;
}

export const MarketTimingAdvisor: React.FC<MarketTimingAdvisorProps> = ({ onActionClick }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          Market Entry Radar
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Recommendations identifying optimal fixture windows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MARKET_TIMING_SIGNALS.map((signal) => {
          const isEmerald = signal.badgeColor === 'emerald';
          const isBlue = signal.badgeColor === 'blue';
          const isAmber = signal.badgeColor === 'amber';

          return (
            <div
              key={signal.id}
              className={`bg-white p-6 rounded-2xl border transition-all flex flex-col justify-between shadow-sm ${isEmerald
                  ? 'border-emerald-300 hover:shadow-md'
                  : isBlue
                    ? 'border-sky-300 hover:shadow-md'
                    : isAmber
                      ? 'border-amber-300 hover:shadow-md'
                      : 'border-orange-300 hover:shadow-md'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider ${isEmerald ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      isBlue ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                        isAmber ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                    {signal.signalType.replace(/_/g, ' ')}
                  </span>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-600">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                    <span>{signal.confidenceScore}% Confidence</span>
                  </div>
                </div>

                <h4 className="text-base font-display font-bold text-slate-900 mb-2">
                  {signal.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {signal.recommendedAction}
                </p>

                {/* Target Window & Impact Box */}
                <div className="space-y-2 text-xs font-mono bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4">
                  <div className="flex items-center gap-1.5 text-sky-700 font-bold">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{signal.optimalBookingWindow}</span>
                  </div>
                  <div className="text-emerald-700 font-semibold">
                    {signal.expectedCostImpact}
                  </div>
                </div>

                <div className="text-[11px] text-slate-600">
                  <strong className="text-slate-900 font-bold">Key Market Driver: </strong>
                  {signal.keyDriver}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono font-medium">
                  {signal.tradeRoutesAffected[0]}
                </span>
                {onActionClick && (
                  <button
                    onClick={onActionClick}
                    className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Execute Strategy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
