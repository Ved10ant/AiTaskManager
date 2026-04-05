import React from "react";
import { Gauge } from "lucide-react";

type Props = {
    score: number; // Expecting 0-100 here as provided by the modal
}

const ScoreMeter: React.FC<Props> = ({ score }) => {
    const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

    const getLevel = (s: number) => {
        if (s >= 80) return { label: "Excellent", color: "from-emerald-400 to-green-500", text: "text-emerald-400" };
        if (s >= 60) return { label: "Strong", color: "from-blue-400 to-indigo-500", text: "text-blue-400" };
        if (s >= 40) return { label: "Average", color: "from-amber-400 to-orange-500", text: "text-amber-400" };
        return { label: "Low", color: "from-red-400 to-rose-500", text: "text-rose-400" };
    };

    const level = getLevel(normalizedScore);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1.5">
                    <Gauge size={14} className="text-gray-400" /> Match Score
                </span>
                <span className={`text-lg font-black tracking-tighter ${level.text}`}>
                    {normalizedScore}%
                </span>
            </div>

            <div className="relative group">
                {/* Background Track */}
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 shadow-inner">
                    {/* Animated Fill */}
                    <div
                        className={`bg-gradient-to-r ${level.color} h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(34,197,94,0.2)]`}
                        style={{ width: `${normalizedScore}%` }}
                    ></div>
                </div>
                {/* Tooltip hint on hover (simple) */}
                <div className="absolute top-0 right-0 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pb-1">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-white border border-white/10">
                        {level.label} Match
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${level.text}`}>
                    {level.label}
                </span>
                <span className="text-[10px] font-bold text-gray-600 uppercase">
                    Synergy Analysis
                </span>
            </div>
        </div>
    );
};

export default ScoreMeter;