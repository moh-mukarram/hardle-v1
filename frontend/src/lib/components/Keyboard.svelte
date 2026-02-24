<script lang="ts">
    import { Delete } from "lucide-svelte";
    import type { GuessDetail } from "$lib/utils/api";

    interface Props {
        guesses: GuessDetail[];
        onKey: (key: string) => void;
    }

    let { guesses, onKey } = $props<Props>();

    const ROWS = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
    ];

    // Compute key colors derived from guesses
    const getKeyColors = (guesses: GuessDetail[]) => {
        const colors: Record<string, number> = {};

        for (const guess of guesses) {
            guess.word.split("").forEach((char, i) => {
                const color = guess.colors[i];
                const existing = colors[char] ?? -1;
                // Upgrade color: Green (2) > Yellow (1) > Gray (0) > None (-1)
                // Note: Gray should overwrite "None", but not Green or Yellow.
                // Yellow should overwrite Gray or None, but not Green.
                // Green overwrites everything.

                if (color === 2) {
                    colors[char] = 2;
                } else if (color === 1) {
                    if (existing !== 2) colors[char] = 1;
                } else if (color === 0) {
                    if (existing === -1) colors[char] = 0;
                }
            });
        }
        return colors;
    };

    let keyColors = $derived(getKeyColors(guesses));

    const getKeyClass = (key: string, color: number) => {
        const base =
            "flex items-center justify-center rounded font-bold transition-colors select-none cursor-pointer";
        const size =
            key.length > 1
                ? "px-3 py-4 text-xs sm:text-sm"
                : "w-8 h-12 sm:w-10 sm:h-14 text-sm sm:text-lg";

        let bg = "bg-[#818384] text-white hover:bg-[#9d9ea0]"; // Default/Neutral

        if (color === 2) bg = "bg-[#6aaa64] text-white";
        else if (color === 1) bg = "bg-[#c9b458] text-white";
        else if (color === 0) bg = "bg-[#3a3a3c] text-white"; // Gray (Absent)

        return `${base} ${size} ${bg}`;
    };
</script>

<div class="w-full max-w-lg flex flex-col gap-2 p-2">
    {#each ROWS as row}
        <div class="flex justify-center gap-1.5">
            {#each row as key}
                <button
                    class={getKeyClass(key, keyColors[key] ?? -1)}
                    onclick={() => onKey(key)}
                >
                    {#if key === "BACKSPACE"}
                        <Delete size={20} />
                    {:else}
                        {key}
                    {/if}
                </button>
            {/each}
        </div>
    {/each}
</div>
