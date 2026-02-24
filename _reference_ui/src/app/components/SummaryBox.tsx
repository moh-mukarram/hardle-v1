interface RowCounts {
  greenCount: number;
  yellowCount: number;
}

interface SummaryBoxProps {
  rows: RowCounts[];
}

export function SummaryBox({ rows }: SummaryBoxProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row, index) => (
        <div key={index} className="flex gap-1.5 items-center">
          {/* Row number */}
          <div className="w-6 text-xs text-gray-600 font-bold text-right">
            {index + 1}
          </div>
          
          {/* Green count box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#6aaa64] bg-[#121213] flex items-center justify-center transition-all">
            <span className="text-2xl sm:text-3xl font-bold text-[#6aaa64]">
              {row.greenCount || ''}
            </span>
          </div>
          
          {/* Yellow count box */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#c9b458] bg-[#121213] flex items-center justify-center transition-all">
            <span className="text-2xl sm:text-3xl font-bold text-[#c9b458]">
              {row.yellowCount || ''}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
