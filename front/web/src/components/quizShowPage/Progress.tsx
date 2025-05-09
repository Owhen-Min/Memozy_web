interface ProgressProps {
    currentQuizIndex: number;
    totalQuizCount: number;
}   

const Progress = ({ currentQuizIndex, totalQuizCount }: ProgressProps) => {
    const progress = ((currentQuizIndex + 1) / totalQuizCount) * 100;
    
    return (
        <div className="w-[20vw]">
            <div className="flex gap-2 justify-between items-center mb-2">
                <div className="w-full h-2 bg-lighthover rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-[#91BAFF] to-[#191FD9] transition-all duration-300 ease-in-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-main200 font-semibold">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
};

export default Progress;
