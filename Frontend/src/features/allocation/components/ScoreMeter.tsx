import React from "react";

type Props = {
    score: number;
}

const ScoreMeter: React.FC<Props> = ({ score }) => {
    const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

    const getLevel = (s: number) => {
        if (s >= 80) return { label: "Excellent", color: "bg-green-500" };
        if (s >= 60) return { label: "Good", color: "bg-yellow-500" };
        if (s >= 40) return { label: "Average", color: "bg-orange-500" };
        return { label: "Low", color: "bg-red-500" };
    };

    const level = getLevel(normalizedScore);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Match Score</span>
                <span className="text-lg font-bold">{normalizedScore}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${level.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${normalizedScore}%` }}
                ></div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{level.label}</span>
                <span className="text-xs text-gray-500">0 - 100</span>
            </div>
        </div>
    );
};

export default ScoreMeter;