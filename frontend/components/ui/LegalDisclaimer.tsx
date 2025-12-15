"use client";

import { useState } from "react";

interface LegalDisclaimerProps {
  variant?: "banner" | "inline" | "modal";
  showClose?: boolean;
}

export function LegalDisclaimer({ 
  variant = "inline", 
  showClose = false 
}: LegalDisclaimerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const content = (
    <>
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-gold-400 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className="font-medium text-slate-300 mb-1">
            ⚖️ Құқықтық ескерту / Правовое уведомление
          </p>
          <p className="text-slate-400 text-xs leading-relaxed">
            Бұл платформа тек ақпараттық мақсатта берілген. AI көмекші лицензияланған 
            заңгерді алмастырмайды. Маңызды құқықтық мәселелер бойынша білікті заңгерге 
            хабарласыңыз.
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Данная платформа предоставляется исключительно в информационных целях. 
            AI-ассистент не заменяет лицензированного юриста.
          </p>
        </div>
        {showClose && (
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Жабу / Закрыть"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </>
  );

  if (variant === "banner") {
    return (
      <div className="bg-gold-500/10 border-b border-gold-500/20 px-4 py-3">
        <div className="mx-auto max-w-7xl">{content}</div>
      </div>
    );
  }

  return <div className="legal-disclaimer">{content}</div>;
}
