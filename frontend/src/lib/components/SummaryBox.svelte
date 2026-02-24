<script lang="ts">
    interface RowCounts {
        greenCount: number;
        yellowCount: number;
    }

    interface Props {
        rows: RowCounts[];
    }

    let { rows } = $props<Props>();
</script>

<div class="flex flex-col gap-1.5">
    {#each rows as row, i}
        <div class="flex gap-1.5 items-center">
            <!-- Row number -->
            <div class="w-6 text-xs text-gray-600 font-bold text-right">
                {i + 1}
            </div>

            <!-- Green -->
            <div
                class="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#6aaa64] bg-[#121213] flex items-center justify-center transition-all"
            >
                <span class="text-2xl sm:text-3xl font-bold text-[#6aaa64]">
                    {#if row.greenCount > 0}{row.greenCount}{/if}
                </span>
            </div>

            <!-- Yellow -->
            <div
                class="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#c9b458] bg-[#121213] flex items-center justify-center transition-all"
            >
                <span class="text-2xl sm:text-3xl font-bold text-[#c9b458]">
                    {#if row.yellowCount > 0}{row.yellowCount}{/if}
                </span>
            </div>
        </div>
    {/each}
</div>
