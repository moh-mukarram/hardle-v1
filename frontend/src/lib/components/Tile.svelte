<script lang="ts">
    interface Props {
        letter: string;
        color: number; // 0=Gray, 1=Yellow, 2=Green, -1=Empty/Current
        size?: "md" | "lg";
        disabled?: boolean; // If true, rendering might be dimmed?
    }

    let { letter, color, size = "lg", disabled = false } = $props<Props>();

    // Map backend colors to visual styles
    // 0 -> Gray (#3a3a3c)
    // 1 -> Yellow (#c9b458)
    // 2 -> Green (#6aaa64)
    // -1 -> Empty/Input (#121213)

    const getColorClass = (c: number) => {
        switch (c) {
            case 2:
                return "bg-[#6aaa64] border-[#6aaa64]";
            case 1:
                return "bg-[#c9b458] border-[#c9b458]";
            case 0:
                return "bg-[#3a3a3c] border-[#3a3a3c]";
            case 3: // Neutral Static (Very Hard Mode Phase 2)
                return "bg-[#121213] border-[#3a3a3c]";
            case -1:
            default:
                return "bg-[#121213] border-[#3a3a3c]";
        }
    };

    const getSizeClass = (s: "md" | "lg") => {
        return s === "lg"
            ? "w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl"
            : "w-10 h-10 text-xl"; // For small preview if needed
    };
</script>

<div
    class={`
    flex items-center justify-center border-2 font-bold uppercase select-none transition-all
    ${getSizeClass(size)}
    ${getColorClass(color)}
    ${color !== -1 ? "text-white" : "text-white"}
    ${letter && color === -1 ? "border-gray-500 animate-pulse" : ""}
  `}
>
    {letter}
</div>
