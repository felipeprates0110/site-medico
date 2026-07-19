"use client";

import { useEffect } from "react";

interface AdSenseUnitProps {
  slot: string;
  format?: "auto" | "fluid" | "rectangle";
  className?: string;
}

export function AdSenseUnit({ slot, format = "auto", className = "" }: AdSenseUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error", err);
    }
  }, []);

  return (
    <div className={`my-12 w-full bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-4 flex flex-col items-center justify-center relative overflow-hidden ${className}`}>
      <span className="text-[10px] text-slate-400 uppercase tracking-widest absolute top-2 left-4">
        Publicidade
      </span>
      <div className="min-h-[90px] w-full flex items-center justify-center pt-4">
        {/* Placeholder para ambiente de desenvolvimento */}
        {process.env.NODE_env === "development" ? (
          <span className="text-slate-300 font-medium text-sm">Anúncio AdSense ({slot})</span>
        ) : (
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%" }}
            data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  );
}
