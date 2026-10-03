'use client';

interface ProgressBarProps {
    raised: number;
    target: number;
    className?: string;
    showLabel?: boolean;
}

export default function ProgressBar({
    raised,
    target,
    className = '',
    showLabel = true,
}: ProgressBarProps) {
    const validTarget = target > 0 ? target : 1;
    const percentage = Math.min(100, Math.max(0, Math.round((raised / validTarget) * 100)));

    return (
        <div className={`w-full ${className}`}>
            <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-gray-200/50">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-playful-coral via-rose-400 to-playful-teal transition-all duration-700 ease-out shadow-xs"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between items-center text-xs mt-2 font-medium text-gray-600">
                    <span className="font-bold text-playful-text">
                        ₹{raised.toLocaleString('en-IN')}{' '}
                        <span className="text-gray-400 font-normal">raised</span>
                    </span>
                    <span className="font-bold text-playful-coral">
                        {percentage}%{' '}
                        <span className="text-gray-400 font-normal">of ₹{target.toLocaleString('en-IN')}</span>
                    </span>
                </div>
            )}
        </div>
    );
}
