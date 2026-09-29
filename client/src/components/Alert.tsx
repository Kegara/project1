import React from 'react';
import { useAlert } from '../context/AlertContext';
import { X, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AlertContainer: React.FC = () => {
  const { alerts, dismissAlert } = useAlert();

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {alerts.map((alert) => {
        const isError = alert.type === 'error';
        const isWarning = alert.type === 'warning';
        const isSuccess = alert.type === 'success';

        const bgClass = isError
          ? 'bg-rose-50 border-rose-300 text-rose-800'
          : isWarning
          ? 'bg-amber-50 border-amber-300 text-amber-800'
          : 'bg-emerald-50 border-emerald-300 text-emerald-800';

        const Icon = isError ? AlertCircle : isWarning ? AlertTriangle : CheckCircle2;
        const iconColor = isError
          ? 'text-rose-500'
          : isWarning
          ? 'text-amber-500'
          : 'text-emerald-500';

        const label = isError ? 'Error' : isWarning ? 'Warning' : 'Success';

        return (
          <div
            key={alert.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-slide-in-right ${bgClass}`}
            role="alert"
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-xs font-medium leading-relaxed">{alert.message}</p>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 transition-colors"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
