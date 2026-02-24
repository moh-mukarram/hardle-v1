<script lang="ts">
    import Tile from "./Tile.svelte";
    import type { GuessDetail } from "$lib/utils/api";

    interface Props {
        guesses: GuessDetail[];
        currentGuess: string;
        status: string; // IN_PROGRESS, WIN, LOSE
        disableGreen: boolean;
        disableYellow: boolean;
    }

    let { guesses, currentGuess, status, disableGreen, disableYellow } =
        $props<Props>();

    const TOTAL_ROWS = 6;
    const WORD_LENGTH = 5;

    // Helper to color tiles based on display mode
    const getDisplayColor = (realColor: number): number => {
        if (realColor === 2 && disableGreen) return 0; // Show green as gray
        if (realColor === 1 && disableYellow) return 0; // Show yellow as gray
        return realColor;
    };
</script>

<div class="flex flex-col gap-1.5">
    {#each Array(TOTAL_ROWS) as _, rowIndex}
        {@const isPast = rowIndex < guesses.length}
        {@const isCurrent =
            rowIndex === guesses.length && status === "IN_PROGRESS"}
        {@const guessData = isPast ? guesses[rowIndex] : null}

        <div class="flex gap-1.5 items-center">
            <!-- Row Number -->
            <div
                class={`w-8 h-8 flex items-center justify-center text-xs font-bold ${isCurrent ? "text-white" : "text-gray-600"}`}
            >
                {rowIndex + 1}
            </div>

            <!-- Tiles -->
            <div class="flex gap-1.5">
                {#each Array(WORD_LENGTH) as _, colIndex}
                    <!-- Logic for Letter -->
                    {#if isPast}
                        <Tile
                            letter={guessData?.word[colIndex] ?? ""}
                            color={getDisplayColor(
                                guessData?.colors[colIndex] ?? 0,
                            )}
                        />
                    {:else if isCurrent}
                        <Tile
                            letter={currentGuess[colIndex] ?? ""}
                            color={-1}
                        />
                    {:else}
                        <Tile letter="" color={-1} />
                    {/if}
                {/each}
            </div>
        </div>
    {/each}
</div>
