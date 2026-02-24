import { useState } from 'react';

export function RoughWorkPanel() {
  const [notes, setNotes] = useState('');
  const [greensInput, setGreensInput] = useState('');
  const [yellowsInput, setYellowsInput] = useState('');

  const handleInputChange = (value: string, setter: (val: string) => void) => {
    // Only allow letters, convert to uppercase, remove numbers and special characters
    const filtered = value.replace(/[^a-zA-Z]/g, '').toUpperCase();
    setter(filtered);
  };

  return (
    <div className="w-[240px] bg-[#1e1e1e] border-l border-[#333333] rounded-tr-lg rounded-br-lg flex flex-col h-fit">
      {/* Header */}
      <div className="text-center py-6 border-b border-[#333333]">
        <h2 className="text-[#aaaaaa] text-xs font-bold tracking-[1px] uppercase">
          Rough Work
        </h2>
      </div>

      {/* Content Area */}
      <div className="p-6 relative">
        {/* Pre-filled prompts with input fields */}
        <div className="font-mono text-sm space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[#6aaa64] font-bold whitespace-nowrap">Greens =</span>
            <input
              type="text"
              value={greensInput}
              onChange={(e) => handleInputChange(e.target.value, setGreensInput)}
              className="flex-1 bg-transparent border-b border-[#6aaa64]/30 text-[#6aaa64] font-bold outline-none focus:border-[#6aaa64] transition-colors px-1"
              placeholder=""
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#c9b458] font-bold whitespace-nowrap">Yellows =</span>
            <input
              type="text"
              value={yellowsInput}
              onChange={(e) => handleInputChange(e.target.value, setYellowsInput)}
              className="flex-1 bg-transparent border-b border-[#c9b458]/30 text-[#c9b458] font-bold outline-none focus:border-[#c9b458] transition-colors px-1"
              placeholder=""
            />
          </div>
        </div>

        {/* Ruled lines - textarea overlay */}
        <div className="relative">
          {/* Background ruling lines */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="border-b border-white/10"
                style={{
                  height: '32px',
                  marginTop: i === 0 ? '0' : '0'
                }}
              />
            ))}
          </div>

          {/* Transparent textarea */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Type your deductions here..."
            className="w-full h-[320px] bg-transparent text-[#d4d4d4] font-mono text-sm resize-none outline-none relative z-10 leading-[32px]"
            style={{
              caretColor: '#6aaa64',
              lineHeight: '32px'
            }}
          />
        </div>
      </div>
    </div>
  );
}