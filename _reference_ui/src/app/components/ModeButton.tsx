interface ModeButtonProps {
  mode: 'green' | 'yellow';
  disabled: boolean;
  onClick: () => void;
}

export function ModeButton({ mode, disabled, onClick }: ModeButtonProps) {
  const isGreen = mode === 'green';
  const baseColor = isGreen ? '#6aaa64' : '#c9b458';
  const label = isGreen ? 'DISABLE GREEN MODE' : 'DISABLE YELLOW MODE';
  
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 py-4 px-8 font-bold text-lg tracking-wide
        transition-all duration-200
        ${disabled 
          ? 'bg-[#3a3a3c] text-gray-500 opacity-50' 
          : `text-white hover:opacity-90 active:scale-98`
        }
      `}
      style={{
        backgroundColor: disabled ? '#3a3a3c' : baseColor,
      }}
    >
      {disabled ? label.replace('DISABLE', 'DISABLED') : label}
    </button>
  );
}
